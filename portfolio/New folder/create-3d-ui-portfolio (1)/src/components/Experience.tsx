import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Trophy, Download, MapPin } from "lucide-react";
import { SectionHeading, GlowOrb } from "./Shared";
import { experience } from "../data/portfolio";

export default function Experience() {
  return (
    <section id="journey" className="relative overflow-hidden py-24 md:py-36">
      <GlowOrb className="right-[-140px] bottom-20 h-[440px] w-[440px] bg-fuchsia-600/10" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="05"
          label="JOURNEY"
          title="Eight years of"
          accent="shipping & learning."
          desc="From freelance hustler to leading WebGL teams — every role sharpened a different superpower."
        />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Timeline */}
          <div className="relative">
            <div className="absolute bottom-8 left-[19px] top-2 w-px bg-gradient-to-b from-violet-500 via-cyan-400/60 to-transparent md:left-[23px]" />
            <div className="flex flex-col gap-6">
              {experience.map((e, i) => (
                <motion.div
                  key={e.company}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="relative pl-14 md:pl-16"
                >
                  {/* node */}
                  <span className={`absolute left-[11px] top-6 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 md:left-[15px] ${e.current ? "border-emerald-400 bg-emerald-400/20" : "border-violet-400/60 bg-[#0b0b16]"}`}>
                    {e.current ? (
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    )}
                  </span>

                  <div className="card-glare group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-violet-400/35 hover:bg-white/[0.05] md:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className={`font-mono rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider ${e.current ? "bg-emerald-400/15 text-emerald-300" : "bg-violet-500/15 text-violet-300"}`}>
                        {e.period}
                      </span>
                      <span className="font-mono flex items-center gap-1.5 text-xs text-zinc-500">
                        <MapPin className="h-3.5 w-3.5" /> {e.location}
                      </span>
                    </div>
                    <h3 className="font-display mt-4 text-xl font-extrabold md:text-2xl">{e.role}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-cyan-300">
                      <Briefcase className="h-4 w-4" /> {e.company}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{e.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {e.tags.map((t) => (
                        <span key={t} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Side cards */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="card-glare overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-violet-600/20 to-transparent p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600">
                  <Trophy className="h-5 w-5 text-white" />
                </span>
                <h3 className="font-display text-lg font-extrabold">Awards & honors</h3>
              </div>
              <ul className="mt-5 space-y-4">
                {[
                  { a: "Awwwards — Site of the Day ×3", y: "2024–26" },
                  { a: "FWA — of the Day ×2", y: "2023–25" },
                  { a: "CSSDA — Website of the Year nominee", y: "2025" },
                  { a: "Webby Awards — Honoree", y: "2025" },
                ].map((a) => (
                  <li key={a.a} className="flex items-start justify-between gap-3 border-b border-white/8 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm font-medium leading-snug">{a.a}</span>
                    <span className="font-mono shrink-0 text-xs text-zinc-500">{a.y}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="card-glare rounded-3xl border border-white/10 bg-white/[0.03] p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600">
                  <GraduationCap className="h-5 w-5 text-white" />
                </span>
                <h3 className="font-display text-lg font-extrabold">Education</h3>
              </div>
              <ul className="mt-5 space-y-4">
                <li>
                  <div className="text-sm font-bold">MSc Computer Graphics</div>
                  <div className="text-[13px] text-zinc-500">TU Delft — 2015–2017</div>
                </li>
                <li>
                  <div className="text-sm font-bold">BSc Media Technology</div>
                  <div className="text-[13px] text-zinc-500">Leiden University — 2012–2015</div>
                </li>
              </ul>
              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm font-bold transition-all hover:border-violet-400/50 hover:bg-violet-500/15">
                <Download className="h-4 w-4" /> Download full résumé
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="ring-conic rounded-3xl p-[1.5px]"
            >
              <div className="rounded-[22px] bg-[#08080f] p-7 text-center">
                <div className="font-display text-4xl font-extrabold">Let's talk</div>
                <p className="mt-2 text-sm text-zinc-400">Currently booking Q4 2026 — 2 slots left.</p>
                <a href="#contact" className="mt-5 block rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black transition-all hover:bg-violet-200">
                  Check availability
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
