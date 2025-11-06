# train.py
import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler, FunctionTransformer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.multioutput import MultiOutputClassifier
from sklearn.multioutput import MultiOutputRegressor
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import classification_report, f1_score
from sklearn.preprocessing import MultiLabelBinarizer
import joblib

DATA_DIR = "data"
FINAL_CSV = os.path.join(DATA_DIR, "Final_data.csv")
MEAL_CSV = os.path.join(DATA_DIR, "meal_metadata.csv")
MODELS_DIR = "models"
os.makedirs(MODELS_DIR, exist_ok=True)
RANDOM_SEED = 42


print("Loading datasets...")
final_df = pd.read_csv(FINAL_CSV)
meal_df = pd.read_csv(MEAL_CSV)

CLASS_RULES = {
    'Statin': {
        'alerts': ['avoid_grapefruit'],
        'diet_avoid_keywords': ['grapefruit'],
        'diet_include_keywords': ['leafy', 'oats']
    },
    'Antidiabetic': {
        'alerts': ['avoid_sugary_drinks'],
        'diet_avoid_keywords': ['sugar','sugary'],
        'diet_include_keywords': ['high_fiber','lentils','beans']
    },
    'Analgesic': {
        'alerts': ['avoid_alcohol'],
        'diet_avoid_keywords': ['alcohol'],
        'diet_include_keywords': ['hydration','water']
    }
}

def prescription_to_labels(prescription_list):
    include_tags = set()
    avoid_tags = set()
    alerts = set()
    for med in prescription_list:
        mclass = med.get('class')
        if mclass in CLASS_RULES:
            r = CLASS_RULES[mclass]
            include_tags.update(r.get('diet_include_keywords', []))
            avoid_tags.update(r.get('diet_avoid_keywords', []))
            alerts.update(r.get('alerts', []))
    return list(include_tags), list(avoid_tags), list(alerts)

# ---------- Build training table ----------
print("Constructing examples table for ML training...")

# We'll create a dataset where each row is a user profile combined with a (simulated) prescription.
# If Final_data.csv has a column containing prescriptions, use that; otherwise we will synthesize by sampling meds.
# For now: sample two common prescriptions per user from CLASS_RULES keys (bootstrap).
med_classes = list(CLASS_RULES.keys())

def sample_prescription_for_user(i):
    # simple strategy: pick 1-2 random classes
    n = np.random.choice([1,2], p=[0.6,0.4])
    classes = list(np.random.choice(med_classes, size=n, replace=False))
    return [{"name": cls + "_MED", "class": cls} for cls in classes]

# Build dataset rows
rows = []
for idx, row in final_df.iterrows():
    user = row.to_dict()
    prescription = sample_prescription_for_user(idx)
    incl, avo, alerts = prescription_to_labels(prescription)
    rows.append({
        "age": user.get("age") or user.get("Age") or np.nan,
        "smoker_flag": bool(user.get("smoker_flag", False) or user.get("Smoking", False)),
        "alcohol_flag": bool(user.get("alcohol_flag", False) or user.get("Alcohol", False)),
        "exercise_level": user.get("exercise_level") if "exercise_level" in user else user.get("Activity", "unknown"),
        "diet_type": user.get("diet_type") if "diet_type" in user else user.get("Diet", "unknown"),
        "health_conditions": user.get("health_conditions", []),
        "prescription": json.dumps(prescription),
        # labels:
        "diet_include_tags": incl,
        "diet_avoid_tags": avo,
        "alerts": alerts
    })

ml_df = pd.DataFrame(rows)
print("ML dataframe shape:", ml_df.shape)

# ---------- Prepare target encodings ----------
mlb_include = MultiLabelBinarizer()
mlb_avoid = MultiLabelBinarizer()
mlb_alerts = MultiLabelBinarizer()

Y_include = mlb_include.fit_transform(ml_df['diet_include_tags'])
Y_avoid = mlb_avoid.fit_transform(ml_df['diet_avoid_tags'])
Y_alerts = mlb_alerts.fit_transform(ml_df['alerts'])

# Combine multi-label outputs into a single multioutput y by concatenation (or train separate models)
Y = np.hstack([Y_include, Y_avoid, Y_alerts])
print("Y shape:", Y.shape)
# Keep track of label names:
label_names = list(mlb_include.classes_) + ["AVOID:" + c for c in mlb_avoid.classes_] + ["ALERT:" + c for c in mlb_alerts.classes_]

# ---------- Features ----------
# Basic feature extraction: numeric + categorical + prescription class bag
def extract_prescription_features(prescription_json):
    try:
        pres = json.loads(prescription_json)
    except:
        pres = []
    classes = [p.get('class','') for p in pres]
    d = {}
    for cls in med_classes:
        d["pres_class_"+cls] = 1 if cls in classes else 0
    return pd.Series(d)

pres_features = ml_df['prescription'].apply(extract_prescription_features)
X_base = pd.concat([
    ml_df[['age','smoker_flag','alcohol_flag','exercise_level','diet_type']].reset_index(drop=True),
    pres_features.reset_index(drop=True)
], axis=1)

# Fill missing numeric
X_base['age'] = pd.to_numeric(X_base['age'], errors='coerce').fillna(X_base['age'].median())

# Convert booleans
X_base['smoker_flag'] = X_base['smoker_flag'].astype(int)
X_base['alcohol_flag'] = X_base['alcohol_flag'].astype(int)

# One-hot encode exercise_level and diet_type
X = pd.get_dummies(X_base, columns=['exercise_level','diet_type'], drop_first=True)
print("X shape:", X.shape)

# ---------- Train/test split ----------
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=RANDOM_SEED)
print("Train:", X_train.shape, "Test:", X_test.shape)

# ---------- Model: MultiOutput RandomForest ----------
print("Training multioutput RandomForest (may take some time)...")
clf = MultiOutputClassifier(RandomForestClassifier(n_estimators=200, random_state=RANDOM_SEED, n_jobs=-1))
clf.fit(X_train, Y_train)

# ---------- Evaluation ----------
print("Evaluating...")
Y_pred = clf.predict(X_test)
# compute micro & macro f1 across all labels
micro_f1 = f1_score(Y_test, Y_pred, average='micro')
macro_f1 = f1_score(Y_test, Y_pred, average='macro')
print(f"Micro F1: {micro_f1:.4f}, Macro F1: {macro_f1:.4f}")

# Detailed per-label (optional)
print("Per-label performance (first 20 labels):")
for i, name in enumerate(label_names[:20]):
    print(name, f1_score(Y_test[:,i], Y_pred[:,i], average='binary'))

# ---------- Save model & metadata ----------
print("Saving model and metadata...")
joblib.dump(clf, os.path.join(MODELS_DIR, "multioutput_rf.joblib"))
joblib.dump(mlb_include, os.path.join(MODELS_DIR, "mlb_include.joblib"))
joblib.dump(mlb_avoid, os.path.join(MODELS_DIR, "mlb_avoid.joblib"))
joblib.dump(mlb_alerts, os.path.join(MODELS_DIR, "mlb_alerts.joblib"))
joblib.dump(X.columns.tolist(), os.path.join(MODELS_DIR, "feature_columns.joblib"))
joblib.dump(CLASS_RULES, os.path.join(MODELS_DIR, "class_rules.joblib"))
print("Saved models in", MODELS_DIR)
