import { MessageCircle } from "lucide-react";

const FloatingCTA = () => {
  return (
    <a
      href="https://wa.me/260966138238"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
};

export default FloatingCTA;
