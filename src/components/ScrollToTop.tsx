import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Top of the page on every navigation, unless the link names a section
   (for example /#beon), in which case go to that section once it has rendered. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      let tries = 0;
      const find = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (tries++ < 20) {
          timer = window.setTimeout(find, 100);
        }
      };
      let timer = window.setTimeout(find, 0);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
};

export default ScrollToTop;
