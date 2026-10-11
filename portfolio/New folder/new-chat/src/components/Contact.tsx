import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";
import Marquee from "./Marquee";

const SOCIALS = ["GitHub", "LinkedIn", "X / Twitter", "Dribbble", "Instagram"];

export default function Contact() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section id="contact" className="relative scroll-mt-24 pt-28 md:pt-40">
      <Marquee
        outline
        className="border-white/5"
        items={["Let's work together", "Let's work together", "Let's work together", "Let's work together"]}
      />

      <div className="relative overflow-hidden px-6 py-24 md:px-12 md:py-36">
        <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-[160px]" />

        <div className="relative mx-auto flex max-w-[1600px] flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-white/50"
          >
            <span className="h-px w-10 bg-accent" />
            ( 05 ) — Got a project in mind?
            <span className="h-px w-10 bg-accent" />
          </motion.p>

          <h2 className="font-display font-extrabold uppercase leading-[0.88] tracking-tight">
            <Reveal>
              <span className="block text-[clamp(2.6rem,9vw,8.5rem)]">Let&apos;s build</span>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="text-outline block text-[clamp(2.6rem,9vw,8.5rem)]">something</span>
            </Reveal>
            <Reveal delay={0.2}>
              <span className="block text-[clamp(2.6rem,9vw,8.5rem)]">
                un<span className="text-accent">real</span>
              </span>
            </Reveal>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14"
          >
            <MagneticButton strength={0.45}>
              <a
                href="mailto:hello@ardenvale.studio"
                data-hover
                className="group inline-flex items-center gap-4 rounded-full border border-accent bg-accent/5 px-8 py-5 font-display text-sm font-bold uppercase tracking-[0.2em] text-accent transition-all duration-300 hover:bg-accent hover:text-black md:px-12 md:py-6 md:text-base"
              >
                hello@ardenvale.studio
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-3"
          >
            {SOCIALS.map((s) => (
              <MagneticButton key={s} strength={0.4}>
                <a
                  href="#contact"
                  aria-label={s}
                  data-hover
                  className="group/social inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white/60 transition-all duration-300 hover:border-accent hover:bg-accent hover:text-black"
                >
                  {s}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/social:rotate-45" />
                </a>
              </MagneticButton>
            ))}
          </motion.div>
        </div>
      </div>

      {/* footer */}
      <footer className="border-t border-white/10 px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 text-[10px] uppercase tracking-[0.25em] text-white/35 md:flex-row">
          <p>© 2026 Arden Vale — All rights reserved</p>
          <p className="hidden md:block">Designed & engineered in the browser</p>
          <button
            onClick={toTop}
            data-hover
            className="group flex items-center gap-2 text-white/50 transition-colors duration-300 hover:text-accent"
          >
            Back to top
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-accent">
              <ArrowUp className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      </footer>
    </section>
  );
}
