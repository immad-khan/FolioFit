import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { SectionHeading, GlowOrb } from "./Shared";
import { testimonials } from "../data/portfolio";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const t = setInterval(() => go(1), 6500);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[index];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <GlowOrb className="left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-violet-600/10" />
      <div className="relative mx-auto max-w-5xl px-4 md:px-8">
        <SectionHeading
          index="06"
          label="LOVE LETTERS"
          title="Clients who took the"
          accent="3D leap."
        />

        <div className="perspective-1500 relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 120, rotateY: dir * 12 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: dir * -120, rotateY: dir * -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="card-glare relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-8 backdrop-blur md:p-12"
            >
              <Quote className="absolute right-8 top-8 h-16 w-16 text-white/5" />
              <div className="mb-5 flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-300 text-amber-300" />
                ))}
              </div>
              <blockquote className="font-display max-w-3xl text-xl font-medium leading-relaxed md:text-2xl">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className={`font-display flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-extrabold text-white ${t.color}`}>
                  {t.initials}
                </span>
                <span>
                  <span className="block font-bold">{t.name}</span>
                  <span className="font-mono text-xs text-zinc-500">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          {/* controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-10 bg-gradient-to-r from-violet-500 to-cyan-400" : "w-2 bg-white/15 hover:bg-white/30"}`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => go(-1)} aria-label="Previous" className="glass flex h-12 w-12 items-center justify-center rounded-full transition-all hover:border-violet-400/50 hover:bg-violet-500/20">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => go(1)} aria-label="Next" className="glass flex h-12 w-12 items-center justify-center rounded-full transition-all hover:border-violet-400/50 hover:bg-violet-500/20">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
