/* Job Capture extension — popup logic.
 * Injects an extraction function into the active tab, then POSTs the
 * extracted job data to the user's dashboard API.
 */

const apiInput = document.getElementById("apiUrl");
const captureBtn = document.getElementById("captureBtn");
const captureAllBtn = document.getElementById("captureAllBtn");
const statusEl = document.getElementById("status");
const dashboardLink = document.getElementById("dashboardLink");

function setStatus(msg, cls) {
  statusEl.textContent = msg;
  statusEl.className = cls;
}

function updateDashboardLink() {
  try {
    const u = new URL(apiInput.value.trim());
    dashboardLink.href = u.origin;
    dashboardLink.style.display = "block";
  } catch {
    dashboardLink.style.display = "none";
  }
}

chrome.storage.sync.get(["apiUrl"], (res) => {
  if (res.apiUrl) {
    apiInput.value = res.apiUrl;
  } else {
    apiInput.value = "http://localhost:3000/api/jobs";
    chrome.storage.sync.set({ apiUrl: "http://localhost:3000/api/jobs" });
  }
  updateDashboardLink();
});

apiInput.addEventListener("input", () => {
  chrome.storage.sync.set({ apiUrl: apiInput.value.trim() });
  updateDashboardLink();
});

/* ============================================================
 * This function is serialized and executed INSIDE the page.
 * It must be fully self-contained (no outer references).
 * ============================================================ */
