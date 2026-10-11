import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Experience from "./components/Experience";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function Preloader({ done }: { done: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setCount(Math.floor(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(done, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050508]"
    >
      <div className="grid-bg absolute inset-0" />
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_80px_-10px_rgba(139,92,246,0.8)]"
      >
        <span className="font-display text-3xl font-extrabold text-white">A</span>
      </motion.div>
      <div className="font-display mt-6 text-2xl font-extrabold tracking-tight">
        aiden<span className="text-gradient">.cross</span>
      </div>
      <div className="font-mono mt-2 text-xs tracking-[0.3em] text-zinc-500">LOADING DIMENSIONS</div>
      <div className="mt-6 h-1 w-56 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all" style={{ width: `${count}%` }} />
      </div>
      <div className="font-display mt-3 text-sm font-bold text-violet-300">{count}%</div>
    </motion.div>
  );
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      className="pointer-events-none fixed z-[5] hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.07] blur-[100px] md:block"
      style={{ left: pos.x, top: pos.y }}
    />
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
  }, [loading]);

  return (
    <div className="noise relative min-h-screen bg-[#050508] text-zinc-100">
      <AnimatePresence>{loading && <Preloader done={() => setLoading(false)} />}</AnimatePresence>
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
