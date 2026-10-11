import React from 'react';
import SkillRoadmap from './SkillRoadmap';

export default function SkillBotPage() {
  return (
    <main className="min-h-screen bg-background text-on-surface antialiased py-4 sm:py-8">
      <SkillRoadmap initialView="roadmap" />
    </main>
  );
}
