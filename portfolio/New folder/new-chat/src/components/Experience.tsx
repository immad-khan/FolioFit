import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const JOBS = [
  {
    period: "2024 — Now",
    role: "Senior Creative Developer",
    company: "Orbital Studio",
    description:
      "Leading immersive web builds for global brands — real-time 3D configurators, generative campaigns and award-season portfolio sites. Mentoring a team of four creative devs.",
    tags: ["Team Lead", "WebGL", "Direction"],
  },
  {
    period: "2022 — 2024",
    role: "3D Frontend Engineer",
    company: "Nebula Labs",
    description:
      "Built the rendering core of a browser-based spatial design tool. Shipped custom shader pipelines, LOD systems and a component 3D kit used across five products.",
    tags: ["R3F", "GLSL", "Performance"],
  },
  {
    period: "2020 — 2022",
    role: "Frontend Developer",
    company: "Pixelforge Agency",
    description:
      "Crafted marketing sites and interactive campaigns for startups — from scroll-driven storytelling to playful micro-interactions that lifted engagement by double digits.",
    tags: ["React", "GSAP", "SEO"],
  },
  {
    period: "2019 — 2020",
    role: "Freelance Designer & Developer",
    company: "Independent",
    description:
      "Started out designing and shipping end-to-end sites for local clients — where the obsession with pixels, motion and the third dimension began.",
    tags: ["Design", "Branding", "WordPress"],
  },
];

export default function Experience() {
  return (
    <section id="journey" className="relative scroll-mt-24 px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading index="04" label="The journey" />

        <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-6xl">
              <Reveal>Six years</Reveal>
              <br />
              <Reveal delay={0.1}>
                of <span className="text-accent">building</span>
              </Reveal>
              <br />
              <Reveal delay={0.2}>
                the <span className="text-outline">web</span>
              </Reveal>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-6 max-w-sm text-white/50"
            >
              A timeline of pixels pushed, shaders written, and products shipped — from
              WordPress beginnings to leading 3D experiences for global brands.
            </motion.p>
          </div>

          <div className="relative">
            {/* spine */}
            <motion.span
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-4 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-accent via-white/20 to-transparent"
            />

            <div className="space-y-12">
              {JOBS.map((job, i) => (
                <motion.article
                  key={job.role}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative pl-10"
                >
                  <span className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center">
                    <span className="absolute h-full w-full rotate-45 border border-accent/60 bg-ink transition-colors duration-300 group-hover:bg-accent" />
                  </span>

                  <p className="font-mono text-xs tracking-[0.2em] text-accent">{job.period}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                    {job.role}
                  </h3>
                  <p className="mt-1 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/45">
                    <Briefcase className="h-3.5 w-3.5" />
                    {job.company}
                  </p>
                  <p className="mt-4 max-w-xl leading-relaxed text-white/50">{job.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