function extractJobsFromPage(mode) {
  const txt = (el) =>
    el ? el.textContent.replace(/\s+/g, " ").trim() || null : null;

  const stripHtml = (html) => {
    if (!html) return null;
    const d = document.createElement("div");
    d.innerHTML = html;
    d.querySelectorAll("br, p, li, div, h1, h2, h3, h4").forEach((n) =>
      n.appendChild(document.createTextNode("\n"))
    );
    return d.textContent.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ").trim() || null;
  };

  const blockText = (el) => {
    if (!el) return null;
    return el.innerText
      ? el.innerText.replace(/\n{3,}/g, "\n\n").trim() || null
      : txt(el);
  };

  const host = location.hostname.toLowerCase();
  const SALARY_RE = /(\$|€|£|₹|¥|PKR|Rs|AED|SAR|SGD|USD|EUR|GBP|CAD|AUD|INR)\s?[\d,.]+\s?(k|M|m|million|thousand)?(\s?[-–—]\s?(\$|€|£|₹|¥|PKR|Rs|AED|SAR|SGD|USD|EUR|GBP|CAD|AUD|INR)?\s?[\d,.]+\s?(k|M|m|million)?)?(\s?\/?\s?(yr|year|hr|hour|mo|month|week|annually|per hour|per year|per month|PKR\/yr|PKR\/mo))?/i;

  /* ---------- LinkedIn Description Guaranteed Extractor ---------- */
  function getLinkedInDescription(detailPane) {
    if (!detailPane) return null;

    // Auto-click "Show more" button to expand full text if collapsed
    try {
      const showMoreBtns = detailPane.querySelectorAll(
        'button[aria-label*="more" i], .jobs-description__footer-button button, button.show-more-less-html__button, button.artdeco-button--tertiary, [aria-expanded="false"]'
      );
      showMoreBtns.forEach((btn) => {
        if (btn && btn.textContent && /more|show|see/i.test(btn.textContent)) {
          btn.click();
        }
      });
    } catch (e) {}

    // Priority 1: standard LinkedIn description selectors
    const selectors = [
      "#job-details",
      ".jobs-description__content .jobs-box__html-content",
      ".jobs-description-content__text",
      ".jobs-box__html-content",
      ".show-more-less-html__markup",
      "div[data-view-name*='about-the-job']",
      "article.jobs-description__container",
      "article",
      ".jobs-description",
    ];

    for (const sel of selectors) {
      const el = detailPane.querySelector(sel);
      if (el) {
        const text = blockText(el);
        if (text && text.trim().length > 30) {
          return text.trim();
        }
      }
    }

    // Priority 2: Find "About the job" heading and extract its parent/sibling container
    const allHeadings = Array.from(detailPane.querySelectorAll("h2, h3, h4, span, div, strong"));
    for (const h of allHeadings) {
      const t = (h.textContent || "").trim().toLowerCase();
      if (t === "about the job" || t === "about this job" || t.startsWith("about the job")) {
        const parent = h.closest("section, article, div") || h.parentElement;
        if (parent) {
          const text = blockText(parent);
          if (text && text.length > 50) {
            return text.replace(/^about the job\s*/i, "").trim();
          }
        }
      }
    }

    // Priority 3: Extract from the main right pane text
    const fullText = blockText(detailPane);
    if (fullText) {
      const lower = fullText.toLowerCase();
      const marker = lower.indexOf("about the job");
      if (marker !== -1) {
        const afterMarker = fullText.slice(marker + "about the job".length).trim();
        if (afterMarker.length > 30) return afterMarker;
      }
      return fullText.slice(0, 15000);
    }

    return null;
  }

  /* ---------- JSON-LD JobPosting ---------- */
  function fromJsonLd() {
    const found = [];
    document
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((s) => {
        let data;
        try {
          data = JSON.parse(s.textContent);
        } catch {
          return;
        }
        const nodes = [];
        const walk = (n) => {
          if (!n) return;
          if (Array.isArray(n)) return n.forEach(walk);
          if (typeof n === "object") {
            if (n["@graph"]) walk(n["@graph"]);
            const t = n["@type"];
            if (
              t === "JobPosting" ||
              (Array.isArray(t) && t.includes("JobPosting"))
            )
              nodes.push(n);
          }
        };
        walk(data);
        nodes.forEach((n) => {
          let salary = null;
          const bs = n.baseSalary;
          if (bs) {
            const v = bs.value || bs;
            if (v && typeof v === "object") {
              const cur = bs.currency || v.currency || "";
              const unit = v.unitText
                ? " / " + String(v.unitText).toLowerCase()
                : "";
              if (v.minValue != null && v.maxValue != null)
                salary = `${cur} ${v.minValue} - ${v.maxValue}${unit}`.trim();
              else if (v.value != null)
                salary = `${cur} ${v.value}${unit}`.trim();
            } else if (typeof v === "string" || typeof v === "number") {
              salary = String(v);
            }
          }
          let locStr = null;
          const jl = n.jobLocation;
          const locs = Array.isArray(jl) ? jl : jl ? [jl] : [];
          const parts = locs
            .map((l) => {
              const a = l && l.address;
              if (!a) return typeof l === "string" ? l : null;
              if (typeof a === "string") return a;
              const country =
                a.addressCountry &&
                (a.addressCountry.name || a.addressCountry);
              return [a.addressLocality, a.addressRegion, country]
                .filter(Boolean)
                .join(", ");
            })
            .filter(Boolean);
          if (parts.length) locStr = parts.join(" | ");
          if (
            !locStr &&
            n.jobLocationType &&
            /TELECOMMUTE/i.test(String(n.jobLocationType))
          )
            locStr = "Remote";

          found.push({
            title: n.title || n.name || null,
            company:
              (n.hiringOrganization &&
                (n.hiringOrganization.name ||
                  (typeof n.hiringOrganization === "string"
                    ? n.hiringOrganization
                    : null))) ||
              null,
            location: locStr,
            salary,
            employmentType: Array.isArray(n.employmentType)
              ? n.employmentType.join(", ")
              : n.employmentType || null,
            description: stripHtml(n.description),
            postedAt: n.datePosted || null,
            url: location.href,
          });
        });
      });
    return found;
  }

  /* ---------- LinkedIn: Single Job Extractor ---------- */
  function linkedinCurrent() {
    const currentJobId =
      new URLSearchParams(location.search).get("currentJobId") ||
      (location.pathname.match(/\/jobs\/view\/(\d+)/) || [])[1];

    const canonicalUrl = currentJobId
      ? `https://www.linkedin.com/jobs/view/${currentJobId}/`
      : location.href;

    const detailPane =
      document.querySelector(".jobs-search__job-details") ||
      document.querySelector(".scaffold-layout__detail") ||
      document.querySelector(".job-view-layout") ||
      document.querySelector(".jobs-details") ||
      document.querySelector(".job-details-jobs-unified-top-card") ||
      document;

    let title =
      txt(detailPane.querySelector(".job-details-jobs-unified-top-card__job-title h1")) ||
      txt(detailPane.querySelector(".job-details-jobs-unified-top-card__job-title a")) ||
      txt(detailPane.querySelector(".job-details-jobs-unified-top-card__job-title")) ||
      txt(detailPane.querySelector(".jobs-unified-top-card__job-title")) ||
      txt(detailPane.querySelector("h1.t-24")) ||
      txt(detailPane.querySelector("h2.t-24")) ||
      txt(detailPane.querySelector(".top-card-layout__title")) ||
      txt(detailPane.querySelector("h1[class*='job-title']")) ||
      txt(detailPane.querySelector("h1[class*='title']")) ||
      txt(detailPane.querySelector("h1"));

    let company =
      txt(detailPane.querySelector(".job-details-jobs-unified-top-card__company-name a")) ||
      txt(detailPane.querySelector(".job-details-jobs-unified-top-card__company-name")) ||
      txt(detailPane.querySelector(".jobs-unified-top-card__company-name a")) ||
      txt(detailPane.querySelector(".jobs-unified-top-card__company-name")) ||
      txt(detailPane.querySelector(".job-details-jobs-unified-top-card__primary-description a")) ||
      txt(detailPane.querySelector(".jobs-unified-top-card__primary-description a")) ||
      txt(detailPane.querySelector(".topcard__org-name-link")) ||
      txt(detailPane.querySelector(".topcard__flavor:not(.topcard__flavor--bullet)")) ||
      txt(detailPane.querySelector("[data-view-name*='company-name']"));

    let locationStr = null;
    const tertiary = detailPane.querySelector(
      ".job-details-jobs-unified-top-card__tertiary-description-container, .job-details-jobs-unified-top-card__primary-description-container, .jobs-unified-top-card__primary-description, .jobs-unified-top-card__tertiary-description"
    );
    if (tertiary) {
      const t = txt(tertiary);
      if (t) locationStr = t.split("·")[0].trim() || null;
    }
    if (!locationStr) {
      locationStr = txt(
        detailPane.querySelector(".topcard__flavor--bullet, .job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet")
      );
    }

    let salary = null;
    let employmentType = null;
    const pillNodes = detailPane.querySelectorAll(
      ".job-details-jobs-unified-top-card__job-insight, .job-details-preferences-and-skills__pill, .job-details-fit-level-preferences button, .jobs-unified-top-card__job-insight, .compensation__salary, .salary, [class*='job-insight'], [class*='salary']"
    );
    pillNodes.forEach((n) => {
      const t = txt(n);
      if (!t) return;
      if (!salary && SALARY_RE.test(t)) {
        const m = t.match(SALARY_RE);
        salary = (m ? m[0] : t).trim().slice(0, 200);
      }
      if (
        !employmentType &&
        /(full[- ]?time|part[- ]?time|contract|internship|temporary|freelance)/i.test(t)
      ) {
        const m = t.match(
          /(full[- ]?time|part[- ]?time|contract|internship|temporary|freelance)/i
        );
        employmentType = m ? m[0] : null;
      }
    });

    // Fallback using active card
    const activeCard =
      (currentJobId && document.querySelector(`li[data-occludable-job-id="${currentJobId}"]`)) ||
      (currentJobId && document.querySelector(`[data-job-id="${currentJobId}"]`)) ||
      document.querySelector(".jobs-search-results-list__list-item--active") ||
      document.querySelector(".jobs-search-results-list__list-item.active") ||
      document.querySelector("li.jobs-search-results-list__list-item");

    if (activeCard) {
      if (!title) {
        title = txt(activeCard.querySelector(".job-card-list__title, strong, a.job-card-container__link, a"));
      }
      if (!company) {
        company = txt(activeCard.querySelector(".artdeco-entity-lockup__subtitle, .job-card-container__primary-description, [class*='subtitle']"));
      }
      if (!locationStr) {
        locationStr = txt(activeCard.querySelector(".job-card-container__metadata-item, .job-search-card__location, [class*='location']"));
      }
      if (!salary) {
        const cardText = txt(activeCard);
        if (cardText && SALARY_RE.test(cardText)) {
          const m = cardText.match(SALARY_RE);
          salary = m ? m[0].trim() : null;
        }
      }
    }

    if (!title && document.title) {
      const parts = document.title.split(/ \| | - /);
      if (parts.length > 0 && !parts[0].includes("LinkedIn")) {
        title = parts[0].trim();
      }
      if (!company && parts.length > 1 && !parts[1].includes("LinkedIn")) {
        company = parts[1].trim();
      }
    }

    // Comprehensive Description Extraction
    const description = getLinkedInDescription(detailPane);

    const posted = txt(
      detailPane.querySelector(
        ".jobs-unified-top-card__posted-date, .posted-time-ago__text, .jobs-details-top-card__posted-date"
      )
    );

    if (!title) return null;
    return {
      title: title.replace(/ with verification$/i, "").trim(),
      company,
      location: locationStr,
      salary,
      employmentType,
      description,
      postedAt: posted,
      url: canonicalUrl,
      source: "linkedin",
    };
  }

  /* ---------- LinkedIn: all cards in list ---------- */
  function linkedinList() {
    const cards = document.querySelectorAll(
      "li.jobs-search-results-list__list-item, li[data-occludable-job-id], .job-card-container, div[data-view-name='job-card'], .jobs-search__results-list li, .base-card, .scaffold-layout__list-item"
    );
    const out = [];
    const seen = new Set();
    cards.forEach((card) => {
      const link = card.querySelector(
        "a.job-card-container__link, a.job-card-list__title--link, a.job-card-list__title, a.base-card__full-link, a[href*='/jobs/view/']"
      );
      const jobId =
        card.getAttribute("data-occludable-job-id") ||
        card.getAttribute("data-job-id") ||
        (link &&
          link.href &&
          (link.href.match(/\/jobs\/view\/(\d+)/) || [])[1]);
      const url = jobId
        ? `https://www.linkedin.com/jobs/view/${jobId}/`
        : link
          ? link.href.split("?")[0]
          : null;
      if (!url || seen.has(url)) return;

      const title =
        (link &&
          (link.getAttribute("aria-label") ||
            txt(link.querySelector("strong")) ||
            txt(link))) ||
        txt(card.querySelector(".base-search-card__title, .job-card-list__title"));
      const company = txt(
        card.querySelector(
          ".artdeco-entity-lockup__subtitle, .job-card-container__primary-description, .base-search-card__subtitle, .job-card-container__company-name"
        )
      );
      let locationStr = null;
      let salary = null;
      card
        .querySelectorAll(
          ".job-card-container__metadata-wrapper li, .job-card-container__metadata-item, .job-search-card__location, .artdeco-entity-lockup__caption, .artdeco-entity-lockup__metadata, li"
        )
        .forEach((m) => {
          const t = txt(m);
          if (!t) return;
          if (!salary && SALARY_RE.test(t)) {
            const sm = t.match(SALARY_RE);
            salary = (sm ? sm[0] : t).slice(0, 200);
          } else if (!locationStr && !t.includes("Easy Apply") && !t.includes("applicant") && !t.includes("Viewed")) {
            locationStr = t;
          }
        });
      if (!title) return;
      seen.add(url);
      out.push({
        title: title.replace(/ with verification$/i, "").trim(),
        company,
        location: locationStr,
        salary,
        description: null,
        url,
        source: "linkedin",
      });
    });
    return out;
  }

  /* ---------- Indeed: currently-open job ---------- */
  function indeedCurrent() {
    const jk =
      new URLSearchParams(location.search).get("jk") ||
      new URLSearchParams(location.search).get("vjk");
    const canonicalUrl = jk
      ? `${location.origin}/viewjob?jk=${jk}`
      : location.href;

    const title = txt(
      document.querySelector(
        'h1[data-testid="jobsearch-JobInfoHeader-title"], h2[data-testid="jobsearch-JobInfoHeader-title"], .jobsearch-JobInfoHeader-title'
      )
    );
    const company = txt(
      document.querySelector(
        '[data-testid="inlineHeader-companyName"], [data-company-name="true"], .jobsearch-InlineCompanyRating div:first-child, [data-testid="jobsearch-CompanyInfoContainer"] a'
      )
    );
    const locationStr = txt(
      document.querySelector(
        '[data-testid="inlineHeader-companyLocation"], [data-testid="jobsearch-JobInfoHeader-companyLocation"], [data-testid="job-location"]'
      )
    );
    let salary = null;
    let employmentType = null;
    const salBlock = document.querySelector(
      '#salaryInfoAndJobType, [data-testid="jobsearch-OtherJobDetailsContainer"]'
    );
    if (salBlock) {
      const t = txt(salBlock);
      if (t) {
        const sm = t.match(SALARY_RE);
        if (sm) salary = sm[0].trim();
        const em = t.match(
          /(full[- ]?time|part[- ]?time|contract|internship|temporary|freelance)/i
        );
        if (em) employmentType = em[0];
      }
    }
    document
      .querySelectorAll('#jobDetailsSection [data-testid="list-item"], [data-testid^="detailText"]')
      .forEach((n) => {
        const t = txt(n);
        if (t && !salary && SALARY_RE.test(t)) {
          const sm = t.match(SALARY_RE);
          salary = (sm ? sm[0] : t).slice(0, 200);
        }
      });

    const description = blockText(
      document.querySelector("#jobDescriptionText, .jobsearch-jobDescriptionText, [id*='jobDescriptionText']")
    );

    if (!title) return null;
    return {
      title: title.replace(/\s*- job post$/i, ""),
      company,
      location: locationStr,
      salary,
      employmentType,
      description,
      url: canonicalUrl,
      source: "indeed",
    };
  }

  /* ---------- Indeed: all cards ---------- */
  function indeedList() {
    const out = [];
    const seen = new Set();
    document
      .querySelectorAll("a.jcs-JobTitle, h2.jobTitle a, a[data-jk]")
      .forEach((link) => {
        const jk =
          link.getAttribute("data-jk") ||
          (link.href && (link.href.match(/jk=([a-z0-9]+)/i) || [])[1]);
        const url = jk
          ? `${location.origin}/viewjob?jk=${jk}`
          : link.href
            ? link.href.split("&")[0]
            : null;
        if (!url || seen.has(url)) return;
        const card =
          link.closest(".cardOutline, .job_seen_beacon, li") || link;
        const title = txt(link);
        const company = txt(
          card.querySelector('[data-testid="company-name"], .companyName')
        );
        const locationStr = txt(
          card.querySelector('[data-testid="text-location"], .companyLocation')
        );
        let salary = null;
        card
          .querySelectorAll(
            '[data-testid="attribute_snippet_testid"], .salary-snippet-container, .estimated-salary, [class*="salary"]'
          )
          .forEach((s) => {
            const t = txt(s);
            if (t && !salary && SALARY_RE.test(t)) {
              const sm = t.match(SALARY_RE);
              salary = (sm ? sm[0] : t).slice(0, 200);
            }
          });
        if (!title) return;
        seen.add(url);
        out.push({
          title,
          company,
          location: locationStr,
          salary,
          description: null,
          url,
          source: "indeed",
        });
      });
    return out;
  }

  /* ---------- Glassdoor ---------- */
  function glassdoorCurrent() {
    const title = txt(
      document.querySelector(
        '[data-test="job-title"], h1[id^="jd-job-title"], .JobDetails_jobTitle__Rw_gn'
      )
    );
    const company = txt(
      document.querySelector(
        '[data-test="employer-name"], .EmployerProfile_employerNameHeading__bXBYr, [class*="EmployerProfile_employerName"]'
      )
    );
    const locationStr = txt(
      document.querySelector('[data-test="location"], [data-test="emp-location"]')
    );
    let salary = null;
    const sal = document.querySelector(
      '[data-test="detailSalary"], [class*="SalaryEstimate"]'
    );
    if (sal) {
      const t = txt(sal);
      if (t && SALARY_RE.test(t)) salary = t.slice(0, 200);
    }
    const description = blockText(
      document.querySelector(
        '[class*="JobDetails_jobDescription"], .jobDescriptionContent, [data-test="job-description"]'
      )
    );
    if (!title) return null;
    return {
      title,
      company,
      location: locationStr,
      salary,
      description,
      url: location.href.split("?")[0],
      source: "glassdoor",
    };
  }

  /* ---------- Generic fallback ---------- */
  function genericCurrent() {
    const og = (p) => {
      const m = document.querySelector(`meta[property="${p}"], meta[name="${p}"]`);
      return m ? m.getAttribute("content") : null;
    };
    const title =
      txt(document.querySelector("h1")) || og("og:title") || document.title;
    if (!title) return null;
    const main =
      document.querySelector(
        "main, article, [role='main'], #content, .content"
      ) || document.body;
    const description = blockText(main);
    const bodyText = description || "";
    const sm = bodyText.match(SALARY_RE);
    return {
      title: title.slice(0, 300),
      company: og("og:site_name"),
      location: null,
      salary: sm ? sm[0].trim() : null,
      description: description ? description.slice(0, 20000) : og("og:description"),
      url: location.href,
      source: host.replace(/^www\./, "").split(".")[0],
    };
  }

  const merge = (primary, fallback) => {
    if (!primary) return fallback;
    if (!fallback) return primary;
    const out = { ...primary };
    for (const k of Object.keys(fallback)) {
      if (out[k] == null || out[k] === "") out[k] = fallback[k];
    }
    return out;
  };

  const isLinkedIn = host.includes("linkedin.");
  const isIndeed = host.includes("indeed.");
  const isGlassdoor = host.includes("glassdoor.");
  const jsonLd = fromJsonLd();

  if (mode === "all") {
    let list = [];
    if (isLinkedIn) list = linkedinList();
    else if (isIndeed) list = indeedList();
    if (!list.length && jsonLd.length > 1) list = jsonLd;
    if (!list.length) {
      mode = "single";
    } else {
      return { jobs: list, pageUrl: location.href, pageTitle: document.title };
    }
  }

  let job = null;
  if (isLinkedIn) job = merge(linkedinCurrent(), jsonLd[0]);
  else if (isIndeed) job = merge(indeedCurrent(), jsonLd[0]);
  else if (isGlassdoor) job = merge(glassdoorCurrent(), jsonLd[0]);
  else if (jsonLd.length) job = merge(jsonLd[0], genericCurrent());
  else job = genericCurrent();

  if (job && !job.source) {
    job.source = isLinkedIn
      ? "linkedin"
      : isIndeed
        ? "indeed"
        : isGlassdoor
          ? "glassdoor"
          : host.replace(/^www\./, "").split(".")[0];
  }

  return {
    jobs: job && job.title ? [job] : [],
    pageUrl: location.href,
    pageTitle: document.title,
  };
}

