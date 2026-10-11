import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
  Menu, X, ChevronDown, ExternalLink,
  Mail, MapPin, Calendar, ArrowRight, Code, Palette, Zap, Database,
  Globe, Smartphone, Layers, Send, Download, Star, Briefcase,
  GraduationCap, Heart, Coffee, Sparkles
} from 'lucide-react';

// Custom SVG icons for social media
const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

// Cursor follower component
function CursorFollower() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-[999] hidden md:block"
      style={{
        left: cursorXSpring,
        top: cursorYSpring,
        x: '-50%',
        y: '-50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)',
      }}
    />
  );
}

// Navigation
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.a
          href="#home"
          className="text-2xl font-bold font-display"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-gradient">ALEX</span>
          <span className="text-white/80">.dev</span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm text-white/60 hover:text-white transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
          <motion.a
            href="#contact"
            className="btn-3d px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hire Me
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Nav */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden glass-strong"
      >
        <div className="px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block text-white/70 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}

// 3D Floating Shape
function Floating3DShape({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1, ease: [0.23, 1, 0.32, 1] }}
      className={`absolute ${className}`}
    >
      <div className="animate-float" style={{ animationDelay: `${delay}s` }}>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 backdrop-blur-sm" />
      </div>
    </motion.div>
  );
}

