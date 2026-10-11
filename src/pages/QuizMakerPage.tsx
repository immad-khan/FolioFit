import { useEffect } from 'react';
import { useQuizStore } from '../quiz/quizStore';
import { QuizStart } from '../quiz/QuizStart';
import { QuizSession } from '../quiz/QuizSession';
import { QuizResult } from '../quiz/QuizResult';
import { QuizResume } from '../quiz/QuizResume';
import { Logo, Icon, Button } from '../components/ui';
import { navigate } from '../lib/router';
import { currentUser } from '../lib/auth';

export default function QuizMakerPage() {
  const user = currentUser();
  const { step, setStep, questions, answers } = useQuizStore();

  useEffect(() => {
    if (step === 'START' && questions.length > 0 && answers.length < questions.length && answers.length > 0) {
      setStep('PAUSED');
    }
  }, []);

  const renderStep = () => {
    switch (step) {
      case 'START': return <QuizStart />;
      case 'QUIZ': return <QuizSession />;
      case 'PAUSED': return <QuizResume />;
      case 'RESULT': return <QuizResult />;
      default: return <QuizStart />;
    }
  };

  const stepLabels: Record<string, string> = {
    START: 'Setup',
    QUIZ: 'In Progress',
    PAUSED: 'Paused',
    RESULT: 'Results',
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 inset-x-0 z-40 h-20 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto h-full px-5 md:px-margin flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer hover:opacity-90 transition"
              title="FolioFit Dashboard"
            >
              <Logo />
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-outline-variant/60 font-mono text-label-sm text-on-surface-variant">
              <button onClick={() => navigate('/')} className="hover:text-primary transition cursor-pointer">Home</button>
              <span>/</span>
              <span className="text-primary font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                Quiz Lab
              </span>
              <span>/</span>
              <span className="text-on-surface-variant">{stepLabels[step]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/50 font-mono text-label-sm text-primary font-bold">
              <Icon name="quiz" className="text-[18px]" />
              <span>AI Quiz Lab</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            </div>

            <button
              onClick={() => navigate('/skillbot')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-label-sm border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary/50 transition cursor-pointer"
            >
              <Icon name="smart_toy" className="text-[16px]" />
              <span>Skill Bot</span>
            </button>

            {user ? (
              <Button variant="secondary" className="text-label-md" onClick={() => navigate('/dashboard')}>
                <Icon name="dashboard" className="text-[18px]" />
                <span>Dashboard</span>
              </Button>
            ) : (
              <Button variant="ghost" className="text-label-md" onClick={() => navigate('/login')}>Log in</Button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-margin">
          {renderStep()}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-outline-variant/40 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto px-5 md:px-margin flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-label-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            <span>Quiz Lab & Interview Simulation • FolioFit</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="hover:text-primary transition cursor-pointer">Landing</button>
            <button onClick={() => navigate('/skillbot')} className="hover:text-primary transition cursor-pointer">Skill Bot</button>
            <button onClick={() => navigate('/scraper')} className="hover:text-primary transition cursor-pointer">Job Scraper</button>
            <button onClick={() => navigate(user ? '/dashboard' : '/login')} className="hover:text-primary transition cursor-pointer">
              {user ? 'Dashboard' : 'Sign In'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
