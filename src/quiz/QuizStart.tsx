import React, { useState } from 'react';
import { useQuizStore } from './quizStore';
import { generateInterviewQuestions } from './quizGroq';
import { Loader2, CheckCircle2 } from 'lucide-react';

const categories = [
  { id: 'Technical', count: '24 Qs' },
  { id: 'HR', count: '16 Qs' },
  { id: 'Behavioral', count: '18 Qs' },
];

const difficulties = [
  {
    id: 'Beginner',
    desc: 'Warm-up questions, confidence building',
    sub: "Great if you're new to interviewing or returning to the job market after a break.",
    color: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    id: 'Intermediate',
    desc: 'Real-world, role-focused questions',
    sub: 'Ideal if you already have some interview experience and want sharper answers.',
    color: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-400',
  },
  {
    id: 'Advanced',
    desc: 'Challenging, panel-style questions',
    sub: "Best suited if you're preparing for senior or highly competitive roles.",
    color: 'from-purple-500/10 to-violet-500/10',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/10 text-purple-400',
  },
];

export const QuizStart: React.FC = () => {
  const { startInterview } = useQuizStore();
  const [selectedCategory, setSelectedCategory] = useState('Technical');
  const [customCategory, setCustomCategory] = useState('');
  const [testType, setTestType] = useState<'WRITTEN' | 'MCQ'>('WRITTEN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async (difficulty: string) => {
    setLoading(true);
    setError('');
    const categoryToUse = customCategory.trim() || selectedCategory;
    try {
      const questions = await generateInterviewQuestions(categoryToUse, difficulty, testType);
      if (questions && questions.length > 0) {
        startInterview(categoryToUse, difficulty, testType, questions);
      } else {
        setError('Could not generate questions. Using sample questions instead.');
        const fallback = [
          { id: 1, question: `Tell me about your experience with ${categoryToUse}.`, category: categoryToUse },
          { id: 2, question: `What is your greatest strength in ${categoryToUse}?`, category: categoryToUse },
          { id: 3, question: `Describe a challenging problem you solved in ${categoryToUse}.`, category: categoryToUse },
        ];
        startInterview(categoryToUse, difficulty, testType, fallback);
      }
    } catch {
      setError('API error. Starting with sample questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-md">
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
          <div className="space-y-4 max-w-2xl">
            <p className="font-mono text-label-sm text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
              AI Mock Interview Quiz
            </p>
            <h1 className="text-headline-md text-on-surface font-bold">Interview Simulation Lab</h1>
            <p className="text-body-md text-on-surface-variant">
              Prepare for your next interview with AI-powered questions. Specify your niche field for tailored, role-specific questions.
            </p>

            {error && (
              <div className="text-body-sm text-error bg-error-container/20 border border-error/30 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5 pt-2">
              <div className="space-y-2">
                <label className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">
                  1. Specify Category (Field of Interest)
                </label>
                <div className="relative group max-w-md">
                  <input
                    type="text"
                    placeholder="e.g. Cloud Computing, AI, Data Science, DevOps..."
                    className="w-full px-5 py-3.5 rounded-xl outline-none transition-all font-medium bg-surface-container border border-outline-variant/50 text-on-surface focus:ring-2 focus:ring-primary/40 focus:border-primary/60 placeholder:text-on-surface-variant/50"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors text-on-surface-variant/50 group-focus-within:text-primary">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
                <p className="font-mono text-label-sm text-on-surface-variant/60 italic">Leave blank to use quick categories →</p>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">
                  2. Choose Test Format
                </label>
                <div className="flex gap-3 max-w-md">
                  <button
                    onClick={() => setTestType('WRITTEN')}
                    className={`flex-1 py-3.5 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      testType === 'WRITTEN'
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-outline-variant/40 bg-surface-container text-on-surface-variant hover:border-primary/40'
                    }`}
                  >
                    <span className="text-label-md">Written / Typed</span>
                    <span className="font-mono text-label-sm opacity-70">Open-ended answers</span>
                  </button>
                  <button
                    onClick={() => setTestType('MCQ')}
                    className={`flex-1 py-3.5 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      testType === 'MCQ'
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-outline-variant/40 bg-surface-container text-on-surface-variant hover:border-primary/40'
                    }`}
                  >
                    <span className="text-label-md">MCQ</span>
                    <span className="font-mono text-label-sm opacity-70">Multiple choice</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <span className="px-3 py-1 rounded-full font-mono text-label-sm bg-primary/10 text-primary">Tailored by AI</span>
                <span className="px-3 py-1 rounded-full font-mono text-label-sm bg-primary/10 text-primary">10 Questions</span>
                <span className="px-3 py-1 rounded-full font-mono text-label-sm bg-primary/10 text-primary">~15 Minutes</span>
              </div>
            </div>
          </div>

          {/* Quick Category Selection */}
          <div className="w-full lg:w-64 rounded-xl border border-outline-variant/30 bg-surface-container p-5">
            <h3 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Quick Selection</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedCategory === cat.id ? 'bg-primary' : 'bg-outline'}`} />
                    <span className="font-mono text-label-sm font-bold uppercase">{cat.id}</span>
                  </div>
                  <span className="font-mono text-label-sm opacity-60">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div>
        <h2 className="text-headline-sm text-on-surface font-bold mb-2">Choose your difficulty</h2>
        <p className="text-body-sm text-on-surface-variant mb-6">Start with a level that matches your current interview readiness.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {difficulties.map((diff) => (
            <div key={diff.id} className={`rounded-2xl p-7 border ${diff.border} bg-gradient-to-br ${diff.color} flex flex-col hover:shadow-lg transition-all duration-300`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-title-lg font-bold text-on-surface">{diff.id}</h3>
                  <p className="font-mono text-label-sm text-on-surface-variant mt-0.5">{diff.desc}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-mono text-label-sm ${diff.badge}`}>{diff.id[0]}</span>
              </div>
              <p className="text-body-sm text-on-surface-variant flex-1 leading-relaxed mb-6">{diff.sub}</p>
              <button
                onClick={() => handleStart(diff.id)}
                disabled={loading}
                className="w-full font-mono text-label-sm font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest bg-primary text-on-primary hover:bg-primary-container cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Initiate Session →'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizStart;
