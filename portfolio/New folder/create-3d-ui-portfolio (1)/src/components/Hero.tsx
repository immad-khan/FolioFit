import { Suspense, lazy, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Play, Sparkles } from "lucide-react";
import { marqueeItems } from "../data/portfolio";

const socialIcons = [
  { name: "GitHub", path: "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12v3.15c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" },
  { name: "X", path: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.25 6.93 6.06-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" },
  { name: "LinkedIn", path: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" },
  { name: "Dribbble", path: "M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0Zm7.94 5.53a10.2 10.2 0 0 1 1.35 5.1c-.2-.04-2.5-.51-4.77-.22-.05-.11-.1-.22-.15-.34-.14-.34-.3-.7-.46-1.04 2.55-1.04 3.68-2.53 4.03-3.5ZM12 1.77c2.6 0 4.98.98 6.78 2.58-.3.9-1.3 2.2-3.6 3.12A52.7 52.7 0 0 0 11.9 1.8c.03 0 .07-.03.1-.03ZM7.62 2.76a53.3 53.3 0 0 1 3.28 5.66c-4.11 1.1-8.2 1.08-8.56 1.08a10.24 10.24 0 0 1 5.28-6.74ZM1.77 12v-.31c.35.01 4.87.06 9.47-1.32.26.51.51 1.03.75 1.56l-.36.11c-4.77 1.54-7.3 5.75-7.51 6.2A10.2 10.2 0 0 1 1.77 12Zm10.23 10.23c-2.48 0-4.76-.9-6.53-2.38.17-.42 2.17-4.13 7.5-6.01l.06-.02a37.7 37.7 0 0 1 1.9 6.7c-.92.47-1.9.71-2.93.71Zm4.63-1.37c-.5-1.6-1.15-3.9-1.7-6.02 2.12-.34 4 .22 4.24.29a10.27 10.27 0 0 1-2.54 5.73Z" },
];

const Scene3D = lazy(() => import("./Scene3D"));

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  const cardX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const cardY = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const titleX = useTransform(sx, [-0.5, 0.5], [10, -10]);
  const titleY = useTransform(sy, [-0.5, 0.5], [6, -6]);

  const onMouse = (e: React.MouseEvent) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouse}
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden pt-32 md:pt-36"
    >
      {/* 3D background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(139,92,246,0.25),transparent_60%)]" />}>
        <Scene3D />
      </Suspense>
      <div className="grid-bg absolute inset-0 opacity-70" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: copy */}
        <motion.div style={{ x: titleX, y: titleY }} className="preserve-3d">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 py-1.5 pl-2 pr-4 backdrop-blur-md">
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-xs tracking-wide text-emerald-200">
              AVAILABLE FOR PROJECTS — 2026
            </span>
          </motion.div>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={1} className="font-mono mb-4 text-sm tracking-[0.3em] text-violet-300/90 md:text-base">
            {"<hello world />"} I'M
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="font-display text-[13.5vw] font-extrabold leading-[0.92] tracking-tight sm:text-7xl md:text-8xl xl:text-[6.6rem]"
          >
            AIDEN
            <br />
            <span className="text-stroke">CROSS</span>
            <span className="text-gradient">.</span>
          </motion.h1>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-display rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-bold tracking-wide shadow-lg shadow-violet-600/40 md:text-base">
              CREATIVE DEVELOPER
            </span>
            <span className="font-display rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-bold tracking-wide text-cyan-200 backdrop-blur-md md:text-base">
              3D DESIGNER
            </span>
          </motion.div>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={4} className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">
            I craft <span className="text-white">immersive 3D web experiences</span> with React,
            Three.js & WebGL — where brutalist code meets cinematic design.
            <span className="text-violet-300"> 80+ launches. 12 awards. Zero boring pixels.</span>
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-7 py-4 text-sm font-bold text-black transition-all hover:shadow-[0_0_50px_-8px_rgba(255,255,255,0.6)] md:text-base"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative transition-colors group-hover:text-white">Explore My Work</span>
              <ArrowUpRight className="relative h-5 w-5 transition-all group-hover:rotate-45 group-hover:text-white" />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-2xl px-2 py-2 text-sm font-semibold md:text-base"
            >
              <span className="glass flex h-12 w-12 items-center justify-center rounded-full transition-all group-hover:scale-110 group-hover:border-violet-400/60">
                <Play className="h-4 w-4 fill-white" />
              </span>
              <span className="text-zinc-300 underline-offset-4 group-hover:text-white group-hover:underline">
                Let's talk
              </span>
            </a>
          </motion.div>

          {/* stats */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6} className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              { v: "08+", l: "Years crafting" },
              { v: "80+", l: "Projects shipped" },
              { v: "12", l: "Global awards" },
            ].map((s) => (
              <div key={s.l} className="glass card-glare rounded-2xl px-4 py-4 text-center md:text-left">
                <div className="font-display text-2xl font-extrabold text-white md:text-3xl">{s.v}</div>
                <div className="font-mono mt-1 text-[10px] uppercase tracking-widest text-zinc-500 md:text-[11px]">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: floating 3D glass cards */}
        <motion.div style={{ x: cardX, y: cardY }} className="relative hidden h-[560px] select-none lg:block">
          {/* code card */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateY: -14 }}
            animate={{ opacity: 1, y: 0, rotateY: -8 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="glass-strong absolute left-0 top-6 w-72 animate-float rounded-2xl p-5 shadow-2xl shadow-black/60"
            style={{ transform: "perspective(1000px)" }}
          >
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="font-mono ml-2 text-[10px] text-zinc-500">scene.tsx</span>
            </div>
            <pre className="font-mono text-[11px] leading-relaxed">
              <code>
                <span className="text-fuchsia-400">{"<Float>"}</span>{"\n"}
                {"  "}<span className="text-cyan-300">{"<mesh>"}</span>{"\n"}
                {"    "}<span className="text-violet-300">{"<torusKnot />"}</span>{"\n"}
                {"    "}<span className="text-amber-300">{"<distort />"}</span>{"\n"}
                {"  "}<span className="text-cyan-300">{"</mesh>"}</span>{"\n"}
                <span className="text-fuchsia-400">{"</Float>"}</span>
              </code>
            </pre>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-400/10 px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="font-mono text-[10px] text-emerald-300">rendering @ 120fps</span>
            </div>
          </motion.div>

          {/* profile card */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateY: 12 }}
            animate={{ opacity: 1, y: 0, rotateY: 8 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="glass-strong absolute right-0 top-44 w-64 animate-float-delayed rounded-2xl p-5 text-center shadow-2xl shadow-black/60"
          >
            <div className="ring-conic mx-auto h-20 w-20 rounded-2xl p-[2px]">
              <img src="/images/avatar.jpg" alt="Aiden Cross" className="h-full w-full rounded-[14px] object-cover" />
            </div>
            <div className="font-display mt-3 text-lg font-bold">Aiden Cross</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300">based everywhere — utc±?</div>
            <div className="mt-3 flex justify-center gap-2">
              {socialIcons.map((s) => (
                <a key={s.name} href="#contact" title={s.name} className="glass flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:border-violet-400/60 hover:bg-violet-500/20">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* award chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="glass absolute bottom-10 left-10 flex animate-float items-center gap-3 rounded-2xl px-4 py-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span>
              <span className="block text-sm font-bold">Awwwards SOTD ×3</span>
              <span className="font-mono text-[10px] text-zinc-400">+ fwa / cssda honors</span>
            </span>
          </motion.div>

          {/* rotating badge */}
          <div className="absolute -top-2 right-8 h-28 w-28 animate-spin-slow">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path id="circ" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <text className="font-mono fill-zinc-400 text-[9.5px] uppercase tracking-[2.5px]">
                <textPath href="#circ">scroll to explore • 3d portfolio •</textPath>
              </text>
            </svg>
            <ArrowDown className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-violet-300" />
          </div>
        </motion.div>
      </div>

      {/* bottom marquee */}
      <div className="relative z-10 mt-14 border-y border-white/8 bg-black/40 py-4 backdrop-blur-md">
        <div className="marquee-track flex overflow-hidden">
          <div className="marquee-inner flex shrink-0 animate-marquee items-center gap-8 pr-8">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                <span className="font-display text-sm font-bold uppercase tracking-widest text-zinc-300 md:text-base">{item}</span>
                <span className="h-2 w-2 rotate-45 bg-gradient-to-br from-violet-400 to-cyan-400" />
              </span>
            ))}
          </div>
          <div aria-hidden className="marquee-inner flex shrink-0 animate-marquee items-center gap-8 pr-8">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                <span className="font-display text-sm font-bold uppercase tracking-widest text-zinc-300 md:text-base">{item}</span>
                <span className="h-2 w-2 rotate-45 bg-gradient-to-br from-violet-400 to-cyan-400" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
