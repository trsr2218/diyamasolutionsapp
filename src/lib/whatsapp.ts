export const WHATSAPP_NUMBER = "260966138238";

/** wa.me link, optionally with the message already typed in. */
export const whatsappLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Turns form fields into a readable WhatsApp message, skipping empty ones. */
export const formToMessage = (heading: string, fields: Record<string, string | undefined>) =>
  [
    heading,
    "",
    ...Object.entries(fields)
      .filter(([, v]) => v && v.trim())
      .map(([k, v]) => `${k}: ${v!.trim()}`),
  ].join("\n");
