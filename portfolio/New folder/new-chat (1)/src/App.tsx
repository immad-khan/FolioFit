import { useMemo, useState } from "react";

type Template = { id: number; name: string; type: string; tone: string; initials: string; role: string; projects: string; style: string };

const templates: Template[] = [
  { id: 1, name: "Forma", type: "Minimal · Editorial", tone: "mint", initials: "F", role: "PRODUCT DESIGNER", projects: "Selected work — 2024 / 25", style: "Clean lines, considered details." },
  { id: 2, name: "Studio North", type: "Creative · Bold", tone: "peach", initials: "N", role: "INDEPENDENT CREATIVE", projects: "Ideas made visible.", style: "Make something that matters." },
  { id: 3, name: "Mono", type: "Developer · Minimal", tone: "dark", initials: "M", role: "FRONTEND DEVELOPER", projects: "Building for the web.", style: "Code with a point of view." },
  { id: 4, name: "Canvas", type: "Visual · Playful", tone: "lavender", initials: "C", role: "DESIGNER & ILLUSTRATOR", projects: "A little color goes a long way.", style: "Curious by design." },
  { id: 5, name: "Maison", type: "Elegant · Personal", tone: "cream", initials: "M", role: "ART DIRECTOR", projects: "A practice in good things.", style: "Quietly confident work." },
  { id: 6, name: "Gridline", type: "Modern · Structured", tone: "blue", initials: "G", role: "DIGITAL DESIGNER", projects: "Selected projects / 01—06", style: "Made to move things forward." },
];

function Icon({ name }: { name: string }) { return <span className="material-symbols-outlined" aria-hidden="true">{name}</span>; }

