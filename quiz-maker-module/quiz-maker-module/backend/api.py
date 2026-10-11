import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    GenerateQuizRequest, 
    GenerateQuizResponse, 
    EvaluateQuizRequest, 
    EvaluateQuizResponse
)
from .quiz_generator import QuizGenerator

app = FastAPI(
    title="Quiz Maker API",
    description="Standalone AI-Powered Quiz Generator and Evaluation Engine",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

quiz_service = QuizGenerator()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Quiz Maker AI Engine",
        "endpoints": {
            "generate": "/api/quiz/generate",
            "evaluate": "/api/quiz/evaluate"
        }
    }

@app.post("/api/quiz/generate", response_model=GenerateQuizResponse)
def generate_quiz_endpoint(request: GenerateQuizRequest):
    try:
        questions = quiz_service.generate_quiz(
            category=request.category,
            difficulty=request.difficulty,
            test_type=request.test_type
        )
        return GenerateQuizResponse(
            success=True,
            category=request.category,
            difficulty=request.difficulty,
            test_type=request.test_type,
            questions=questions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz/evaluate", response_model=EvaluateQuizResponse)
def evaluate_quiz_endpoint(request: EvaluateQuizRequest):
    try:
        questions_dict = [q.model_dump() for q in request.questions]
        result = quiz_service.evaluate_answers(
            questions=questions_dict,
            answers=request.answers
        )
        return EvaluateQuizResponse(
            success=True,
            score=result.get("score", 0),
            summary=result.get("summary", ""),
            strengths=result.get("strengths", []),
            improvements=result.get("improvements", []),
            detailedBreakdown=result.get("detailedBreakdown", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
