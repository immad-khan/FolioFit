import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Masked line reveal — slides content up from behind an overflow mask. */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  return (
    <span className={`inline-block overflow-hidden align-bottom ${className}`}>
      <motion.span
        className="inline-block will-change-transform"
        initial={{ y: "112%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
