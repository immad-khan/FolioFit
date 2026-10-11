import React from 'react';
import Scene from './components/Scene';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <div className="relative selection:bg-indigo-500 selection:text-white">
      {/* 3D Background Scene */}
      <Scene />
      
      {/* UI Overlay */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        
        <footer className="relative z-10 py-12 text-center text-slate-500 text-sm border-t border-white/5 bg-slate-950/50 backdrop-blur-md">
          <p>© {new Date().getFullYear()} PORTFOLIO.3D - Crafted with React & Three.js</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
