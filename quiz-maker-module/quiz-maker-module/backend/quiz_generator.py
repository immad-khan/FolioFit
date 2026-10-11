import os
import json
import logging
from typing import List, Dict, Any, Optional
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class QuizGenerator:
    """
    Independent Quiz Generator & Answer Evaluator powered by Groq LLM (llama-3.3-70b-versatile).
    Can generate both Multiple Choice Questions (MCQs) and Open-Ended Written Questions.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY") or os.getenv("NEXT_PUBLIC_GROQ_API_KEY")
        if not self.api_key:
            raise ValueError(
                "GROQ_API_KEY is not set. Please set it in your environment or .env file."
            )
        self.client = Groq(api_key=self.api_key)
        self.model = "llama-3.3-70b-versatile"

    def generate_quiz(
        self, 
        category: str, 
        difficulty: str = "Intermediate", 
        test_type: str = "MCQ"
    ) -> List[Dict[str, Any]]:
        """
        Generates 10 questions for the specified category and difficulty level.
        """
        is_mcq = test_type.upper() == "MCQ"
        
        prompt = f"""Generate 10 interview and assessment questions for '{category}' at the '{difficulty}' level.
The test type is {test_type}.
{'For each question, provide 4 multiple-choice options (A, B, C, D) and specify the correct answer.' if is_mcq else 'Questions should be open-ended for written answers.'}

Return the result STRICTLY as a JSON array of objects.
Each object must have:
- "id" (number, 1-10)
- "question" (string)
- "category" (string)
{'- "options" (array of strings, exactly 4)\\n- "correctAnswer" (string, the exact text of the correct option)' if is_mcq else ''}

Do not include markdown backticks or any conversational text. Return only valid JSON."""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert technical interviewer and educator. Always respond with accurate, valid JSON."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                model=self.model,
                response_format={"type": "json_object"}
            )

            raw_content = chat_completion.choices[0].message.content or "{}"
            
            # Clean possible markdown wrap
            if "```json" in raw_content:
                raw_content = raw_content.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_content:
                raw_content = raw_content.split("```")[1].split("```")[0].strip()

            parsed = json.loads(raw_content)
            
            if isinstance(parsed, dict):
                questions = parsed.get("questions") or parsed.get("data") or list(parsed.values())[0] if parsed else []
            elif isinstance(parsed, list):
                questions = parsed
            else:
                questions = []

            return questions if isinstance(questions, list) else []

        except Exception as e:
            logger.error(f"Failed to generate quiz: {e}")
            raise RuntimeError(f"Error generating quiz questions: {str(e)}")

    def evaluate_answers(
        self, 
        questions: List[Dict[str, Any]], 
        answers: List[str]
    ) -> Dict[str, Any]:
        """
        Evaluates submitted answers, computing score (0-100), overall summary, strengths,
        areas for improvement, and per-question STAR-method breakdowns.
        """
        evaluation_payload = []
        for i, q in enumerate(questions):
            evaluation_payload.append({
                "question": q.get("question", f"Question {i+1}"),
                "user_answer": answers[i] if i < len(answers) and answers[i] else "No answer provided",
                "correct_answer": q.get("correctAnswer", "N/A")
            })

        prompt = f"""Evaluate the following interview/quiz answers:
{json.dumps(evaluation_payload, indent=2)}

Return a JSON object with:
- "score": percentage integer (0-100)
- "summary": a concise 2-sentence summary of overall candidate performance
- "strengths": array of 3 specific positive strengths demonstrated
- "improvements": array of 3 specific areas to improve
- "detailedBreakdown": array of objects for each question, containing:
  - "question": the original question string
  - "feedback": constructive, actionable feedback on the candidate's answer
  - "rating": rating integer from 1 to 10
  - "correctAnswer": what a perfect/ideal answer looks like (using the STAR framework for behavioral/technical clarity)
  - "explanation": explanation of why that answer is ideal and key concepts to cover

Do not include any other text or markdown outside the JSON."""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a senior technical hiring manager and assessment specialist. Provide rigorous, fair, and actionable feedback in JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                response_format={"type": "json_object"}
            )

            raw_content = chat_completion.choices[0].message.content or "{}"
            if "```json" in raw_content:
                raw_content = raw_content.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_content:
                raw_content = raw_content.split("```")[1].split("```")[0].strip()

            return json.loads(raw_content)

        except Exception as e:
            logger.error(f"Failed to evaluate quiz: {e}")
            raise RuntimeError(f"Error evaluating answers: {str(e)}")
