import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Contact from "./components/Contact";

export default function App() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <div className="relative min-h-screen bg-ink font-body text-white">
      <Cursor />

      <AnimatePresence mode="wait">{loading && <Preloader key="loader" />}</AnimatePresence>

      {/* scroll progress */}
      <motion.div
        className="fixed left-0 top-0 z-[90] h-[3px] w-full origin-left bg-accent"
        style={{ scaleX: progress }}
      />

      {/* film grain */}
      <div className="noise" aria-hidden />

      <Navbar started={!loading} />

      <main>
        <Hero started={!loading} />
        <Marquee
          className="fast bg-ink"
          items={[
            "WebGL",
            "Three.js",
            "React",
            "GLSL Shaders",
            "Motion Design",
            "3D Interfaces",
            "Creative Coding",
            "TypeScript",
          ]}
        />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
