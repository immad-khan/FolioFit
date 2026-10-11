import { useState } from "react";
import { Button, Chip, Eyebrow, Icon } from "../components/ui";
import { KeywordBars, Progress, Radar, VelocityChart } from "../components/charts";
import { modules } from "../data/modules";
import { currentUser, logout } from "../lib/auth";
import { navigate } from "../lib/router";
import { cn } from "../utils/cn";

const sideItems = [{ icon: "dashboard", label: "Dashboard" }, ...modules.map((m) => ({ icon: m.icon, label: m.title }))];

export default function Dashboard() {
  const user = currentUser();
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState("All Modules");
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!user) return null;

  const fire = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const first = user.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Floating sidebar */}
      <aside className="hidden md:flex fixed left-4 top-4 bottom-4 w-20 z-50 bg-primary rounded-full shadow-[0_12px_32px_-4px_rgba(13,92,117,0.2)] flex-col items-center py-5 gap-2">
        <button
          onClick={() => setActive(0)}
          className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed grid place-items-center mb-3 cursor-pointer"
          title="Dashboard"
        >
          <Icon name="auto_awesome" />
        </button>
        <div className="flex flex-col gap-1.5 overflow-y-auto">
          {sideItems.map((s, i) => {
            const mod = modules[i - 1];
            return (
            <button
              key={s.label}
              title={s.label}
              onClick={() => {
                setActive(i);
                if (mod?.route) {
                  navigate(mod.route);
                } else if (mod?.externalUrl) {
                  window.open(mod.externalUrl, '_blank', 'noopener,noreferrer');
                } else if (i > 0) {
                  fire(`Opening ${s.label}…`);
                }
              }}
              className={cn(
                "w-11 h-11 rounded-full grid place-items-center transition cursor-pointer",
                active === i
                  ? "bg-primary-container text-on-primary shadow-[0_0_16px_rgba(0,166,147,0.4)]"
                  : "text-on-primary/70 hover:bg-surface-container-lowest/15 hover:text-surface-bright"
              )}
            >
              <Icon name={s.icon} className="text-[22px]" />
            </button>
            );
          })}

        </div>
        <div className="mt-auto flex flex-col gap-1.5">
          <button title="Preferences" className="w-11 h-11 rounded-full grid place-items-center text-on-primary/70 hover:bg-surface-container-lowest/15 hover:text-surface-bright cursor-pointer">
            <Icon name="tune" />
          </button>
          <button
            title="Log out"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-11 h-11 rounded-full grid place-items-center text-on-primary/70 hover:bg-surface-container-lowest/15 hover:text-surface-bright cursor-pointer"
          >
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      {/* Top header */}
      <header className="fixed top-0 left-0 md:left-28 right-0 z-40 h-20 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-full px-5 md:px-margin flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-on-primary grid place-items-center font-bold">F</div>
            <span className="text-title-md">FolioFit</span>
            <span className="hidden sm:inline text-body-md text-on-surface-variant">Workspace</span>
            <span className="hidden xl:inline font-mono text-label-sm text-primary">AI Career Suite</span>
          </div>
          <nav className="hidden lg:flex items-center gap-1 bg-surface-container rounded-full p-1">
            {["All Modules", "Active Jobs", "Recent Scores", "Archives"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-2 rounded-full font-mono text-label-sm transition cursor-pointer",
                  tab === t ? "bg-primary text-on-primary shadow" : "text-on-surface-variant hover:text-primary"
                )}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => navigate("/scraper")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-label-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest transition cursor-pointer font-medium"
              title="Open Real-Time Job Scraper"
            >
              <Icon name="travel_explore" className="text-[16px]" />
              <span>Scraper</span>
            </button>
            <button
              onClick={() => navigate("/quiz")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-label-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest transition cursor-pointer font-medium"
              title="Open Quiz Lab"
            >
              <Icon name="quiz" className="text-[16px]" />
              <span>Quiz Lab</span>
            </button>
            <button
              onClick={() => navigate("/interview")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-label-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest transition cursor-pointer font-medium"
              title="Open Interview Coach"
            >
              <Icon name="record_voice_over" className="text-[16px]" />
              <span>Interview</span>
            </button>
            <a
              href="https://01a12540-dc4f-7190-8a33-c05ba809f44a.arena.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-label-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest transition cursor-pointer font-medium"
              title="Open Resume Comparison & Gap Audit"
            >
              <Icon name="difference" className="text-[16px]" />
              <span>Resume Audit</span>
            </a>
            <button
              onClick={() => navigate("/skillbot")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-label-sm bg-primary text-on-primary hover:bg-primary-container transition cursor-pointer font-bold ml-1 shadow-sm"
              title="Open Skill Bot Career Engine"
            >
              <Icon name="smart_toy" className="text-[16px]" />
              <span>Skill Bot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse" />
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-surface-container-lowest rounded-full px-3 py-2 font-mono text-label-sm shadow-sm">
              <Icon name="bolt" className="text-[16px] text-primary-container" /> AI Credits: 850
            </span>
            <button className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-surface-container cursor-pointer">
              <Icon name="notifications" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-primary-container" />
            </button>
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2.5 cursor-pointer">
                <span className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container grid place-items-center text-title-md">
                  {user.name[0]}
                </span>
                <span className="hidden md:block text-left">
                  <span className="block text-label-md">{user.name}</span>
                  <span className="block font-mono text-label-sm text-on-surface-variant">{user.role}</span>
                </span>
              </button>
              {menu && (
                <div className="absolute right-0 top-12 w-56 bg-surface-container-lowest rounded-xl shadow-md p-1.5 border border-outline-variant/40">
                  <button onClick={() => navigate("/")} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-surface-container-low text-body-md cursor-pointer">
                    <Icon name="home" className="text-[18px]" /> Landing page
                  </button>
                  <button onClick={() => navigate("/scraper")} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-surface-container-low text-body-md text-on-surface font-medium cursor-pointer">
                    <Icon name="travel_explore" className="text-[18px] text-primary" /> Job Scraper
                  </button>
                  <button onClick={() => navigate("/quiz")} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-surface-container-low text-body-md text-on-surface font-medium cursor-pointer">
                    <Icon name="quiz" className="text-[18px] text-primary" /> Quiz Lab
                  </button>
                  <button onClick={() => navigate("/interview")} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-surface-container-low text-body-md text-on-surface font-medium cursor-pointer">
                    <Icon name="record_voice_over" className="text-[18px] text-primary" /> Interview Coach
                  </button>
                  <a
                    href="https://01a12540-dc4f-7190-8a33-c05ba809f44a.arena.site/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-surface-container-low text-body-md text-on-surface font-medium cursor-pointer"
                  >
                    <Icon name="difference" className="text-[18px] text-primary" /> Resume & Gap Audit ↗
                  </a>
                  <button onClick={() => navigate("/skillbot")} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-surface-container-low text-body-md text-primary font-semibold cursor-pointer">
                    <Icon name="smart_toy" className="text-[18px]" /> Skill Bot & Roadmap
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-surface-container-low text-body-md text-error cursor-pointer"
                  >
                    <Icon name="logout" className="text-[18px]" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="md:pl-28 pt-24 pb-16">
        <div className="px-5 md:px-margin max-w-[1400px] space-y-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-label-sm text-on-surface-variant flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-surface-container-low px-2 py-0.5 rounded-full text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" /> REAL-TIME TELEMETRY ACTIVE
                </span>
                SYNCED: 2 MINS AGO
              </p>
              <h1 className="text-headline-lg-mobile md:text-headline-lg mt-2">Welcome, {first} — Executive Career Hub</h1>
              <p className="text-body-md text-on-surface-variant mt-1">
                High-fidelity candidate alignment, algorithmic ATS readiness, and interview intelligence.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="bg-surface-container-lowest shadow-sm">
                <Icon name="tune" className="text-[18px]" /> Filter Baseline
              </Button>
              <Button className="bg-primary hover:bg-primary-container px-5 py-2.5 text-label-md" onClick={() => fire("Full diagnostic started — results in ~30s")}>
                <Icon name="bolt" className="text-[18px]" /> Run Full Diagnostic
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-gutter">
            {[
              { l: "Aggregate Match", c: "↑ +4.2%", v: "88.4%", u: "/ 100", p: 88, f: ["Benchmark: 80%", "Top 5% Candidate"] },
              { l: "ATS Parse Index", c: "Optimal", v: "94", u: "/ 100 PTS", p: 94, f: ["Parsing: 0.12s", "Zero Red Flags"] },
              { l: "Tracked Pipeline", c: "3 Pending", v: "14", u: "Positions", p: 62, f: ["8 Tier-1 Tech", "6 Seed/Series B"] },
              { l: "Interview Sim", c: "Level 4", v: "85%", u: "Confidence", p: 85, f: ["12 Mocks", "Strong Articulation"] },
            ].map((m) => (
              <div key={m.l} className="bg-surface-container-lowest rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-center">
                  <p className="font-mono text-label-sm uppercase tracking-wider text-on-surface-variant">{m.l}</p>
                  <Chip>{m.c}</Chip>
                </div>
                <p className="mt-4">
                  <span className="text-metric-callout">{m.v}</span>{" "}
                  <span className="font-mono text-label-sm text-on-surface-variant">{m.u}</span>
                </p>
                <Progress value={m.p} className="mt-4" />
                <div className="flex justify-between font-mono text-label-sm text-on-surface-variant mt-3">
                  <span>{m.f[0]}</span>
                  <span className="text-primary">{m.f[1]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics */}
          <div className="grid xl:grid-cols-[1.4fr_1fr] gap-gutter">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md">
              <Eyebrow>Deep Analytical Matrix</Eyebrow>
              <h2 className="text-headline-sm mt-1 mb-4">Candidate Alignment & Radar Fit</h2>
              <div className="grid sm:grid-cols-2 gap-6 items-center">
                <Radar />
                <div className="space-y-3">
                  {[
                    ["Design Systems & UI", 96],
                    ["Strategy & Product Vision", 92],
                    ["Cross-team Execution", 88],
                    ["Metrics & A/B Testing", 79],
                    ["Technical Architecture", 84],
                  ].map(([s, v]) => (
                    <div key={s} className="bg-surface-container-low rounded-lg px-4 py-3">
                      <div className="flex justify-between text-body-sm mb-2">
                        <span>{s}</span>
                        <span className="font-mono text-primary">{v}%</span>
                      </div>
                      <Progress value={v as number} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-3 mt-6 pt-4 border-t border-outline-variant/40">
                <p className="text-body-sm text-on-surface-variant flex items-center gap-2">
                  <Icon name="check_circle" className="text-primary text-[18px]" /> ATS keyword density matches <b>82%</b> of Silicon Valley VP/Lead listings.
                </p>
                <button className="font-mono text-label-sm text-primary cursor-pointer">Optimization Report →</button>
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
                <div className="flex justify-between mb-3">
                  <div>
                    <Eyebrow>30-Day Evolution</Eyebrow>
                    <h3 className="text-title-md mt-1">Match Quality Velocity</h3>
                  </div>
                  <span className="font-mono text-label-md text-primary">+14.6% Growth</span>
                </div>
                <VelocityChart />
              </div>
            </div>
          </div>

          {/* Modules */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <Eyebrow>Unified Suite Modules</Eyebrow>
                <h2 className="text-headline-md mt-1">Accelerate Application Pipelines</h2>
              </div>
              <button className="hidden sm:block font-mono text-label-sm text-primary cursor-pointer">Configure All Integrations →</button>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-gutter">
              {modules.map((m) => (
                <div
                  key={m.title}
                  onClick={() => {
                    if (m.route) {
                      navigate(m.route);
                    } else if (m.externalUrl) {
                      window.open(m.externalUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      fire(`${m.title}: ${m.cta} launched`);
                    }
                  }}
                  className="bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col hover:-translate-y-1 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="w-10 h-10 rounded-xl bg-surface-container-low text-primary grid place-items-center">
                      <Icon name={m.icon} />
                    </span>
                    <Chip>{m.tag}</Chip>
                  </div>
                  <h3 className="text-title-md">{m.title}</h3>
                  <p className="text-body-sm text-on-surface-variant mt-2 flex-1">{m.desc}</p>
                  <div className="flex justify-between mt-5 pt-4 border-t border-outline-variant/40 font-mono text-label-sm">
                    <span className="text-on-surface-variant">{m.stat}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (m.route) {
                          navigate(m.route);
                        } else if (m.externalUrl) {
                          window.open(m.externalUrl, '_blank', 'noopener,noreferrer');
                        } else {
                          fire(`${m.title}: ${m.cta} launched`);
                        }
                      }}
                      className="text-primary cursor-pointer hover:underline"
                    >
                      {m.cta} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applications + Log */}
          <div className="grid xl:grid-cols-[1.4fr_1fr] gap-gutter">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <Eyebrow>Active Benchmarks</Eyebrow>
                  <h3 className="text-headline-sm mt-1">Tracked Applications & Compatibility</h3>
                </div>
                <button className="font-mono text-label-sm text-primary flex items-center gap-1 cursor-pointer">
                  <Icon name="add_circle" className="text-[16px]" /> Add JD Link
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { c: "Stripe", f: 94, r: "Lead Product Experience · San Francisco (Hybrid)", s: "3 ATS Gaps Found" },
                  { c: "Airbnb", f: 89, r: "Staff Design Systems Architect · Remote", s: "ATS Perfect" },
                  { c: "Linear", f: 82, r: "Principal Product Designer · New York / Remote", s: "Missing: GraphQL" },
                ].map((a) => (
                  <div key={a.c} className="flex flex-wrap items-center gap-4 bg-surface-container-low rounded-xl p-4">
                    <span className="w-11 h-11 rounded-full bg-surface-container-high text-primary grid place-items-center text-title-md">{a.c[0]}</span>
                    <div className="flex-1 min-w-[180px]">
                      <p className="text-title-md flex items-center gap-2">
                        {a.c} <Chip>{a.f}% Fit</Chip>
                      </p>
                      <p className="text-body-sm text-on-surface-variant">{a.r}</p>
                    </div>
                    <span className="font-mono text-label-sm text-on-surface-variant">{a.s}</span>
                    <Button variant="secondary" className="bg-surface-container-lowest font-mono text-label-sm" onClick={() => fire(`Adapting resume for ${a.c}…`)}>
                      Adapt Resume
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <Eyebrow>Continuous Sync</Eyebrow>
                  <h3 className="text-headline-sm mt-1">Audit & Diagnostic Log</h3>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant">Today</span>
              </div>
              <ol className="relative border-l-2 border-surface-container-high ml-1.5 space-y-5">
                {[
                  ["AI Resume Generation Completed", "Tailored 4 impact metrics for Stripe's \"Developer Ergonomics\" JD.", "14:24 · Resume Generator"],
                  ["Simulated Interview Completed", "15-minute mock on \"Conflict Resolution\" (Score: 88%).", "11:05 · Mock Interview"],
                  ["Quiz Lab Drill Finished", "System design trade-offs — 92nd percentile.", "10:12 · Quiz Maker"],
                  ["Scraped JD from Greenhouse", "Synthesized core requirements for Airbnb Staff Design Systems.", "09:30 · Job Scraper"],
                ].map(([t, d, m]) => (
                  <li key={t} className="pl-5 relative">
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-lowest" />
                    <p className="text-label-md">{t}</p>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">{d}</p>
                    <p className="font-mono text-label-sm text-outline mt-1">{m}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-surface rounded-full px-5 py-3 shadow-md flex items-center gap-2 text-label-md animate-fade-up">
          <Icon name="bolt" className="text-primary-fixed text-[18px]" /> {toast}
        </div>
      )}
    </div>
  );
}