/* ---------------- popup orchestration ---------------- */

async function capture(mode) {
  const apiUrl = apiInput.value.trim();
  if (!apiUrl) {
    setStatus(
      "Paste your Dashboard API URL first (find it on the Setup page of your dashboard).",
      "err"
    );
    return;
  }
  let parsed;
  try {
    parsed = new URL(apiUrl);
  } catch {
    setStatus("That API URL doesn't look valid. It should start with http(s)://", "err");
    return;
  }

  captureBtn.disabled = true;
  captureAllBtn.disabled = true;
  setStatus("Reading job & description from this tab…", "info");

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.id) throw new Error("No active tab found.");
    if (
      tab.url &&
      (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("about:"))
    ) {
      throw new Error("This is a browser page — open a job posting tab (LinkedIn, Indeed…) first.");
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractJobsFromPage,
      args: [mode],
    });

    const data = results && results[0] && results[0].result;
    if (!data || !data.jobs || !data.jobs.length) {
      throw new Error(
        "No job data found on this page. Open a job posting (click a job so its details are visible), then try again."
      );
    }

    setStatus(
      `Found ${data.jobs.length} job${data.jobs.length > 1 ? "s" : ""}. Sending to dashboard…`,
      "info"
    );

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobs: data.jobs }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Dashboard API error (${res.status}). ${t.slice(0, 120)}`);
    }
    const out = await res.json();
    const first = data.jobs[0];
    const hasDesc = !!first.description;
    setStatus(
      `✅ Sent! ${out.saved || 0} new, ${out.updated || 0} updated.\n` +
        (data.jobs.length === 1
          ? `"${first.title}"${first.company ? " @ " + first.company : ""}${hasDesc ? "\n📄 Full description captured" : ""}`
          : `${data.jobs.length} jobs captured from this page.`) +
        `\nCheck your dashboard — it updates live.`,
      "ok"
    );
  } catch (e) {
    setStatus("❌ " + (e && e.message ? e.message : String(e)), "err");
  } finally {
    captureBtn.disabled = false;
    captureAllBtn.disabled = false;
  }
}

captureBtn.addEventListener("click", () => capture("single"));
captureAllBtn.addEventListener("click", () => capture("all"));
