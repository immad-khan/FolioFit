import fs from "fs";
import path from "path";

export interface Job {
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
  extra?: unknown;
  capturedAt: string;
  updatedAt: string;
}

export type IncomingJob = {
  title?: string | null;
  company?: string | null;
  location?: string | null;
  salary?: string | null;
  employmentType?: string | null;
  description?: string | null;
  url?: string | null;
  source?: string | null;
  postedAt?: string | null;
  extra?: unknown;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "jobs.json");

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

function readJobs(): Job[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading jobs.json:", err);
    return [];
  }
}

function writeJobs(jobs: Job[]): void {
  ensureDataFile();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing jobs.json:", err);
  }
}

function clean(v: unknown, max = 20000): string | null {
  if (typeof v !== "string") return null;
  const t = v.replace(/\s+\n/g, "\n").replace(/[ \t]+/g, " ").trim();
  if (!t) return null;
  return t.slice(0, max);
}

export async function getJobs(filter?: { q?: string; source?: string }): Promise<{ jobs: Job[]; total: number }> {
  const all = readJobs();
  let filtered = all;

  if (filter?.source && filter.source !== "all") {
    filtered = filtered.filter(
      (j) => (j.source || "").toLowerCase() === filter.source!.toLowerCase()
    );
  }

  if (filter?.q) {
    const term = filter.q.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        (j.title && j.title.toLowerCase().includes(term)) ||
        (j.company && j.company.toLowerCase().includes(term)) ||
        (j.location && j.location.toLowerCase().includes(term)) ||
        (j.description && j.description.toLowerCase().includes(term))
    );
  }

  // Sort by capturedAt descending
  filtered.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());

  return {
    jobs: filtered.slice(0, 500),
    total: all.length,
  };
}

export async function saveIncomingJobs(incomingList: IncomingJob[]): Promise<{
  saved: number;
  updated: number;
  skipped: number;
  errors: string[];
}> {
  const all = readJobs();
  let saved = 0;
  let updated = 0;
  const errors: string[] = [];
  const now = new Date().toISOString();

  for (const j of incomingList) {
    const title = clean(j.title, 500);
    const url = clean(j.url, 2000);
    if (!title || !url) {
      errors.push("Skipped a job missing title or url");
      continue;
    }

    const payload = {
      title,
      company: clean(j.company, 500),
      location: clean(j.location, 500),
      salary: clean(j.salary, 500),
      employmentType: clean(j.employmentType, 200),
      description: clean(j.description, 50000),
      url,
      source: clean(j.source, 100) ?? "other",
      postedAt: clean(j.postedAt, 200),
      extra: j.extra ?? null,
    };

    const existingIndex = all.findIndex((existing) => existing.url === url);

    if (existingIndex >= 0) {
      all[existingIndex] = {
        ...all[existingIndex],
        ...payload,
        updatedAt: now,
      };
      updated++;
    } else {
      const nextId = all.length > 0 ? Math.max(...all.map((item) => item.id || 0)) + 1 : 1;
      const newJob: Job = {
        id: nextId,
        ...payload,
        capturedAt: now,
        updatedAt: now,
      };
      all.unshift(newJob);
      saved++;
    }
  }

  writeJobs(all);

  return {
    saved,
    updated,
    skipped: errors.length,
    errors,
  };
}

export async function deleteJobById(id: number): Promise<boolean> {
  const all = readJobs();
  const filtered = all.filter((j) => j.id !== id);
  if (filtered.length !== all.length) {
    writeJobs(filtered);
    return true;
  }
  return false;
}

export async function clearAllJobs(): Promise<void> {
  writeJobs([]);
}
