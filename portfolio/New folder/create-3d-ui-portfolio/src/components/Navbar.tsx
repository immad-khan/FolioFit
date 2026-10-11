import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 backdrop-blur-sm bg-slate-950/30"
    >
      <div className="text-2xl font-bold text-white tracking-tighter">
        PORT<span className="text-indigo-500">FOLIO</span>.3D
      </div>
      <ul className="hidden md:flex gap-8">
        {navLinks.map((link) => (
          <li key={link.name}>
            <a 
              href={link.href} 
              className="text-slate-300 hover:text-white transition-colors duration-300 font-medium text-sm uppercase tracking-widest"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="md:hidden text-white">
        {/* Mobile menu icon would go here */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </div>
    </motion.nav>
  );
};

export default Navbar;
