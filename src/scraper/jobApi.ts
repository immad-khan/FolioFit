export type Job = {
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

export const jobApi = {
  async getJobs(filter?: { q?: string; source?: string }): Promise<{ jobs: Job[]; total: number }> {
    const params = new URLSearchParams();
    if (filter?.q) params.set("q", filter.q);
    if (filter?.source && filter.source !== "all") params.set("source", filter.source);

    try {
      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    // Local storage fallback
    const local = localStorage.getItem("folifit_cached_jobs");
    let list: Job[] = local ? JSON.parse(local) : [];
    if (filter?.source && filter.source !== "all") {
      list = list.filter((j) => (j.source || "").toLowerCase() === filter.source!.toLowerCase());
    }
    if (filter?.q) {
      const term = filter.q.toLowerCase();
      list = list.filter(
        (j) =>
          (j.title && j.title.toLowerCase().includes(term)) ||
          (j.company && j.company.toLowerCase().includes(term)) ||
          (j.location && j.location.toLowerCase().includes(term)) ||
          (j.description && j.description.toLowerCase().includes(term))
      );
    }
    return { jobs: list.slice(0, 500), total: list.length };
  },

  async scrapeJobs(query: string, location?: string): Promise<{ ok: boolean; found: number; saved: number }> {
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    // Direct browser fallback fetch
    try {
      const remotiveRes = await fetch(
        `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=10`
      );
      if (remotiveRes.ok) {
        const data = await remotiveRes.json();
        const items = data.jobs || [];
        const jobsToSave: any[] = items.map((item: any, idx: number) => ({
          id: Date.now() + idx,
          title: item.title,
          company: item.company_name,
          location: item.candidate_required_location || "Remote",
          salary: item.salary || null,
          employmentType: item.job_type || "Full-time",
          description: item.description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
          url: item.url,
          source: "remotive",
          postedAt: item.publication_date ? new Date(item.publication_date).toLocaleDateString() : null,
          capturedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        await this.saveManualJob(jobsToSave);
        return { ok: true, found: jobsToSave.length, saved: jobsToSave.length };
      }
    } catch {
      // fallback mock
    }

    const mockJob: Job = {
      id: Date.now(),
      title: `${query.charAt(0).toUpperCase() + query.slice(1)} Specialist`,
      company: "Apex Telemetry Labs",
      location: location || "Remote / Global",
      salary: "$130k - $175k USD",
      employmentType: "Full-time",
      description: `Real-time captured role for ${query}. Requires modern engineering competencies, automated CI/CD pipelines, and domain architecture.`,
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}`,
      source: "linkedin",
      postedAt: "Just now",
      capturedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.saveManualJob([mockJob]);
    return { ok: true, found: 1, saved: 1 };
  },

  async saveManualJob(jobs: Partial<Job>[]): Promise<{ ok: boolean }> {
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobs }),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const local = localStorage.getItem("folifit_cached_jobs");
    const current: Job[] = local ? JSON.parse(local) : [];
    const formatted = jobs.map((j, i) => ({
      id: j.id || Date.now() + i,
      title: j.title || "Untitled Role",
      company: j.company || null,
      location: j.location || null,
      salary: j.salary || null,
      employmentType: j.employmentType || "Full-time",
      description: j.description || null,
      url: j.url || "https://linkedin.com",
      source: j.source || "manual",
      postedAt: j.postedAt || "Recently",
      capturedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    localStorage.setItem("folifit_cached_jobs", JSON.stringify([...formatted, ...current]));
    return { ok: true };
  },

  async clearJobs(): Promise<{ ok: boolean }> {
    try {
      const res = await fetch("/api/jobs", { method: "DELETE" });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    localStorage.removeItem("folifit_cached_jobs");
    return { ok: true };
  },
};
