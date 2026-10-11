from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class QuestionItem(BaseModel):
    id: int
    question: str
    category: str
    options: Optional[List[str]] = None
    correctAnswer: Optional[str] = None

class GenerateQuizRequest(BaseModel):
    category: str = Field(..., description="Field or topic, e.g., 'Software Engineering', 'Python', 'DevOps'")
    difficulty: Literal['Beginner', 'Intermediate', 'Advanced'] = 'Intermediate'
    test_type: Literal['MCQ', 'WRITTEN'] = 'MCQ'

class GenerateQuizResponse(BaseModel):
    success: bool
    category: str
    difficulty: str
    test_type: str
    questions: List[QuestionItem]

class AnswerSubmission(BaseModel):
    question_id: int
    answer: str

class DetailedBreakdown(BaseModel):
    question: str
    feedback: str
    rating: int
    correctAnswer: str
    explanation: str

class EvaluateQuizRequest(BaseModel):
    questions: List[QuestionItem]
    answers: List[str]

class EvaluateQuizResponse(BaseModel):
    success: bool
    score: int
    summary: str
    strengths: List[str]
    improvements: List[str]
    detailedBreakdown: List[DetailedBreakdown]
