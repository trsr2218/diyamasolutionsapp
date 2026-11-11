import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

/* A soft gold glow that follows the pointer across a dark band, so the ink reads
 * as a surface rather than a flat fill. Pointer events pass straight through it.
 * On touch devices it simply sits still at the last known point. */

const CursorGlow = ({ color = "hsl(41 95% 60% / 0.14)" }: { color?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement ?? el;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    parent.addEventListener("mousemove", move);
    return () => parent.removeEventListener("mousemove", move);
  }, [x, y]);

  const bg = useMotionTemplate`radial-gradient(620px circle at ${sx}px ${sy}px, ${color}, transparent 62%)`;
  return <motion.div ref={ref} aria-hidden className="absolute inset-0 pointer-events-none z-[1]" style={{ background: bg }} />;
};

export default CursorGlow;
