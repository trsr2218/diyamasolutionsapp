import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingCTA = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href="https://wa.me/260966138238"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl flex items-center overflow-hidden"
      aria-label="Chat on WhatsApp"
    >
      {/* Soft pulse ring */}
      <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-10 pointer-events-none" />
      <span className="p-4 relative z-10 shrink-0">
        <MessageCircle size={24} />
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="whitespace-nowrap text-sm font-medium pr-5 relative z-10 overflow-hidden"
          >
            Chat with us
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
};

export default FloatingCTA;
