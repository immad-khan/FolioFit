#!/usr/bin/env python3
"""
Interactive Command-Line Quiz Tool
Run: python cli.py
"""

import sys
import time
from quiz_generator import QuizGenerator

def print_banner():
    print("=" * 60)
    print("           🧠 QUIZ MAKER - AI INTERVIEW SIMULATOR          ")
    print("=" * 60)

def main():
    print_banner()
    try:
        generator = QuizGenerator()
    except Exception as e:
        print(f"\n❌ Error initializing Quiz Generator: {e}")
        print("💡 Ensure GROQ_API_KEY is set in your .env or environment variables.\n")
        sys.exit(1)

    category = input("\n👉 Enter Category/Topic (e.g. Software Engineering, Python, DevOps) [Software Engineering]: ").strip()
    if not category:
        category = "Software Engineering"

    print("\nSelect Difficulty:")
    print("  1. Beginner")
    print("  2. Intermediate")
    print("  3. Advanced")
    diff_choice = input("Choice (1-3) [2]: ").strip()
    difficulty = {"1": "Beginner", "2": "Intermediate", "3": "Advanced"}.get(diff_choice, "Intermediate")

    print("\nSelect Test Type:")
    print("  1. Multiple Choice (MCQ)")
    print("  2. Written (Open-ended)")
    type_choice = input("Choice (1-2) [1]: ").strip()
    test_type = "MCQ" if type_choice != "2" else "WRITTEN"

    print(f"\n⏳ Generating 10 {difficulty} {test_type} questions for '{category}'...")
    try:
        questions = generator.generate_quiz(category, difficulty, test_type)
    except Exception as e:
        print(f"\n❌ Failed to generate questions: {e}")
        sys.exit(1)

    if not questions:
        print("❌ No questions were generated. Please try again.")
        sys.exit(1)

    print(f"\n✅ Ready! 10 questions loaded. Starting session...\n")
    time.sleep(1)

    answers = []
    for idx, q in enumerate(questions, 1):
        print("-" * 60)
        print(f"Question {idx}/10: {q.get('question')}")
        
        if test_type == "MCQ" and q.get("options"):
            for opt_idx, opt in enumerate(q["options"]):
                letter = chr(65 + opt_idx)
                print(f"  [{letter}] {opt}")
            
            while True:
                user_choice = input("\nYour answer (A/B/C/D): ").strip().upper()
                if user_choice in ["A", "B", "C", "D"]:
                    chosen_index = ord(user_choice) - ord("A")
                    if chosen_index < len(q["options"]):
                        answers.append(q["options"][chosen_index])
                        break
                print("⚠️ Invalid choice. Please enter A, B, C, or D.")
        else:
            ans = input("\nYour answer (STAR method encouraged): ").strip()
            answers.append(ans if ans else "No answer provided")
        
        print()

    print("=" * 60)
    print("⏳ Evaluating your answers with AI... please wait.")
    print("=" * 60)

    try:
        eval_result = generator.evaluate_answers(questions, answers)
    except Exception as e:
        print(f"\n❌ Evaluation failed: {e}")
        sys.exit(1)

    score = eval_result.get("score", 0)
    print(f"\n🏆 FINAL SCORE: {score}%")
    print(f"📝 Summary: {eval_result.get('summary')}\n")

    print("💪 STRENGTHS:")
    for s in eval_result.get("strengths", []):
        print(f"  • {s}")

    print("\n🎯 AREAS FOR IMPROVEMENT:")
    for imp in eval_result.get("improvements", []):
        print(f"  • {imp}")

    print("\n" + "=" * 60)
    print("             DETAILED QUESTION-BY-QUESTION BREAKDOWN        ")
    print("=" * 60)

    for i, item in enumerate(eval_result.get("detailedBreakdown", []), 1):
        print(f"\n[Question {i}]: {item.get('question')}")
        print(f"⭐ Rating: {item.get('rating')}/10")
        print(f"💡 AI Feedback: {item.get('feedback')}")
        print(f"✨ Ideal Answer (STAR): {item.get('correctAnswer')}")
        print(f"📖 Why this works: {item.get('explanation')}")
        print("-" * 60)

    print("\n🎉 Quiz session complete! Great job.\n")

if __name__ == "__main__":
    main()
