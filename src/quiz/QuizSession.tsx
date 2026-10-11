import React, { useState } from 'react';
import { useQuizStore } from './quizStore';
import { evaluateAnswers } from './quizGroq';
import { Loader2, ArrowLeft, ArrowRight, Save } from 'lucide-react';

export const QuizSession: React.FC = () => {
  const {
    questions,
    currentIndex,
    answers,
    submitAnswer,
    nextQuestion,
    prevQuestion,
    setStep,
    finishInterview,
    category,
    difficulty,
    testType,
  } = useQuizStore();

  const [loading, setLoading] = useState(false);
  const currentQuestion = questions[currentIndex];
  const isMCQ = testType === 'MCQ';

  const handleFinish = async () => {
    setLoading(true);
    try {
      const result = await evaluateAnswers(questions, answers);
      if (result) {
        finishInterview(result);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const circumference = 175.9;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Header */}
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-7 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <p className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">
              Session · {category} · {difficulty}
            </p>
            <h1 className="text-headline-sm font-bold text-on-surface">
              Question {currentIndex + 1}/{questions.length}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-mono text-label-sm text-primary font-bold">{Math.round(progress)}% Completed</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-surface-container" />
                <circle
                  cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                  className="text-primary transition-all duration-500"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * progress) / 100}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-label-sm font-bold text-on-surface">
                {currentIndex + 1}/{questions.length}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Question */}
          <div className="p-6 rounded-xl border border-primary/20 bg-primary/5">
            <h2 className="text-title-lg font-medium leading-relaxed text-on-surface">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Area */}
          {isMCQ && currentQuestion.options ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => submitAnswer(option)}
                  className={`p-5 text-left border-2 rounded-xl transition-all flex items-center gap-4 cursor-pointer ${
                    answers[currentIndex] === option
                      ? 'border-primary bg-primary/10 font-bold text-primary'
                      : 'border-outline-variant/40 bg-surface-container hover:border-primary/40 text-on-surface'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-mono text-label-sm font-bold ${
                    answers[currentIndex] === option ? 'border-primary bg-primary text-on-primary' : 'border-outline text-on-surface-variant'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-body-md">{option}</span>
                </button>
              ))}
            </div>
          ) : (
            <textarea
              className="w-full p-5 h-48 outline-none transition-all rounded-xl border-2 bg-surface-container border-outline-variant/40 text-on-surface focus:ring-2 focus:ring-primary/40 focus:border-primary/60 resize-none placeholder:text-on-surface-variant/50 text-body-md"
              placeholder="Type your answer here (use STAR method: Situation, Task, Action, Result)..."
              value={answers[currentIndex] || ''}
              onChange={(e) => submitAnswer(e.target.value)}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-7 pt-5 border-t border-outline-variant/30">
          <div className="flex gap-3">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl font-mono text-label-sm font-bold uppercase tracking-wider transition-all border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container flex items-center gap-2 disabled:opacity-30 cursor-pointer"
            >
              <ArrowLeft size={16} /> Previous
            </button>
            <button
              onClick={() => setStep('PAUSED')}
              className="px-5 py-2.5 rounded-xl font-mono text-label-sm font-bold uppercase tracking-wider transition-all border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container flex items-center gap-2 cursor-pointer"
            >
              <Save size={16} /> Save Progress
            </button>
          </div>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="px-8 py-2.5 font-mono text-label-sm font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 bg-primary text-on-primary hover:bg-primary-container cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Finish Session →'}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-8 py-2.5 font-mono text-label-sm font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-container cursor-pointer"
            >
              Next <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      <p className="text-center font-mono text-label-sm italic text-on-surface-variant/60">
        Progress is auto-saved. You can resume anytime.
      </p>
    </div>
  );
};

export default QuizSession;
