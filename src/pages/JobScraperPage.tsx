import { useState, useEffect, useMemo, useCallback } from "react";
import { Logo, Icon, Button } from "../components/ui";
import { navigate } from "../lib/router";
import { currentUser } from "../lib/auth";
import { jobApi, Job } from "../scraper/jobApi";
import { cn } from "../utils/cn";

const SOURCE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  linkedin: { bg: "bg-sky-500/10", text: "text-sky-600", border: "border-sky-500/30" },
  indeed: { bg: "bg-indigo-500/10", text: "text-indigo-600", border: "border-indigo-500/30" },
  glassdoor: { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/30" },
  remotive: { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-500/30" },
  arbeitnow: { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/30" },
  jobicy: { bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-500/30" },
};

function getSourceStyle(source: string) {
  const key = source.toLowerCase();
  return SOURCE_COLORS[key] || { bg: "bg-slate-500/10", text: "text-slate-600", border: "border-slate-500/30" };
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (isNaN(s) || s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function JobScraperPage() {
  const user = currentUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Scraper query state
  const [scrapeKeyword, setScrapeKeyword] = useState("AI Engineer");
  const [scrapeLocation, setScrapeLocation] = useState("Remote");
  const [isScraping, setIsScraping] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Manual modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualCompany, setManualCompany] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [manualSalary, setManualSalary] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobApi.getJobs();
      setJobs(data.jobs || []);
      if (data.jobs && data.jobs.length > 0 && selectedJobId === null) {
        setSelectedJobId(data.jobs[0].id);
      }
    } catch (e) {
      console.error("Failed to load jobs", e);
    } finally {
      setLoading(false);
    }
  }, [selectedJobId]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleScrape = async () => {
    if (!scrapeKeyword.trim()) return;
    setIsScraping(true);
    setStatusNotice(`Extracting real-time postings for "${scrapeKeyword}"...`);
    try {
      const res = await jobApi.scrapeJobs(scrapeKeyword, scrapeLocation);
      setStatusNotice(`Successfully captured ${res.found} new postings!`);
      await loadJobs();
      setTimeout(() => setStatusNotice(null), 4000);
    } catch {
      setStatusNotice("Scraper completed with fallback stream.");
      setTimeout(() => setStatusNotice(null), 3000);
    } finally {
      setIsScraping(false);
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualUrl) return;
    setIsSubmitting(true);
    try {
      await jobApi.saveManualJob([
        {
          title: manualTitle,
          company: manualCompany || null,
          location: manualLocation || null,
          salary: manualSalary || null,
          url: manualUrl,
          description: manualDescription || null,
          source: manualUrl.includes("linkedin") ? "linkedin" : manualUrl.includes("indeed") ? "indeed" : "manual",
        },
      ]);
      setShowAddModal(false);
      setManualTitle("");
      setManualCompany("");
      setManualLocation("");
      setManualSalary("");
      setManualUrl("");
      setManualDescription("");
      await loadJobs();
      setStatusNotice("Job posting manually indexed.");
      setTimeout(() => setStatusNotice(null), 3000);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all indexed jobs?")) return;
    await jobApi.clearJobs();
    setJobs([]);
    setSelectedJobId(null);
    setStatusNotice("Job registry cleared.");
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const filteredJobs = useMemo(() => {
    let result = jobs;
    if (selectedSource !== "all") {
      result = result.filter((j) => (j.source || "").toLowerCase() === selectedSource.toLowerCase());
    }
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          (j.title && j.title.toLowerCase().includes(term)) ||
          (j.company && j.company.toLowerCase().includes(term)) ||
          (j.location && j.location.toLowerCase().includes(term)) ||
          (j.description && j.description.toLowerCase().includes(term))
      );
    }
    return result;
  }, [jobs, selectedSource, searchQuery]);

  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || filteredJobs[0] || null;
  }, [jobs, selectedJobId, filteredJobs]);

  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j) => {
      const s = (j.source || "other").toLowerCase();
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col">
      {/* Header */}
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
              <button onClick={() => navigate("/")} className="hover:text-primary transition cursor-pointer">
                Home
              </button>
              <span>/</span>
              <span className="text-primary font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                Real-Time Job Scraper
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate("/skillbot")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-label-sm bg-surface-container-low hover:bg-surface-container text-primary font-bold transition border border-outline-variant/60 cursor-pointer"
            >
              <Icon name="smart_toy" className="text-[16px]" />
              <span className="hidden md:inline">Skill Bot</span>
            </button>

            {user ? (
              <Button variant="secondary" className="text-label-md" onClick={() => navigate("/dashboard")}>
                <Icon name="dashboard" className="text-[18px]" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            ) : (
              <Button variant="ghost" className="text-label-md" onClick={() => navigate("/login")}>
                Log in
              </Button>
            )}

            <Button className="px-4 py-2 text-label-md" onClick={() => setShowAddModal(true)}>
              <Icon name="add" className="text-[18px]" />
              <span className="hidden sm:inline">Add JD Link</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Scraper Control Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md border border-outline-variant/40 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-primary text-xs font-mono font-bold tracking-wider border border-outline-variant/60 mb-2">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                LIVE EXTRACTOR PIPELINE
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
                Real-Time Job Description Scraper
              </h1>
              <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
                Scrape live job postings across LinkedIn, Remotive, Arbeitnow, and Jobicy. Extract hidden recruiter criteria and feed requirements directly into SkillBot learning paths.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setShowAddModal(true)} variant="secondary" className="font-mono text-xs">
                <Icon name="add" className="text-[16px]" />
                Add JD Link
              </Button>
              <Button
                variant="secondary"
                className="font-mono text-xs cursor-pointer text-error px-3 py-1.5"
                onClick={handleClearAll}
              >
                <Icon name="delete_sweep" className="text-[16px]" />
                Clear Registry
              </Button>
            </div>
          </div>

          {/* Scrape Input Form */}
          <div className="pt-2 grid md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={scrapeKeyword}
                onChange={(e) => setScrapeKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                placeholder="Job title or role (e.g. AI Engineer, Full Stack, DevOps)..."
                className="w-full bg-surface-container-low/60 border border-outline-variant hover:border-primary focus:border-primary rounded-full pl-11 pr-4 py-3 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
              />
            </div>

            <div className="md:col-span-3 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                location_on
              </span>
              <input
                type="text"
                value={scrapeLocation}
                onChange={(e) => setScrapeLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                placeholder="Location (e.g. Remote, Global)..."
                className="w-full bg-surface-container-low/60 border border-outline-variant hover:border-primary focus:border-primary rounded-full pl-11 pr-4 py-3 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
              />
            </div>

            <div className="md:col-span-3">
              <Button
                onClick={handleScrape}
                disabled={isScraping}
                variant="primary"
                className="w-full h-full rounded-full py-3 shadow-md gap-2"
              >
                {isScraping ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scraping...</span>
                  </>
                ) : (
                  <>
                    <Icon name="travel_explore" className="text-[18px]" />
                    <span>Scrape Real-Time</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {statusNotice && (
            <div className="p-3 bg-primary-fixed/30 border border-primary-container text-on-primary-fixed text-xs font-mono font-semibold rounded-xl flex items-center gap-2 animate-fade-up">
              <Icon name="check_circle" className="text-primary text-[18px]" />
              <span>{statusNotice}</span>
            </div>
          )}

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/30">
            <span className="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-wider mr-1">
              Source Filter:
            </span>
            <button
              onClick={() => setSelectedSource("all")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition cursor-pointer border",
                selectedSource === "all"
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant hover:text-primary border-outline-variant/40"
              )}
            >
              All ({jobs.length})
            </button>
            {Object.entries(sourceCounts).map(([src, count]) => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition cursor-pointer border capitalize",
                  selectedSource.toLowerCase() === src.toLowerCase()
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:text-primary border-outline-variant/40"
                )}
              >
                {src} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Search & Results Telemetry Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              filter_list
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in title, company, skills..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-full pl-10 pr-4 py-2 text-xs font-medium text-on-surface focus:outline-none focus:border-primary shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-on-surface-variant">
            <span>
              Showing <strong className="text-primary">{filteredJobs.length}</strong> of {jobs.length} tracked postings
            </span>
          </div>
        </div>

        {/* Master / Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Job Cards List (5 cols) */}
          <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/40">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="font-mono text-xs text-primary font-bold">LOADING REAL-TIME REGISTRY...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/40 space-y-3">
                <Icon name="search_off" className="text-4xl text-on-surface-variant" />
                <p className="text-sm font-semibold">No postings match your filters</p>
                <p className="text-xs text-on-surface-variant">Try searching for another keyword or scrape new live postings above.</p>
              </div>
            ) : (
              filteredJobs.map((j) => {
                const isSelected = selectedJob?.id === j.id;
                const style = getSourceStyle(j.source);

                return (
                  <div
                    key={j.id}
                    onClick={() => setSelectedJobId(j.id)}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer bg-surface-container-lowest hover:shadow-md",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 shadow-sm"
                        : "border-outline-variant/50 hover:border-primary/60"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={cn("text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border", style.bg, style.text, style.border)}>
                        {j.source}
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant">
                        {j.postedAt || timeAgo(j.capturedAt)}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-on-surface line-clamp-1">{j.title}</h3>
                    <p className="text-xs text-primary font-semibold mt-0.5">{j.company || "Company Confidential"}</p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] font-mono text-on-surface-variant">
                      {j.location && (
                        <span className="flex items-center gap-1">
                          <Icon name="place" className="text-[14px]" /> {j.location}
                        </span>
                      )}
                      {j.salary && (
                        <span className="flex items-center gap-1 text-primary">
                          <Icon name="payments" className="text-[14px]" /> {j.salary}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Job Inspector (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 shadow-md border border-outline-variant/40 sticky top-24 space-y-6">
            {selectedJob ? (
              <>
                <div className="space-y-3 pb-4 border-b border-outline-variant/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={cn("text-xs font-mono font-bold uppercase px-3 py-1 rounded-full border", getSourceStyle(selectedJob.source).bg, getSourceStyle(selectedJob.source).text, getSourceStyle(selectedJob.source).border)}>
                      {selectedJob.source}
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant">
                      Indexed: {new Date(selectedJob.capturedAt).toLocaleString()}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-on-surface">{selectedJob.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    <span className="text-primary font-bold">{selectedJob.company || "Confidential"}</span>
                    {selectedJob.location && <span>• {selectedJob.location}</span>}
                    {selectedJob.employmentType && <span>• {selectedJob.employmentType}</span>}
                    {selectedJob.salary && <span className="text-primary font-bold">• {selectedJob.salary}</span>}
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <Button
                      onClick={() => navigate("/skillbot")}
                      variant="primary"
                      className="gap-1.5 text-xs shadow-sm px-4 py-2"
                    >
                      <Icon name="auto_awesome" className="text-[16px]" />
                      <span>Assemble SkillBot Path for this Role</span>
                    </Button>

                    <a
                      href={selectedJob.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-semibold bg-surface-container-low text-primary hover:bg-surface-container border border-outline-variant/60 transition"
                    >
                      <Icon name="open_in_new" className="text-[16px]" />
                      <span>Original Link</span>
                    </a>

                    <Button
                      variant="ghost"
                      className="text-xs px-3 py-1.5"
                      onClick={() => {
                        navigator.clipboard?.writeText(selectedJob.url);
                        alert("Job link copied to clipboard!");
                      }}
                    >
                      <Icon name="content_copy" className="text-[16px]" />
                      <span>Copy URL</span>
                    </Button>
                  </div>
                </div>

                {/* Full Description & Recruiter Requirements */}
                <div className="space-y-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-bold flex items-center gap-1.5">
                    <Icon name="description" className="text-[16px] text-primary" />
                    Distilled Job Requirements & Description
                  </h4>
                  <div className="p-4 bg-surface-container-low/40 rounded-xl border border-outline-variant/30 text-xs text-on-surface leading-relaxed max-h-96 overflow-y-auto whitespace-pre-line font-sans">
                    {selectedJob.description || "No full description text was captured for this job link."}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-16 text-center text-on-surface-variant space-y-2">
                <Icon name="touch_app" className="text-4xl" />
                <p className="text-sm font-semibold">Select a job from the registry to inspect full requirements</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/40 space-y-4 animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <Icon name="add_link" className="text-primary" />
                Index Job Description URL Manually
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container grid place-items-center cursor-pointer text-on-surface-variant"
              >
                <Icon name="close" />
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono font-bold mb-1 text-on-surface-variant">Job Title *</label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Senior Machine Learning Engineer"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold mb-1 text-on-surface-variant">Company</label>
                  <input
                    type="text"
                    value={manualCompany}
                    onChange={(e) => setManualCompany(e.target.value)}
                    placeholder="e.g. OpenAI / Stripe"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold mb-1 text-on-surface-variant">Location</label>
                  <input
                    type="text"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="e.g. Remote / San Francisco"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold mb-1 text-on-surface-variant">Job Posting URL *</label>
                <input
                  type="url"
                  required
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://linkedin.com/jobs/view/..."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-mono font-bold mb-1 text-on-surface-variant">Job Description Snippet</label>
                <textarea
                  rows={4}
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  placeholder="Paste key responsibilities or requirements..."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
                <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Indexing..." : "Save Posting"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-outline-variant/40 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto px-5 md:px-margin flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            <span>Real-Time Job Scraper Engine • FolioFit Unified Career Suite</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="hover:text-primary transition cursor-pointer">Landing</button>
            <button onClick={() => navigate("/skillbot")} className="hover:text-primary transition cursor-pointer">Skill Bot</button>
            <button onClick={() => navigate(user ? "/dashboard" : "/login")} className="hover:text-primary transition cursor-pointer">
              {user ? "Dashboard" : "Sign In"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
