import { motion } from "framer-motion";
import { MapPin, Download, Zap, Globe, Award, Coffee } from "lucide-react";
import { SectionHeading, TiltCard, GlowOrb } from "./Shared";

const facts = [
  { icon: MapPin, label: "Based in", value: "Lisbon / Remote" },
  { icon: Zap, label: "Focus", value: "3D & Creative Dev" },
  { icon: Globe, label: "Languages", value: "EN · PT · DE" },
  { icon: Coffee, label: "Fuel", value: "Espresso ×4/day" },
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-36">
      <GlowOrb className="left-[-200px] top-1/3 h-[500px] w-[500px] bg-violet-600/15" />
      <GlowOrb className="right-[-150px] top-10 h-[400px] w-[400px] bg-cyan-500/10" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="01"
          label="ABOUT ME"
          title="Design-obsessed engineer with a"
          accent="3D obsession."
          desc="For 8 years I've lived at the intersection of design and engineering — turning wild creative concepts into blazing-fast, production-grade web experiences."
        />

        <div className="grid items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Portrait 3D card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="perspective-1000"
          >
            <TiltCard max={8} className="card-glare group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent">
              <div className="relative h-72 overflow-hidden md:h-80">
                <img
                  src="/images/avatar.jpg"
                  alt="Aiden Cross portrait"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1a] via-transparent to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="font-mono text-[11px] tracking-wider text-zinc-200">OPEN TO WORK</span>
                </div>
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <div>
                    <div className="font-display text-2xl font-extrabold">Aiden Cross</div>
                    <div className="font-mono text-xs text-violet-300">creative developer · est. 2017</div>
                  </div>
                  <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Award className="h-5 w-5 text-amber-300" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 p-5">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
                    <f.icon className="h-4 w-4 shrink-0 text-violet-300" />
                    <div className="leading-tight">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{f.label}</div>
                      <div className="text-sm font-semibold">{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 px-5 pb-5">
                <a href="#contact" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-bold transition-all hover:shadow-[0_0_30px_-6px_rgba(139,92,246,0.8)]">
                  Let's collaborate
                </a>
                <button className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:border-violet-400/50">
                  <Download className="h-4 w-4" /> CV
                </button>
              </div>
              {/* 3D depth layer */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
            </TiltCard>
          </motion.div>

          {/* Text + journey pills */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="card-glare rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm md:p-9"
            >
              <p className="font-display text-xl font-medium leading-relaxed md:text-2xl">
                "I believe the web should feel{" "}
                <span className="text-gradient font-extrabold">tangible</span> — something you
                can grab, spin and explore. That's why every pixel I ship has{" "}
                <span className="text-white underline decoration-violet-500 decoration-2 underline-offset-4">depth, physics & soul</span>."
              </p>
              <p className="mt-5 leading-relaxed text-zinc-400">
                What started as slicing PSDs in 2017 became a deep dive into shaders, 3D math
                and interaction design. Today I help ambitious brands stand out with sites
                people remember — built on React, Three.js and an unreasonable attention to detail.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["React Three Fiber", "GLSL Shaders", "Design Systems", "Motion", "WebXR", "AI UI"].map((t) => (
                  <span key={t} className="font-mono rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { n: "98", s: "/100 avg. Lighthouse", d: "Performance is a feature. My 3D scenes stream, instance and LOD their way to green scores.", g: "from-cyan-400 to-blue-600" },
                { n: "3.2×", s: "avg. engagement lift", d: "Immersive storytelling keeps visitors exploring — and buying — dramatically longer.", g: "from-fuchsia-500 to-violet-600" },
              ].map((c, i) => (
                <motion.div
                  key={c.n}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
                >
                  <TiltCard max={10} className="card-glare h-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6">
                    <div className={`font-display inline-block bg-gradient-to-r ${c.g} bg-clip-text text-5xl font-extrabold text-transparent`}>
                      {c.n}
                    </div>
                    <div className="font-mono mt-1 text-xs uppercase tracking-widest text-zinc-400">{c.s}</div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{c.d}</p>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
