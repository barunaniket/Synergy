from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
import json
from app.inference import predict_and_build_json

app = FastAPI(title="MediAI ML", version="ml-v0.1")

@app.post("/analyze")
async def analyze(
    age: float = Form(...),
    smoker_flag: bool = Form(...),
    alcohol_flag: bool = Form(...),
    exercise_level: str = Form(...),
    diet_type: str = Form(...),
    prescription: str = Form(...),  # JSON string
):
    """
    Receives user profile and prescription list, returns ML-based JSON recommendations.
    """
    user_profile = {
        "age": age,
        "smoker_flag": smoker_flag,
        "alcohol_flag": alcohol_flag,
        "exercise_level": exercise_level,
        "diet_type": diet_type,
        "health_conditions": [],
    }

    # Parse the prescription JSON string
    try:
        prescription_list = json.loads(prescription)
    except Exception:
        return JSONResponse({"error": "Invalid prescription format"}, status_code=400)

    # Get predictions from trained model
    output = predict_and_build_json(user_profile, prescription_list)
    return JSONResponse(output)


@app.get("/")
def home():
    return {"message": "MediAI ML backend is running 🚀"}
