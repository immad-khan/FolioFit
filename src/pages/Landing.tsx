import { useState } from "react";
import { Button, Chip, Eyebrow, Icon, Logo } from "../components/ui";
import { KeywordBars, Progress, Radar, VelocityChart } from "../components/charts";
import { modules } from "../data/modules";
import { navigate } from "../lib/router";
import { cn } from "../utils/cn";

const navLinks = [
  { href: "#modules", label: "Modules" },
  { href: "#how", label: "How it works" },
  { href: "#analytics", label: "Analytics" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const scrollTo = (id: string) => {
  const sectionId = id.replace("#", "");
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  navigate("/");
  window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
};

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-20 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto h-full px-5 md:px-margin flex items-center justify-between gap-6">
        <button onClick={() => navigate("/dashboard")} className="cursor-pointer hover:opacity-90 transition" title="FolioFit Dashboard">
          <Logo />
        </button>
        <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low rounded-full p-1.5 border border-outline-variant/50">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="px-4 py-2 rounded-full text-label-md text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary transition cursor-pointer"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => navigate("/scraper")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-label-md text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary transition cursor-pointer font-medium"
          >
            <Icon name="travel_explore" className="text-[18px]" />
            <span>Job Scraper</span>
          </button>
          <button
            onClick={() => navigate("/quiz")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-label-md text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary transition cursor-pointer font-medium"
          >
            <Icon name="quiz" className="text-[18px]" />
            <span>Quiz Lab</span>
          </button>
          <button
            onClick={() => navigate("/interview")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-label-md text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary transition cursor-pointer font-medium"
          >
            <Icon name="record_voice_over" className="text-[18px]" />
            <span>Interview</span>
          </button>
          <a
            href="https://01a12540-dc4f-7190-8a33-c05ba809f44a.arena.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-label-md text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary transition cursor-pointer font-medium"
            title="Open Resume Comparison & Gap Audit"
          >
            <Icon name="difference" className="text-[18px]" />
            <span>Resume Audit</span>
          </a>
          <button
            onClick={() => navigate("/skillbot")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-label-md bg-primary-container text-on-primary hover:bg-primary transition cursor-pointer font-semibold shadow-sm ml-1"
          >
            <Icon name="smart_toy" className="text-[18px]" />
            <span>Skill Bot</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse" />
          </button>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Log in
          </Button>
          <Button className="px-5 py-2.5 text-label-md" onClick={() => navigate("/signup")}>
            Create account <Icon name="arrow_forward" className="text-[18px]" />
          </Button>
        </div>
        <button className="md:hidden w-11 h-11 grid place-items-center rounded-full bg-surface-container cursor-pointer" onClick={() => setOpen(!open)}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-surface-container-lowest shadow-md mx-4 rounded-xl p-4 space-y-1">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => {
                setOpen(false);
                scrollTo(l.href);
              }}
              className="block w-full text-left px-4 py-3 rounded-lg text-body-md hover:bg-surface-container-low cursor-pointer"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { setOpen(false); navigate("/scraper"); }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-body-md hover:bg-surface-container-low text-on-surface font-semibold cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Icon name="travel_explore" className="text-[18px] text-primary" />
              Real-Time Job Scraper
            </span>
            <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-mono">LIVE</span>
          </button>
          <button
            onClick={() => { setOpen(false); navigate("/quiz"); }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-body-md hover:bg-surface-container-low text-on-surface font-semibold cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Icon name="quiz" className="text-[18px] text-primary" />
              AI Quiz Lab
            </span>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">NEW</span>
          </button>
          <button
            onClick={() => { setOpen(false); navigate("/interview"); }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-body-md hover:bg-surface-container-low text-on-surface font-semibold cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Icon name="record_voice_over" className="text-[18px] text-primary" />
              Interview Coach
            </span>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">AI</span>
          </button>
          <a
            href="https://01a12540-dc4f-7190-8a33-c05ba809f44a.arena.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-body-md hover:bg-surface-container-low text-on-surface font-semibold cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <span className="flex items-center gap-2">
              <Icon name="difference" className="text-[18px] text-primary" />
              Resume Comparison & Gap Audit
            </span>
            <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-mono">↗</span>
          </a>
          <button
            onClick={() => { setOpen(false); navigate("/skillbot"); }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-body-md bg-surface-container text-primary font-semibold cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Icon name="smart_toy" className="text-[18px]" />
              Skill Bot & Career Roadmap
            </span>
            <span className="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-mono">AI LIVE</span>
          </button>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1 py-3" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button className="flex-1 py-3 text-label-md" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroPreview() {
  const side = ["dashboard", "difference", "travel_explore", "auto_awesome", "record_voice_over", "quiz", "web"];
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-primary-container/20 blur-3xl rounded-full" />
      <div className="relative bg-surface-container-lowest/90 rounded-2xl shadow-[0_24px_60px_-12px_rgba(13,92,117,0.25)] border border-outline-variant/40 p-3 flex gap-3">
        <div className="hidden sm:flex w-14 bg-primary rounded-full py-4 flex-col items-center gap-3 shadow-[0_12px_32px_-4px_rgba(13,92,117,0.2)]">
          <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed grid place-items-center">
            <Icon name="auto_awesome" className="text-[18px]" />
          </div>
          {side.map((s, i) => (
            <div
              key={s}
              className={cn(
                "w-9 h-9 rounded-full grid place-items-center text-on-primary/70",
                i === 0 && "bg-primary-container text-on-primary shadow-[0_0_16px_rgba(0,166,147,0.4)]"
              )}
            >
              <Icon name={s} className="text-[18px]" />
            </div>
          ))}
        </div>
        <div className="flex-1 p-2 space-y-3 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] tracking-widest text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" /> REAL-TIME TELEMETRY
              </p>
              <p className="text-title-md">Executive Career Hub</p>
            </div>
            <span className="text-[10px] bg-primary text-on-primary px-3 py-1.5 rounded-full flex items-center gap-1">
              <Icon name="bolt" className="text-[12px]" /> Run Diagnostic
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { l: "AGGREGATE MATCH", v: "88.4%", p: 88 },
              { l: "ATS PARSE INDEX", v: "94", p: 94 },
              { l: "PIPELINE", v: "14", p: 62 },
              { l: "INTERVIEW SIM", v: "85%", p: 85 },
            ].map((m) => (
              <div key={m.l} className="rounded-xl border border-outline-variant/50 p-3 bg-surface-container-lowest">
                <p className="font-mono text-[9px] tracking-wider text-on-surface-variant">{m.l}</p>
                <p className="text-headline-md mt-1">{m.v}</p>
                <Progress value={m.p} className="mt-2" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2.5">
            <div className="col-span-2 rounded-xl border border-outline-variant/50 p-2 bg-surface-container-lowest">
              <Radar size={200} />
            </div>
            <div className="col-span-3 rounded-xl border border-outline-variant/50 p-3 bg-surface-container-lowest flex flex-col justify-between">
              <div className="flex justify-between items-baseline">
                <p className="font-mono text-[9px] tracking-wider text-on-surface-variant">30-DAY VELOCITY</p>
                <p className="font-mono text-[10px] text-primary">+14.6%</p>
              </div>
              <VelocityChart />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex absolute -left-8 bottom-10 bg-surface-container-lowest rounded-xl shadow-md p-3 items-center gap-3 animate-float border border-outline-variant/40">
        <div className="w-10 h-10 rounded-full bg-primary-fixed grid place-items-center text-primary">
          <Icon name="check_circle" filled />
        </div>
        <div>
          <p className="text-label-md">Stripe · 94% Fit</p>
          <p className="font-mono text-label-sm text-on-surface-variant">Resume adapted</p>
        </div>
      </div>
      <div className="hidden md:flex absolute -right-4 -top-5 bg-surface-container-lowest rounded-full shadow-md px-4 py-2 items-center gap-2 animate-float [animation-delay:1.5s] border border-outline-variant/40">
        <Icon name="bolt" className="text-primary-container text-[18px]" />
        <span className="font-mono text-label-sm">AI Credits: 850</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 md:pt-36 pb-16 overflow-hidden">
      <div className="absolute inset-0 grid-dots [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative max-w-7xl mx-auto px-5 md:px-margin grid lg:grid-cols-2 gap-14 items-center">
        <div className="animate-fade-up">
          <Chip className="mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" /> AI CAREER SUITE · 8 UNIFIED MODULES
          </Chip>
          <h1 className="text-headline-lg-mobile md:text-display text-on-surface">
            Land the role with an <span className="text-primary">AI career hub</span> that audits, tailors & coaches.
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-5 max-w-xl">
            FolioFit unifies resume gap audits, JD scraping, AI bullet crafting, interview simulation, quiz drills, market
            trends, SkillMaker learning paths, and a live portfolio — in one high-fidelity workspace.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button onClick={() => navigate("/signup")}>
              Create free account <Icon name="arrow_forward" className="text-[20px]" />
            </Button>
            <Button variant="secondary" className="px-6 py-3.5 text-title-md" onClick={() => scrollTo("#modules")}>
              <Icon name="grid_view" className="text-[20px]" /> Explore modules
            </Button>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10">
            {[
              ["3.2×", "more recruiter callbacks"],
              ["94", "avg ATS parse score"],
              ["12k+", "candidates hired"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-headline-md text-primary">{v}</p>
                <p className="font-mono text-label-sm text-on-surface-variant uppercase tracking-wider">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="animate-fade-up [animation-delay:150ms]">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function Logos() {
  return (
    <section className="py-10 border-y border-outline-variant/40 bg-surface-container-low/50">
      <div className="max-w-7xl mx-auto px-5 md:px-margin">
        <p className="text-center font-mono text-label-sm uppercase tracking-[0.2em] text-on-surface-variant mb-6">
          FolioFit candidates now work at
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-headline-sm text-outline">
          {["Stripe", "Airbnb", "Linear", "Figma", "Notion", "Vercel", "Shopify"].map((n) => (
            <span key={n} className="hover:text-primary transition">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modules() {
  const [active, setActive] = useState(0);
  const m = modules[active];
  return (
    <section id="modules" className="py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-margin">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <Eyebrow>Unified Suite Modules</Eyebrow>
            <h2 className="text-headline-lg-mobile md:text-headline-lg mt-2">Accelerate application pipelines</h2>
            <p className="text-body-lg text-on-surface-variant mt-3 max-w-2xl">
              Eight purpose-built engines working from one candidate profile. Every module feeds the next — audit, tailor,
              practice, upskill, and publish.
            </p>
          </div>
          <Button variant="ghost" className="font-mono" onClick={() => navigate("/signup")}>
            Configure all integrations <Icon name="arrow_forward" className="text-[16px]" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {modules.map((mod, i) => (
            <button
              key={mod.title}
              onMouseEnter={() => setActive(i)}
              onClick={() => {
                setActive(i);
                if (mod.route) {
                  navigate(mod.route);
                } else if (mod.externalUrl) {
                  window.open(mod.externalUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              className={cn(
                "text-left bg-surface-container-lowest rounded-xl p-6 shadow-md border-2 transition-all duration-200 flex flex-col cursor-pointer hover:-translate-y-1",
                active === i ? "border-primary-container shadow-[0_12px_32px_-8px_rgba(0,166,147,0.35)]" : "border-transparent"
              )}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl grid place-items-center transition",
                    active === i ? "bg-primary text-on-primary" : "bg-surface-container-low text-primary"
                  )}
                >
                  <Icon name={mod.icon} />
                </div>
                <Chip>{mod.tag}</Chip>
              </div>
              <h3 className="text-title-md">{mod.title}</h3>
              <p className="text-body-sm text-on-surface-variant mt-2 flex-1">{mod.desc}</p>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline-variant/40">
                <span className="font-mono text-label-sm text-on-surface-variant">{mod.stat}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (mod.route) {
                      navigate(mod.route);
                    } else if (mod.externalUrl) {
                      window.open(mod.externalUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      navigate("/signup");
                    }
                  }}
                  className="font-mono text-label-sm text-primary flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  {mod.cta} <Icon name="arrow_forward" className="text-[14px]" />
                </button>
              </div>
            </button>
          ))}
        </div>

        {/* Spotlight */}
        <div className="mt-gutter bg-primary rounded-2xl p-8 md:p-10 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center shadow-[0_12px_32px_-4px_rgba(13,92,117,0.2)] relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary-container/30 blur-2xl" />
          <div className="relative">
            <p className="font-mono text-label-sm tracking-[0.18em] uppercase text-primary-fixed">
              Module spotlight · {String(active + 1).padStart(2, "0")}/08
            </p>
            <h3 className="text-headline-md text-on-primary mt-2">{m.title}</h3>
            <p className="text-body-lg text-on-primary/80 mt-3">{m.desc}</p>
            <Button
              className="mt-6 bg-primary-fixed text-on-primary-fixed hover:bg-surface-container-lowest"
              onClick={() => {
                if (m.route) {
                  navigate(m.route);
                } else if (m.externalUrl) {
                  window.open(m.externalUrl, '_blank', 'noopener,noreferrer');
                } else {
                  navigate("/signup");
                }
              }}
            >
              Try {m.cta.toLowerCase()} free <Icon name="arrow_forward" className="text-[18px]" />
            </Button>
          </div>
          <ul className="relative space-y-3">
            {m.bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 bg-on-primary/10 rounded-xl px-4 py-3.5 text-on-primary">
                <span className="w-8 h-8 rounded-full bg-primary-container grid place-items-center shadow-[0_0_16px_rgba(0,166,147,0.4)]">
                  <Icon name="check" className="text-[18px]" />
                </span>
                <span className="text-title-md">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: "link", t: "Paste a JD link", d: "Drop a LinkedIn, Indeed, or Glassdoor URL. The scraper distills hidden recruiter criteria in seconds." },
    { icon: "difference", t: "Audit the gap", d: "Gap Audit compares your resume line-by-line, scoring ATS parse readiness and missing competencies." },
    { icon: "auto_awesome", t: "Tailor & upskill", d: "Generate STAR bullets, then close gaps with SkillMaker paths and Quiz Lab drills." },
    { icon: "record_voice_over", t: "Rehearse & apply", d: "Run voice mock interviews, publish your portfolio, and track every application's fit score." },
  ];
  return (
    <section id="how" className="py-24 bg-surface-container-low scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-margin">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Eyebrow>Workflow</Eyebrow>
          <h2 className="text-headline-lg-mobile md:text-headline-lg mt-2">From job link to offer in four steps</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-gutter relative">
          {steps.map((s, i) => (
            <div key={s.t} className="bg-surface-container-lowest rounded-xl p-6 shadow-md relative">
              <span className="absolute top-5 right-6 font-mono text-headline-md text-surface-container-highest">0{i + 1}</span>
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary grid place-items-center shadow-[0_0_16px_rgba(0,166,147,0.4)]">
                <Icon name={s.icon} />
              </div>
              <h3 className="text-headline-sm mt-5">{s.t}</h3>
              <p className="text-body-md text-on-surface-variant mt-2">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Analytics() {
  const roles = ["Product Lead", "Sr Frontend", "Data Architect"];
  const [role, setRole] = useState(0);
  const sets = [
    [0.96, 0.92, 0.88, 0.79, 0.84, 0.9],
    [0.82, 0.7, 0.9, 0.86, 0.95, 0.88],
    [0.7, 0.85, 0.8, 0.94, 0.92, 0.76],
  ];
  const skills = [
    ["Design Systems & UI", "Strategy & Product Vision", "Cross-team Execution", "Metrics & A/B Testing", "Technical Architecture"],
    ["React & TypeScript", "Performance Tuning", "Design Systems", "Testing & CI", "Accessibility"],
    ["Data Modeling", "Distributed Systems", "SQL & Warehousing", "Governance", "Pipeline Design"],
  ];
  return (
    <section id="analytics" className="py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-margin">
        <div className="max-w-2xl mb-12">
          <Eyebrow>Deep Analytical Matrix</Eyebrow>
          <h2 className="text-headline-lg-mobile md:text-headline-lg mt-2">See exactly where you stand — before recruiters do</h2>
          <p className="text-body-lg text-on-surface-variant mt-3">
            Candidate radar fit, keyword density against peers, and match velocity over time. Real telemetry, not guesswork.
          </p>
        </div>
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-gutter">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h3 className="text-headline-sm">Candidate Alignment & Radar Fit</h3>
              <div className="flex bg-surface-container-low rounded-full p-1 border border-outline-variant/50">
                {roles.map((r, i) => (
                  <button
                    key={r}
                    onClick={() => setRole(i)}
                    className={cn(
                      "px-4 py-1.5 rounded-full font-mono text-label-sm transition cursor-pointer",
                      role === i ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <div>
                <Radar values={sets[role]} />
                <div className="flex justify-center gap-5 font-mono text-label-sm text-on-surface-variant mt-2">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-primary rounded-sm" /> Candidate</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-secondary rounded-sm" /> Target JD</span>
                </div>
              </div>
              <div className="space-y-3">
                {skills[role].map((s, i) => {
                  const v = Math.round(sets[role][i] * 100);
                  return (
                    <div key={s} className="bg-surface-container-low rounded-lg px-4 py-3">
                      <div className="flex justify-between text-body-sm mb-2">
                        <span>{s}</span>
                        <span className="font-mono text-primary">{v}%</span>
                      </div>
                      <Progress value={v} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="space-y-gutter">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <Eyebrow>Density Distribution</Eyebrow>
                  <h3 className="text-title-md mt-1">Keyword Match vs. Peers</h3>
                </div>
                <Chip>Senior Tier</Chip>
              </div>
              <KeywordBars />
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Eyebrow>30-Day Evolution</Eyebrow>
                  <h3 className="text-title-md mt-1">Match Quality Velocity</h3>
                </div>
                <span className="font-mono text-label-md text-primary">+14.6% Growth</span>
              </div>
              <VelocityChart />
              <div className="flex justify-between font-mono text-label-sm text-on-surface-variant mt-2">
                <span>Wk 1 (74%)</span><span>Wk 2 (78%)</span><span>Wk 3 (83%)</span><span>Wk 4 (88.4%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { n: "Priya Raman", r: "Staff Designer · Airbnb", q: "The gap audit told me exactly which three keywords were costing me interviews. I adapted, re-applied, and got the call within a week." },
    { n: "Marcus Lee", r: "Sr Frontend · Linear", q: "Voice mock interviews with real-time conciseness scores were brutal and brilliant. I walked into the final round genuinely calm." },
    { n: "Sofia Alvarez", r: "Product Lead · Stripe", q: "Market Trends showed me the salary band I was underpricing. SkillMaker closed my analytics gap in four weeks. Worth every credit." },
  ];
  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-5 md:px-margin">
        <div className="text-center mb-12">
          <Eyebrow>Candidate Outcomes</Eyebrow>
          <h2 className="text-headline-lg-mobile md:text-headline-lg mt-2">Loved by ambitious candidates</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-gutter">
          {t.map((x) => (
            <figure key={x.n} className="bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col">
              <div className="flex gap-0.5 text-primary-container mb-4">
                {Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" filled className="text-[18px]" />)}
              </div>
              <blockquote className="text-body-lg text-on-surface flex-1">“{x.q}”</blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-outline-variant/40">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container grid place-items-center text-title-md">
                  {x.n[0]}
                </div>
                <div>
                  <p className="text-label-md">{x.n}</p>
                  <p className="font-mono text-label-sm text-on-surface-variant">{x.r}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [yearly, setYearly] = useState(true);
  const plans = [
    { n: "Starter", p: 0, d: "Explore the suite", f: ["3 Gap Audits / month", "5 JD scrapes", "1 mock interview", "Basic Quiz Lab", "Market Trends preview"], hot: false },
    { n: "Pro", p: yearly ? 19 : 24, d: "For active job seekers", f: ["Unlimited Gap Audits", "Unlimited JD Scraper", "AI Bullet Crafter (850 credits)", "Voice Interview Coach", "SkillMaker learning paths", "Full Market Trends"], hot: true },
    { n: "Executive", p: yearly ? 49 : 59, d: "Leadership & career pivots", f: ["Everything in Pro", "Custom domain portfolio", "Priority AI models", "1:1 coach review monthly", "Salary negotiation drills"], hot: false },
  ];
  return (
    <section id="pricing" className="py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-margin">
        <div className="text-center mb-10">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="text-headline-lg-mobile md:text-headline-lg mt-2">Simple plans. Serious results.</h2>
          <div className="inline-flex mt-6 bg-surface-container rounded-full p-1">
            {["Monthly", "Yearly"].map((x, i) => (
              <button
                key={x}
                onClick={() => setYearly(i === 1)}
                className={cn(
                  "px-5 py-2 rounded-full text-label-md transition cursor-pointer",
                  yearly === (i === 1) ? "bg-primary text-on-primary shadow" : "text-on-surface-variant"
                )}
              >
                {x} {i === 1 && <span className="font-mono text-label-sm opacity-80">-20%</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-gutter items-stretch">
          {plans.map((p) => (
            <div
              key={p.n}
              className={cn(
                "rounded-xl p-7 flex flex-col",
                p.hot ? "bg-primary text-on-primary shadow-[0_12px_32px_-4px_rgba(13,92,117,0.35)] md:-translate-y-3" : "bg-surface-container-lowest shadow-md"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-headline-sm">{p.n}</h3>
                {p.hot && <span className="font-mono text-label-sm bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full">Most popular</span>}
              </div>
              <p className={cn("text-body-md mt-1", p.hot ? "text-on-primary/75" : "text-on-surface-variant")}>{p.d}</p>
              <p className="mt-6">
                <span className="text-metric-callout">${p.p}</span>
                <span className={cn("text-body-md", p.hot ? "text-on-primary/75" : "text-on-surface-variant")}> / month</span>
              </p>
              <ul className="space-y-3 mt-6 flex-1">
                {p.f.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-body-md">
                    <Icon name="check_circle" filled className={cn("text-[20px]", p.hot ? "text-primary-fixed" : "text-primary-container")} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/signup")}
                className={cn("mt-8 w-full", p.hot && "bg-primary-fixed text-on-primary-fixed hover:bg-surface-container-lowest")}
                variant={p.hot ? "primary" : p.p === 0 ? "secondary" : "primary"}
              >
                {p.p === 0 ? "Start free" : `Choose ${p.n}`}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    ["How does the Gap Audit score my resume?", "We parse your resume like a modern ATS, then compare structure, hard competencies, and keyword density against the target JD and a benchmark of top-5% candidates for that role."],
    ["Which job boards does the JD Scraper support?", "LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, and Workday postings. Paste any URL and we extract requirements, seniority signals, and hidden criteria."],
    ["Is the AI Interview Coach voice-based?", "Yes. You can run voice or text sessions across behavioral, technical, and case rounds. You'll get sentiment, pace (wpm), and conciseness scoring after each answer."],
    ["What do Market Trends and SkillMaker do?", "Market Trends tracks live hiring demand, salary bands, and rising skills. SkillMaker converts your gaps into a weekly learning roadmap with curated resources and Quiz Lab checkpoints."],
    ["Is my data private?", "Your documents are encrypted at rest and never used to train shared models. You can export or delete everything from Settings at any time."],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-24 bg-surface-container-low scroll-mt-20">
      <div className="max-w-3xl mx-auto px-5 md:px-margin">
        <div className="text-center mb-10">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-headline-lg-mobile md:text-headline-lg mt-2">Questions, answered</h2>
        </div>
        <div className="space-y-3">
          {qs.map(([q, a], i) => (
            <div key={q} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer">
                <span className="text-title-md">{q}</span>
                <Icon name="expand_more" className={cn("text-primary transition-transform", open === i && "rotate-180")} />
              </button>
              <div className={cn("grid transition-all duration-300", open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <p className="overflow-hidden px-5 text-body-md text-on-surface-variant">
                  <span className="block pb-5">{a}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-margin">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 md:p-16 text-center shadow-[0_12px_32px_-4px_rgba(13,92,117,0.2)]">
          <div className="absolute inset-0 opacity-30 grid-dots [filter:invert(1)]" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-primary-container/40 blur-3xl" />
          <div className="relative">
            <h2 className="text-headline-lg-mobile md:text-display text-on-primary max-w-3xl mx-auto">Your next offer starts with a 94-point resume.</h2>
            <p className="text-body-lg text-on-primary/80 mt-4 max-w-xl mx-auto">Create your FolioFit workspace in under a minute. No credit card required.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Button className="bg-primary-fixed text-on-primary-fixed hover:bg-surface-container-lowest" onClick={() => navigate("/signup")}>
                Create account <Icon name="arrow_forward" className="text-[20px]" />
              </Button>
              <Button variant="secondary" className="px-6 py-3.5 text-title-md bg-on-primary/10 text-on-primary hover:bg-on-primary/20" onClick={() => navigate("/login")}>
                I already have an account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { h: "Modules", l: ["Gap Audit", "JD Scraper", "Bullet Crafter", "Interview Coach", "Quiz Lab", "Market Trends", "SkillMaker", "Portfolio"] },
    { h: "Company", l: ["About", "Careers", "Blog", "Press"] },
    { h: "Resources", l: ["Help center", "ATS guide", "Salary reports", "API docs"] },
    { h: "Legal", l: ["Privacy", "Terms", "Security"] },
  ];
  return (
    <footer className="border-t border-outline-variant/50 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-5 md:px-margin py-14 grid md:grid-cols-[1.5fr_repeat(4,1fr)] gap-10">
        <div>
          <button onClick={() => navigate("/dashboard")} className="cursor-pointer hover:opacity-90 transition text-left" title="FolioFit Dashboard">
            <Logo />
          </button>
          <p className="text-body-md text-on-surface-variant mt-4 max-w-xs">
            The AI career suite for high-fidelity candidate alignment, ATS readiness, and interview intelligence.
          </p>
          <div className="flex gap-2 mt-5">
            {["mail", "public", "forum"].map((i) => (
              <span key={i} className="w-10 h-10 rounded-full bg-surface-container-lowest grid place-items-center text-primary shadow-sm">
                <Icon name={i} className="text-[20px]" />
              </span>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="font-mono text-label-sm uppercase tracking-widest text-on-surface mb-4">{c.h}</p>
            <ul className="space-y-2.5">
              {c.l.map((x) => (
                <li key={x}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-body-md text-on-surface-variant hover:text-primary transition">
                    {x}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-outline-variant/50">
        <div className="max-w-7xl mx-auto px-5 md:px-margin py-6 flex flex-col sm:flex-row justify-between gap-2 font-mono text-label-sm text-on-surface-variant">
          <span>© {new Date().getFullYear()} FolioFit Inc. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Logos />
      <Modules />
      <HowItWorks />
      <Analytics />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
