"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SetupPage() {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const apiUrl = origin ? `${origin}/api/jobs` : "…";

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const steps = [
    {
      title: "Download the extension",
      body: (
        <>
          <p className="text-sm text-slate-400">
            Download the zip and extract it to a folder on your computer
            (remember where you put it).
          </p>
          <a
            href="/job-capture-extension.zip"
            download
            className="mt-3 inline-block rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            ⬇️ Download job-capture-extension.zip
          </a>
        </>
      ),
    },
    {
      title: "Load it into Chrome",
      body: (
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-400">
          <li>
            Open{" "}
            <button
              onClick={() => copy("chrome://extensions", "ext")}
              className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-emerald-400 hover:bg-slate-700"
            >
              chrome://extensions {copied === "ext" ? "✓ copied" : "⧉"}
            </button>{" "}
            in a new tab
          </li>
          <li>
            Turn on <b className="text-slate-200">Developer mode</b> (toggle,
            top-right corner)
          </li>
          <li>
            Click <b className="text-slate-200">Load unpacked</b> and select the
            extracted <span className="font-mono text-xs">extension</span>{" "}
            folder
          </li>
          <li>
            Pin it: click the extensions icon in the toolbar → pin{" "}
            <b className="text-slate-200">Job Capture</b>
          </li>
        </ol>
      ),
    },
    {
      title: "Connect it to this dashboard",
      body: (
        <>
          <p className="text-sm text-slate-400">
            Click the extension icon and paste this API URL into the{" "}
            <b className="text-slate-200">Dashboard API URL</b> field (saved
            automatically):
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-emerald-400">
              {apiUrl}
            </code>
            <button
              onClick={() => copy(apiUrl, "api")}
              className="shrink-0 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
            >
              {copied === "api" ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </>
      ),
    },
    {
      title: "Capture real jobs",
      body: (
        <ul className="space-y-2 text-sm text-slate-400">
          <li>
            <b className="text-slate-200">LinkedIn</b> — open{" "}
            <span className="font-mono text-xs">linkedin.com/jobs</span>, click
            any job so its details show, then hit{" "}
            <b className="text-emerald-400">Capture this job</b>. On a search
            results page you can also use{" "}
            <b className="text-slate-200">Capture all jobs visible on page</b>{" "}
            to grab every card at once.
          </li>
          <li>
            <b className="text-slate-200">Indeed</b> — open any job (or click
            one in the results list so the right pane opens) and capture it. It
            grabs title, company, location, salary and the full description.
          </li>
          <li>
            <b className="text-slate-200">Any other job site</b> — Glassdoor,
            company career pages, Greenhouse, Lever, Workday… the extension
            reads the page&apos;s JobPosting structured data automatically.
          </li>
          <li>
            Captured jobs appear on the{" "}
            <Link href="/" className="text-emerald-400 underline underline-offset-2">
              dashboard
            </Link>{" "}
            within ~2 seconds. Re-capturing the same job URL updates it instead
            of duplicating.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/15" aria-hidden="true" />
            <h1 className="text-lg font-bold">Extension Setup</h1>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 py-8">
        <p className="text-sm leading-relaxed text-slate-400">
          The Job Capture Chrome extension reads the job posting open in your
          current tab — on <b className="text-slate-200">LinkedIn</b>,{" "}
          <b className="text-slate-200">Indeed</b>,{" "}
          <b className="text-slate-200">Glassdoor</b> or almost any career site —
          and sends the real data (title, company, location, salary, full
          description, link) straight into this dashboard. No mock data: it
          scrapes whatever job you have open.
        </p>

        {steps.map((s, i) => (
          <section
            key={s.title}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="mb-3 flex items-center gap-3 text-base font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-emerald-950">
                {i + 1}
              </span>
              {s.title}
            </h2>
            {s.body}
          </section>
        ))}

        <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200/80">
          <b className="text-amber-300">Troubleshooting:</b>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              &ldquo;No job data found&rdquo; → make sure a job&apos;s details are actually
              visible on the page (click a job card first), then retry.
            </li>
            <li>
              Salary shows empty → many postings simply don&apos;t publish a salary;
              the extension captures it whenever the site displays one.
            </li>
            <li>
              If LinkedIn/Indeed changed their layout, the extension falls back
              to the page&apos;s structured data, which usually still works.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
