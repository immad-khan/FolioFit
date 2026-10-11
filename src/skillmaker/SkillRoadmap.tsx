import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { roadmapAPI, RoadmapData, SkillItem } from './api';
import Button from './components/ui/button';

interface SkillRoadmapProps {
  initialView?: 'setup' | 'roadmap' | 'progress';
}

const PRESET_ROLES = [
  { title: 'Software Engineer', icon: 'code', level: 'beginner' },
  { title: 'AI Engineer', icon: 'smart_toy', level: 'intermediate' },
  { title: 'Full Stack Developer', icon: 'layers', level: 'intermediate' },
  { title: 'Frontend Developer', icon: 'devices', level: 'beginner' },
  { title: 'DevOps & Cloud Architect', icon: 'cloud', level: 'advanced' },
  { title: 'Data Scientist', icon: 'analytics', level: 'intermediate' },
];

export default function SkillRoadmap({ initialView = 'roadmap' }: SkillRoadmapProps) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  
  // Input fields for user role and level
  const [roleInput, setRoleInput] = useState('AI Engineer');
  const [levelInput, setLevelInput] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  
  // UI States
  const [, setView] = useState<'setup' | 'roadmap' | 'progress'>(initialView);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'uncompleted' | 'completed'>('all');
  
  // SkillBot Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ message: string; response: string; timestamp?: string }>>([
    {
      message: 'What should I prioritize first in this career path?',
      response: 'Start with Section 1: Foundational Core. Completing the foundational skills and practicing the linked resources gives you the baseline needed for subsequent advanced milestones!',
      timestamp: '12:00 PM'
    }
  ]);

  useEffect(() => {
    fetchActiveRoadmap();
  }, []);

  const fetchActiveRoadmap = async () => {
    setLoading(true);
    try {
      const response = await roadmapAPI.getRoadmaps();
      if (response && response.success && response.data.length > 0) {
        setRoadmap(response.data[0]);
        setRoleInput(response.data[0].role);
        setLevelInput(response.data[0].level as any);
      }
    } catch (error) {
      console.error('Failed to fetch active roadmap', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (customRole?: string, customLevel?: string) => {
    const roleToUse = (customRole || roleInput).trim();
    const levelToUse = (customLevel || levelInput);

    if (!roleToUse) {
      toast.error('Please enter a target role (e.g. Software Engineer or AI Engineer)', {
        style: { background: '#ba1a1a', color: '#ffffff', borderRadius: '9999px' }
      });
      return;
    }

    setGenerating(true);
    try {
      const response = await roadmapAPI.generateRoadmap({ role: roleToUse, level: levelToUse });
      if (response && response.success && response.data) {
        setRoadmap(response.data);
        setRoleInput(roleToUse);
        setLevelInput(levelToUse as any);
        setView('roadmap');
        toast.success(`Career path created for ${roleToUse}!`, {
          icon: '🚀',
          style: { background: '#006b5e', color: '#ffffff', borderRadius: '9999px' }
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate career path');
    } finally {
      setGenerating(false);
    }
  };

  const toggleSkill = async (skillId: string, currentStatus: boolean) => {
    if (!roadmap) return;
    try {
      const response = await roadmapAPI.updateSkillProgress(roadmap.id, {
        skill_id: skillId,
        is_completed: !currentStatus,
      });

      if (response && response.success && response.data) {
        setRoadmap(response.data);
        toast.success(currentStatus ? 'Skill marked as pending' : 'Skill marked as complete!', {
          icon: currentStatus ? '↩️' : '✅',
          style: { background: '#006b5e', color: '#ffffff', borderRadius: '9999px' }
        });
      }
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    const query = chatMessage;
    setChatMessage('');
    setChatLoading(true);

    try {
      const response = await roadmapAPI.skillbotChat({ message: query });
      if (response && response.success) {
        setChatHistory(prev => [...prev, response.data]);
      }
    } catch (error) {
      toast.error('SkillBot helper is currently busy');
    } finally {
      setChatLoading(false);
    }
  };

  // Helper counters
  const allSkills = roadmap ? roadmap.sections.flatMap(s => s.skills) : [];
  const completedSkills = allSkills.filter(s => s.is_completed);
  const totalSkillsCount = allSkills.length;
  const completedSkillsCount = completedSkills.length;
  const completionPercentage = roadmap?.completion_percentage ?? 0;

  const filterSkills = (skills: SkillItem[]) => {
    if (activeTab === 'completed') return skills.filter(s => s.is_completed);
    if (activeTab === 'uncompleted') return skills.filter(s => !s.is_completed);
    return skills;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] w-full py-16">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-surface-container"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 font-mono text-xs text-primary font-bold tracking-wider">
          LOADING CAREER ROADMAP ENGINE...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-sans text-on-surface">
      <Toaster position="top-right" />

      {/* ========================================================================= */}
      {/* 1. HERO & ROLE GENERATION INPUT SECTION                                  */}
      {/* ========================================================================= */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md border border-outline-variant/40 space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-primary text-xs font-mono font-bold tracking-wider border border-outline-variant/60">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            AI CAREER PATH ENGINE
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-on-surface">
            Build Your Personalized Career Roadmap
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant font-normal leading-relaxed">
            Enter any target role like <span className="text-primary font-semibold">"Software Engineer"</span> or <span className="text-primary font-semibold">"AI Engineer"</span> to instantly generate a step-by-step career path with curated learning resources and progress tracking.
          </p>
        </div>

        {/* Input & Controls Form */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Main Role Input Field */}
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Software Engineer, AI Engineer, Full Stack Developer..."
                className="w-full bg-surface-container-low/60 border border-outline-variant hover:border-primary focus:border-primary rounded-full pl-12 pr-4 py-3.5 text-sm sm:text-base font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans shadow-sm"
              />
            </div>

            {/* Level Selector Chips */}
            <div className="flex items-center gap-1.5 bg-surface-container-low p-1.5 rounded-full border border-outline-variant/40 flex-shrink-0">
              {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelInput(lvl)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs font-mono font-semibold capitalize transition-all cursor-pointer ${
                    levelInput === lvl
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Generate Path CTA Button */}
            <Button
              onClick={() => handleGenerate()}
              isLoading={generating}
              size="lg"
              variant="primary"
              className="rounded-full shadow-md gap-2 flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>Assemble Path</span>
            </Button>
          </div>

          {/* Preset Quick Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider mr-1">
              Popular Paths:
            </span>
            {PRESET_ROLES.map((preset) => (
              <button
                key={preset.title}
                onClick={() => {
                  setRoleInput(preset.title);
                  setLevelInput(preset.level as any);
                  handleGenerate(preset.title, preset.level);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition-all cursor-pointer ${
                  roleInput.toLowerCase() === preset.title.toLowerCase()
                    ? 'bg-primary-fixed text-on-primary-fixed border-primary-container font-semibold'
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[15px] text-primary">
                  {preset.icon}
                </span>
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ROADMAP OVERVIEW & PROGRESS SUMMARY CARD                               */}
      {/* ========================================================================= */}
      {roadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Path Header Card (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-container animate-pulse"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                    Active Learning Path
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-surface-container-low text-on-surface font-mono text-xs font-bold px-3 py-1 rounded-full border border-outline-variant/60 capitalize">
                    Level: {roadmap.level}
                  </span>
                  <span className="bg-secondary-container text-on-secondary-container font-mono text-xs font-bold px-3 py-1 rounded-full">
                    {roadmap.sections.length} Milestones
                  </span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-2">
                {roadmap.role}
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Step-by-step career path tailored with industry standard competencies, hands-on tutorials, official documentation, and project milestones.
              </p>
            </div>

            {/* Quick Filter Tabs & Count */}
            <div className="mt-6 pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">
                  Filter:
                </span>
                {(['all', 'uncompleted', 'completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all capitalize cursor-pointer ${
                      activeTab === tab
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono font-semibold text-on-surface-variant">
                <strong className="text-primary">{completedSkillsCount}</strong> of {totalSkillsCount} Skills Mastered
              </span>
            </div>
          </div>

          {/* Progress Circular Gauge Card (4 cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-outline-variant/40 flex flex-col justify-between items-center text-center">
            <span className="text-xs font-bold text-on-surface font-mono uppercase tracking-wider mb-2">
              Overall Roadmap Progress
            </span>

            {/* Circular SVG Gauge */}
            <div className="relative w-32 h-32 my-1 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#dcf9fd"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#00a693"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-on-surface font-mono">
                  {completionPercentage}%
                </span>
                <span className="text-[9px] font-mono text-on-surface-variant font-bold uppercase tracking-wider">
                  COMPLETE
                </span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant mt-2">
              {completionPercentage === 100
                ? '🎉 Congratulations! You have mastered all skills in this career path!'
                : completionPercentage > 0
                ? `${completedSkillsCount} skills finished. Keep advancing through your active milestones!`
                : 'Ready to begin? Click the checkboxes as you complete each learning step.'}
            </p>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DETAILED STEP-BY-STEP CAREER PATH & RESOURCES                         */}
      {/* ========================================================================= */}
      {roadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Milestones & Skills List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-on-surface">
                  Curriculum & Learning Milestones
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Expand each skill to view curated documentation, video tutorials, and courses.
                </p>
              </div>
            </div>

            {/* Sections Loop */}
            <div className="space-y-6">
              {roadmap.sections.map((section, sIdx) => {
                const visibleSkills = filterSkills(section.skills);
                if (visibleSkills.length === 0) return null;

                const sectionCompleted = section.skills.filter(s => s.is_completed).length;

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sIdx * 0.08 }}
                    className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/40 overflow-hidden"
                  >
                    {/* Section Header */}
                    <div className="p-5 bg-surface-container-low/50 border-b border-outline-variant/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-mono text-xs font-bold">
                          {sIdx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-on-surface">
                            {section.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            {section.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-primary bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant/40 flex-shrink-0">
                        {sectionCompleted} / {section.skills.length} done
                      </span>
                    </div>

                    {/* Skill Items in Section */}
                    <div className="p-5 space-y-4 divide-y divide-outline-variant/30">
                      {visibleSkills.map((skill) => {
                        const isExpanded = expandedSkillId === skill.id;

                        return (
                          <div key={skill.id} className="pt-4 first:pt-0 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              
                              {/* Checkbox & Skill Title */}
                              <div className="flex items-start gap-3 flex-1">
                                <button
                                  onClick={() => toggleSkill(skill.id, skill.is_completed)}
                                  className={`mt-0.5 flex-shrink-0 transition-transform active:scale-90 cursor-pointer ${
                                    skill.is_completed ? 'text-primary' : 'text-outline-variant hover:text-primary'
                                  }`}
                                  title={skill.is_completed ? 'Mark as incomplete' : 'Mark as completed'}
                                >
                                  <span className="material-symbols-outlined text-[24px]">
                                    {skill.is_completed ? 'check_circle' : 'radio_button_unchecked'}
                                  </span>
                                </button>

                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h5 className={`text-sm sm:text-base font-bold ${
                                      skill.is_completed ? 'text-primary' : 'text-on-surface'
                                    }`}>
                                      {skill.name}
                                    </h5>
                                    {skill.is_completed ? (
                                      <span className="bg-primary-fixed/40 text-on-primary-fixed text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                                        COMPLETED
                                      </span>
                                    ) : (
                                      <span className="bg-surface-container text-on-surface-variant text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                                        TO LEARN
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                                    {skill.description}
                                  </p>
                                </div>
                              </div>

                              {/* Toggle Resources Button */}
                              <button
                                onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                                className={`flex-shrink-0 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isExpanded
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-surface-container-low text-primary hover:bg-surface-container border-outline-variant/60'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {isExpanded ? 'expand_less' : 'menu_book'}
                                </span>
                                <span>{isExpanded ? 'Hide' : `Resources (${skill.resources.length})`}</span>
                              </button>
                            </div>

                            {/* Expandable Resources Drawer */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="ml-9 p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                                      <span className="material-symbols-outlined text-[16px] text-primary">school</span>
                                      Recommended Learning Links & Documentation
                                    </span>
                                    <span className="text-[10px] font-mono text-primary font-bold">
                                      Verified Courses & Docs
                                    </span>
                                  </div>

                                  <div className="grid gap-2">
                                    {skill.resources.map((res, rIdx) => (
                                      <a
                                        key={rIdx}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 hover:border-primary hover:shadow-sm transition-all group"
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <span className="material-symbols-outlined text-primary text-[18px]">
                                            {res.type === 'video' ? 'play_circle' : res.type === 'course' ? 'workspace_premium' : 'menu_book'}
                                          </span>
                                          <div>
                                            <span className="text-xs sm:text-sm font-semibold text-on-surface group-hover:text-primary block">
                                              {res.name}
                                            </span>
                                            <span className="text-[10px] font-mono text-on-surface-variant">
                                              {res.url}
                                            </span>
                                          </div>
                                        </div>
                                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[18px]">
                                          open_in_new
                                        </span>
                                      </a>
                                    ))}
                                    {skill.resources.length === 0 && (
                                      <p className="text-xs text-on-surface-variant italic py-1">
                                        No direct links attached. Ask SkillBot in the sidebar for curated materials.
                                      </p>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: SkillBot Career Assistant & Fast Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SkillBot AI Helper Widget */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-outline-variant/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">SkillBot Career Assistant</h4>
                    <p className="text-[11px] font-mono text-primary">Context Aware • {roadmap.role}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-mono text-primary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                  Active
                </span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-end">
                      <div className="bg-surface-container-low text-on-surface border border-outline-variant/40 px-3.5 py-2 rounded-2xl rounded-tr-none max-w-[85%] font-medium">
                        {chat.message}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-surface-container text-on-surface px-3.5 py-2.5 rounded-2xl rounded-tl-none max-w-[90%] leading-relaxed border border-outline-variant/30">
                        <p className="font-normal">{chat.response}</p>
                        {chat.timestamp && (
                          <span className="text-[9px] font-mono text-on-surface-variant/70 block mt-1 text-right">
                            {chat.timestamp}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="relative flex items-center gap-2 pt-2 border-t border-surface-container">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Ask SkillBot about any skill or resource..."
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-full py-2.5 pl-4 pr-12 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                />
                <button
                  disabled={chatLoading}
                  onClick={handleChat}
                  className="absolute right-1.5 w-8 h-8 rounded-full bg-primary-container hover:bg-primary text-white flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {chatLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-[#004d44] to-[#006b5e] text-white rounded-2xl p-6 shadow-md border border-[#00a693]/30 space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary-fixed">
                  ROADMAP TOOLS
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  Ready to Share or Export?
                </h4>
                <p className="text-xs text-white/80 mt-1">
                  Export this roadmap or print your verified competency summary.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => {
                    toast.success('Career path link copied to clipboard!', {
                      icon: '📋',
                      style: { background: '#00332c', color: '#7af7e1', borderRadius: '9999px' }
                    });
                  }}
                  variant="primary"
                  size="sm"
                  className="w-full bg-white text-primary hover:bg-primary-fixed hover:text-on-primary-fixed font-semibold py-2.5 text-xs gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                  Share Learning Path
                </Button>

                <Button
                  onClick={() => {
                    window.print();
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold py-2.5 text-xs gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  Print / Save as PDF
                </Button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
