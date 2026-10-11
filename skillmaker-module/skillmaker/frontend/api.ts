import axios from 'axios';

// ─── Django backend client (used when backend is live) ─────────────────────
const djangoApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

djangoApi.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Groq direct client (used when backend is offline) ─────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;
const GROQ_MODEL   = import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-120b';
const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';

const groqApi = axios.create({
  baseURL: GROQ_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${GROQ_API_KEY}`,
  },
  timeout: 60000,
});

// ─── Types ─────────────────────────────────────────────────────────────────
export interface SkillResource {
  name: string;
  url: string;
  type?: 'docs' | 'course' | 'video' | 'practice';
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  is_completed: boolean;
  resources: SkillResource[];
}

export interface RoadmapSectionData {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export interface RoadmapData {
  id: string;
  role: string;
  level: string;
  created_at: string;
  completion_percentage: number;
  sections: RoadmapSectionData[];
}

// ─── Groq LLM generation ───────────────────────────────────────────────────
async function generateRoadmapWithGroq(role: string, level: string): Promise<RoadmapData> {
  const prompt = `Generate a detailed, professional learning roadmap for the role of "${role}" at a "${level}" level.

Structure the roadmap into 4-5 sections (e.g. Foundational Concepts, Core Skills, Advanced Topics, Tools & Ecosystem, Interview Prep).
Each section should contain 3-5 specific skills or topics.
For each skill, provide a clear description and 2-3 real, high-quality learning resources with actual working URLs.

Return ONLY valid JSON in this exact format — no markdown, no code fences, just raw JSON:
{
  "role": "${role}",
  "level": "${level}",
  "sections": [
    {
      "title": "Section Title",
      "description": "Short section description",
      "skills": [
        {
          "name": "Skill Name",
          "description": "Clear description of what to learn and why it matters",
          "resources": [
            { "name": "Resource Name", "url": "https://actual-url.com", "type": "docs" }
          ]
        }
      ]
    }
  ]
}`;

  const res = await groqApi.post('', {
    model: GROQ_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are an expert career coach and technical architect. Generate accurate, structured JSON learning roadmaps only. Output raw JSON only — no markdown, no explanation.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: 'json_object' },
  });

  const raw = res.data.choices[0].message.content;
  let parsed: any;

  try {
    // Strip any accidental markdown fences
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Groq returned malformed JSON. Please try again.');
  }

  const id = `rdm-${Date.now()}`;

  const sections: RoadmapSectionData[] = (parsed.sections || []).map((sec: any, sIdx: number) => ({
    id: `sec-${sIdx + 1}-${id}`,
    title: sec.title || `Section ${sIdx + 1}`,
    description: sec.description || '',
    skills: (sec.skills || []).map((sk: any, skIdx: number) => ({
      id: `sk-${sIdx + 1}${String(skIdx + 1).padStart(2, '0')}-${id}`,
      name: sk.name || `Skill ${skIdx + 1}`,
      description: sk.description || '',
      is_completed: false,
      resources: (sk.resources || []).map((r: any) => ({
        name: r.name || 'Resource',
        url: r.url || '#',
        type: r.type || 'docs',
      })),
    })),
  }));

  const allSkills   = sections.flatMap(s => s.skills);
  const completedPct = Math.round(allSkills.filter(s => s.is_completed).length / (allSkills.length || 1) * 100);

  return {
    id,
    role: parsed.role || role,
    level: parsed.level || level,
    created_at: new Date().toISOString(),
    completion_percentage: completedPct,
    sections,
  };
}

// ─── SkillBot Groq chat ────────────────────────────────────────────────────
async function chatWithGroq(message: string, activeRole: string): Promise<string> {
  const res = await groqApi.post('', {
    model: GROQ_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are SkillBot, an expert AI career advisor specializing in the "${activeRole}" career path. Give concise, actionable advice in 2-3 sentences.`,
      },
      { role: 'user', content: message },
    ],
    temperature: 0.8,
    max_tokens: 300,
  });

  return res.data.choices[0].message.content.trim();
}

// ─── localStorage helpers ──────────────────────────────────────────────────
function getActiveRole(): string {
  const stored = getStoredRoadmap();
  return stored?.role || 'Software Engineer';
}

function getStoredRoadmap(): RoadmapData | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('career_active_roadmap');
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

function saveStoredRoadmap(roadmap: RoadmapData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('career_active_roadmap', JSON.stringify(roadmap));
  }
}

// ─── Public API ────────────────────────────────────────────────────────────
export const roadmapAPI = {
  /**
   * 1. Generate Roadmap
   *    → Tries Django backend first, then falls back to Groq directly.
   */
  generateRoadmap: async (data: { role: string; level: string }) => {
    // ── Try Django backend ──────────────────────────────────────────────
    try {
      const res = await djangoApi.post('/skill-roadmap/generate/', data);
      if (res.data?.success && res.data?.data) {
        saveStoredRoadmap(res.data.data);
        return res.data;
      }
    } catch {
      // Backend offline — fall through to Groq
    }

    // ── Fall back to Groq ──────────────────────────────────────────────
    const generated = await generateRoadmapWithGroq(data.role, data.level);
    saveStoredRoadmap(generated);

    return {
      success: true,
      data: generated,
      message: `AI-generated career path for ${data.role} (${data.level})`,
    };
  },

  /**
   * 2. Get all user roadmaps
   */
  getRoadmaps: async () => {
    try {
      const res = await djangoApi.get('/skill-roadmap/list/');
      if (res.data?.success && res.data?.data?.length > 0) return res.data;
    } catch {
      // Backend offline
    }

    const current = getStoredRoadmap();
    return {
      success: true,
      data: current ? [current] : [],
    };
  },

  /**
   * 3. Fetch single roadmap detail by ID
   */
  getRoadmapDetail: async (id: string) => {
    try {
      const res = await djangoApi.get(`/skill-roadmap/${id}/`);
      if (res.data?.success) return res.data;
    } catch {
      // Backend offline
    }

    return { success: true, data: getStoredRoadmap() };
  },

  /**
   * 4. Toggle a skill's completion status
   */
  updateSkillProgress: async (roadmapId: string, data: { skill_id: string; is_completed: boolean }) => {
    try {
      const res = await djangoApi.patch(`/skill-roadmap/${roadmapId}/`, data);
      if (res.data?.success) return res.data;
    } catch {
      // Backend offline
    }

    // Local state update
    const current = getStoredRoadmap();
    if (!current) return { success: false };

    let total = 0, done = 0;
    current.sections = current.sections.map(section => ({
      ...section,
      skills: section.skills.map(skill => {
        const updated = skill.id === data.skill_id ? { ...skill, is_completed: data.is_completed } : skill;
        total++;
        if (updated.is_completed) done++;
        return updated;
      }),
    }));
    current.completion_percentage = Math.round((done / (total || 1)) * 100);
    saveStoredRoadmap(current);

    return { success: true, data: current };
  },

  /**
   * 5. SkillBot chat — Groq powered
   */
  skillbotChat: async (data: { message: string }) => {
    const activeRole = getActiveRole();

    // ── Try Django backend ──────────────────────────────────────────────
    try {
      const res = await djangoApi.post('/skill-roadmap/chat/', data);
      if (res.data?.success) return res.data;
    } catch {
      // Backend offline
    }

    // ── Fall back to Groq ──────────────────────────────────────────────
    const reply = await chatWithGroq(data.message, activeRole);

    return {
      success: true,
      data: {
        message: data.message,
        response: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    };
  },
};
