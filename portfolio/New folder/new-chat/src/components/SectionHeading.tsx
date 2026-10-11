import { motion } from "framer-motion";

interface SectionHeadingProps {
  index: string;
  label: string;
}

export default function SectionHeading({ index, label }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 flex items-center gap-4 md:mb-16"
    >
      <span className="font-mono text-xs text-accent">({index})</span>
      <span className="text-[11px] uppercase tracking-[0.35em] text-white/60">{label}</span>
      <span className="h-px flex-1 bg-white/10" />
      <span className="hidden h-1.5 w-1.5 rotate-45 bg-accent sm:block" />
    </motion.div>
  );
}
