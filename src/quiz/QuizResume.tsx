import React from 'react';
import { useQuizStore } from './quizStore';
import { Play, RotateCcw, Clock, Monitor } from 'lucide-react';

export const QuizResume: React.FC = () => {
  const { setStep, resetInterview, currentIndex, questions, category } = useQuizStore();

  const progress = Math.round((currentIndex / questions.length) * 100);
  const lastQuestion = questions[currentIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Resume Banner */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 shadow-md flex flex-col lg:flex-row items-start justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <p className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">
            Mock Interview Quiz · Saved Progress
          </p>
          <h1 className="text-headline-md font-bold text-on-surface">Pick Up Where You Left Off</h1>
          <p className="text-body-md text-on-surface-variant">
            You paused this quiz earlier. Resume from your last question or start over for a fresh run.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full font-mono text-label-sm bg-primary/10 text-primary border border-primary/30 italic">
              Progress: {currentIndex} / {questions.length} questions
            </span>
            <span className="px-3 py-1.5 rounded-full font-mono text-label-sm bg-surface-container border border-outline-variant/40 text-on-surface-variant">
              ~4-6 min remaining
            </span>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep('QUIZ')}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-mono text-label-sm font-bold uppercase tracking-wider bg-primary text-on-primary hover:bg-primary-container transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Play size={18} fill="currentColor" /> Resume Quiz
            </button>
            <button
              onClick={resetInterview}
              className="px-5 py-3 rounded-xl font-mono text-label-sm font-bold uppercase tracking-wider bg-surface-container hover:bg-surface-container-low text-on-surface-variant transition-all cursor-pointer"
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-36 h-36 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-container" />
              <circle
                cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="transparent"
                className="text-primary transition-all duration-500"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * progress) / 100}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-primary">{progress}%</span>
              <span className="font-mono text-label-sm text-on-surface-variant">Completed</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold text-on-surface text-label-md">Mid-way through</p>
            <div className="flex gap-2 justify-center mt-2">
              <span className="font-mono text-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">Auto-saved</span>
              <span className="font-mono text-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">No data lost</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Last Question */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-7 shadow-md space-y-5">
          <h3 className="text-title-lg font-bold text-on-surface border-b border-outline-variant/20 pb-4">Last Attempted Question</h3>
          <p className="font-mono text-label-sm text-on-surface-variant">Here's where you paused. We'll resume from this question.</p>
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-mono text-label-sm border border-outline-variant/40">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-mono text-label-sm border border-outline-variant/40">
                {category}
              </span>
            </div>
            <div className="p-5 bg-primary/5 border border-primary/15 rounded-xl">
              <h4 className="text-title-md font-bold text-on-surface leading-relaxed">{lastQuestion?.question}</h4>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-7 shadow-md flex flex-col">
          <h3 className="text-title-lg font-bold text-on-surface mb-2">Saved Progress Overview</h3>
          <p className="font-mono text-label-sm text-on-surface-variant mb-7">A quick snapshot of your current session.</p>
          <div className="space-y-5 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant">Current Question</span>
              <span className="font-mono text-label-sm font-bold text-on-surface">{currentIndex + 1} / {questions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant flex items-center gap-2"><Clock size={14} /> Time elapsed</span>
              <span className="font-mono text-label-sm font-bold text-on-surface">In progress</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant flex items-center gap-2"><Monitor size={14} /> Mode</span>
              <span className="font-mono text-label-sm font-bold text-on-surface">Interactive Quiz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResume;
