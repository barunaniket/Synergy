# app/inference.py
import os, json, joblib
import numpy as np
import pandas as pd
from datetime import datetime, timezone

MODELS_DIR = "models"
clf = joblib.load(os.path.join(MODELS_DIR, "multioutput_rf.joblib"))
mlb_include = joblib.load(os.path.join(MODELS_DIR, "mlb_include.joblib"))
mlb_avoid = joblib.load(os.path.join(MODELS_DIR, "mlb_avoid.joblib"))
mlb_alerts = joblib.load(os.path.join(MODELS_DIR, "mlb_alerts.joblib"))
feature_columns = joblib.load(os.path.join(MODELS_DIR, "feature_columns.joblib"))
CLASS_RULES = joblib.load(os.path.join(MODELS_DIR, "class_rules.joblib"))
med_classes = list(CLASS_RULES.keys())

def build_feature_row(user_profile, prescription_list):
    # base features
    row = {}
    row['age'] = float(user_profile.get('age', np.nan))
    row['smoker_flag'] = int(bool(user_profile.get('smoker_flag', False)))
    row['alcohol_flag'] = int(bool(user_profile.get('alcohol_flag', False)))
    row['exercise_level'] = user_profile.get('exercise_level', 'unknown')
    row['diet_type'] = user_profile.get('diet_type', 'unknown')
    # prescription one-hot
    classes = [p.get('class') for p in prescription_list]
    for cls in med_classes:
        row["pres_class_"+cls] = 1 if cls in classes else 0
    df = pd.DataFrame([row])
    # one-hot for exercise_level, diet_type matching training columns
    df = pd.get_dummies(df, columns=['exercise_level','diet_type'], drop_first=True)
    # ensure all feature columns exist
    for c in feature_columns:
        if c not in df.columns:
            df[c] = 0
    df = df[feature_columns]
    return df

def predict_and_build_json(user_profile, prescription_list):
    X = build_feature_row(user_profile, prescription_list)
    y_pred = clf.predict(X)  # shape (1, n_labels)
    # split prediction back into include/avoid/alerts
    n_inc = len(mlb_include.classes_)
    n_avo = len(mlb_avoid.classes_)
    n_alert = len(mlb_alerts.classes_)
    inc_pred = y_pred[:, :n_inc]
    avo_pred = y_pred[:, n_inc:n_inc+n_avo]
    alert_pred = y_pred[:, n_inc+n_avo:]
    include_tags = list(mlb_include.inverse_transform(inc_pred)[0])
    avoid_tags = list(mlb_avoid.inverse_transform(avo_pred)[0])
    alerts = list(mlb_alerts.inverse_transform(alert_pred)[0])

    # map alerts to human messages if you want
    alert_messages = []
    for a in alerts:
        # 'avoid_grapefruit' -> message from CLASS_RULES mapping or a mapping dict
        if a == 'avoid_grapefruit':
            alert_messages.append({'alert': 'Avoid grapefruit juice — may increase statin concentration.'})
        elif a == 'avoid_sugary_drinks':
            alert_messages.append({'alert': 'Monitor carbohydrate intake; avoid sugary drinks.'})
        elif a == 'avoid_alcohol':
            alert_messages.append({'alert': 'Avoid alcohol while on this medicine.'})
        else:
            alert_messages.append({'alert': a})

    # exercise suggestion: simple heuristic from predicted include/avoid or user profile
    exercise_suggestion = 'Start with 15-20 minutes walking daily; monitor response.' if user_profile.get('exercise_level','unknown') in ['none','low'] else 'Maintain current exercise'

    output = {
        "user_profile": user_profile,
        "prescription_analysis": prescription_list,
        "recommendations": {
            "diet": {"include": include_tags, "avoid": avoid_tags},
            "exercise": exercise_suggestion,
            "lifestyle_tips": [],  # optionally fill from user_profile
            "alerts": alert_messages
        },
        "metadata": {
            "processed_at": datetime.now(timezone.utc).isoformat(),
            "version": "ml-v0.1"
        }
    }
    return output
