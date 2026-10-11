import { useEffect, useRef, useState, type MouseEvent } from "react";
import { navigate } from "../lib/router";
import "./portfolio.css";

const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
  event.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d={diagonal ? "M5 19 19 5M8 5h11v11" : "M5 12h14M14 7l5 5-5 5"} />
  </svg>
);

const projects = [
  { number: "01", title: "Nova", type: "Art direction / 3D", year: "2025", image: "/images/portfolio/project-nova.jpg" },
  { number: "02", title: "Forma", type: "Identity / Digital", year: "2024", image: "/images/portfolio/project-form.jpg" },
];

function Project({ project }: { project: (typeof projects)[number] }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    imageRef.current?.style.setProperty("--rx", `${-y * 8}deg`);
    imageRef.current?.style.setProperty("--ry", `${x * 10}deg`);
  };
  const resetTilt = () => {
    imageRef.current?.style.setProperty("--rx", "0deg");
    imageRef.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <a className="project" href="#contact" onClick={(event) => scrollToSection(event, "portfolio-contact")} onMouseMove={handleMove} onMouseLeave={resetTilt} aria-label={`View ${project.title} case study`}>
      <div className="project__meta"><span>{project.number}</span><span>{project.type}</span></div>
      <div className="project__visual" ref={imageRef}><img src={project.image} alt={`${project.title} project artwork`} /></div>
      <div className="project__footer">
        <h3>{project.title}</h3><span>{project.year}</span><span className="project__arrow"><Arrow diagonal /></span>
      </div>
    </a>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMove = (event: globalThis.MouseEvent) => {
      if (!heroRef.current) return;
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      heroRef.current.style.setProperty("--mx", `${x * 18}px`);
      heroRef.current.style.setProperty("--my", `${y * 14}px`);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <main className="portfolio-page">
      <section className="hero" ref={heroRef} id="top">
        <div className="hero__media" aria-hidden="true" />
        <div className="hero__shade" />
        <nav className="nav" aria-label="Main navigation">
          <button className="brand" onClick={() => navigate("/dashboard")} aria-label="Back to FolioFit Dashboard">AV<span>+</span></button>
          <div className={`nav__links ${menuOpen ? "is-open" : ""}`}>
            <a href="#work" onClick={(event) => { setMenuOpen(false); scrollToSection(event, "work"); }}>Work</a>
            <a href="#about" onClick={(event) => { setMenuOpen(false); scrollToSection(event, "about"); }}>About</a>
            <a href="#contact" onClick={(event) => { setMenuOpen(false); scrollToSection(event, "portfolio-contact"); }}>Contact</a>
          </div>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}><span /><span /></button>
        </nav>
        <div className="hero__content">
          <p className="hero__eyebrow"><span /> Independent designer / 3D artist</p>
          <h1>Alex Voss<span>builds digital worlds.</span></h1>
          <p className="hero__copy">Immersive identities and interfaces for brands moving culture forward.</p>
          <a className="round-link" href="#work" onClick={(event) => scrollToSection(event, "work")} aria-label="Explore selected work"><span>Explore<br />work</span><Arrow /></a>
        </div>
        <div className="hero__index" aria-hidden="true">(01 / 04)</div>
        <div className="hero__scroll" aria-hidden="true">Scroll to discover <span /></div>
      </section>

      <section className="intro" id="about">
        <div className="intro__label">What I do</div>
        <p className="intro__statement">I turn <em>bold ideas</em> into memorable digital experiences through design, motion and three-dimensional craft.</p>
        <div className="intro__foot">
          <p>Based in Amsterdam<br />Working worldwide</p>
        <a href="#contact" onClick={(event) => scrollToSection(event, "portfolio-contact")}>More about me <Arrow /></a>
        </div>
      </section>

      <section className="work" id="work">
        <header className="section-heading"><p>Selected work</p><h2>Projects <sup>02</sup></h2></header>
        <div className="projects">{projects.map((project) => <Project key={project.title} project={project} />)}</div>
      </section>

      <section className="capabilities">
        <p className="capabilities__label">Capabilities</p>
        <div className="capabilities__list"><span>Art direction</span><span>Digital design</span><span>3D &amp; motion</span><span>Creative development</span></div>
      </section>

      <footer id="portfolio-contact">
        <div className="footer__orb" aria-hidden="true" />
        <p>Have something in mind?</p>
        <h2>Let's make it<br /><em>unreal.</em></h2>
        <a className="footer__cta" href="mailto:hello@alexvoss.design">Start a project <Arrow diagonal /></a>
        <div className="footer__bottom">
          <span>© 2025 Alex Voss</span>
          <div><a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.behance.net" target="_blank" rel="noreferrer">Behance</a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></div>
          <a href="#top" onClick={(event) => scrollToSection(event, "top")}>Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
