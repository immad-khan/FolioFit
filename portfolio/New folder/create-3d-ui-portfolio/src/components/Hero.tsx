import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-8 pt-20">
      <div className="max-w-4xl text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-extrabold text-white leading-tight"
        >
          Designing <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Digital</span> <br /> 
          Experiences in 3D
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-slate-400 text-lg md:text-xl max-w-2xl mx-auto"
        >
          A creative developer specializing in interactive 3D web applications. 
          Turning complex ideas into immersive digital realities.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a 
            href="#projects" 
            className="px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95"
          >
            View My Work
          </a>
          <a 
            href="#contact" 
            className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all backdrop-blur-md"
          >
            Get In Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