// Hero Section
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const roles = ['Full Stack Developer', 'UI/UX Designer', 'Creative Coder', 'Problem Solver'];
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter to-dark" />
        <div className="absolute inset-0 opacity-30">
          <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50" />
      </div>

      {/* 3D Grid */}
      <div className="absolute inset-0 perspective-2000">
        <div className="absolute inset-0 preserve-3d" style={{ transform: 'rotateX(60deg) translateZ(-100px)' }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>
      </div>

      {/* Floating 3D Shapes */}
      <Floating3DShape delay={0.2} className="top-[20%] left-[10%] rotate-12" />
      <Floating3DShape delay={0.5} className="top-[60%] right-[15%] -rotate-12" />
      <Floating3DShape delay={0.8} className="bottom-[20%] left-[20%] rotate-45" />
      <Floating3DShape delay={1.1} className="top-[30%] right-[25%] rotate-90" />

      {/* Orbiting elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-20">
        <div className="absolute inset-0 rounded-full border border-primary/30 animate-spin-slow" />
        <div className="absolute inset-8 rounded-full border border-accent/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
        <div className="absolute inset-16 rounded-full border border-primary/10 animate-spin-slow" style={{ animationDuration: '30s' }} />
      </div>

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/70 mb-6">
                <Sparkles size={14} className="text-primary" />
                <span>Available for freelance work</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-5xl md:text-7xl font-bold font-display leading-tight"
            >
              <span className="text-white">Hi, I'm</span>
              <br />
              <span className="text-gradient">Alex Morgan</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/60"
            >
              <span>A passionate </span>
              <motion.span
                key={currentRole}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-gradient font-semibold"
              >
                {roles[currentRole]}
              </motion.span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg text-white/50 max-w-xl"
            >
              I create stunning digital experiences with cutting-edge technologies.
              Specializing in building beautiful, functional, and user-centered applications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="#projects"
                className="btn-3d inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
                <ArrowRight size={18} />
              </motion.a>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                Download CV
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex gap-8 pt-8"
            >
              {[
                { number: '5+', label: 'Years Experience' },
                { number: '50+', label: 'Projects Done' },
                { number: '30+', label: 'Happy Clients' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-gradient font-display">{stat.number}</div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 3D Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="hidden lg:flex justify-center perspective-1000"
          >
            <div className="relative">
              {/* Glowing background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-3xl animate-pulse-glow" />
              
              {/* Main card */}
              <div className="relative glass-strong rounded-3xl p-8 preserve-3d animate-float">
                <div className="w-72 h-80 rounded-2xl overflow-hidden mb-6" style={{ transform: 'translateZ(30px)' }}>
                  <img src="/images/profile.jpg" alt="Alex Morgan" className="w-full h-full object-cover" />
                </div>
                <div className="text-center" style={{ transform: 'translateZ(20px)' }}>
                  <h3 className="text-xl font-bold text-white font-display">Alex Morgan</h3>
                  <p className="text-white/50">Senior Developer</p>
                  <div className="flex justify-center gap-3 mt-4">
                    {[GithubIcon, LinkedinIcon, TwitterIcon].map((Icon, i) => (
                      <motion.a
                        key={i}
                        href="#"
                        className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon size={18} />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -top-4 -right-4 glass-strong rounded-xl px-3 py-2 text-xs font-medium text-accent"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Code size={14} className="inline mr-1" />
                  React Expert
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 glass-strong rounded-xl px-3 py-2 text-xs font-medium text-primary"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
                >
                  <Palette size={14} className="inline mr-1" />
                  UI Designer
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-white/30"
          >
            <span className="text-xs">Scroll Down</span>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium">Get to Know Me</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-2">
            About <span className="text-gradient">Me</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="perspective-1000"
          >
            <div className="relative preserve-3d group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
              <div className="relative glass rounded-3xl p-6 overflow-hidden">
                <div className="rounded-2xl overflow-hidden" style={{ transform: 'translateZ(30px)' }}>
                  <img
                    src="/images/profile.jpg"
                    alt="About Alex"
                    className="w-full h-auto rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Floating info cards */}
                <motion.div
                  className="absolute top-8 right-8 glass-strong rounded-xl px-4 py-3"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <div className="flex items-center gap-2">
                    <Coffee size={16} className="text-primary" />
                    <span className="text-sm font-medium">1000+ Coffees</span>
                  </div>
                </motion.div>
                <motion.div
                  className="absolute bottom-8 left-8 glass-strong rounded-xl px-4 py-3"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 2 }}
                >
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-red-400" />
                    <span className="text-sm font-medium">50+ Projects</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold font-display text-white">
              A passionate developer based in San Francisco
            </h3>
            <p className="text-white/60 leading-relaxed">
              With over 5 years of experience in web development, I specialize in creating
              beautiful, functional, and user-centered digital experiences. My passion lies
              at the intersection of design and technology.
            </p>
            <p className="text-white/60 leading-relaxed">
              I'm constantly exploring new technologies and pushing the boundaries of what's
              possible on the web. When I'm not coding, you'll find me contributing to open-source
              projects or mentoring aspiring developers.
            </p>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
                { icon: Calendar, label: 'Experience', value: '5+ Years' },
                { icon: GraduationCap, label: 'Degree', value: 'BS Computer Science' },
                { icon: Briefcase, label: 'Freelance', value: 'Available' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-4 group hover:bg-white/10 transition-colors"
                >
                  <item.icon size={20} className="text-primary mb-2" />
                  <div className="text-xs text-white/40">{item.label}</div>
                  <div className="text-sm font-medium text-white/80">{item.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Skills Section
function SkillsSection() {
  const skills = [
    { name: 'React / Next.js', level: 95, color: 'from-blue-500 to-cyan-500' },
    { name: 'TypeScript', level: 90, color: 'from-blue-600 to-blue-400' },
    { name: 'Node.js', level: 88, color: 'from-green-500 to-emerald-500' },
    { name: 'Python', level: 82, color: 'from-yellow-500 to-orange-500' },
    { name: 'UI/UX Design', level: 85, color: 'from-purple-500 to-pink-500' },
    { name: 'Database Design', level: 87, color: 'from-red-500 to-rose-500' },
  ];

  const technologies = [
    { icon: Code, name: 'Frontend', desc: 'React, Vue, Angular' },
    { icon: Database, name: 'Backend', desc: 'Node.js, Python, Go' },
    { icon: Globe, name: 'Web', desc: 'HTML5, CSS3, WebGL' },
    { icon: Smartphone, name: 'Mobile', desc: 'React Native, Flutter' },
    { icon: Layers, name: 'Design', desc: 'Figma, Adobe XD' },
    { icon: Zap, name: 'DevOps', desc: 'Docker, AWS, CI/CD' },
  ];

  return (
    <section id="skills" className="relative py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium">What I Know</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-2">
            My <span className="text-gradient">Skills</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Skill Bars */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold font-display text-white mb-8">Technical Proficiency</h3>
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="perspective-1000"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-white/80 font-medium">{skill.name}</span>
                  <span className="text-primary font-bold">{skill.level}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden preserve-3d" style={{ transform: 'rotateX(20deg)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${skill.color} relative`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-gradient" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Technology Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-bold font-display text-white mb-8">Technologies I Use</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {technologies.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 10,
                    rotateX: -5,
                  }}
                  className="glass rounded-2xl p-5 text-center group hover:bg-white/10 transition-all cursor-pointer preserve-3d"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <tech.icon size={24} className="text-primary" />
                  </div>
                  <h4 className="font-semibold text-white text-sm">{tech.name}</h4>
                  <p className="text-xs text-white/40 mt-1">{tech.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Projects Section
function ProjectsSection() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard.',
      image: '/images/project1.jpg',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      github: '#',
      live: '#',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Real-time data visualization platform with interactive charts, custom reports, and team collaboration.',
      image: '/images/project2.jpg',
      tags: ['Vue.js', 'Python', 'PostgreSQL', 'D3.js'],
      github: '#',
      live: '#',
    },
    {
      title: 'Creative Portfolio',
      description: 'Award-winning portfolio website with 3D animations, parallax effects, and immersive storytelling.',
      image: '/images/project3.jpg',
      tags: ['Next.js', 'Three.js', 'GSAP', 'Tailwind'],
      github: '#',
      live: '#',
    },
    {
      title: 'SaaS Platform',
      description: 'Multi-tenant SaaS application with role-based access, subscription management, and API integrations.',
      image: '/images/project4.jpg',
      tags: ['React', 'GraphQL', 'AWS', 'Docker'],
      github: '#',
      live: '#',
    },
  ];

  return (
    <section id="projects" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium">My Work</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-2">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and expertise in building modern web applications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="project-card group"
            >
              <div className="glass rounded-3xl overflow-hidden">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
                  
                  {/* Overlay buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-dark/60 backdrop-blur-sm">
                    <motion.a
                      href={project.github}
                      className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <GithubIcon size={20} />
                    </motion.a>
                    <motion.a
                      href={project.live}
                      className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ExternalLink size={20} />
                    </motion.a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold font-display text-white mb-2 group-hover:text-gradient transition-all">
                    {project.title}
                  </h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-white/5 text-white/60 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="#"
            className="btn-3d inline-flex items-center gap-2 px-8 py-4 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Projects
            <ArrowRight size={18} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// Experience Section
function ExperienceSection() {
  const experiences = [
    {
      year: '2023 - Present',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      description: 'Leading the frontend team in building scalable web applications. Implemented micro-frontend architecture reducing build times by 60%.',
      icon: Briefcase,
    },
    {
      year: '2021 - 2023',
      title: 'Full Stack Developer',
      company: 'Digital Agency',
      description: 'Developed 20+ client projects using React, Node.js, and cloud services. Mentored junior developers and conducted code reviews.',
      icon: Code,
    },
    {
      year: '2020 - 2021',
      title: 'Junior Developer',
      company: 'StartupXYZ',
      description: 'Built and maintained multiple web applications. Collaborated with design team to implement pixel-perfect UI components.',
      icon: Zap,
    },
    {
      year: '2019 - 2020',
      title: 'Computer Science Degree',
      company: 'University of California',
      description: 'Graduated with honors. Specialized in software engineering and human-computer interaction. Led university coding club.',
      icon: GraduationCap,
    },
  ];

  return (
    <section id="experience" className="relative py-20 md:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium">My Journey</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-2">
            Work <span className="text-gradient">Experience</span>
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className={`relative flex items-start gap-8 mb-12 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-primary to-accent border-4 border-dark z-10" />

              {/* Content card */}
              <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                <motion.div
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: i % 2 === 0 ? 5 : -5,
                  }}
                  className="glass rounded-2xl p-6 preserve-3d group hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <exp.icon size={20} className="text-primary" />
                    </div>
                    <span className="text-sm text-primary font-medium">{exp.year}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">{exp.title}</h3>
                  <p className="text-accent text-sm mb-2">{exp.company}</p>
                  <p className="text-white/50 text-sm">{exp.description}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStartup',
      content: 'Alex delivered exceptional work on our project. His attention to detail and technical expertise made our vision come to life.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      content: 'Working with Alex was a pleasure. He understood our requirements perfectly and delivered beyond expectations.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Design Director',
      content: 'The quality of code and design implementation was outstanding. Alex has a great eye for both aesthetics and functionality.',
      rating: 5,
    },
  ];

  return (
    <section className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium">Client Feedback</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-2">
            What People <span className="text-gradient">Say</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              whileHover={{ 
                y: -10,
                rotateY: 5,
                rotateX: -5,
              }}
              className="glass rounded-2xl p-6 preserve-3d group hover:bg-white/10 transition-all"
            >
              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} size={16} className="fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              
              <p className="text-white/60 mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                  <div className="text-xs text-white/40">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className="relative py-20 md:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-2">
            Let's Work <span className="text-gradient">Together</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how I can help bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold font-display text-white mb-4">
                Let's talk about your project
              </h3>
              <p className="text-white/60">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: 'alex@example.com' },
                { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
                { icon: Calendar, label: 'Availability', value: 'Open for projects' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl glass flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-white/40">{item.label}</div>
                    <div className="text-white font-medium">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              {[
                { icon: GithubIcon, label: 'GitHub' },
                { icon: LinkedinIcon, label: 'LinkedIn' },
                { icon: TwitterIcon, label: 'Twitter' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Your Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Project Inquiry"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-2 block">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <motion.button
                type="submit"
                className="btn-3d w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={18} />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="relative py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold font-display">
              <span className="text-gradient">ALEX</span>
              <span className="text-white/80">.dev</span>
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/40 text-sm">Building the future, one pixel at a time.</span>
          </div>
          
          <div className="flex items-center gap-6">
            {['Home', 'About', 'Projects', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-white/40 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          
          <div className="flex gap-4">
            {[GithubIcon, LinkedinIcon, TwitterIcon].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/40 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>
        
        <div className="section-divider my-8" />
        
        <div className="text-center text-sm text-white/30">
          © {new Date().getFullYear()} Alex Morgan. All rights reserved. Made with ❤️
        </div>
      </div>
    </footer>
  );
}

// Main App Component
export default function App() {
  return (
    <div className="noise-overlay">
      <CursorFollower />
      <Navigation />
      <main>
        <HeroSection />
        <div className="section-divider" />
        <AboutSection />
        <div className="section-divider" />
        <SkillsSection />
        <div className="section-divider" />
        <ProjectsSection />
        <div className="section-divider" />
        <ExperienceSection />
        <div className="section-divider" />
        <TestimonialsSection />
        <div className="section-divider" />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}