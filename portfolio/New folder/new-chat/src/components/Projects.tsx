import { useRef, type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    title: "Lumen Engine",
    category: "3D Product Configurator",
    description: "Real-time WebGL configurator with physically-based materials, cinematic lighting and 60fps interactions.",
    tags: ["Three.js", "R3F", "WebGL"],
    year: "2026",
    image: "/images/project-1.jpg",
  },
  {
    title: "Prism OS",
    category: "Spatial Interface Concept",
    description: "A glassmorphic spatial operating system rendered entirely in the browser with custom GLSL refraction.",
    tags: ["GLSL", "React", "Shaders"],
    year: "2025",
    image: "/images/project-2.jpg",
  },
  {
    title: "Nebula Dashboard",
    category: "Data Visualization",
    description: "Holographic analytics suite visualizing millions of data points through layered 3D panels and depth.",
    tags: ["TypeScript", "D3.js", "WebGL"],
    year: "2025",
    image: "/images/project-3.jpg",
  },
  {
    title: "Orbital Studio",
    category: "Award-winning Portfolio",
    description: "Site of the Day winning studio site — iridescent sculptures, physics-based scroll and generative art.",
    tags: ["Next.js", "GSAP", "Three.js"],
    year: "2024",
    image: "/images/project-4.jpg",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 160, damping: 18 });
  const imgX = useSpring(useTransform(mx, [0, 1], [-14, 14]), { stiffness: 120, damping: 20 });
  const imgY = useSpring(useTransform(my, [0, 1], [-10, 10]), { stiffness: 120, damping: 20 });

  const gx = useTransform(mx, (v) => v * 100);
  const gy = useTransform(my, (v) => v * 100);
  const glare = useMotionTemplate`radial-gradient(320px circle at ${gx}% ${gy}%, rgba(255,255,255,0.14), transparent 65%)`;

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1, delay: (index % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{ perspective: 1400 }}>
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          data-hover
          className="group relative will-change-transform"
        >
          {/* image */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-panel">
            <motion.img
              src={project.image}
              alt={project.title}
              style={{ x: imgX, y: imgY }}
              className="h-64 w-full scale-[1.12] object-cover transition-[filter] duration-500 group-hover:brightness-110 md:h-[380px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

            {/* glare */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: glare }}
            />

            {/* top meta */}
            <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
              <span className="rounded-full border border-white/20 bg-ink/40 px-3 py-1 font-mono text-[11px] text-white/80 backdrop-blur-md">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="rounded-full border border-white/20 bg-ink/40 px-3 py-1 font-mono text-[11px] text-accent backdrop-blur-md">
                {project.year}
              </span>
            </div>
          </div>

          {/* floating info panel */}
          <div
            style={{ transform: "translateZ(46px)" }}
            className="relative mx-4 -mt-14 rounded-xl border border-white/10 bg-ink/80 p-5 backdrop-blur-xl transition-colors duration-300 group-hover:border-accent/40 md:mx-6 md:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-accent">{project.category}</p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {project.title}
                </h3>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent">
                <ArrowUpRight className="h-5 w-5 transition-colors duration-300 group-hover:text-black" />
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/50">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="work" className="relative scroll-mt-24 px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeading index="01" label="Selected works" />

        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight md:text-8xl">
            <Reveal>Featured</Reveal>
            <br />
            <Reveal delay={0.1}>
              <span className="text-outline">Projects</span>
            </Reveal>
          </h2>
          <Reveal delay={0.2} className="pb-2">
            <span className="font-display text-xl text-white/40">
              ( {String(PROJECTS.length).padStart(2, "0")} <span className="text-accent">works</span> )
            </span>
          </Reveal>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-16">
          {PROJECTS.map((p, i) => (
            <div key={p.title} className={i % 2 === 1 ? "md:translate-y-16" : ""}>
              <ProjectCard project={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
