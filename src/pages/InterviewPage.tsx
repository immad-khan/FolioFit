clsimport { useState } from 'react';
import { Logo, Icon, Button } from '../components/ui';
import { navigate } from '../lib/router';
import { currentUser } from '../lib/auth';
import { useState } from 'react';

type Stage = 'setup' | 'live' | 'report';

interface Question {
  id: number;
  text: string;
  category: string;
  hint: string;
}

interface Answer {
  questionId: number;
  text: string;
  score?: number;
  feedback?: string;
}

const sampleQuestions: Record<string, Question[]> = {
  title: [
    { id: 1, text: "Tell me about yourself and why you're interested in this role.", category: 'Background', hint: 'Focus on relevant experience and motivation.' },
    { id: 2, text: "What is your greatest professional achievement?", category: 'Achievement', hint: 'Use the STAR framework: Situation, Task, Action, Result.' },
    { id: 3, text: "Describe a challenging situation you faced at work and how you handled it.", category: 'Behavioral', hint: 'Show problem-solving and resilience.' },
    { id: 4, text: "Where do you see yourself in 5 years?", category: 'Career Goals', hint: 'Show ambition aligned with the role.' },
    { id: 5, text: "Why should we hire you over other candidates?", category: 'Value Proposition', hint: 'Highlight your unique strengths.' },
  ],
};

