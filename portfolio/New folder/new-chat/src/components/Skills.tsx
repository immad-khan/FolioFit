import { motion } from "framer-motion";
import {
  Boxes,
  Braces,
  Code2,
  Layers,
  MonitorSmartphone,
  Palette,
  Sparkles,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const SKILLS = [
  { icon: Boxes, name: "Three.js / WebGL", level: 95, note: "Scenes, cameras, post-processing" },
  { icon: Sparkles, name: "GLSL Shaders", level: 86, note: "Custom vertex & fragment magic" },
  { icon: Code2, name: "React / Next.js", level: 92, note: "Architecture, performance, SSR" },
  { icon: Layers, name: "GSAP / Motion", level: 90, note: "Choreographed interactions" },
  { icon: Braces, name: "TypeScript", level: 88, note: "Strict, scalable, safe code" },
  { icon: Palette, name: "UI / UX Design", level: 84, note: "Systems, typography, layout" },
];

const ALSO = ["Figma", "Blender", "Tailwind CSS", "Node.js", "Framer Motion", "Zustand", "Vite", "Sanity"];

export default function Skills() {
  return (
    <section id="stack" className="relative scroll-mt-24 px-6 py-28 md:px-12 md:py-40">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />

      <div className="relative mx-auto max-w-[1600px]">
        <SectionHeading index="03" label="Stack & skills" />

        <h2 className="mb-14 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight md:mb-20 md:text-7xl">
          <Reveal>The toolbox</Reveal>{" "}
          <Reveal delay={0.1}>
            <span className="text-accent">behind</span>
          </Reveal>
          <br />
          <Reveal delay={0.18}>
            the <span className="text-outline">magic</span>
          </Reveal>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              data-hover
              className="group rounded-2xl border border-white/10 bg-panel/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 md:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-black">
                  <s.icon className="h-6 w-6" />
                </span>
                <span className="font-mono text-sm text-white/40">{s.level}%</span>
              </div>

              <h3 className="mt-5 font-display text-xl font-bold">{s.name}</h3>
              <p className="mt-1 text-sm text-white/45">{s.note}</p>

              <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, delay: 0.25 + (i % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <span className="mr-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/40">
            <MonitorSmartphone className="h-4 w-4 text-accent" />
            Also fluent in
          </span>
          {ALSO.map((t) => (
            <span
              key={t}
              data-hover
              className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-white/60 transition-colors duration-300 hover:border-accent/60 hover:text-white"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
