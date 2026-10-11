import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ExternalLink, ChevronRight, Calendar, Layers } from "lucide-react";
import { SectionHeading, TiltCard, GlowOrb } from "./Shared";
import { projects, type Project } from "../data/portfolio";

const filters = ["All", "3D & WebGL", "E-Commerce", "UI/UX", "AI & Creative"];

export default function Projects() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="work" className="relative overflow-hidden py-24 md:py-36">
      <GlowOrb className="right-[-180px] top-1/4 h-[520px] w-[520px] bg-violet-600/12" />
      <GlowOrb className="left-[-160px] bottom-0 h-[420px] w-[420px] bg-cyan-500/8" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="03"
          label="SELECTED WORK"
          title="Worlds I've shipped into"
          accent="production."
          desc="Six flagship builds — each one a deep dive into 3D, motion and conversion. Click any project to open the case file."
        />

        {/* filters */}
        <div className="mb-10 flex flex-wrap gap-2.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                active === f
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/40"
                  : "glass text-zinc-400 hover:border-violet-400/40 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="font-mono ml-auto hidden items-center text-xs text-zinc-500 md:inline-flex">
            {filtered.length} / {projects.length} PROJECTS
          </span>
        </div>

        {/* grid */}
        <motion.div layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={i === 0 ? "md:col-span-2" : ""}
              >
                <TiltCard max={i === 0 ? 4 : 7} className="h-full">
                  <div
                    onClick={() => setSelected(p)}
                    className={`card-glare group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b16] transition-all duration-500 hover:border-violet-400/40 hover:shadow-[0_20px_80px_-20px_rgba(139,92,246,0.45)] ${
                      i === 0 ? "md:grid md:grid-cols-2" : ""
                    }`}
                  >
                    <div className={`relative overflow-hidden ${i === 0 ? "h-72 md:h-full md:min-h-[380px]" : "h-60"}`}>
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b16] via-[#0b0b16]/20 to-transparent" />
                      <div className="absolute left-5 top-5 flex gap-2">
                        <span className={`rounded-full bg-gradient-to-r px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white ${p.color}`}>
                          {p.category}
                        </span>
                        <span className="glass rounded-full px-3 py-1.5 text-[11px] font-semibold text-zinc-200">{p.year}</span>
                      </div>
                      <div className="absolute bottom-5 right-5 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                    </div>
                    <div className={`p-6 md:p-8 ${i === 0 ? "flex flex-col justify-center" : ""}`}>
                      <div className="font-mono text-xs tracking-[0.25em] text-violet-300/80">{p.subtitle.toUpperCase()}</div>
                      <h3 className="font-display mt-2 text-2xl font-extrabold tracking-tight transition-colors group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-violet-300 md:text-3xl">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-[15px]">{p.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {p.tags.slice(0, 4).map((t) => (
                          <span key={t} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-violet-300">
                        Open case study
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl sm:rounded-3xl"
            >
              <div className="relative h-64 md:h-80">
                <img src={selected.image} alt={selected.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b16] via-transparent to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="glass-strong absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full transition-all hover:rotate-90 hover:border-rose-400/50"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-5 left-6 right-6 md:left-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${selected.color}`}>
                      {selected.category}
                    </span>
                    <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px]">
                      <Calendar className="h-3 w-3" /> {selected.year}
                    </span>
                    <span className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px]">
                      <Layers className="h-3 w-3" /> {selected.tags.length} technologies
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-3xl font-extrabold md:text-4xl">{selected.title}</h3>
                  <p className="font-mono text-xs tracking-widest text-violet-300">{selected.subtitle.toUpperCase()}</p>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <p className="leading-relaxed text-zinc-300">{selected.longDescription}</p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {selected.stats.map((s) => (
                    <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                      <div className="font-display text-xl font-extrabold text-white md:text-2xl">{s.value}</div>
                      <div className="font-mono mt-1 text-[10px] uppercase tracking-widest text-zinc-500">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <span key={t} className="font-mono rounded-lg border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={selected.link} onClick={(e) => e.preventDefault()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black transition-all hover:bg-violet-200">
                    Visit live site <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => {
                      const idx = projects.findIndex((p) => p.id === selected.id);
                      setSelected(projects[(idx + 1) % projects.length]);
                    }}
                    className="glass inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold transition-all hover:border-violet-400/50"
                  >
                    Next project <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