export default function InterviewPage() {
  const user = currentUser();
  const [stage, setStage] = useState<Stage>('setup');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startInterview = () => {
    if (!jobTitle.trim()) { setError('Please enter the job title to continue.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      const qs = sampleQuestions.title.map((q) => ({
        ...q,
        text: q.text.replace('this role', `the ${jobTitle} role at ${company || 'the company'}`),
      }));
      setQuestions(qs);
      setCurrentIndex(0);
      setTranscript('');
      setAnswers([]);
      setStage('live');
      setLoading(false);
    }, 1200);
  };

  const submitAnswer = () => {
    if (!transcript.trim()) return;
    const newAnswer: Answer = {
      questionId: questions[currentIndex].id,
      text: transcript,
      score: Math.floor(Math.random() * 25) + 70,
      feedback: "Good response. Consider using more specific examples with measurable outcomes.",
    };
    const updated = [...answers];
    updated[currentIndex] = newAnswer;
    setAnswers(updated);
    setTranscript('');
    if (currentIndex + 1 >= questions.length) {
      setStage('report');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const avgScore = answers.length > 0 ? Math.round(answers.reduce((sum, a) => sum + (a.score || 0), 0) / answers.length) : 0;

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 inset-x-0 z-40 h-20 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto h-full px-5 md:px-margin flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/dashboard")} className="cursor-pointer hover:opacity-90 transition" title="FolioFit Dashboard">
              <Logo />
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-outline-variant/60 font-mono text-label-sm text-on-surface-variant">
              <button onClick={() => navigate('/')} className="hover:text-primary transition cursor-pointer">Home</button>
              <span>/</span>
              <span className="text-primary font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                AI Interview Studio
              </span>
              <span className="text-on-surface-variant">·</span>
              <span className="text-on-surface-variant capitalize">{stage}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/50 font-mono text-label-sm text-primary font-bold">
              <Icon name="record_voice_over" className="text-[18px]" />
              <span>Interview Coach</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            </div>
            {stage !== 'setup' && (
              <Button variant="secondary" className="text-label-md" onClick={() => { setStage('setup'); setAnswers([]); setQuestions([]); }}>
                <Icon name="arrow_back" className="text-[18px]" />
                <span className="hidden sm:inline">New Session</span>
              </Button>
            )}
            {user ? (
              <Button variant="secondary" className="text-label-md" onClick={() => navigate('/dashboard')}>
                <Icon name="dashboard" className="text-[18px]" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            ) : (
              <Button variant="ghost" className="text-label-md" onClick={() => navigate('/login')}>Log in</Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-5 md:px-margin">
          {stage !== 'setup' && (
            <div className="flex justify-end mb-5">
              <Button variant="secondary" className="text-label-md" onClick={() => { setStage('setup'); setAnswers([]); setQuestions([]); }}>
                <Icon name="arrow_back" className="text-[18px]" />
                New Session
              </Button>
            </div>
          )}

          {/* SETUP STAGE */}
          {stage === 'setup' && (
            <div className="space-y-8">
              <div>
                <p className="font-mono text-label-sm text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                  AI Voice Interview Coach
                </p>
                <h1 className="text-headline-md font-bold text-on-surface">Interview Preparation Studio</h1>
                <p className="text-body-md text-on-surface-variant mt-2">Answer out loud, get scored after every question, and finish with a full performance report.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Setup Form */}
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 shadow-md space-y-5">
                  <h2 className="text-title-lg font-bold text-on-surface">Set Up Your Session</h2>

                  {error && (
                    <div className="text-body-sm text-error bg-error-container/20 border border-error/30 rounded-xl px-4 py-3">{error}</div>
                  )}

                  <div className="space-y-2">
                    <label className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">Job Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Product Designer, Software Engineer..."
                      className="w-full px-5 py-3.5 rounded-xl outline-none border border-outline-variant/50 bg-surface-container text-on-surface focus:ring-2 focus:ring-primary/40 focus:border-primary/60 placeholder:text-on-surface-variant/50 text-body-md"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">Company (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Google, Stripe, Startup..."
                      className="w-full px-5 py-3.5 rounded-xl outline-none border border-outline-variant/50 bg-surface-container text-on-surface focus:ring-2 focus:ring-primary/40 focus:border-primary/60 placeholder:text-on-surface-variant/50 text-body-md"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-3 py-1 rounded-full font-mono text-label-sm bg-primary/10 text-primary">5 Questions</span>
                    <span className="px-3 py-1 rounded-full font-mono text-label-sm bg-primary/10 text-primary">AI Scoring</span>
                    <span className="px-3 py-1 rounded-full font-mono text-label-sm bg-primary/10 text-primary">Full Report</span>
                  </div>

                  <button
                    onClick={startInterview}
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl font-mono text-label-sm font-bold uppercase tracking-widest bg-primary text-on-primary hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <><Icon name="refresh" className="text-[18px] animate-spin" /> Generating Questions…</>
                    ) : (
                      <><Icon name="play_arrow" className="text-[20px]" /> Start Interview Session</>
                    )}
                  </button>
                </div>

                {/* Tips */}
                <div className="space-y-4">
                  <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-7 shadow-md">
                    <h3 className="text-title-md font-bold text-on-surface mb-4">How This Works</h3>
                    <div className="space-y-4">
                      {[
                        { icon: 'psychology', title: 'AI-Tailored Questions', desc: 'Questions are customized to your job title for maximum relevance.' },
                        { icon: 'edit', title: 'Text-Based Answers', desc: 'Type your answers as you would speak them in a real interview.' },
                        { icon: 'analytics', title: 'Instant Scoring', desc: 'Each answer is scored with detailed feedback after submission.' },
                        { icon: 'description', title: 'Full Report', desc: 'Get a complete performance report with strengths and improvements.' },
                      ].map((tip) => (
                        <div key={tip.title} className="flex items-start gap-3">
                          <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary grid place-items-center flex-shrink-0">
                            <Icon name={tip.icon} className="text-[18px]" />
                          </span>
                          <div>
                            <p className="font-bold text-on-surface text-label-md">{tip.title}</p>
                            <p className="text-body-sm text-on-surface-variant mt-0.5">{tip.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LIVE STAGE */}
          {stage === 'live' && questions.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-label-sm text-primary uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                    Live Interview Session
                  </p>
                  <h1 className="text-headline-sm font-bold text-on-surface mt-1">
                    {jobTitle}{company ? ` · ${company}` : ''}
                  </h1>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant">
                  {currentIndex + 1} / {questions.length}
                </span>
              </div>

              {/* Progress */}
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 shadow-md space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full font-mono text-label-sm bg-primary/10 text-primary">
                    {questions[currentIndex].category}
                  </span>
                  <span className="font-mono text-label-sm text-on-surface-variant">Question {currentIndex + 1}</span>
                </div>

                <div className="p-6 bg-primary/5 border border-primary/15 rounded-xl">
                  <h2 className="text-title-lg font-medium text-on-surface leading-relaxed">
                    {questions[currentIndex].text}
                  </h2>
                </div>

                <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 flex items-start gap-3">
                  <Icon name="lightbulb" className="text-[18px] text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-body-sm text-on-surface-variant italic">{questions[currentIndex].hint}</p>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">Your Answer</label>
                  <textarea
                    className="w-full p-5 h-44 outline-none transition-all rounded-xl border-2 bg-surface-container border-outline-variant/40 text-on-surface focus:ring-2 focus:ring-primary/40 focus:border-primary/60 resize-none placeholder:text-on-surface-variant/50 text-body-md"
                    placeholder="Type your answer here (use STAR method: Situation, Task, Action, Result)..."
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-mono text-label-sm text-on-surface-variant italic">
                    {currentIndex + 1 < questions.length ? `${questions.length - currentIndex - 1} questions remaining` : 'Last question'}
                  </span>
                  <button
                    onClick={submitAnswer}
                    disabled={!transcript.trim()}
                    className="px-8 py-3 font-mono text-label-sm font-bold uppercase tracking-wider rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all cursor-pointer disabled:opacity-40 flex items-center gap-2"
                  >
                    {currentIndex + 1 >= questions.length ? (
                      <><Icon name="flag" className="text-[18px]" /> Finish Interview</>
                    ) : (
                      <>Next <Icon name="arrow_forward" className="text-[18px]" /></>
                    )}
                  </button>
                </div>
              </div>

              {/* Previous Answers */}
              {answers.filter(Boolean).length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">Answered Questions</h3>
                  {answers.filter(Boolean).map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                      <span className="text-body-sm text-on-surface-variant">Q{i + 1}: {questions[i]?.text.slice(0, 60)}…</span>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-label-sm font-bold ${(a.score || 0) >= 80 ? 'bg-primary/10 text-primary' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {a.score}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REPORT STAGE */}
          {stage === 'report' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <p className="font-mono text-label-sm text-primary uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Icon name="check_circle" className="text-[16px]" />
                  Interview Complete
                </p>
                <h1 className="text-headline-md font-bold text-on-surface">Your Performance Report</h1>
                <p className="text-body-md text-on-surface-variant mt-1">Review your performance and see where to improve.</p>
              </div>

              {/* Score Overview */}
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 shadow-md flex flex-col sm:flex-row items-center gap-8">
                <div className="w-36 h-36 relative flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-container" />
                    <circle
                      cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="transparent"
                      className="text-primary transition-all duration-1000"
                      strokeDasharray={364.4}
                      strokeDashoffset={364.4 - (364.4 * avgScore) / 100}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-primary">{avgScore}%</span>
                    <span className="font-mono text-label-sm text-on-surface-variant">Average</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <h2 className="text-headline-sm font-bold text-on-surface">
                    {jobTitle} Interview{company ? ` · ${company}` : ''}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-full font-mono text-label-sm bg-primary/10 text-primary border border-primary/30">Score: {avgScore}%</span>
                    <span className="px-3 py-1.5 rounded-full font-mono text-label-sm bg-surface-container border border-outline-variant/40 text-on-surface-variant">{answers.filter(Boolean).length} Questions Answered</span>
                    <span className="px-3 py-1.5 rounded-full font-mono text-label-sm bg-surface-container border border-outline-variant/40 text-on-surface-variant">
                      {avgScore >= 80 ? '🏆 Excellent' : avgScore >= 65 ? '👍 Good' : '📈 Needs Improvement'}
                    </span>
                  </div>
                  <button
                    onClick={() => { setStage('setup'); setAnswers([]); setQuestions([]); setJobTitle(''); setCompany(''); }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-label-sm font-bold uppercase tracking-wider bg-primary text-on-primary hover:bg-primary-container transition-all cursor-pointer"
                  >
                    <Icon name="refresh" className="text-[18px]" /> New Session
                  </button>
                </div>
              </div>

              {/* Per-Question Breakdown */}
              <div className="space-y-4">
                <h2 className="text-headline-sm font-bold text-on-surface">Answer Breakdown</h2>
                {answers.filter(Boolean).map((a, i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md overflow-hidden">
                    <div className="p-5 border-b border-outline-variant/20 bg-surface-container/50 flex justify-between items-center">
                      <h3 className="font-bold text-on-surface">Question {i + 1}</h3>
                      <span className={`px-3 py-1 rounded-full font-mono text-label-sm font-bold ${(a.score || 0) >= 80 ? 'bg-primary/10 text-primary' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {a.score}%
                      </span>
                    </div>
                    <div className="p-7 space-y-4">
                      <div>
                        <p className="font-mono text-label-sm text-on-surface-variant uppercase mb-2">The Question</p>
                        <p className="text-title-md font-medium text-on-surface">{questions[i]?.text}</p>
                      </div>
                      <div>
                        <p className="font-mono text-label-sm text-on-surface-variant uppercase mb-2">Your Answer</p>
                        <p className="text-body-sm text-on-surface bg-surface-container p-4 rounded-xl border border-outline-variant/30 leading-relaxed">{a.text}</p>
                      </div>
                      <div>
                        <p className="font-mono text-label-sm text-primary uppercase mb-2 flex items-center gap-1.5">
                          <Icon name="auto_awesome" className="text-[14px]" /> AI Feedback
                        </p>
                        <p className="text-body-sm text-on-surface bg-primary/5 border border-primary/15 p-4 rounded-xl leading-relaxed">{a.feedback}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-outline-variant/40 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto px-5 md:px-margin flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-label-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            <span>AI Interview Coach & Studio • FolioFit</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="hover:text-primary transition cursor-pointer">Landing</button>
            <button onClick={() => navigate('/quiz')} className="hover:text-primary transition cursor-pointer">Quiz Lab</button>
            <button onClick={() => navigate('/skillbot')} className="hover:text-primary transition cursor-pointer">Skill Bot</button>
            <button onClick={() => navigate(user ? '/dashboard' : '/login')} className="hover:text-primary transition cursor-pointer">
              {user ? 'Dashboard' : 'Sign In'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
