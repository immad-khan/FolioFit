import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeading({
  index,
  label,
  title,
  accent,
  desc,
}: {
  index: string;
  label: string;
  title: ReactNode;
  accent?: string;
  desc?: string;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-5 flex items-center gap-4"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-violet-300/80 md:text-sm">
          {"//"} {index}. {label}
        </span>
        <span className="h-px w-16 bg-gradient-to-r from-violet-500 to-transparent md:w-28" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.08 }}
        className="font-display max-w-4xl text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl"
      >
        {title}{" "}
        {accent && <span className="text-gradient">{accent}</span>}
      </motion.h2>
      {desc && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg"
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
}

export function GlowOrb({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-[120px] ${className}`}
      style={{ animation: "orbDrift 12s ease-in-out infinite" }}
    />
  );
}

export function TiltCard({
  children,
  className = "",
  max = 10,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg) translateY(-4px)`;
    el.style.setProperty("--glare-x", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--glare-y", `${(py + 0.5) * 100}%`);
  };
  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  };
  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
