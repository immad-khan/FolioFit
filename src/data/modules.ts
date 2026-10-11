export type Module = {
  icon: string;
  tag: string;
  title: string;
  desc: string;
  stat: string;
  cta: string;
  bullets: string[];
  route?: string; // internal route to navigate to
  externalUrl?: string; // external URL to open in new tab
};

export const modules: Module[] = [
  {
    icon: "difference",
    tag: "Engine v4.2",
    title: "Resume Comparison & Gap Audit",
    desc: "Side-by-side JD parser identifying structural ATS mismatch, omitted hard competencies, and keyword density deficiencies.",
    stat: "94 avg ATS parse index",
    cta: "Run Audit",
    externalUrl: "https://01a12540-dc4f-7190-8a33-c05ba809f44a.arena.site/",
    bullets: ["ATS parse scoring", "Missing-skill detection", "Keyword density heatmap"],
  },
  {
    icon: "travel_explore",
    tag: "Live Extractor",
    title: "Job Description Scraper",
    desc: "One-click extraction pipeline for LinkedIn, Indeed, and Glassdoor URLs. Automatically distills hidden recruiter criteria.",
    stat: "0.12s parsing speed",
    cta: "Scrape Now",
    route: "/scraper",
    bullets: ["LinkedIn / Indeed / Glassdoor", "Hidden criteria distillation", "Cached JD library"],
  },
  {
    icon: "auto_awesome",
    tag: "Tailored AI",
    title: "AI Resume & Bullet Crafter",
    desc: "Generates executive STAR-framework impact statements tailored to target seniority levels and industry lexicons.",
    stat: "6 variants per role",
    cta: "Generate",
    bullets: ["STAR impact bullets", "Seniority-aware tone", "One-click role variants"],
  },
  {
    icon: "record_voice_over",
    tag: "Voice Sim",
    title: "AI Interview Taker & Coach",
    desc: "Conduct realistic vocal and scenario-based simulated interviews. Generates sentiment analysis and conciseness scores.",
    stat: "85% avg confidence lift",
    cta: "Start Session",
    route: "/interview",
    bullets: ["Voice & video mocks", "Sentiment + pace analysis", "Behavioral & technical rounds"],
  },
  {
    icon: "quiz",
    tag: "Quiz Maker",
    title: "Quiz Lab & Competency Drills",
    desc: "Adaptive technical and product trade-off assessments designed to uncover cognitive weak points before the real screening.",
    stat: "92nd percentile avg",
    cta: "Take Quiz",
    route: "/quiz",
    bullets: ["Adaptive difficulty", "Role-specific question banks", "Instant explanations"],
  },
  {
    icon: "trending_up",
    tag: "Market Pulse",
    title: "Market Trends Intelligence",
    desc: "Real-time hiring demand, salary bands, and in-demand skill velocity across roles, regions, and industries.",
    stat: "1.2M postings indexed",
    cta: "Explore Trends",
    bullets: ["Salary benchmarks", "Rising skill signals", "Role demand forecasts"],
  },
  {
    icon: "psychology",
    tag: "SkillMaker",
    title: "SkillMaker Learning Paths",
    desc: "Turns your gap audit into a personalized upskilling roadmap with curated resources, milestones, and progress tracking.",
    stat: "4-week avg gap closure",
    cta: "Build Path",
    route: "/skillbot",
    bullets: ["Gap-driven roadmaps", "Curated micro-lessons", "Milestone tracking"],
  },
  {
    icon: "web",
    tag: "Published Live",
    title: "Dynamic Portfolio Engine",
    desc: "Interactive case-study showcase with dynamic CMS syncing, live code sandbox embeddings, and client-ready domain export.",
    stat: "foliofit.dev/you",
    cta: "Edit Layout",
    route: "/portfolio",
    bullets: ["Case-study templates", "Live code embeds", "Custom domain export"],
  },
];
