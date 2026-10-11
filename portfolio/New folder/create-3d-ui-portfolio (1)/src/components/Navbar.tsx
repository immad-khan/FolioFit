import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowUpRight, Boxes } from "lucide-react";

const links = [
  { name: "About", href: "#about" },
  { name: "Stack", href: "#stack" },
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "Journey", href: "#journey" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-violet-500 via-cyan-400 to-fuchsia-400"
        style={{ scaleX: progress }}
      />
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <nav
            className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 md:px-6 ${
              scrolled
                ? "glass-strong shadow-[0_8px_40px_-12px_rgba(139,92,246,0.4)]"
                : "border border-transparent bg-transparent"
            }`}
          >
            <a href="#top" className="group flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-cyan-500 shadow-lg shadow-violet-500/30 transition-transform duration-500 group-hover:rotate-[20deg]">
                <Boxes className="h-5 w-5 text-white" strokeWidth={2.2} />
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#050508] bg-emerald-400" />
              </span>
              <span className="leading-none">
                <span className="font-display block text-lg font-bold tracking-tight">
                  aiden<span className="text-gradient">.cross</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  creative dev — 3d
                </span>
              </span>
            </a>

            <div className="hidden items-center gap-1 lg:flex">
              {links.map((l) => (
                <a
                  key={l.name}
                  href={l.href}
                  className="group relative rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  {l.name}
                  <span className="absolute inset-x-4 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-violet-400 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="group hidden items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-violet-200 hover:shadow-[0_0_30px_-5px_rgba(167,139,250,0.7)] sm:inline-flex"
              >
                Hire Me
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <button
                onClick={() => setOpen(true)}
                className="glass flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#050508]/95 backdrop-blur-2xl"
          >
            <div className="grid-bg absolute inset-0" />
            <div className="relative flex items-center justify-between px-6 py-6">
              <span className="font-display text-xl font-bold">
                aiden<span className="text-gradient">.cross</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="glass flex h-11 w-11 items-center justify-center rounded-xl"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex flex-1 flex-col justify-center gap-2 px-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.name}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5 }}
                  className="group flex items-center gap-4 border-b border-white/5 py-4"
                >
                  <span className="font-mono text-xs text-violet-400">
                    0{i + 1}
                  </span>
                  <span className="font-display text-4xl font-extrabold tracking-tight text-white transition-all group-hover:translate-x-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-300 group-hover:to-cyan-300">
                    {l.name}
                  </span>
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-4 font-semibold"
              >
                Let's work together <ArrowUpRight className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