function App() {
  const [selected, setSelected] = useState(1);
  const [name, setName] = useState("Alex Morgan");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const current = templates.find((t) => t.id === selected)!;
  const visible = useMemo(() => templates.filter((t) => `${t.name} ${t.type}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const download = () => {
    const safeName = name.trim() || "Your Name";
    const title = `${safeName} — ${current.role.toLowerCase()}`;
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>*{box-sizing:border-box}body{margin:0;background:${current.tone === "dark" ? "#101b1a" : "#eafdff"};color:#021f22;font:16px/1.6 'Arial',sans-serif}.wrap{max-width:1060px;margin:auto;padding:32px 7vw}.nav{display:flex;justify-content:space-between;align-items:center;padding:20px 0;border-bottom:1px solid #bbcac5}.nav a{color:inherit;text-decoration:none;margin-left:24px;font-size:14px}.hero{padding:100px 0 110px}.eyebrow{font:12px monospace;letter-spacing:.12em;color:#006b5e}.hero h1{font-size:clamp(56px,10vw,112px);line-height:.95;letter-spacing:-.06em;margin:24px 0}.hero p{font-size:20px;color:#3c4946;max-width:480px}.button{display:inline-block;margin-top:24px;background:#006b5e;color:white;text-decoration:none;border-radius:99px;padding:13px 24px}.work{padding:48px 0;border-top:1px solid #bbcac5}.work h2{font-size:32px;letter-spacing:-.04em}.tiles{display:grid;grid-template-columns:1fr 1fr;gap:18px}.tile{height:210px;border-radius:14px;background:#d6f3f7;padding:24px;display:flex;align-items:end;font-size:19px}.tile:nth-child(2){background:#a1e0fd}.foot{padding:48px 0;color:#3c4946}@media(max-width:600px){.wrap{padding:20px}.hero{padding:72px 0}.tiles{grid-template-columns:1fr}.nav a{margin-left:10px}}</style><body><div class="wrap"><nav class="nav"><strong>${safeName}</strong><div><a href="#work">Work</a><a href="#about">About</a><a href="mailto:hello@example.com">Contact</a></div></nav><main><section class="hero"><div class="eyebrow">${current.role}</div><h1>Hi, I’m ${safeName}.</h1><p>${current.style} I create thoughtful digital experiences, from first sketch to final detail.</p><a class="button" href="#work">Explore my work ↗</a></section><section class="work" id="work"><div class="eyebrow">A FEW RECENT THINGS</div><h2>${current.projects}</h2><div class="tiles"><div class="tile">01 &nbsp; A new perspective ↗</div><div class="tile">02 &nbsp; The everyday, reimagined ↗</div><div class="tile">03 &nbsp; Small details, big impact ↗</div><div class="tile">04 &nbsp; Made for what’s next ↗</div></div></section><section class="work" id="about"><div class="eyebrow">A LITTLE ABOUT ME</div><h2>Good work starts with good questions.</h2><p>I’m ${safeName}, a creative working across design and technology. Currently open to select collaborations.</p></section></main><footer class="foot">© ${new Date().getFullYear()} ${safeName} · Made with care</footer></div></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = `${safeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${current.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-portfolio.html`; link.click(); URL.revokeObjectURL(url);
    setNotice("Your portfolio is ready — check your downloads."); window.setTimeout(() => setNotice(""), 3500);
  };

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand-mark">p<span>.</span></div><nav className="side-nav" aria-label="Main navigation"><button className="side-item active" title="Templates"><Icon name="dashboard" /></button><button className="side-item" title="My portfolio"><Icon name="person" /></button><button className="side-item" title="Help"><Icon name="help" /></button></nav><button className="side-item side-bottom" title="Settings"><Icon name="settings" /></button></aside>
    <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Portfolio builder</strong></div><div className="top-actions"><span className="save-status"><i /> All changes saved</span><div className="avatar">AM</div></div></header>
    <main className="main-content"><div className="content-wrap">
      <div className="welcome-row"><div><div className="overline">YOUR NEXT CHAPTER STARTS HERE</div><h1>Make it <em>yours.</em></h1><p className="intro">Choose a starting point, add your name, and get a portfolio that feels like you.</p></div><div className="step-pill"><span>01</span> Choose your template <b>—</b> <span className="muted-step">02 Add your name</span></div></div>
      <section className="editor-card"><div className="editor-copy"><div className="editor-icon"><Icon name="edit" /></div><div><label htmlFor="portfolio-name">Your name</label><p>This appears throughout your portfolio.</p></div></div><div className="name-controls"><input id="portfolio-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Morgan" maxLength={48} /><button className="download-btn" onClick={download}><Icon name="download" /> <span>Download portfolio</span></button></div></section>
      <div className="gallery-heading"><div><h2>Find your look</h2><p>Six thoughtfully designed starting points. Pick one to preview.</p></div><div className="gallery-tools"><span className="template-count">{visible.length} templates</span><label className="search-box"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates" /></label></div></div>
      <section className="template-grid" aria-label="Portfolio templates">{visible.map((template) => <button key={template.id} className={`template-card ${selected === template.id ? "selected" : ""}`} onClick={() => setSelected(template.id)} aria-pressed={selected === template.id}>
        <div className={`preview preview-${template.tone}`}><div className="preview-bar"><span className="preview-brand">{name.trim() || "Your Name"}</span><div className="preview-links"><i /><i /><i /></div></div><div className="preview-body"><div className="preview-eyebrow">{template.role}</div><div className="preview-title">{template.name === "Mono" ? <>Build<br/>with intent.</> : template.name === "Canvas" ? <>Ideas in<br/><i>full color.</i></> : <>Hello,<br/><i>{name.trim() || "Your Name"}.</i></>}</div><div className="preview-description">{template.style}</div><div className="preview-cta">Explore work <span>↗</span></div></div><div className="preview-art" aria-hidden="true"><div className="art-shape shape-a"/><div className="art-shape shape-b"/><div className="art-shape shape-c"/><span>{template.initials}</span></div><div className="preview-foot"><span>SELECTED WORK</span><div className="mini-blocks"><i/><i/><i/></div></div>{selected === template.id && <div className="selected-mark"><Icon name="check" /></div>}</div>
        <div className="template-info"><div><strong>{template.name}</strong><span>{template.type}</span></div><span className="radio-indicator">{selected === template.id && <i />}</span></div>
      </button>)}</section>
      {visible.length === 0 && <div className="empty-state">No templates match “{query}”. Try another search.</div>}
      <div className="bottom-note"><Icon name="auto_awesome" /><span>Every template is responsive and ready to make your own.</span><button onClick={download}>Preview selected <Icon name="arrow_forward" /></button></div>
    </div></main>{notice && <div className="toast"><Icon name="check_circle" />{notice}</div>}
  </div>;
}

export default App;
