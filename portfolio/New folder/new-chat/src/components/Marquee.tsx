import { Asterisk } from "lucide-react";

interface MarqueeProps {
  items: string[];
  className?: string;
  outline?: boolean;
}

export default function Marquee({ items, className = "", outline = false }: MarqueeProps) {
  const loop = [...items, ...items];
  return (
    <div className={`relative w-full overflow-hidden border-y border-white/10 ${className}`}>
      <div className="marquee-track flex w-max items-center whitespace-nowrap py-5 md:py-7">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="mr-10 flex items-center gap-10 md:mr-14 md:gap-14">
            <span
              className={`font-display text-4xl font-bold uppercase tracking-tight md:text-6xl ${
                outline ? "text-outline-dim" : "text-white"
              }`}
            >
              {item}
            </span>
            <Asterisk className="h-7 w-7 shrink-0 text-accent md:h-9 md:w-9" />
          </span>
        ))}
      </div>
    </div>
  );
}
