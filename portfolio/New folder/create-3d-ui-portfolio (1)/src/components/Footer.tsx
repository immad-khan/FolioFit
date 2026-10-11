import { ArrowUp, Boxes, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8">
      {/* giant watermark */}
      <div className="pointer-events-none select-none overflow-hidden">
        <div className="font-display -mb-6 bg-gradient-to-b from-white/8 to-transparent bg-clip-text text-center text-[18vw] font-extrabold leading-none tracking-tight text-transparent md:-mb-10">
          AIDEN®
        </div>
      </div>

      <div className="relative border-t border-white/8 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row md:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500">
              <Boxes className="h-4 w-4 text-white" />
            </span>
            <span className="font-display font-bold">
              aiden<span className="text-gradient">.cross</span>
            </span>
          </a>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-400">
            {["About", "Work", "Services", "Journey", "Contact"].map((l) => (
              <a key={l} href={`#${l.toLowerCase() === "work" ? "work" : l.toLowerCase() === "journey" ? "journey" : l.toLowerCase()}`} className="transition-colors hover:text-white">
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="font-mono hidden text-xs text-zinc-600 lg:inline-flex items-center gap-1.5">
              crafted with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> + three.js
            </span>
            <a
              href="#top"
              aria-label="Back to top"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all hover:-translate-y-1 hover:border-violet-400/60 hover:shadow-[0_10px_30px_-8px_rgba(139,92,246,0.7)]"
            >
              <ArrowUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center">
          <p className="font-mono text-[11px] tracking-wider text-zinc-600">
            © 2026 AIDEN CROSS — ALL DIMENSIONS RESERVED · LISBON / REMOTE
          </p>
        </div>
      </div>
    </footer>
  );
}
