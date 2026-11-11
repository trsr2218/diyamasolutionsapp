import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/* Counts up to a figure such as "2,900+" when it scrolls into view. The final
   text is always exactly the string passed in, so the number shown at rest is
   the sourced one and never a rounding of it. */
const CountUp = ({ value, className }: { value: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const target = Number(value.replace(/[^\d]/g, ""));
  const suffix = value.replace(/[\d,]/g, "");
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduce || !target) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setShown(Math.round(v).toLocaleString("en-US") + suffix),
      onComplete: () => setShown(value),
    });
    return () => controls.stop();
  }, [inView, reduce, target, suffix, value]);

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
};

export default CountUp;
