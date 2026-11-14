import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/* Night mode. Ernest, 13 Nov 2026: a dark mode toggle, easy to reach, on every site.
 * Ernest, 14 Nov 2026: every site opens light by day and dark at night. index.html picks
 * from the visitor's clock (06:00 to 18:00 is day) before the first paint. A choice made
 * here lasts for this visit only ("diyama-theme" in sessionStorage); the next visit
 * follows the clock again. */
const KEY = "diyama-theme";

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const flip = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      sessionStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      /* private window: the choice lasts for this page only */
    }
    setDark(next);
  };
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={dark ? "Switch to day mode" : "Switch to night mode"}
      title={dark ? "Day mode" : "Night mode"}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground hover:bg-muted transition-colors ${className}`}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
