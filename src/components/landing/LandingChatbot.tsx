"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface FaqMsg {
  sender: "bot" | "user";
  text: string;
}

const FAQ_DATA: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["pricing", "price", "cost", "how much", "rate", "cheap", "expensive", "afford"],
    answer:
      "Kriyava offers wallet-based pricing — you only pay for what you order. Services start as low as ₹0.50 per 1,000. We have three plans: Starter (free), Professional (₹1,999/mo), and Agency (₹4,999/mo). The Starter plan has zero monthly fees — just top up and order!",
  },
  {
    keywords: ["how", "work", "start", "begin", "step", "process", "use"],
    answer:
      "It's simple! 1️⃣ Create a free account in 30 seconds. 2️⃣ Add funds via UPI, cards, or net banking. 3️⃣ Pick a service (e.g., Instagram followers), paste your link, and set quantity. 4️⃣ Watch delivery happen in real-time on your dashboard. Most orders start within seconds!",
  },
  {
    keywords: ["platform", "support", "instagram", "youtube", "tiktok", "telegram", "facebook", "spotify", "twitter", "discord"],
    answer:
      "Kriyava supports all major platforms: Instagram, YouTube, TikTok, Telegram, Facebook, X (Twitter), Spotify, and Discord. We offer followers, likes, views, comments, shares, and more for each platform — all from one dashboard.",
  },
  {
    keywords: ["speed", "fast", "delivery", "time", "quick", "instant", "slow"],
    answer:
      "Most services start within seconds to a few minutes. Delivery speed varies by service — some offer instant burst delivery, while others use drip-feed mode to make growth look natural. Each service card shows its exact average start time and daily speed.",
  },
  {
    keywords: ["refill", "drop", "guarantee", "retention", "warranty"],
    answer:
      "Many of our services include refill guarantees — 30-day, 365-day, or even lifetime refill. If followers drop, we automatically refill them at no extra cost. The refill window is clearly labeled on every service, and you can request refills in one click from your dashboard.",
  },
  {
    keywords: ["safe", "secure", "ban", "risk", "account", "password", "dangerous"],
    answer:
      "Absolutely safe! We never ask for your password — only your public profile or post link. Delivery is drip-fed to look completely natural. We use high-retention, low-drop services to keep your account healthy. Thousands of creators trust Kriyava daily.",
  },
  {
    keywords: ["payment", "pay", "upi", "card", "razorpay", "method", "deposit", "fund"],
    answer:
      "We accept UPI, credit/debit cards, net banking, and wallets — all processed securely through Razorpay. Funds appear in your Kriyava wallet after payment verification. You can start with as little as ₹10!",
  },
  {
    keywords: ["api", "resell", "white label", "child panel", "agency"],
    answer:
      "Yes! Kriyava offers a full REST API for resellers and our Agency plan includes a white-label child panel with your own domain, logo, and custom pricing. Build your own SMM business powered by our multi-provider routing engine.",
  },
  {
    keywords: ["ai", "bot", "assistant", "chatbot", "agent"],
    answer:
      "Kriyava features an AI-powered growth assistant inside the dashboard! It can find the best services for you, check your balance, place orders automatically, and explain quality tiers. Just type what you need and the AI handles the rest.",
  },
];

const QUICK_QUESTIONS = [
  "How does it work?",
  "What platforms do you support?",
  "Is it safe to use?",
  "What are the prices?",
  "Do you offer refills?",
  "Payment methods?",
];

const SESSION_KEY = "kriyava_ai_landing_count";
const MAX_PROMPTS = 5;

function findAnswer(query: string): string {
  const q = query.toLowerCase();
  for (const faq of FAQ_DATA) {
    if (faq.keywords.some((kw) => q.includes(kw))) return faq.answer;
  }
  return "Great question! For detailed information, please sign up for a free account or reach out to our 24/7 support team. You can also browse our FAQ section on this page for more answers.";
}

export function LandingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<FaqMsg[]>([
    {
      sender: "bot",
      text: "👋 Hi there! I'm Kriyava's FAQ bot. Ask me anything about our SMM panel — pricing, platforms, delivery, safety, and more!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [usedPrompts, setUsedPrompts] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsedPrompts(Number(sessionStorage.getItem(SESSION_KEY) || 0));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    if (usedPrompts >= MAX_PROMPTS) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "You have used the 5 free AI prompts for this session. Please sign in to continue from the dashboard." },
      ]);
      return;
    }
    const userMsg: FaqMsg = { sender: "user", text: text.trim() };
    const nextCount = usedPrompts + 1;
    setUsedPrompts(nextCount);
    sessionStorage.setItem(SESSION_KEY, String(nextCount));
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    try {
      const res = await api.aiChat({
        prompt: text.trim(),
        surface: "landing",
        messages: messages.slice(-6).map((m) => ({ role: m.sender === "user" ? "user" : "model", text: m.text })),
      });
      setMessages((prev) => [...prev, { sender: "bot", text: res.reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: findAnswer(text) }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* Floating bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full text-white shadow-xl transition-transform hover:scale-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #2563EB)",
              boxShadow: "0 8px 30px rgba(124,58,237,0.45)",
            }}
            aria-label="Open FAQ chat"
          >
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[340px] sm:w-[370px] flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(13,19,33,0.92)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3.5 shrink-0"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/20">
                  <MessageCircle size={16} className="text-white" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">Have questions?</h3>
                  <span className="text-[10px] text-white/70 font-medium mt-0.5 block">
                    Gemini AI • {MAX_PROMPTS - usedPrompts}/{MAX_PROMPTS} left
                  </span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-white text-[10px] mt-0.5 ${
                      m.sender === "bot" ? "bg-purple-600/40" : "bg-blue-600/40"
                    }`}
                  >
                    {m.sender === "bot" ? <Bot size={12} /> : <User size={12} />}
                  </span>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-[12.5px] leading-relaxed ${
                      m.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white/[0.06] border border-white/[0.06] text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-white text-[10px] mt-0.5 bg-purple-600/40">
                    <Bot size={12} />
                  </span>
                  <div className="rounded-2xl rounded-tl-none border border-white/[0.06] bg-white/[0.06] px-3 py-2.5 text-[12.5px] text-slate-300">
                    Thinking...
                  </div>
                </div>
              )}

              {/* Quick question chips (show only initially) */}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => void send(q)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="border-t border-white/[0.06] p-3 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={usedPrompts >= MAX_PROMPTS ? "5 prompt limit reached" : "Ask about pricing, platforms..."}
                disabled={usedPrompts >= MAX_PROMPTS}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[12.5px] text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || usedPrompts >= MAX_PROMPTS}
                className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors active:scale-95 disabled:opacity-30"
                aria-label="Send"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
