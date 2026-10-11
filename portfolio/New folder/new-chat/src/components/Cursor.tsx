import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [fine, setFine] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  const dotX = useSpring(mx, { stiffness: 900, damping: 60, mass: 0.2 });
  const dotY = useSpring(my, { stiffness: 900, damping: 60, mass: 0.2 });
  const ringX = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.6 });
  const ringY = useSpring(my, { stiffness: 180, damping: 22, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    if (!mq.matches) return;

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHovering(!!t?.closest("a, button, [data-hover]"));
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [mx, my]);

  if (!fine) return null;

  return (
    <>
      {/* trailing ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[96]"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/70"
          animate={{
            width: hovering ? 64 : 36,
            height: hovering ? 64 : 36,
            opacity: hovering ? 0.9 : 0.5,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        />
      </motion.div>

      {/* dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[97] mix-blend-difference"
        style={{ x: dotX, y: dotY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{ width: hovering ? 14 : 8, height: hovering ? 14 : 8 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </>
  );
}
