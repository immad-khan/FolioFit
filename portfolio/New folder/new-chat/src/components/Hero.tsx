import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowDown, Asterisk, MapPin } from "lucide-react";
import Scene3D from "./Scene3D";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};

const lineUp: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1.1, ease: EASE } },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const STATS = [
  { value: "06+", label: "Years exp." },
  { value: "48", label: "Projects shipped" },
  { value: "12", label: "Awards won" },
];

export default function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative flex min-h-screen flex-col overflow-hidden">
      {/* glowing aura behind the 3D scene */}
      <div className="absolute right-[-10%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-accent/10 blur-[140px]" />
      <div className="absolute left-[-15%] bottom-[-10%] h-[50vh] w-[50vh] rounded-full bg-violet-soft/10 blur-[140px]" />

      <Scene3D />

      <motion.div
        style={{ y: yText, opacity }}
        variants={container}
        initial="hidden"
        animate={started ? "show" : "hidden"}
        className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between px-6 pb-10 pt-28 md:px-12 md:pt-32"
      >
        {/* kicker */}
        <motion.div variants={fade} className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-white/50">
            <Asterisk className="h-4 w-4 animate-spin-slower text-accent" />
            Folio — 2026
          </p>
          <p className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-white/50 md:flex">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            Based everywhere / Working worldwide
          </p>
        </motion.div>

        {/* headline */}
        <div className="mt-6 md:mt-0">
          <h1 className="font-display font-extrabold uppercase leading-[0.85] tracking-tight">
            <span className="block overflow-hidden pb-1">
              <motion.span variants={lineUp} className="block text-[clamp(3.2rem,12.5vw,11.5rem)]">
                Creative
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                variants={lineUp}
                className="text-outline block text-[clamp(3.2rem,12.5vw,11.5rem)]"
              >
                3D<span className="text-accent [-webkit-text-stroke:0px]">.</span>Developer
              </motion.span>
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
            <motion.p variants={fade} className="max-w-md text-base leading-relaxed text-white/60 md:text-lg">
              I&apos;m <span className="text-white">Arden Vale</span> — I design & engineer immersive
              interfaces where <span className="text-accent">WebGL</span>, motion and typography collide
              into unforgettable digital experiences.
            </motion.p>

            <motion.div variants={fade} className="flex gap-10 md:gap-14">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-bold md:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-white/40">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* bottom row */}
        <motion.div variants={fade} className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/50">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15">
              <ArrowDown className="h-4 w-4 animate-float-y text-accent" />
            </span>
            Scroll to explore
          </div>
          <p className="hidden text-[11px] uppercase tracking-[0.3em] text-white/40 sm:block">
            Available for freelance — Q3 2026
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
