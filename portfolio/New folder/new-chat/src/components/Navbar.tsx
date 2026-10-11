import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";

const LINKS = [
  { n: "01", label: "Work", href: "#work" },
  { n: "02", label: "About", href: "#about" },
  { n: "03", label: "Stack", href: "#stack" },
  { n: "04", label: "Journey", href: "#journey" },
];

export default function Navbar({ started }: { started: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={started ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      className={`fixed left-0 top-0 z-[70] w-full transition-all duration-500 ${
        scrolled ? "border-b border-white/5 bg-ink/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-12 md:py-5">
        <a href="#home" className="group flex items-center gap-2" data-hover>
          <span className="font-display text-xl font-extrabold tracking-tight">
            AV<span className="text-accent">®</span>
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.3em] text-white/40 sm:block">
            Creative Dev
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.n}>
              <a href={l.href} className="group relative flex items-baseline gap-1.5" data-hover>
                <span className="font-mono text-[10px] text-accent">{l.n}</span>
                <span className="text-sm uppercase tracking-[0.18em] text-white/70 transition-colors duration-300 group-hover:text-white">
                  {l.label}
                </span>
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <MagneticButton>
          <a
            href="#contact"
            data-hover
            className="group flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-black"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 group-hover:bg-black/50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent group-hover:bg-black" />
            </span>
            Let's talk
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </MagneticButton>
      </nav>
    </motion.header>
  );
}
