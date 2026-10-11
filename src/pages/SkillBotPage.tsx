import { useState } from 'react';
import SkillRoadmap from '../skillmaker/SkillRoadmap';
import { Logo, Icon, Button } from '../components/ui';
import { navigate } from '../lib/router';
import { currentUser } from '../lib/auth';

export default function SkillBotPage() {
  const user = currentUser();
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col">
      {/* SkillBot FolioFit Navigation Bar */}
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
              <button
                onClick={() => navigate('/')}
                className="hover:text-primary transition cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-primary font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                SkillBot Module
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/50 text-xs font-mono text-primary font-bold">
              <Icon name="smart_toy" className="text-[18px]" />
              <span>SkillBot AI Copilot</span>
            </div>

            {user ? (
              <Button
                variant="secondary"
                className="text-label-md"
                onClick={() => navigate('/dashboard')}
              >
                <Icon name="dashboard" className="text-[18px]" />
                <span>Dashboard</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="text-label-md"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
            )}

            <Button
              className="px-4 py-2 text-label-md"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <Icon name={copied ? "check" : "share"} className="text-[18px]" />
              <span className="hidden sm:inline">{copied ? "Copied!" : "Share Path"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Roadmap Area */}
      <main className="flex-1 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-5 md:px-margin flex justify-end mb-4">
          <Button
            className="px-4 py-2 text-label-md"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <Icon name={copied ? "check" : "share"} className="text-[18px]" />
            <span>{copied ? "Copied!" : "Share Path"}</span>
          </Button>
        </div>
        <SkillRoadmap initialView="roadmap" />
      </main>

      {/* Subtle Footer */}
      <footer className="py-6 border-t border-outline-variant/40 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto px-5 md:px-margin flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            <span>SkillBot Career Roadmap & Telemetry Engine • FolioFit</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="hover:text-primary transition cursor-pointer">Landing</button>
            <button onClick={() => navigate(user ? '/dashboard' : '/login')} className="hover:text-primary transition cursor-pointer">
              {user ? 'Dashboard' : 'Sign In'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
