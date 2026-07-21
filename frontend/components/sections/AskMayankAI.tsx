"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Brain,
  ChevronRight,
  RotateCcw,
  Zap,
  MessageCircle,
  Database,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import type { AiKnowledge, Profile } from "@/types/portfolio";

interface AskMayankAIProps {
  aiKnowledge: AiKnowledge[];
  profile: Profile | null;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "Tell me about yourself",
  "What are your top skills?",
  "Describe your experience",
  "What projects have you built?",
  "What is your educational background?",
  "Are you available for work?",
  "What technologies do you use?",
  "How can I contact you?",
];

/* ─── AI answer engine ────────────────────────────────────── */
function findAnswer(
  query: string,
  knowledge: AiKnowledge[],
  profile: Profile | null
): string {
  const q = query.toLowerCase().trim();

  if (
    q.includes("available") ||
    q.includes("hire") ||
    q.includes("work") ||
    q.includes("open")
  ) {
    if (profile) {
      return profile.available
        ? `Yes! ${profile.name} is currently available for new opportunities. Feel free to reach out at ${profile.email} to discuss projects or roles.`
        : `${profile.name} is currently occupied, but you can still reach out at ${profile.email} for future opportunities.`;
    }
  }

  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("phone")
  ) {
    if (profile) {
      return `You can reach ${profile.name} at:\n📧 Email: ${profile.email}${
        profile.phone ? `\n📞 Phone: ${profile.phone}` : ""
      }${profile.location ? `\n📍 Location: ${profile.location}` : ""}`;
    }
  }

  const scored = knowledge
    .map((k) => {
      const kq = k.question.toLowerCase();
      const ka = k.answer.toLowerCase();
      let score = 0;
      const words = q
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 2);
      words.forEach((word) => {
        if (kq.includes(word)) score += 3;
        if (ka.includes(word)) score += 1;
        if (k.category?.toLowerCase().includes(word)) score += 2;
      });
      if (kq.includes(q.substring(0, 10))) score += 5;
      return { ...k, score };
    })
    .filter((k) => k.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) return scored[0].answer;

  if (profile) {
    if (
      q.includes("who") ||
      q.includes("yourself") ||
      q.includes("about") ||
      q.includes("introduce")
    ) {
      return `Hi! I'm ${profile.name}, ${profile.title}. ${
        profile.about || profile.tagline
      }`;
    }
  }

  return "I don't have specific information about that yet. You can reach out directly through the contact section or check my LinkedIn/GitHub profiles for more details!";
}

/* ─── Typing indicator ────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#00e5ff" }}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Message bubble ─────────────────────────────────────── */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: isUser
            ? "linear-gradient(135deg, #3b82f6, #7c3aed)"
            : "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(59,130,246,0.2))",
          border: isUser ? "none" : "1px solid rgba(0,229,255,0.3)",
        }}
      >
        {isUser ? (
          <User size={14} className="text-white" />
        ) : (
          <Bot size={14} className="text-cyan-400" />
        )}
      </div>

      {/* Bubble */}
      <div
        className="max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
        style={{
          background: isUser
            ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(124,58,237,0.15))"
            : "rgba(255,255,255,0.04)",
          border: isUser
            ? "1px solid rgba(59,130,246,0.25)"
            : "1px solid rgba(255,255,255,0.07)",
          color: isUser ? "#e2e8f0" : "#cbd5e1",
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
        }}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

