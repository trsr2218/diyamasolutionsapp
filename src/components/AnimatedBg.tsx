interface AnimatedBgProps {
  variant?: "primary" | "accent" | "dark" | "subtle";
  className?: string;
}

const orbSets = {
  primary: [
    { cls: "w-[500px] h-[500px] bg-primary/5 -top-24 -left-24", anim: "animate-orb-1" },
    { cls: "w-[400px] h-[400px] bg-accent/4 bottom-0 right-0", anim: "animate-orb-2" },
    { cls: "w-72 h-72 bg-primary/3 top-1/2 right-1/4", anim: "animate-orb-3" },
  ],
  accent: [
    { cls: "w-[450px] h-[450px] bg-accent/5 -top-16 right-10", anim: "animate-orb-2" },
    { cls: "w-80 h-80 bg-primary/4 bottom-0 -left-10", anim: "animate-orb-1" },
    { cls: "w-64 h-64 bg-accent/3 top-1/3 left-1/3", anim: "animate-orb-3" },
  ],
  dark: [
    { cls: "w-[600px] h-[600px] bg-primary/20 -top-32 -right-32", anim: "animate-orb-1" },
    { cls: "w-[450px] h-[450px] bg-accent/14 -bottom-20 -left-20", anim: "animate-orb-2" },
    { cls: "w-80 h-80 bg-primary/8 top-1/2 left-1/2", anim: "animate-orb-3" },
  ],
  subtle: [
    { cls: "w-96 h-96 bg-primary/3 -top-10 right-0", anim: "animate-orb-2" },
    { cls: "w-80 h-80 bg-accent/3 bottom-0 left-0", anim: "animate-orb-3" },
  ],
};

const AnimatedBg = ({ variant = "subtle", className = "" }: AnimatedBgProps) => (
  <div
    className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    {orbSets[variant].map((orb, i) => (
      <div
        key={i}
        className={`absolute rounded-full blur-3xl will-change-transform ${orb.cls} ${orb.anim}`}
      />
    ))}
  </div>
);

export default AnimatedBg;
