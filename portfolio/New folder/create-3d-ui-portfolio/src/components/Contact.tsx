import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section id="contact" className="relative min-h-screen flex items-center justify-center px-8 py-20">
      <div className="max-w-4xl w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Let's <span className="text-indigo-500">Collaborate</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-slate-400 text-lg mb-12 max-w-xl mx-auto"
          >
            Have a project in mind or just want to say hello? My inbox is always open.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 text-sm font-medium ml-1">Name</label>
              <input 
                type="text" 
                placeholder="Your Name" 
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 text-sm font-medium ml-1">Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-slate-300 text-sm font-medium ml-1">Message</label>
              <textarea 
                rows={4} 
                placeholder="Tell me about your project..." 
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
              >
                Send Message
              </motion.button>
            </div>
          </motion.form>

          <div className="mt-16 flex justify-center gap-8">
            {['GitHub', 'LinkedIn', 'Twitter', 'Dribbble'].map((platform) => (
              <a 
                key={platform} 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors font-medium text-sm uppercase tracking-widest"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
