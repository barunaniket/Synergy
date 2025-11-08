from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# ---------- Load model and preprocessors ----------
model = joblib.load("nutrition_model.pkl")
scaler = joblib.load("scaler.pkl")
le_gender, le_activity, le_goal = joblib.load("encoders.pkl")

# ---------- Load recipes dataset ----------
recipes = pd.read_csv("recipes.csv", low_memory=False)
recipes = recipes[['Name', 'Calories', 'ProteinContent', 'FatContent', 'CarbohydrateContent', 'RecipeIngredientParts']]
recipes = recipes.dropna(subset=['Calories']).reset_index(drop=True)

# ---------- Predict nutrition ----------
def predict_nutrition(age, height, weight, gender, activity, goal, meals):
    bmi = weight / ((height / 100) ** 2)
    activity_index = {
        "Little/no exercise": 1.2,
        "Lightly active": 1.375,
        "Moderately active": 1.55,
        "Very active": 1.725,
        "Extra active": 1.9
    }[activity]
    data = pd.DataFrame([[age, height, weight, gender, activity, goal, meals, bmi, activity_index]],
                        columns=['Age', 'Height', 'Weight', 'Gender', 'Activity', 'Goal', 'Meals', 'BMI', 'ActivityIndex'])
    data['Gender'] = le_gender.transform(data['Gender'])
    data['Activity'] = le_activity.transform(data['Activity'])
    data['Goal'] = le_goal.transform(data['Goal'])
    scaled = scaler.transform(data)
    pred = model.predict(scaled)[0]
    return {
        'Calories': float(pred[0]),
        'Protein': float(pred[1]),
        'Fat': float(pred[2]),
        'Carbs': float(pred[3])
    }

# ---------- Recommend meals ----------
def recommend_meals(age, height, weight, gender, activity, goal, meals):
    prediction = predict_nutrition(age, height, weight, gender, activity, goal, meals)
    total_cal = prediction['Calories']
    per_meal = total_cal / meals
    tolerance = 0.15  # ±15% window

    filtered = recipes[
        (recipes['Calories'] >= per_meal * (1 - tolerance)) &
        (recipes['Calories'] <= per_meal * (1 + tolerance))
    ].copy()

    if filtered.empty:
        return {'message': 'No suitable meals found for this calorie range.'}

    filtered['MacroScore'] = np.sqrt(
        (0.4 * ((filtered['ProteinContent']/filtered['Calories']) - (prediction['Protein']/prediction['Calories'])))**2 +
        (0.3 * ((filtered['FatContent']/filtered['Calories']) - (prediction['Fat']/prediction['Calories'])))**2 +
        (0.3 * ((filtered['CarbohydrateContent']/filtered['Calories']) - (prediction['Carbs']/prediction['Calories'])))**2
    )

    top_meals = filtered.sort_values('MacroScore', ascending=True).head(10)

    meals_json = []
    for _, row in top_meals.iterrows():
        meals_json.append({
            'name': row['Name'],
            'calories': float(row['Calories']),
            'protein': float(row['ProteinContent']),
            'fat': float(row['FatContent']),
            'carbs': float(row['CarbohydrateContent']),
            'ingredients': row['RecipeIngredientParts']
        })

    return {
        'predicted_calories': round(prediction['Calories'], 2),
        'per_meal_target': round(per_meal, 2),
        'macros': {
            'protein': round(prediction['Protein'], 2),
            'fat': round(prediction['Fat'], 2),
            'carbs': round(prediction['Carbs'], 2)
        },
        'recommended_meals': meals_json
    }

# ---------- Endpoint ----------
@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        required = ['age', 'height', 'weight', 'gender', 'activity', 'goal', 'meals']
        if not all(k in data for k in required):
            return jsonify({'error': 'Missing required fields'}), 400

        result = recommend_meals(
            age=int(data['age']),
            height=float(data['height']),
            weight=float(data['weight']),
            gender=data['gender'],
            activity=data['activity'],
            goal=data['goal'],
            meals=int(data['meals'])
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------- Run Server ----------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
