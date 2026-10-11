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
const GROQ_API_KEY = (import.meta.env.VITE_GROQ_API_KEY as string) || '';
const GROQ_MODEL   = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
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

// ─── Rich Default Roadmap Template ──────────────────────────────────────────
export const DEFAULT_AI_ROADMAP: RoadmapData = {
  id: "rdm-default-ai",
  role: "AI Engineer",
  level: "intermediate",
  created_at: new Date().toISOString(),
  completion_percentage: 33,
  sections: [
    {
      id: "sec-1-ai",
      title: "1. Foundational Mathematics & Data Systems",
      description: "Mathematical foundations and vector manipulation essential for AI system engineering.",
      skills: [
        {
          id: "sk-101",
          name: "Linear Algebra & Matrix Operations",
          description: "Vectors, dot products, eigenvalues, SVD, and GPU tensor acceleration in PyTorch and NumPy.",
          is_completed: true,
          resources: [
            { name: "3Blue1Brown - Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type: "video" },
            { name: "Khan Academy - Linear Algebra", url: "https://www.khanacademy.org/math/linear-algebra", type: "course" }
          ]
        },
        {
          id: "sk-102",
          name: "Multivariable Calculus & Gradient Descent",
          description: "Partial derivatives, chain rule, backpropagation dynamics, and AdamW optimization routines.",
          is_completed: true,
          resources: [
            { name: "3Blue1Brown - Neural Networks & Backprop", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "video" },
            { name: "Deep Learning Book - Numerical Computation", url: "https://www.deeplearningbook.org/contents/numerical.html", type: "docs" }
          ]
        },
        {
          id: "sk-103",
          name: "Probability, Statistics & Entropy",
          description: "Probability distributions, maximum likelihood estimation, KL-divergence, and cross-entropy loss.",
          is_completed: false,
          resources: [
            { name: "StatQuest with Josh Starmer", url: "https://www.youtube.com/c/joshstarmer", type: "video" },
            { name: "Harvard Stat 110: Introduction to Probability", url: "https://projects.iq.harvard.edu/stat110", type: "course" }
          ]
        }
      ]
    },
    {
      id: "sec-2-ai",
      title: "2. Deep Learning & Transformer Architectures",
      description: "State-of-the-art neural architectures, attention mechanisms, and deep model implementation.",
      skills: [
        {
          id: "sk-201",
          name: "PyTorch Framework & Custom Module Training",
          description: "Building production deep learning models, DataLoaders, custom loss functions, and mixed precision.",
          is_completed: true,
          resources: [
            { name: "Official PyTorch Documentation & Tutorials", url: "https://pytorch.org/tutorials/", type: "docs" },
            { name: "Fast.ai - Practical Deep Learning for Coders", url: "https://course.fast.ai/", type: "course" }
          ]
        },
        {
          id: "sk-202",
          name: "Self-Attention & Transformer Architecture",
          description: "Multi-head scaled dot-product attention, positional embeddings, RoPE, and causal masking.",
          is_completed: false,
          resources: [
            { name: "The Illustrated Transformer - Jay Alammar", url: "http://jalammar.github.io/illustrated-transformer/", type: "docs" },
            { name: "Attention Is All You Need (Original Paper)", url: "https://arxiv.org/abs/1706.03762", type: "docs" }
          ]
        },
        {
          id: "sk-203",
          name: "Hugging Face Ecosystem & Tokenizers",
          description: "Transformers library, Byte-Pair Encoding (BPE), safetensors, model hub, and pipeline inference.",
          is_completed: false,
          resources: [
            { name: "Hugging Face NLP Course", url: "https://huggingface.co/learn/nlp-course", type: "course" }
          ]
        }
      ]
    },
    {
      id: "sec-3-ai",
      title: "3. Large Language Models, RAG & Vector Systems",
      description: "Building production Retrieval-Augmented Generation, vector embeddings, and LLM applications.",
      skills: [
        {
          id: "sk-301",
          name: "Vector Databases & Hybrid Semantic Retrieval",
          description: "Qdrant, Pinecone, Chroma, HNSW indexing, chunking strategies, dense/sparse hybrid search, and reranking.",
          is_completed: false,
          resources: [
            { name: "Pinecone Vector Search Architecture Guide", url: "https://www.pinecone.io/learn/", type: "docs" },
            { name: "Qdrant Vector Search Docs", url: "https://qdrant.tech/documentation/", type: "docs" }
          ]
        },
        {
          id: "sk-302",
          name: "LLM Fine-Tuning & Quantization (LoRA / QLoRA)",
          description: "Parameter-efficient fine-tuning (PEFT), SFTTrainer, 4-bit/8-bit quantization with BitsAndBytes and Unsloth.",
          is_completed: false,
          resources: [
            { name: "Hugging Face PEFT Documentation", url: "https://huggingface.co/docs/peft", type: "docs" },
            { name: "Unsloth AI Ultra-Fast Fine-Tuning", url: "https://github.com/unslothai/unsloth", type: "docs" }
          ]
        },
        {
          id: "sk-303",
          name: "Agentic Workflows & Tool-Calling (MCP / LangGraph)",
          description: "ReAct reasoning loops, Model Context Protocol (MCP), structured JSON function calling, and state machines.",
          is_completed: false,
          resources: [
            { name: "Model Context Protocol Specification", url: "https://modelcontextprotocol.io/", type: "docs" },
            { name: "LangGraph Multi-Agent Architecture", url: "https://langchain-ai.github.io/langgraph/", type: "docs" }
          ]
        }
      ]
    },
    {
      id: "sec-4-ai",
      title: "4. MLOps, vLLM Deployment & Production Serving",
      description: "Serving high-throughput models, GPU memory management, and enterprise telemetry.",
      skills: [
        {
          id: "sk-401",
          name: "High-Throughput Inference with vLLM / Ollama",
          description: "PagedAttention memory allocation, continuous batching, streaming token APIs, and FP8/AWQ engines.",
          is_completed: false,
          resources: [
            { name: "vLLM Production Deployment Guide", url: "https://docs.vllm.ai/", type: "docs" }
          ]
        },
        {
          id: "sk-402",
          name: "LLM Observability, Evaluation & Guardrails",
          description: "Trace instrumentation with Langfuse, RAGAS automated eval, NeMo Guardrails, and latency/cost telemetry.",
          is_completed: false,
          resources: [
            { name: "Langfuse Open Source LLM Engineering", url: "https://langfuse.com/docs", type: "docs" },
            { name: "Ragas Framework for RAG Evaluation", url: "https://docs.ragas.io/", type: "docs" }
          ]
        }
      ]
    }
  ]
};

// ─── Groq LLM generation ───────────────────────────────────────────────────
async function generateRoadmapWithGroq(role: string, level: string): Promise<RoadmapData> {
  const prompt = `Generate a detailed, professional learning roadmap for the role of "${role}" at a "${level}" level.

Structure the roadmap into 4-5 sections (e.g. Foundational Concepts, Core Skills, Advanced Topics, Tools & Ecosystem, Interview Prep).
Each section should contain 3-4 specific skills or topics.
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

  const modelsToTry = [
    GROQ_MODEL,
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768'
  ];

  let raw = '';

  for (const model of modelsToTry) {
    try {
      const res = await groqApi.post('', {
        model,
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
      raw = res.data.choices[0].message.content;
      if (raw) break;
    } catch {
      // try next model
    }
  }

  if (!raw) {
    // If Groq is completely unavailable or rate limited, build an intelligent structured roadmap based on the role
    return generateFallbackRoadmap(role, level);
  }

  let parsed: any;
  try {
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return generateFallbackRoadmap(role, level);
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
        name: r.name || 'Documentation',
        url: r.url || 'https://developer.mozilla.org',
        type: r.type || 'docs',
      })),
    })),
  }));

  const allSkills = sections.flatMap(s => s.skills);
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

function generateFallbackRoadmap(role: string, level: string): RoadmapData {
  const id = `rdm-${Date.now()}`;
  return {
    id,
    role,
    level,
    created_at: new Date().toISOString(),
    completion_percentage: 0,
    sections: [
      {
        id: `sec-1-${id}`,
        title: `1. Foundational Core for ${role}`,
        description: `Essential background principles, core syntax, and theoretical paradigms at ${level} level.`,
        skills: [
          {
            id: `sk-101-${id}`,
            name: `${role} Fundamentals & Architecture`,
            description: `Master standard conventions, project structure, design patterns, and industry toolchains.`,
            is_completed: false,
            resources: [
              { name: "Official Documentation & Reference", url: "https://developer.mozilla.org", type: "docs" },
              { name: "FreeCodeCamp Complete Curriculum", url: "https://www.freecodecamp.org", type: "course" }
            ]
          },
          {
            id: `sk-102-${id}`,
            name: `Environment Setup & Version Control (Git/GitHub)`,
            description: `Branching strategies, CI/CD automated workflows, and production deployment environments.`,
            is_completed: false,
            resources: [
              { name: "Pro Git Official Book", url: "https://git-scm.com/book/en/v2", type: "docs" },
              { name: "GitHub Skills Interactive Labs", url: "https://skills.github.com", type: "practice" }
            ]
          }
        ]
      },
      {
        id: `sec-2-${id}`,
        title: `2. Applied Implementation & Production Patterns`,
        description: `Hands-on development of scalable modules, API design, and system integration.`,
        skills: [
          {
            id: `sk-201-${id}`,
            name: `Core Framework & Component Engineering`,
            description: `Writing idiomatic, clean, modular code with automated testing and type safety.`,
            is_completed: false,
            resources: [
              { name: "Official Framework Guidelines", url: "https://react.dev", type: "docs" },
              { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "course" }
            ]
          },
          {
            id: `sk-202-${id}`,
            name: `Data Layer, APIs & State Management`,
            description: `Asynchronous data pipelines, caching layers, REST/GraphQL integration, and reactivity.`,
            is_completed: false,
            resources: [
              { name: "MDN Web Docs - Asynchronous Programming", url: "https://developer.mozilla.org", type: "docs" }
            ]
          }
        ]
      },
      {
        id: `sec-3-${id}`,
        title: `3. Advanced Optimization, Security & Interview Prep`,
        description: `Performance tuning, observability, enterprise security, and executive interview readiness.`,
        skills: [
          {
            id: `sk-301-${id}`,
            name: `Performance Profiling & Observability`,
            description: `Memory diagnostics, network optimization, latency reduction, and production monitoring.`,
            is_completed: false,
            resources: [
              { name: "Web Dev Performance Metrics", url: "https://web.dev/explore/metrics", type: "docs" }
            ]
          },
          {
            id: `sk-302-${id}`,
            name: `Technical Portfolio & Senior Interview Case Studies`,
            description: `Architectural whiteboarding, trade-off defense, STAR scenario articulation, and live coding.`,
            is_completed: false,
            resources: [
              { name: "LeetCode Technical Interview Bank", url: "https://leetcode.com", type: "practice" }
            ]
          }
        ]
      }
    ]
  };
}

// ─── SkillBot Groq chat ────────────────────────────────────────────────────
async function chatWithGroq(message: string, activeRole: string): Promise<string> {
  const modelsToTry = [
    'llama-3.1-8b-instant',
    GROQ_MODEL,
    'llama-3.3-70b-versatile'
  ];

  for (const model of modelsToTry) {
    try {
      const res = await groqApi.post('', {
        model,
        messages: [
          {
            role: 'system',
            content: `You are SkillBot, an elite AI career advisor and technical coach specializing in the "${activeRole}" career path. Give razor-sharp, actionable, and encouraging advice in 2-3 sentences.`,
          },
          { role: 'user', content: message },
        ],
        temperature: 0.8,
        max_tokens: 300,
      });

      if (res.data?.choices?.[0]?.message?.content) {
        return res.data.choices[0].message.content.trim();
      }
    } catch {
      // try next model
    }
  }

  // Graceful conversational response if API is unreachable
  return `To excel as a ${activeRole}, prioritize the milestones in Section 1 to build rock-solid fundamentals before moving to advanced architecture. Make sure to tick off each skill and practice with the linked documentation!`;
}

// ─── localStorage helpers ──────────────────────────────────────────────────
function getActiveRole(): string {
  const stored = getStoredRoadmap();
  return stored?.role || 'AI Engineer';
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
    if (current) {
      return {
        success: true,
        data: [current],
      };
    }

    // If first time visit, seed with our default AI roadmap
    saveStoredRoadmap(DEFAULT_AI_ROADMAP);
    return {
      success: true,
      data: [DEFAULT_AI_ROADMAP],
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

    return { success: true, data: getStoredRoadmap() || DEFAULT_AI_ROADMAP };
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
    const current = getStoredRoadmap() || DEFAULT_AI_ROADMAP;

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
