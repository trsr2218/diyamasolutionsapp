import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Shown when a form cannot be saved. The backend has gone down before without
 * anyone noticing, and every lead in that window was lost. This makes sure a
 * visitor who took the time to write to us can still reach a person in one tap,
 * with what they typed carried across.
 */
const WhatsAppFallback = ({ message, className = "" }: { message: string; className?: string }) => (
  <div role="alert" className={`rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm ${className}`}>
    <p className="font-medium text-foreground mb-1">We could not send that from here.</p>
    <p className="text-muted-foreground mb-3">
      Nothing you typed is lost. Send it to us on WhatsApp instead, it is already written for you.
    </p>
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-accent inline-flex items-center gap-2"
    >
      <MessageCircle size={16} aria-hidden /> Send on WhatsApp
    </a>
  </div>
);

export default WhatsAppFallback;
