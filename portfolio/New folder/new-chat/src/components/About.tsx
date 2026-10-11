import { motion } from "framer-motion";
import { ArrowDownRight, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const SERVICES = [
  "WebGL Experiences",
  "3D Product Configurators",
  "Interactive Landing Pages",
  "Motion & Interaction Design",
  "Creative Direction",
  "Shader Art",
];

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-24 px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading index="02" label="About me" />

        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* portrait */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            {/* corner brackets */}
            <span className="absolute -left-3 -top-3 h-8 w-8 border-l-2 border-t-2 border-accent" />
            <span className="absolute -right-3 -top-3 h-8 w-8 border-r-2 border-t-2 border-accent" />
            <span className="absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-accent" />

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-panel" data-hover>
              <img
                src="/images/portrait.png"
                alt="Arden Vale — 3D portrait"
                className="h-[420px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 md:h-[540px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="font-display text-xl font-bold">Arden Vale</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">Creative Technologist</p>
                </div>
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
            </div>

            {/* rotating badge */}
            <div className="absolute -bottom-8 -right-4 h-28 w-28 md:-right-10 md:h-36 md:w-36">
              <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slower">
                <defs>
                  <path id="badge-circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                </defs>
                <circle cx="50" cy="50" r="49" className="fill-ink stroke-white/15" strokeWidth="0.75" />
                <text className="fill-white/70 text-[8px] uppercase" style={{ letterSpacing: "0.22em" }}>
                  <textPath href="#badge-circle">open to work — let's talk — open to work —</textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <ArrowDownRight className="h-6 w-6 text-accent" />
              </div>
            </div>
          </motion.div>

          {/* copy */}
          <div>
            <h2 className="font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight md:text-6xl">
              <Reveal>Turning pixels</Reveal>{" "}
              <Reveal delay={0.08}>
                into <span className="text-accent">living,</span>
              </Reveal>{" "}
              <Reveal delay={0.16}>
                <span className="text-outline">breathing</span> 3D
              </Reveal>{" "}
              <Reveal delay={0.24}>experiences</Reveal>
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 space-y-5 text-base leading-relaxed text-white/55 md:text-lg"
            >
              <p>
                For the past 6 years I&apos;ve been obsessing over the intersection of design and
                engineering — building websites that don&apos;t just inform, but{" "}
                <span className="text-white">perform</span>. Real-time 3D, buttery motion and bold
                typography are my native language.
              </p>
              <p>
                From startups to global brands, I help teams ship interfaces that win awards, convert
                visitors, and make competitors nervously check their own websites.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap gap-3"
            >
              {SERVICES.map((s, i) => (
                <span
                  key={s}
                  data-hover
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
                    i % 2 === 0
                      ? "border-white/15 text-white/70 hover:border-accent hover:text-accent"
                      : "border-white/15 text-white/70 hover:border-violet-soft hover:text-violet-soft"
                  }`}
                >
                  {s}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
