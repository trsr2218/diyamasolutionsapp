import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* The last word of the headline changes every couple of seconds. Each word is
 * something Diyama actually builds a system for; nothing aspirational. */

const RotatingWord = ({ words, className = "" }: { words: string[]; className?: string }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => window.clearInterval(t);
  }, [words.length]);
  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`}>
      <span className="invisible col-start-1 row-start-1">{words.reduce((a, b) => (a.length >= b.length ? a : b))}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 text-gold-gradient"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingWord;
