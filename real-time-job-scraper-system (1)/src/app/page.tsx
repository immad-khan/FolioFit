"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Job = {
  id: number;
  title: string;
  company: string | null;
  location: string | null;
  salary: string | null;
  employmentType: string | null;
  description: string | null;
  url: string;
  source: string;
  postedAt: string | null;
  capturedAt: string;
  updatedAt: string;
};

const SOURCE_STYLES: Record<string, string> = {
  linkedin: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  indeed: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  glassdoor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  remotive: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  arbeitnow: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  jobicy: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

function sourceBadge(source: string) {
  return (
    SOURCE_STYLES[source.toLowerCase()] ??
    "bg-slate-500/15 text-slate-400 border-slate-500/30"
  );
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function Dashboard() {
  const [jobsList, setJobsList] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Quick Scraper / Fetcher state
  const [searchKeyword, setSearchKeyword] = useState("AI Engineer");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeNotice, setScrapeNotice] = useState<string | null>(null);

  // Manual Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualCompany, setManualCompany] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [manualSalary, setManualSalary] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const knownIds = useRef<Set<number>>(new Set());
  const firstLoad = useRef(true);

  const fetchJobs = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (source !== "all") params.set("source", source);
      const res = await fetch(`/api/jobs?${params}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const rows: Job[] = data.jobs ?? [];

      if (!firstLoad.current) {
        const fresh = rows
          .filter((j) => !knownIds.current.has(j.id))
          .map((j) => j.id);
        if (fresh.length) {
          setNewIds((prev) => new Set([...prev, ...fresh]));
          setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev);
              fresh.forEach((id) => next.delete(id));
              return next;
            });
          }, 6000);
        }
      }
      rows.forEach((j) => knownIds.current.add(j.id));
      firstLoad.current = false;

      setJobsList(rows);
      setTotal(data.total ?? rows.length);
      setLastUpdate(new Date());
      setLoading(false);
    } catch {
      /* server polling */
    }
  }, [query, source]);

  useEffect(() => {
    fetchJobs();
    const t = setInterval(fetchJobs, 2500);
    return () => clearInterval(t);
  }, [fetchJobs]);

  const selected = useMemo(
    () => jobsList.find((j) => j.id === selectedId) ?? jobsList[0] ?? null,
    [jobsList, selectedId]
  );

  const stats = useMemo(() => {
    const companies = new Set(
      jobsList.map((j) => j.company?.toLowerCase()).filter(Boolean)
    );
    const withSalary = jobsList.filter((j) => j.salary).length;
    const sources = new Set(jobsList.map((j) => j.source));
    return { companies: companies.size, withSalary, sources: sources.size };
  }, [jobsList]);

  const deleteJob = async (id: number) => {
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    knownIds.current.delete(id);
    setJobsList((prev) => prev.filter((j) => j.id !== id));
    if (selectedId === id) setSelectedId(null);
    fetchJobs();
  };

  const clearAll = async () => {
    if (!confirm("Delete ALL captured jobs?")) return;
    await fetch("/api/jobs", { method: "DELETE" });
    knownIds.current.clear();
    setJobsList([]);
    setSelectedId(null);
    fetchJobs();
  };

  // Direct In-Dashboard Live Scrape & Import
  const handleLiveScrape = async () => {
    if (!searchKeyword.trim()) return;
    setIsScraping(true);
    setScrapeNotice(null);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchKeyword.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setScrapeNotice(`Imported ${data.saved || 0} new jobs for "${searchKeyword}".`);
        fetchJobs();
      } else {
        setScrapeNotice(`Error: ${data.error || "Failed to fetch"}`);
      }
    } catch (e: any) {
      setScrapeNotice(`Failed to connect: ${e.message}`);
    } finally {
      setIsScraping(false);
      setTimeout(() => setScrapeNotice(null), 5000);
    }
  };

  // Quick Manual Job Submit
  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualUrl.trim()) {
      alert("Please provide at least a Job Title and URL.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobs: [
            {
              title: manualTitle.trim(),
              company: manualCompany.trim() || null,
              location: manualLocation.trim() || null,
              salary: manualSalary.trim() || null,
              url: manualUrl.trim(),
              description: manualDescription.trim() || null,
              source: manualUrl.includes("linkedin")
                ? "linkedin"
                : manualUrl.includes("indeed")
                  ? "indeed"
                  : "custom",
            },
          ],
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setManualTitle("");
        setManualCompany("");
        setManualLocation("");
        setManualSalary("");
        setManualUrl("");
        setManualDescription("");
        fetchJobs();
      }
    } catch (err) {
      alert("Failed to save job");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Smart Paste Handler: automatically parses text pasted into Quick Add
  const handleSmartPaste = (pastedText: string) => {
    setManualDescription(pastedText);
    const lines = pastedText.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length > 0 && !manualTitle) {
      setManualTitle(lines[0].slice(0, 100));
    }
    if (lines.length > 1 && !manualCompany) {
      setManualCompany(lines[1].slice(0, 80));
    }
    const salaryMatch = pastedText.match(
      /(\$|€|£|₹|¥|PKR|Rs|AED|USD)\s?[\d,.]+\s?(k|M|m|million)?(\s?[-–—]\s?(\$|€|£|₹|¥|PKR|Rs|AED|USD)?\s?[\d,.]+\s?(k|M|m|million)?)?(\s?\/?\s?(yr|year|hr|hour|mo|month))?/i
    );
    if (salaryMatch && !manualSalary) {
      setManualSalary(salaryMatch[0]);
    }
  };

  return (
    <div className="job-scraper-module min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-white/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/15" aria-hidden="true" />
            <div>
              <h1 className="text-base font-bold leading-tight">
                Real-Time Job Scraper & Capture
              </h1>
              <p className="text-xs text-slate-400">
                Direct In-Dashboard Scraper & Chrome Extension Sync
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live Sync
              {lastUpdate && (
                <span className="text-emerald-500/70">
                  · {timeAgo(lastUpdate.toISOString())}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
            >
              + Quick Add / Paste Job
            </button>
            <Link
              href="/setup"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              Extension Setup
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Instant Live Scraper & Ingest Bar */}
        <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-emerald-400">
                Direct Live Job Scraper & Aggregator
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Fetch and import real jobs directly into this dashboard with 1-click (no extension required).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="e.g. AI Engineer, Python, React..."
                className="rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={handleLiveScrape}
                disabled={isScraping}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-50"
              >
                {isScraping ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-950 border-t-transparent" />
                    Fetching Jobs…
                  </>
                ) : (
                  <>Search & Import Jobs</>
                )}
              </button>
            </div>
          </div>
          {scrapeNotice && (
            <div className="mt-3 rounded-lg bg-slate-950/80 p-2.5 text-xs text-emerald-300">
              {scrapeNotice}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Jobs in Dashboard", value: total },
            { label: "Unique Companies", value: stats.companies },
            { label: "With Salary Info", value: stats.withSalary },
            { label: "Active Sources", value: stats.sources },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4"
            >
              <div className="text-2xl font-bold">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters and Controls */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search captured jobs by title, company, location…"
            className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          >
            <option value="all">All Sources</option>
            <option value="linkedin">LinkedIn</option>
            <option value="indeed">Indeed</option>
            <option value="glassdoor">Glassdoor</option>
            <option value="remotive">Remotive</option>
            <option value="arbeitnow">Arbeitnow</option>
            <option value="jobicy">Jobicy</option>
          </select>
          {jobsList.length > 0 && (
            <button
              onClick={clearAll}
              className="ml-auto rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
            >
              Clear All Jobs
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-slate-400">
            Loading dashboard…
          </div>
        ) : jobsList.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
            <h2 className="mt-4 text-xl font-bold">
              No jobs in dashboard yet
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-400">
              You can import real jobs instantly using the{" "}
              <b className="text-emerald-400">Search & Import Jobs</b> bar above, paste a job manually with{" "}
              <b className="text-emerald-400">+ Quick Add</b>, or capture jobs using the Chrome Extension.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={handleLiveScrape}
                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-emerald-400"
              >
                Fetch Real Jobs Now
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                + Paste a Job
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
            {/* Job list */}
            <div className="max-h-[calc(100vh-320px)] space-y-2 overflow-y-auto pr-1">
              {jobsList.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedId(job.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selected?.id === job.id
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-slate-800 bg-slate-900 hover:border-slate-600"
                  } ${newIds.has(job.id) ? "ring-2 ring-emerald-400/60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-snug">
                      {job.title}
                    </h3>
                    {newIds.has(job.id) && (
                      <span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-emerald-950">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {job.company ?? "Unknown company"}
                    {job.location ? ` · ${job.location}` : ""}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${sourceBadge(job.source)}`}
                    >
                      {job.source}
                    </span>
                    {job.salary && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                        Salary: {job.salary.slice(0, 40)}
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-slate-500">
                      {timeAgo(job.capturedAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="max-h-[calc(100vh-320px)] overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">{selected.title}</h2>
                    <div className="mt-1 text-sm text-slate-300">
                      {selected.company ?? "Unknown company"}
                      {selected.location ? ` · ${selected.location}` : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteJob(selected.id)}
                    className="shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span
                    className={`rounded-full border px-3 py-1 font-medium capitalize ${sourceBadge(selected.source)}`}
                  >
                    {selected.source}
                  </span>
                  {selected.salary && (
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-medium text-amber-400">
                      Salary: {selected.salary}
                    </span>
                  )}
                  {selected.employmentType && (
                    <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-slate-300">
                      {selected.employmentType}
                    </span>
                  )}
                  {selected.postedAt && (
                    <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-slate-300">
                      Posted: {selected.postedAt}
                    </span>
                  )}
                  <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-slate-400">
                    Captured {timeAgo(selected.capturedAt)}
                  </span>
                </div>

                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block break-all text-xs text-sky-400 underline-offset-2 hover:underline"
                >
                  {selected.url}
                </a>

                <div className="mt-5 border-t border-slate-800 pt-5">
                  <h3 className="mb-2 text-sm font-semibold text-slate-300">
                    Job Description
                  </h3>
                  {selected.description ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                      {selected.description}
                    </div>
                  ) : (
                    <p className="text-sm italic text-slate-500">
                      No full description provided.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">
                + Quick Add / Paste Job Posting
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Job Title *
                </label>
                <input
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Principal Software & AI Engineer"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Company
                  </label>
                  <input
                    value={manualCompany}
                    onChange={(e) => setManualCompany(e.target.value)}
                    placeholder="e.g. Volga Partners"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Location
                  </label>
                  <input
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="e.g. Islamabad (Hybrid)"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Salary (Optional)
                  </label>
                  <input
                    value={manualSalary}
                    onChange={(e) => setManualSalary(e.target.value)}
                    placeholder="e.g. 7.2M PKR/yr - 10.2M PKR/yr"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Job / Post URL *
                  </label>
                  <input
                    required
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/jobs/view/..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Job Description / Paste Raw Text (Smart Auto-fills)
                </label>
                <textarea
                  rows={4}
                  value={manualDescription}
                  onChange={(e) => {
                    setManualDescription(e.target.value);
                  }}
                  onPaste={(e) => {
                    const text = e.clipboardData.getData("text");
                    handleSmartPaste(text);
                  }}
                  placeholder="Paste the job description or copy-paste text from LinkedIn..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving…" : "Save Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
