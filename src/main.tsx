import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { preloadForPath } from "./pages/lazyPages";
import "./index.css";

const render = () =>
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );

// Fetch this page's code first so the prerendered content is replaced by the real
// page, not by a blank loading state. If the chunk fails, render anyway.
preloadForPath(window.location.pathname).then(render, render);
