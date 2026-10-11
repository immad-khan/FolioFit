import React from 'react';
import { useQuizStore } from './quizStore';
import { CheckCircle2, RotateCcw, TrendingUp, Award } from 'lucide-react';

export const QuizResult: React.FC = () => {
  const { result, resetInterview, difficulty, timeStarted, timeEnded } = useQuizStore();

  if (!result) return null;

  const getDuration = () => {
    if (!timeStarted || !timeEnded) return '00:00';
    const diff = timeEnded - timeStarted;
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-yellow-400';
    return 'text-error';
  };

  const circumference = 364.4;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Result Card */}
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-md flex flex-col lg:flex-row items-start gap-8">
        <div className="flex-1 space-y-4">
          <p className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">Mock Interview Quiz</p>
          <h1 className="text-headline-md font-bold text-on-surface">Your Results Summary</h1>
          <p className="text-body-md text-on-surface-variant">
            You've completed this quiz. Review your performance and decide your next step.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-full font-mono text-label-sm font-bold border ${result.score >= 80 ? 'bg-primary/10 text-primary border-primary/30' : result.score >= 60 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-error/10 text-error border-error/30'}`}>
              Score: {result.score}%
            </span>
            <span className="px-3 py-1.5 rounded-full font-mono text-label-sm bg-surface-container border border-outline-variant/40 text-on-surface-variant">
              Level: {difficulty}
            </span>
            <span className="px-3 py-1.5 rounded-full font-mono text-label-sm bg-surface-container border border-outline-variant/40 text-on-surface-variant">
              Time: {getDuration()}
            </span>
          </div>
          <button
            onClick={resetInterview}
            className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-label-sm font-bold uppercase tracking-wider bg-primary text-on-primary hover:bg-primary-container transition-all cursor-pointer"
          >
            <RotateCcw size={18} /> Retake Quiz
          </button>
        </div>

        {/* Score Ring */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-36 h-36 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-container" />
              <circle
                cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="transparent"
                className={`transition-all duration-1000 ${result.score >= 80 ? 'text-primary' : result.score >= 60 ? 'text-yellow-400' : 'text-error'}`}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * result.score) / 100}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>{result.score}%</span>
              <span className="font-mono text-label-sm text-on-surface-variant">Score</span>
            </div>
          </div>
          <div className="text-center">
            <p className="flex items-center gap-1 font-bold text-on-surface justify-center">
              <Award size={16} className="text-primary" />
              {result.score >= 80 ? 'Excellent!' : result.score >= 60 ? 'Good effort!' : 'Keep practicing!'}
            </p>
            <p className="font-mono text-label-sm text-on-surface-variant mt-1 max-w-[180px]">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Performance */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-7 shadow-md space-y-5">
          <h3 className="text-title-lg font-bold text-on-surface border-b border-outline-variant/30 pb-4">Performance Breakdown</h3>
          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <p className="font-mono text-label-sm text-on-surface-variant">Overall Score</p>
              <p className={`text-headline-sm font-bold ${getScoreColor(result.score)}`}>{result.score}%</p>
            </div>
            <div>
              <p className="font-mono text-label-sm text-on-surface-variant">Questions</p>
              <p className="text-headline-sm font-bold text-on-surface">{result.detailedBreakdown?.length || 10}</p>
            </div>
            <div>
              <p className="font-mono text-label-sm text-on-surface-variant">Time Taken</p>
              <p className="text-headline-sm font-bold text-on-surface">{getDuration()}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-label-sm bg-primary/10 text-primary">
            <TrendingUp size={12} /> Level: {difficulty}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-7 shadow-md">
          <h3 className="text-title-lg font-bold text-on-surface mb-2">Your Strengths</h3>
          <p className="font-mono text-label-sm text-on-surface-variant mb-5">Areas where you demonstrated strong knowledge.</p>
          <ul className="space-y-3">
            {result.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-body-sm text-on-surface">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-7 shadow-md">
          <h3 className="text-title-lg font-bold text-on-surface mb-2">Areas to Improve</h3>
          <p className="font-mono text-label-sm text-on-surface-variant mb-5">Focus here to reach higher mastery.</p>
          <ul className="space-y-3">
            {result.improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-outline mt-2 flex-shrink-0" />
                <span className="text-body-sm text-on-surface">{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="space-y-4">
        <h2 className="text-headline-sm font-bold text-on-surface">Detailed Feedback & Ideal Answers</h2>
        <div className="grid grid-cols-1 gap-5">
          {result.detailedBreakdown.map((item, index) => (
            <div key={index} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md overflow-hidden">
              <div className="p-5 border-b border-outline-variant/20 bg-surface-container/50 flex justify-between items-center">
                <h3 className="font-bold text-on-surface">Question {index + 1}</h3>
                <span className={`px-3 py-1 rounded-full font-mono text-label-sm font-bold ${
                  item.rating >= 7 ? 'bg-primary/10 text-primary' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  Rating: {item.rating}/10
                </span>
              </div>
              <div className="p-7 space-y-5">
                <div>
                  <p className="font-mono text-label-sm text-on-surface-variant uppercase mb-2">The Question</p>
                  <p className="text-title-md font-medium text-on-surface leading-relaxed">{item.question}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-mono text-label-sm text-primary uppercase mb-2 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> AI Feedback
                    </p>
                    <p className="text-body-sm text-on-surface leading-relaxed bg-primary/5 border border-primary/15 p-4 rounded-xl">
                      {item.feedback}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-label-sm text-secondary uppercase mb-2">Ideal Answer (STAR Method)</p>
                    <p className="text-body-sm text-on-surface leading-relaxed bg-secondary/5 border border-secondary/20 p-4 rounded-xl italic">
                      "{item.correctAnswer}"
                    </p>
                    <p className="font-mono text-label-sm text-on-surface-variant uppercase mt-3 mb-1">Why This Works</p>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">{item.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
