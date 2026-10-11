import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const skills = [
    { name: 'React', color: 'bg-blue-500' },
    { name: 'Three.js', color: 'bg-white' },
    { name: 'TypeScript', color: 'bg-blue-600' },
    { name: 'Tailwind CSS', color: 'bg-cyan-400' },
    { name: 'Framer Motion', color: 'bg-purple-500' },
    { name: 'WebGL', color: 'bg-orange-500' },
  ];

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center px-8 py-20">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-square rounded-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-8xl font-bold opacity-20 group-hover:scale-110 transition-transform duration-500">
              DEV
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-left"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-indigo-500">Me</span>
          </h2>
          <p className="text-slate-400 text-lg mb-6 leading-relaxed">
            I'm a passionate creative developer who loves bridging the gap between design and engineering. 
            My focus is on creating high-performance, visually stunning 3D experiences that engage users 
            and tell compelling stories.
          </p>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            With a deep understanding of mathematical concepts and a keen eye for aesthetics, 
            I strive to push the boundaries of what's possible in the browser.
          </p>
          
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span 
                key={skill.name} 
                className={`${skill.color} text-slate-900 px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
