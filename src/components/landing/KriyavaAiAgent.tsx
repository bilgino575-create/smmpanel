"use client";
import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, X, Bot, User, CheckCircle2 } from "lucide-react";
import { useAccount } from "@/lib/useAccount";
import { useMarket } from "@/lib/useServices";
import { fmtINR } from "@/lib/account";
import { api } from "@/lib/api";
import type { MarketService } from "@/lib/types";

interface Message {
  sender: "bot" | "user";
  text: string;
  card?: React.ReactNode;
  at: number;
}

const SESSION_KEY = "kriyava_ai_dashboard_count";
const MAX_PROMPTS = 5;

export function KriyavaAiAgent() {
  const { account } = useAccount();
  const { services } = useMarket();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [usedPrompts, setUsedPrompts] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize chatbot welcome message
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: `Hey, I'm Kriyava AI! Spark your social growth by telling me what you need. 

Try asking:
• "What is my current wallet balance?"
• "Find the cheapest Instagram followers service."
• "Why do cheap followers drop, and how do quality tiers work?"
• "Order 1,000 views on link: https://instagram.com/p/growth"`,
        at: Date.now(),
      },
    ]);
    setUsedPrompts(Number(sessionStorage.getItem(SESSION_KEY) || 0));
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (usedPrompts >= MAX_PROMPTS) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Session limit reached. You can ask 5 AI prompts per browser session. Refresh or come back later to continue.",
          at: Date.now(),
        },
      ]);
      return;
    }

    const userText = input.trim();
    setInput("");
    const nextCount = usedPrompts + 1;
    setUsedPrompts(nextCount);
    sessionStorage.setItem(SESSION_KEY, String(nextCount));
    
    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: userText, at: Date.now() }]);
    setTyping(true);

    try {
      const res = await api.aiChat({
        prompt: userText,
        surface: "dashboard",
        messages: messages
          .filter((m) => m.sender === "user" || m.sender === "bot")
          .slice(-6)
          .map((m) => ({ role: m.sender === "user" ? "user" : "model", text: m.text })),
        context: {
          name: account.name,
          balance: account.balance,
          spent: account.spent,
          orders: account.orders.length,
          sampleServices: services.slice(0, 8).map((s) => ({
            id: s.id,
            name: s.name,
            platform: s.platform,
            category: s.category,
            price: s.price,
            quality: s.quality,
            min: s.min,
            max: s.max,
          })),
        },
      });
      setTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text: res.reply, at: Date.now() }]);
    } catch {
      processCommand(userText);
    }
  };

  const processCommand = (query: string) => {
    const q = query.toLowerCase();
    setTyping(false);

    // 1. CHECK BALANCE
    if (q.includes("balance") || q.includes("money") || q.includes("wallet") || q.includes("fund")) {
      const text = `Your current Kriyava wallet balance is **${fmtINR(account.balance)}** (Total spent: ${fmtINR(account.spent)} across ${account.orders.length} orders). Let me know if you need to add more funds!`;
      setMessages((prev) => [...prev, { sender: "bot", text, at: Date.now() }]);
      return;
    }

    // 2. EXPLAIN QUALITY TIERS / DROPS
    if (q.includes("drop") || q.includes("quality") || q.includes("tier") || q.includes("refill")) {
      const text = `SMM services fall into three distinct quality tiers:
      
• **High Quality (HQ)**: Active profiles with profile pictures (DP) and organic posts. Extremely low drop rate (0-5%) and usually comes with a 30-day to Lifetime Refill guarantee.
• **Medium Quality (MQ)**: Real-looking accounts with global names. Low drop rate (5-15%) with active refill options.
• **Low Quality (LQ)**: Bot-driven profiles. High drop rate (40-80%) and no refill option, but extremely inexpensive.

*Pro tip: Always filter by 'High' quality in the services menu for organic branding.*`;
      setMessages((prev) => [...prev, { sender: "bot", text, at: Date.now() }]);
      return;
    }

    // 3. ORDER PLACEMENT PARSING
    const orderMatch = q.match(/(?:order|buy|get)\s+([\d,]+)\s+([\w\s]+)\s+(?:for|on|link)\s+(https?:\/\/[^\s]+)/i);
    if (orderMatch) {
      const qtyStr = orderMatch[1].replace(/,/g, "");
      const niche = orderMatch[2].trim();
      const link = orderMatch[3].trim();
      const qty = parseInt(qtyStr, 10);

      if (isNaN(qty) || qty <= 0) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Please specify a valid numeric quantity.", at: Date.now() },
        ]);
        return;
      }

      // Search for cheapest matching service
      const targetSvc = findCheapestServiceForNiche(niche);
      if (!targetSvc) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `I couldn't find a service matching "${niche}". Please try terms like "instagram followers", "instagram likes", "youtube views", or "telegram members".`,
            at: Date.now(),
          },
        ]);
        return;
      }

      prepareOrderSuggestion(targetSvc, qty, link);
      return;
    }

    // 4. CHEAPEST SERVICE QUERY
    const keywords = ["instagram", "youtube", "tiktok", "telegram", "facebook", "followers", "likes", "views", "comments", "members"];
    const matchedKws = keywords.filter((k) => q.includes(k));
    
    if (matchedKws.length > 0) {
      const bestSvc = findCheapestServiceForNiche(q);
      if (bestSvc) {
        const text = `I found a highly recommended match for your search! Here is the cheapest **${bestSvc.platform} ${bestSvc.category}** service available:`;
        
        const card = (
          <div className="mt-3 rounded-xl border border-[color:var(--color-line)] bg-white p-3.5 shadow-sm text-left">
            <span className="inline-block text-[10.5px] font-extrabold uppercase tracking-wide text-[color:var(--color-primary)] bg-blue-50 px-2 py-0.5 rounded-md mb-1.5">
              {bestSvc.platform} • Quality Tier {bestSvc.quality}/5
            </span>
            <div className="text-[13px] font-bold leading-snug mb-1 text-[color:var(--color-ink)] line-clamp-2">
              {bestSvc.name}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[color:var(--color-line-soft)] text-xs text-[color:var(--color-muted)]">
              <div>Price: <b className="text-[14px] text-[color:var(--color-ink)]">{fmtINR(bestSvc.price)}</b> / 1K</div>
              <div>Speed: <span className="font-semibold text-emerald-600">{bestSvc.speed}</span></div>
            </div>
            <button
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { sender: "user", text: `Order 1,000 units on service ${bestSvc.id}`, at: Date.now() },
                ]);
                prepareOrderSuggestion(bestSvc, 1000, "https://instagram.com/myprofile");
              }}
              className="btn btn-primary btn-block !py-2 !text-xs mt-3"
            >
              Order 1,000 Units Now (₹{(bestSvc.price).toFixed(2)})
            </button>
          </div>
        );

        setMessages((prev) => [...prev, { sender: "bot", text, card, at: Date.now() }]);
        return;
      }
    }

    // 5. DEFAULT BACKFALL RESPONSE
    const fallbackText = `I heard you, but I wasn't sure how to process that. You can ask me to:
    
• Find the cheapest service (e.g. "cheapest instagram followers")
• Check your current wallet balance
• Place an order (e.g. "order 1000 likes on https://instagram.com/my-post")
• Ask about low-drop vs high-quality tiers.`;
    setMessages((prev) => [...prev, { sender: "bot", text: fallbackText, at: Date.now() }]);
  };

  const findCheapestServiceForNiche = (nicheStr: string): MarketService | null => {
    if (!services || services.length === 0) return null;
    const keywords = nicheStr.toLowerCase().split(/\s+/).filter(Boolean);
    
    let matches = services.filter((s) => {
      const haystack = (s.name + " " + s.platform + " " + s.category).toLowerCase();
      return keywords.every((kw) => haystack.includes(kw));
    });

    if (matches.length === 0) return null;
    // Sort by price ascending
    return matches.sort((a, b) => a.price - b.price)[0];
  };

  const prepareOrderSuggestion = (svc: MarketService, qty: number, link: string) => {
    const total = +((svc.price * qty) / 1000).toFixed(2);

    if (account.balance < total) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `❌ **Insufficient Funds**: Ordering ${qty.toLocaleString()} units of *${svc.name.slice(0, 40)}...* costs **${fmtINR(total)}**, but you only have **${fmtINR(account.balance)}** in your wallet.

Go to the [Add Funds](/add-funds) page and complete a verified Razorpay top-up first.`,
          at: Date.now(),
        },
      ]);
      return;
    }

    const res = {
      order: {
        id: "ready",
        service: svc.name,
        charge: total,
      },
      balance: account.balance,
    };
    if (res.order) {
      
      const card = (
        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm text-left">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm mb-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            Order Ready
          </div>
          <div className="text-xs text-emerald-800 space-y-1.5">
            <div>Service: <span className="font-medium">{res.order.service}</span></div>
            <div>Quantity: <span className="font-bold">{qty.toLocaleString()} units</span></div>
            <div>Total Cost: <span className="font-extrabold">{fmtINR(res.order.charge)}</span></div>
            <div>Target Link: <span className="underline truncate block max-w-[20ch]">{link}</span></div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-emerald-700 bg-white/80 rounded-lg px-2.5 py-1.5">
            <span>Next step:</span>
            <span>Place it in dashboard</span>
          </div>
        </div>
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Great choice. I found the best matching service. Please place it from the dashboard so the backend can verify wallet balance and create the order securely.",
          card,
          at: Date.now(),
        },
      ]);
    }
  };

  return (
    <>
      {/* floating icon button — compact FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 active:scale-95"
        style={{
          background: open
            ? "linear-gradient(135deg, #1d4ed8, #5b21b6)"
            : "linear-gradient(135deg, #7C3AED, #2563EB)",
          boxShadow: "0 6px 24px rgba(124,58,237,0.45)",
        }}
        aria-label="Open Kriyava AI Assistant"
      >
        {open ? <X size={18} /> : <Sparkles size={18} />}
        {/* remaining prompts badge */}
        {!open && (MAX_PROMPTS - usedPrompts) < MAX_PROMPTS && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border border-[#090D16] text-[9px] font-black text-white grid place-items-center leading-none">
            {MAX_PROMPTS - usedPrompts}
          </span>
        )}
        {/* live dot */}
        {!open && (
          <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#090D16]" />
        )}
      </button>

      {/* chat dialog */}
      {open && (
        <div
          className="fixed bottom-20 right-4 z-[55] flex h-[min(500px,calc(100vh-6rem))] w-[calc(100vw-2rem)] max-w-[370px] flex-col rounded-2xl border border-white/10 bg-[#0D1321]/95 shadow-2xl overflow-hidden transition-all duration-300 sm:right-5"
          style={{ boxShadow: "var(--shadow-lg-soft)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3.5 text-white"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/20">
                <Sparkles size={16} />
              </span>
              <div>
                <h3 className="text-sm font-bold leading-none">Kriyava growth assistant</h3>
                <span className="text-[10px] text-white/80 font-medium mt-0.5 block flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  AI Agent Online
                </span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white" aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#090D16]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : ""}`}>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-white text-xs ${
                    m.sender === "bot" ? "icontint-violet" : "icontint-blue"
                  }`}
                >
                  {m.sender === "bot" ? <Bot size={14} /> : <User size={14} />}
                </span>
                <div className="max-w-[78%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                      m.sender === "user"
                        ? "bg-[color:var(--color-primary)] text-white rounded-tr-none"
                        : "bg-white/[0.06] border border-white/[0.08] text-slate-100 rounded-tl-none font-medium"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {m.text}
                  </div>
                  {m.card && m.card}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full icontint-violet text-white text-xs">
                  <Bot size={14} />
                </span>
                <div className="bg-white border border-[color:var(--color-line-soft)] rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-[color:var(--color-muted)] shadow-sm font-semibold flex items-center gap-1">
                  Agent is planning
                  <span className="flex gap-0.5 ml-1">
                    <span className="h-1 w-1 bg-[color:var(--color-muted)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1 w-1 bg-[color:var(--color-muted)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1 w-1 bg-[color:var(--color-muted)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} className="border-t border-white/10 p-3 bg-[#0D1321] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={usedPrompts >= MAX_PROMPTS ? "5 prompt limit reached" : "Ask services, balance, settings..."}
              disabled={usedPrompts >= MAX_PROMPTS}
              className="flex-1 rounded-[10px] border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || usedPrompts >= MAX_PROMPTS}
              className="grid h-9 w-9 place-items-center rounded-[10px] bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-600)] transition-colors active:scale-95 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
