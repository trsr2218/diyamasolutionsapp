import { useEffect, useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";

/* Reads a Business Kit aloud, for the visitor who would rather listen than read.
 * Uses the browser's own speech engine (the Web Speech API), so it costs nothing and
 * needs no key, which is the standing budget rule. Where the browser has no voice,
 * the button simply does not render. */

interface KitLike {
  summary: string;
  services: string[];
  quickWins: string[];
  blindSpots: string[];
  risks?: string[];
  nextStep: string;
}

const toSpeech = (kit: KitLike, businessName: string) => {
  const name = businessName || "your business";
  const list = (items: string[]) => items.map((s) => s.replace(/\s+/g, " ").trim()).join(". ");
  const parts = [
    `Here is the business kit for ${name}.`,
    `Summary. ${kit.summary}`,
    `Recommended services. ${list(kit.services)}.`,
    `Quick wins. ${list(kit.quickWins)}.`,
    `Possible blind spots. ${list(kit.blindSpots)}.`,
  ];
  if (kit.risks && kit.risks.length) parts.push(`Risks to watch. ${list(kit.risks)}.`);
  parts.push(`Recommended next step. ${kit.nextStep}`);
  parts.push("That is the end of your kit. Book a consultation when you are ready.");
  return parts.join(" ");
};

const pickVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter((v) => /^en/i.test(v.lang));
  return (
    english.find((v) => /en-ZA|en-GB/i.test(v.lang) && /natural|online|neural/i.test(v.name)) ||
    english.find((v) => /natural|online|neural/i.test(v.name)) ||
    english.find((v) => /en-ZA|en-GB/i.test(v.lang)) ||
    english[0] ||
    null
  );
};

const KitReader = ({ kit, businessName }: { kit: KitLike; businessName: string }) => {
  const [supported, setSupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const stop = () => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const play = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(toSpeech(kit, businessName));
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.lang = voice?.lang || "en-GB";
    u.rate = 0.98;
    u.pitch = 1;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    utteranceRef.current = u;
    setPlaying(true);
    window.speechSynthesis.speak(u);
  };

  if (!supported) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={playing ? stop : play}
        aria-pressed={playing}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
          playing
            ? "border-accent bg-accent/15 text-accent"
            : "border-border bg-surface hover:border-primary/40 hover:shadow-sm"
        }`}
      >
        {playing ? <Square size={15} /> : <Volume2 size={16} />}
        {playing ? "Stop reading" : "Listen instead of reading"}
      </button>
      {playing && (
        <span className="flex items-end gap-0.5 h-4" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-accent animate-pulse"
              style={{ height: `${6 + ((i * 7) % 11)}px`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </span>
      )}
    </div>
  );
};

export default KitReader;
