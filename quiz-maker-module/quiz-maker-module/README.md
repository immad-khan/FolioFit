# 🧠 Quiz Maker - AI Interview & Assessment Tool

A complete, self-contained AI-powered quiz generation and candidate evaluation tool. It can be used as an **independent CLI tool**, a **FastAPI backend microservice**, or a **React/Next.js frontend application**.

---

## 🚀 Features

- **Dynamic AI Question Generation**: Generates 10 questions for any technical/non-technical field (e.g. *Software Engineering*, *Cloud Architecture*, *Product Management*, *Behavioral*) across 3 difficulty levels (*Beginner*, *Intermediate*, *Advanced*).
- **Dual Format Support**:
  - **Multiple Choice Questions (MCQ)**: 4 options with exact key determination.
  - **Written/Typed (Open-Ended)**: Free-text answers graded using the **STAR Method** (Situation, Task, Action, Result).
- **Intelligent Grading & STAR Evaluation**: Computes percentage scores, identifies candidate strengths & improvement areas, and provides ideal benchmark answers with explanations.
- **State Management & Persistence**: Session pausing, resume without losing answers, and interactive SVG progress gauges.

---

## 📂 Directory Structure

```
quiz-maker/
├── backend/
│   ├── quiz_generator.py  # Core Python service calling Groq LLM (llama-3.3-70b-versatile)
│   ├── api.py             # Standalone FastAPI server with REST endpoints
│   ├── cli.py             # Interactive Command-Line Terminal Quiz Runner
│   └── schemas.py         # Pydantic data validation models
├── frontend/
│   ├── groq.ts            # Client-side Groq SDK question generator & answer evaluator
│   ├── interviewStore.ts  # Zustand store with LocalStorage persistence & session pause/resume
│   ├── InterviewStart.tsx # Setup & Category / Format / Difficulty selection component
│   ├── InterviewQuiz.tsx  # Active quiz interface (MCQ option cards & STAR text editor)
│   ├── InterviewResume.tsx# Resume paused session interface
│   ├── InterviewResult.tsx# AI Performance scorecard, strengths, and STAR breakdown
│   └── page.tsx           # Top-level React / Next.js Page component
├── data/
│   ├── sample_mcq_quiz.json     # Pre-generated Software Engineering MCQ dataset
│   ├── sample_written_quiz.json # Pre-generated Software Engineering Written dataset
│   └── sample_evaluation.json   # Sample AI evaluation report
├── .env.example
├── requirements.txt       # Python dependencies (groq, fastapi, uvicorn, pydantic)
├── package.json           # Node / React dependencies (zustand, lucide-react, groq-sdk)
└── README.md
```

---

## 🛠️ Usage Modes

### Mode 1: Interactive Terminal CLI Tool
You can run a complete quiz session directly in your terminal:

```bash
cd quiz-maker
pip install -r requirements.txt
python backend/cli.py
```

1. Enter your topic/field (e.g., `Software Engineering`).
2. Choose difficulty (`1. Beginner`, `2. Intermediate`, `3. Advanced`).
3. Choose format (`1. MCQ` or `2. Written`).
4. Answer each question in the console.
5. Receive an instant AI evaluation scorecard with strengths, improvement points, and ideal STAR answers!

---

### Mode 2: Standalone FastAPI Backend Microservice
Run as a standalone HTTP API server:

```bash
cd quiz-maker
pip install -r requirements.txt
uvicorn backend.api:app --reload --port 8000
```

#### API Endpoints:
- **`POST /api/quiz/generate`**:
  ```json
  {
    "category": "Software Engineering",
    "difficulty": "Intermediate",
    "test_type": "MCQ"
  }
  ```
- **`POST /api/quiz/evaluate`**:
  ```json
  {
    "questions": [...],
    "answers": ["Answer 1", "Answer 2", ...]
  }
  ```

---

### Mode 3: Next.js / React Frontend Component
Include the frontend components in any React/Next.js application:

```tsx
import QuizMakerPage from '@/quiz-maker/frontend/page';

export default function Page() {
  return <QuizMakerPage />;
}
```

Ensure your `.env.local` has:
```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

---

## 📊 Sample Data Files
Explore the `data/` folder for ready-to-use fixtures:
- [data/sample_mcq_quiz.json](file:///d:/Desktop/careermate/quiz-maker/data/sample_mcq_quiz.json)
- [data/sample_written_quiz.json](file:///d:/Desktop/careermate/quiz-maker/data/sample_written_quiz.json)
- [data/sample_evaluation.json](file:///d:/Desktop/careermate/quiz-maker/data/sample_evaluation.json)
