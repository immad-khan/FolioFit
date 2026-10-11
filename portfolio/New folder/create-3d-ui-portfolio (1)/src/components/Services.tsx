import { motion } from "framer-motion";
import { Boxes, Code2, PenTool, Sparkles, Check, ArrowUpRight } from "lucide-react";
import { SectionHeading, TiltCard, GlowOrb } from "./Shared";
import { services } from "../data/portfolio";

const icons: Record<string, typeof Boxes> = { Boxes, Code2, PenTool, Sparkles };

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/[0.06] to-transparent" />
      <GlowOrb className="left-1/3 top-10 h-[380px] w-[520px] bg-violet-600/10" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="04"
          label="SERVICES"
          title="What I can build"
          accent="for you."
          desc="End-to-end product craft — from first sketch to deployed, instrumented, award-chasing launch."
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <TiltCard max={9} className="h-full">
                  <div className="card-glare group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-7 transition-all duration-500 hover:border-violet-400/40 hover:shadow-[0_20px_60px_-20px_rgba(139,92,246,0.5)]">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/15 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-violet-500/25" />
                    <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-600/30 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="font-display relative text-xl font-extrabold tracking-tight">{s.title}</h3>
                    <p className="relative mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{s.desc}</p>
                    <ul className="relative mt-5 space-y-2.5 border-t border-white/8 pt-5">
                      {s.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-2.5 text-[13px] text-zinc-300">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                            <Check className="h-3 w-3 text-emerald-300" strokeWidth={3} />
                          </span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <a href="#contact" className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-violet-300 transition-all hover:gap-3">
                      Start a project <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* process strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 grid gap-4 overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur md:grid-cols-4 md:p-8"
        >
          {[
            { n: "01", t: "Discover", d: "Workshops, moodboards & 3D styleframes" },
            { n: "02", t: "Design", d: "Figma systems + interactive prototypes" },
            { n: "03", t: "Build", d: "React + Three.js, weekly demos" },
            { n: "04", t: "Launch", d: "Optimize, deploy, monitor & iterate" },
          ].map((p, i) => (
            <div key={p.n} className="relative flex gap-4">
              <span className="font-display text-4xl font-extrabold text-white/10">{p.n}</span>
              <div>
                <div className="font-bold">{p.t}</div>
                <div className="mt-1 text-[13px] leading-snug text-zinc-500">{p.d}</div>
              </div>
              {i < 3 && <span className="absolute right-0 top-2 hidden h-10 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:block" />}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
