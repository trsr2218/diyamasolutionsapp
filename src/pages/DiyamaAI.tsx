import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, RotateCcw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import PageTransition from "@/components/PageTransition";
import DiyamaAvatar from "@/components/DiyamaAvatar";
import { toast } from "@/hooks/use-toast";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type Msg = { role: "user" | "assistant"; content: string };

const suggestedPrompts = [
  "How do I get my first 50 customers?",
  "What's the best marketing strategy for a restaurant?",
  "How should I price my consulting services?",
  "I want to grow my tourism business in Zambia",
  "Help me think through my startup idea",
  "What's the difference between branding and marketing?",
];

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || "Something went wrong. Please try again.");
    return;
  }

  if (!resp.body) { onError("No response body"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }
  onDone();
}

const DiyamaAI = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: newMessages,
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast({ title: "Error", description: err, variant: "destructive" });
          setIsLoading(false);
        },
      });
    } catch {
      toast({ title: "Connection error", description: "Could not reach Diyama AI. Please try again.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="px-4 py-3 sm:py-4 bg-gradient-to-b from-foreground to-foreground/95 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 right-10 w-48 h-48 rounded-full bg-accent blur-3xl" />
            <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full bg-primary blur-3xl" />
          </div>
          <div className="container-narrow mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-row items-center justify-center gap-3 sm:gap-4">
              <DiyamaAvatar
                size={44}
                mood={isLoading ? (messages[messages.length - 1]?.role === "assistant" ? "speaking" : "thinking") : "idle"}
              />
              <div className="text-left">
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold">
                  Diyama <Sparkles size={12} className="text-accent" />
                </div>
                <p className="text-xs opacity-70">
                  {isLoading
                    ? messages[messages.length - 1]?.role === "assistant"
                      ? "Typing..."
                      : "Thinking..."
                    : "Online, ready to help"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 container-narrow mx-auto px-4 w-full bg-gradient-to-b from-surface to-background">
          {messages.length === 0 ? (
            <div className="py-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="flex flex-col items-center text-center mb-8"
              >
                <DiyamaAvatar size={88} mood="idle" className="mb-5" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                  Hi, I'm <span className="text-gradient-primary">Diyama</span>.
                </h2>
                <p className="text-muted-foreground text-sm max-w-md">
                  Your always-on business advisor. Bring me any challenge: marketing, pricing, growth, or a brand new idea.
                </p>
              </motion.div>
              <p className="text-center text-muted-foreground mb-6 text-sm">Try one of these to get started:</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                {suggestedPrompts.map((p) => (
                  <motion.button key={p} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleSend(p)} className="text-sm bg-card border rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-sm transition-all">
                    {p}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4 flex-1 overflow-y-auto">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <DiyamaAvatar
                      size={30}
                      mood={isLoading && i === messages.length - 1 ? "speaking" : "idle"}
                      className="mr-2 mt-1 shrink-0"
                    />
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border rounded-bl-sm shadow-sm"}`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start items-start">
                  <DiyamaAvatar size={30} mood="thinking" className="mr-2 mt-1 shrink-0" />
                  <div className="bg-card border rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        <div className="border-t bg-background sticky bottom-0 py-4 shadow-lg">
          <div className="container-narrow mx-auto px-4 flex items-center gap-3">
            {messages.length > 0 && (
              <button onClick={() => setMessages([])} className="p-2.5 rounded-lg border text-muted-foreground hover:text-foreground transition-colors" title="Reset conversation">
                <RotateCcw size={18} />
              </button>
            )}
            <div className="flex-1 relative">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Ask Diyama anything about business..." className="w-full bg-surface border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button onClick={() => handleSend()} disabled={!input.trim() || isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary disabled:text-muted-foreground/30 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DiyamaAI;
