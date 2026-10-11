import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1950;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-ink px-6 py-8 md:px-12 md:py-10"
      exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="noise" aria-hidden />

      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/50">
        <span>Arden Vale</span>
        <span>Portfolio ©2026</span>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="overflow-hidden">
          <motion.p
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="font-display text-2xl font-bold uppercase tracking-tight md:text-4xl"
          >
            Crafting <span className="text-accent">3D</span> reality
          </motion.p>
        </div>
        <div className="h-px w-40 overflow-hidden bg-white/10 md:w-64">
          <motion.div
            className="h-full bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: count / 100 }}
            style={{ transformOrigin: "left" }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span className="max-w-[220px] text-[11px] uppercase leading-relaxed tracking-[0.25em] text-white/40">
          Loading shaders, meshes & good vibes
        </span>
        <span className="font-display text-7xl font-extrabold leading-none text-white md:text-9xl">
          {count}
          <span className="text-accent">%</span>
        </span>
      </div>
    </motion.div>
  );
}
