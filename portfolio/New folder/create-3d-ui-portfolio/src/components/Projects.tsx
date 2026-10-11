import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Nebula VR',
    description: 'An immersive space exploration experience built with WebGL and Three.js.',
    category: '3D Experience',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    link: '#',
  },
  {
    title: 'CyberCity',
    description: 'A neon-drenched futuristic city visualization with real-time lighting.',
    category: 'Visualization',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    link: '#',
  },
  {
    title: 'Quantum Core',
    description: 'Interactive data visualization representing quantum particle movement.',
    category: 'Data Art',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    link: '#',
  },
  {
    title: 'Void Engine',
    description: 'A custom lightweight 3D engine designed for high-performance web apps.',
    category: 'Engine',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    link: '#',
  },
];

const Projects = () => {
  return (
    <section id="projects" className="relative min-h-screen px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured <span className="text-indigo-500">Projects</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A collection of my favorite work, focusing on interactivity and immersive visual storytelling.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-indigo-500/50 transition-all"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
                  {project.category}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 mb-6 line-clamp-2">
                  {project.description}
                </p>
                <a 
                  href={project.link} 
                  className="inline-flex items-center text-white font-semibold hover:text-indigo-400 transition-colors"
                >
                  View Case Study 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
