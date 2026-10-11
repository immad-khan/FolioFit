import { motion } from "framer-motion";
import { Atom, Triangle, Braces, Layers, Hexagon, Box } from "lucide-react";
import { SectionHeading, GlowOrb } from "./Shared";
import { skills } from "../data/portfolio";

const cubeFaces = [
  { icon: Atom, label: "REACT", color: "text-cyan-300", t: "translateZ(70px)" },
  { icon: Box, label: "THREE.JS", color: "text-violet-300", t: "rotateY(180deg) translateZ(70px)" },
  { icon: Triangle, label: "WEBGL", color: "text-fuchsia-300", t: "rotateY(90deg) translateZ(70px)" },
  { icon: Braces, label: "TYPESCRIPT", color: "text-blue-300", t: "rotateY(-90deg) translateZ(70px)" },
  { icon: Layers, label: "GSAP", color: "text-amber-300", t: "rotateX(90deg) translateZ(70px)" },
  { icon: Hexagon, label: "NODE", color: "text-emerald-300", t: "rotateX(-90deg) translateZ(70px)" },
];

export default function Skills() {
  return (
    <section id="stack" className="relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/[0.07] to-transparent" />
      <GlowOrb className="left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 bg-fuchsia-600/10" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="02"
          label="TECH ARSENAL"
          title="A stack built for"
          accent="depth & speed."
          desc="Battle-tested tools I use to ship cinematic, 60fps experiences — from shader math to edge-deployed backends."
        />

        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* 3D Cube */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
            className="relative mx-auto flex h-[380px] w-full max-w-[420px] items-center justify-center"
          >
            {/* glow rings */}
            <div className="absolute h-64 w-64 animate-spin-slower rounded-full border border-dashed border-violet-400/25" />
            <div className="absolute h-80 w-80 animate-spin-slow rounded-full border border-cyan-400/15" />
            <div className="absolute h-40 w-40 rounded-full bg-violet-600/25 blur-[80px]" />

            <div className="cube-scene">
              <div className="cube relative h-[140px] w-[140px]">
                {cubeFaces.map((f) => (
                  <div
                    key={f.label}
                    className="cube-face rounded-2xl"
                    style={{ transform: f.t }}
                  >
                    <f.icon className={`h-8 w-8 ${f.color}`} strokeWidth={1.6} />
                    <span className="text-[11px] font-bold tracking-[0.2em] text-white/90">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* floating chips */}
            <div className="glass absolute left-2 top-8 animate-float rounded-xl px-3 py-2">
              <span className="font-mono text-xs text-cyan-300">▲ 120fps</span>
            </div>
            <div className="glass absolute bottom-10 right-2 animate-float-delayed rounded-xl px-3 py-2">
              <span className="font-mono text-xs text-fuchsia-300">◈ GLSL live</span>
            </div>
          </motion.div>

          {/* Skill bars */}
          <div className="flex flex-col gap-5">
            {skills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="card-glare group rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition-colors hover:border-violet-400/30"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-[13px] font-bold text-white ${s.color}`}>
                      {s.icon}
                    </span>
                    <span className="font-semibold">{s.name}</span>
                  </div>
                  <span className="font-display text-xl font-extrabold text-white/90">{s.level}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full bg-gradient-to-r ${s.color} shadow-[0_0_16px_rgba(139,92,246,0.5)]`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* tool strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          {["Vite", "Tailwind", "Framer Motion", "Zustand", "Blender", "Figma", "Spline", "Vercel", "Supabase", "Liveblocks", "Rive", "Sanity"].map((t) => (
            <span
              key={t}
              className="cursor-default rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-300 backdrop-blur transition-all hover:-translate-y-1 hover:border-cyan-400/40 hover:text-white hover:shadow-[0_8px_24px_-8px_rgba(34,211,238,0.5)]"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
