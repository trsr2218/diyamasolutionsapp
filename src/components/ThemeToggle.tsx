import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/* Night mode. Ernest, 13 Nov 2026: a dark mode toggle, easy to reach, on every site.
 * The choice is kept per device ("diyama-theme"); with no choice the phone's own setting
 * decides. index.html sets the class before the first paint, so there is no flash. */
const KEY = "diyama-theme";

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const flip = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
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
