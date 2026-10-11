import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React/Next.js
});

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  options?: string[];
  correctAnswer?: string;
}

export interface DetailedFeedback {
  question: string;
  feedback: string;
  rating: number;
  correctAnswer: string;
  explanation: string;
}

export interface InterviewResultData {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  detailedBreakdown: DetailedFeedback[];
}

/**
 * Generate 10 tailored interview/quiz questions for any field and difficulty
 */
export const generateInterviewQuestions = async (
  category: string, 
  difficulty: string, 
  testType: 'WRITTEN' | 'MCQ' = 'WRITTEN'
): Promise<InterviewQuestion[]> => {
  const isMCQ = testType === 'MCQ';
  const prompt = `Generate 10 interview questions for a ${category} interview at the ${difficulty} level. 
The test type is ${testType}.
${isMCQ ? 'For each question, provide 4 multiple-choice options (A, B, C, D) and specify the correct answer.' : 'Questions should be open-ended for written answers.'}
Return the result as a JSON array of objects.
Each object must have:
- "id" (number)
- "question" (string)
- "category" (string)
${isMCQ ? '- "options" (array of strings, exactly 4)\n- "correctAnswer" (string, the text of the correct option)' : ''}
Do not include any other text in the response, just the JSON array.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) return [];
    
    const parsed = JSON.parse(content);
    const questions = parsed.questions || parsed;
    return Array.isArray(questions) ? questions : [];
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
};

/**
 * Evaluate user's answers and compute detailed ratings, feedback, and ideal STAR answers
 */
export const evaluateAnswers = async (
  questions: InterviewQuestion[], 
  answers: string[]
): Promise<InterviewResultData | null> => {
  const data = questions.map((q, idx) => ({
    question: q.question,
    answer: answers[idx] || "No answer provided"
  }));

  const prompt = `Evaluate the following interview answers:
${JSON.stringify(data, null, 2)}

Return a JSON object with:
- "score": percentage (number, e.g. 85)
- "summary": a brief overall summary (string)
- "strengths": array of strings (3-5 strengths)
- "improvements": array of strings (3-5 areas to improve)
- "detailedBreakdown": array of objects, each containing:
  - "question": the original question
  - "feedback": constructive feedback on the user's answer
  - "rating": rating for this specific answer (1-10)
  - "correctAnswer": what a perfect/ideal answer would look like (STAR framework)
  - "explanation": explanation of why that answer is ideal and key points to hit

Do not include any other text. Avoid using markdown formatting inside the JSON strings.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    return JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Error evaluating answers:", error);
    return null;
  }
};