/* ─── Stat pill ───────────────────────────────────────────── */
function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Icon size={15} className="text-cyan-500 flex-shrink-0" />
      <div>
        <div className="text-xs text-slate-600">{label}</div>
        <div className="text-sm font-bold text-white">{value}</div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function AskMayankAI({
  aiKnowledge,
  profile,
}: AskMayankAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: `Hi! I'm an AI assistant trained on ${
        profile?.name || "Mayank"
      }'s portfolio data. Ask me anything about his skills, experience, projects, or education! 🚀`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  /*
    KEY FIX: scroll the CHAT BOX div, not the whole page.
    We ref the scrollable message container directly.
  */
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Scroll only within the chat box — no page jump */
  const scrollChatToBottom = useCallback(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollChatToBottom();
  }, [messages, isTyping, scrollChatToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      const delay = 300 + Math.random() * 500;
      await new Promise((r) => setTimeout(r, delay));

      const answer = findAnswer(trimmed, aiKnowledge, profile);
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: answer,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    },
    [aiKnowledge, profile, isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (s: string) => sendMessage(s);

  const resetChat = () => {
    setMessages([
      {
        id: "init-reset",
        role: "assistant",
        content: `Hi! I'm an AI assistant trained on ${
          profile?.name || "Mayank"
        }'s portfolio data. Ask me anything about his skills, experience, projects, or education! 🚀`,
        timestamp: new Date(),
      },
    ]);
    setInput("");
  };

  const categories = Array.from(
    new Set(aiKnowledge.map((k) => k.category).filter(Boolean))
  );

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "#020617" }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full bg-cyan-600/[0.04] blur-[150px]" />
        <div className="absolute bottom-1/3 -left-32 w-[550px] h-[550px] rounded-full bg-purple-600/[0.04] blur-[150px]" />
        {/* Animated scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,229,255,0.25), transparent)",
          }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative section-container">

        {/* ══ Section heading — RESTORED ══ */}
        <SectionTitle
          label="AI Assistant"
          title="Ask"
          highlight="Mayank AI"
          description="Powered by my portfolio knowledge base — ask anything about my skills, experience, or projects."
          accent="purple"
        />

        {/* ── Two-column layout ── */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ══════════════════════════════════════
              LEFT: Chat interface
          ══════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(8,12,28,0.97)",
              border: "1px solid rgba(0,229,255,0.15)",
              boxShadow:
                "0 0 0 1px rgba(0,229,255,0.05), 0 40px 80px rgba(0,0,0,0.5)",
              backdropFilter: "blur(40px)",
            }}
          >
            {/* Chat header */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,229,255,0.02)",
              }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(59,130,246,0.2))",
                    border: "1px solid rgba(0,229,255,0.3)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(0,229,255,0.2)",
                      "0 0 22px rgba(0,229,255,0.5)",
                      "0 0 10px rgba(0,229,255,0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain size={18} className="text-cyan-400" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#080c1c]"
                    style={{ background: "#10b981" }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>

                <div>
                  <div className="text-sm font-bold text-white">
                    Ask Mayank AI
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online · {aiKnowledge.length} knowledge entries
                  </div>
                </div>
              </div>

              <button
                onClick={resetChat}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                aria-label="Reset chat"
              >
                <RotateCcw size={11} />
                Reset
              </button>
            </div>

            {/*
              MESSAGE AREA
              ─ overflow-y-auto is on THIS div (chatBoxRef)
              ─ fixed height so only this box scrolls, NOT the page
            */}
            <div
              ref={chatBoxRef}
              className="flex flex-col gap-4 p-6 overflow-y-auto"
              style={{ height: "380px", overscrollBehavior: "contain" }}
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(59,130,246,0.2))",
                      border: "1px solid rgba(0,229,255,0.3)",
                    }}
                  >
                    <Bot size={14} className="text-cyan-400" />
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "4px 16px 16px 16px",
                    }}
                  >
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              {/* Invisible anchor — kept for safety but scrollTop handles it */}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions — only when conversation is fresh */}
            <AnimatePresence>
              {messages.length <= 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-4 flex-shrink-0"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="text-xs text-slate-600 mb-3 flex items-center gap-1.5 pt-3">
                    <Zap size={10} className="text-cyan-600" />
                    Suggested questions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.slice(0, 6).map((s) => (
                      <motion.button
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-1"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                        whileHover={{
                          borderColor: "rgba(0,229,255,0.3)",
                          background: "rgba(0,229,255,0.05)",
                        }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <ChevronRight size={9} className="text-slate-600" />
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div
              className="px-6 py-4 flex-shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about Mayank..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all disabled:opacity-50"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(0,229,255,0.3)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                  }
                  aria-label="Ask a question"
                />

                <motion.button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #00e5ff, #3b82f6)",
                    boxShadow: "0 4px 15px rgba(0,229,255,0.3)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Send message"
                >
                  <Send size={16} className="text-white" />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* ══════════════════════════════════════
              RIGHT: Info panel
          ══════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-5"
          >
            {/* How it works */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(8,12,28,0.97)",
                border: "1px solid rgba(0,229,255,0.12)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                >
                  <MessageCircle size={16} className="text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">How it works</div>
                  <div className="text-xs text-slate-600">Locally powered AI</div>
                </div>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Trained on my personal portfolio data",
                  "Answers about skills, projects & experience",
                  "No external API — fully offline matching",
                  "Instant responses from knowledge base",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-slate-400"
                  >
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#00e5ff" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatPill
                icon={Database}
                label="Knowledge Entries"
                value={aiKnowledge.length}
              />
              <StatPill
                icon={MessageCircle}
                label="Topics Covered"
                value={categories.length || "—"}
              />
            </div>

            {/* Knowledge categories */}
            {categories.length > 0 && (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(8,12,28,0.97)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={13} className="text-slate-600" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Knowledge Base
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#64748b",
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* More questions */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(8,12,28,0.97)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap size={13} className="text-cyan-600" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  More Questions
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.slice(4).map((s) => (
                  <motion.button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs text-left px-3 py-2 rounded-lg text-slate-400 hover:text-cyan-400 flex items-center gap-2 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    whileHover={{
                      borderColor: "rgba(0,229,255,0.25)",
                      background: "rgba(0,229,255,0.04)",
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ChevronRight
                      size={10}
                      className="text-slate-600 flex-shrink-0"
                    />
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}