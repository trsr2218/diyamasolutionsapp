import { motion } from "framer-motion";

export type AvatarMood = "idle" | "thinking" | "speaking";

interface DiyamaAvatarProps {
  size?: number;
  mood?: AvatarMood;
  className?: string;
}

/**
 * Diyama AI's visual persona: a warm, breathing gradient orb with
 * blinking eyes. Moods: idle (calm breathing), thinking (eyes wander,
 * orbit ring spins), speaking (lively bounce).
 */
const DiyamaAvatar = ({ size = 48, mood = "idle", className = "" }: DiyamaAvatarProps) => {
  const eyeSize = Math.max(3, size * 0.09);
  const eyeGap = size * 0.22;
  const eyeTop = size * 0.38;

  const bodyAnimation =
    mood === "speaking"
      ? { scale: [1, 1.05, 0.98, 1.03, 1], rotate: [0, 1.5, -1, 0] }
      : mood === "thinking"
        ? { scale: [1, 1.03, 1], rotate: [0, -2, 2, 0] }
        : { scale: [1, 1.04, 1] };

  const bodyDuration = mood === "speaking" ? 1.6 : mood === "thinking" ? 2.4 : 3.6;

  const eyesAnimation =
    mood === "thinking"
      ? { x: [0, eyeSize * 0.9, -eyeSize * 0.9, 0], y: [0, -eyeSize * 0.4, 0] }
      : { x: 0, y: 0 };

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      {/* Halo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--accent)/0.35) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />

      {/* Orbit ring while thinking */}
      {mood === "thinking" && (
        <motion.div
          className="absolute rounded-full border border-accent/60"
          style={{ inset: -size * 0.14, borderTopColor: "transparent", borderLeftColor: "transparent" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        />
      )}

      {/* Body */}
      <motion.div
        className="absolute inset-0 shadow-md"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)) 10%, hsl(168 45% 35%) 55%, hsl(var(--accent)) 130%)",
          borderRadius: "48% 52% 55% 45% / 50% 48% 52% 50%",
        }}
        animate={{
          ...bodyAnimation,
          borderRadius: [
            "48% 52% 55% 45% / 50% 48% 52% 50%",
            "52% 48% 45% 55% / 48% 52% 48% 52%",
            "48% 52% 55% 45% / 50% 48% 52% 50%",
          ],
        }}
        transition={{ repeat: Infinity, duration: bodyDuration, ease: "easeInOut" }}
      >
        {/* Face highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top: "12%",
            left: "16%",
            width: "30%",
            height: "22%",
            background: "radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)",
          }}
        />
        {/* Eyes */}
        <motion.div
          className="absolute flex"
          style={{ top: eyeTop, left: "50%", marginLeft: -eyeGap / 2 - eyeSize, gap: eyeGap }}
          animate={eyesAnimation}
          transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
        >
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              className="bg-white rounded-full block"
              style={{ width: eyeSize, height: eyeSize * 1.4 }}
              animate={{ scaleY: [1, 1, 0.12, 1, 1] }}
              transition={{ repeat: Infinity, duration: 3.4, times: [0, 0.42, 0.48, 0.54, 1], ease: "easeInOut" }}
            />
          ))}
        </motion.div>
        {/* Smile */}
        <div
          className="absolute border-b-2 border-white/85 rounded-b-full"
          style={{
            top: size * 0.56,
            left: "50%",
            marginLeft: -size * 0.11,
            width: size * 0.22,
            height: size * 0.1,
          }}
        />
      </motion.div>

      {/* Online dot */}
      <span
        className="absolute rounded-full bg-green-400 border-2 border-background"
        style={{ width: size * 0.2, height: size * 0.2, bottom: 0, right: 0 }}
      >
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
      </span>
    </div>
  );
};

export default DiyamaAvatar;
