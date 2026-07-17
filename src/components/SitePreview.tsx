import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface SitePreviewProps {
  image: string;
  domain: string | null;
  alt: string;
}

/**
 * A live-platform screenshot dressed as a mini browser window.
 * Parent should have the `group` class so the image zooms on card hover.
 */
const SitePreview = ({ image, domain, alt }: SitePreviewProps) => (
  <div className="rounded-lg overflow-hidden border border-border/70 shadow-sm mb-5 bg-muted">
    {/* Browser chrome */}
    <div className="flex items-center gap-2 px-3 py-2 bg-surface border-b border-border/60">
      <span className="flex gap-1.5" aria-hidden="true">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      </span>
      {domain && (
        <span className="flex items-center gap-1 mx-auto text-[11px] text-muted-foreground bg-background/80 border border-border/50 rounded-full px-2.5 py-0.5 truncate max-w-[70%]">
          <Lock size={9} className="shrink-0 opacity-60" />
          <span className="truncate">{domain}</span>
        </span>
      )}
    </div>
    {/* Screenshot */}
    <div className="relative aspect-[3/2] overflow-hidden">
      <motion.img
        src={image}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  </div>
);

export default SitePreview;
