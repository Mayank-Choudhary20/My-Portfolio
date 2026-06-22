"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageSquare,
  User,
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Profile } from "@/types/portfolio";

interface ContactProps {
  profile?: Profile | null;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

/* ─── Input style helper ──────────────────────────────────── */
function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#e2e8f0",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"}`,
    outline: "none",
    transition: "border-color 0.2s ease",
  };
}

function inputWithIconStyle(hasError: boolean): React.CSSProperties {
  return {
    ...inputStyle(hasError),
    paddingLeft: "40px",
  };
}

/* ─── Contact info row ────────────────────────────────────── */
function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  color: string;
  delay: number;
}) {
  const content = (
    <div className="flex items-center gap-4 w-full">
      {/* Icon box — fixed size so icons are always aligned */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        <Icon size={17} className={color} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-300 truncate">{value}</p>
      </div>

      {/* Arrow for links */}
      {href && (
        <ExternalLink
          size={13}
          className="text-slate-600 flex-shrink-0 group-hover:text-cyan-400 transition-colors duration-200"
        />
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="group"
    >
      {href ? (
        <a
          href={href}
          className="flex items-center rounded-xl p-3.5 transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(0,229,255,0.2)";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(0,229,255,0.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.03)";
          }}
        >
          {content}
        </a>
      ) : (
        <div
          className="flex items-center rounded-xl p-3.5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {content}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Social button ───────────────────────────────────────── */
function SocialBtn({
  href,
  icon: Icon,
  label,
  hoverColor,
  hoverBorder,
  hoverBg,
  delay,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  hoverColor: string;
  hoverBorder: string;
  hoverBg: string;
  delay: number;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-slate-400 text-sm font-medium transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = hoverColor;
        el.style.borderColor = hoverBorder;
        el.style.background = hoverBg;
        el.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = "";
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.background = "rgba(255,255,255,0.04)";
        el.style.transform = "";
      }}
    >
      <Icon size={16} />
      {label}
    </motion.a>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function Contact({ profile }: ContactProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 20)
      e.message = "Message must be at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "rgba(0,229,255,0.4)";
  };
  const blurBorder = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof FormData
  ) => {
    e.target.style.borderColor = errors[field]
      ? "rgba(239,68,68,0.5)"
      : "rgba(255,255,255,0.08)";
  };

  const contactRows = [
    {
      icon: Mail,
      label: "Email",
      value: profile?.email || "Get in touch",
      href: profile?.email ? `mailto:${profile.email}` : undefined,
      color: "text-cyan-400",
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile?.phone || "—",
      href: profile?.phone ? `tel:${profile.phone}` : undefined,
      color: "text-purple-400",
    },
    {
      icon: MapPin,
      label: "Location",
      value: profile?.location || "India",
      color: "text-blue-400",
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 hours",
      color: "text-green-400",
    },
  ];

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "#020617" }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/[0.04] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/[0.04] blur-[120px]" />
      </div>

      <div className="relative section-container">

        {/* ── Section title ── */}
        <SectionTitle
          label="Contact"
          title="Let's"
          highlight="Connect"
          description="Have a project in mind or want to discuss opportunities? I'd love to hear from you."
          accent="cyan"
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* ════════════════════════════════════
              LEFT — Info column
          ════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-7"
          >
            {/* Intro text */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Open to{" "}
                <span className="gradient-text">Conversations</span>
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Whether you have a question, a project idea, or just want to
                say hi — my inbox is always open. I typically respond within
                24&nbsp;hours.
              </p>
            </div>

            {/* Contact info rows */}
            <div className="flex flex-col gap-3">
              {contactRows.map((row, i) => (
                <ContactRow
                  key={i}
                  icon={row.icon}
                  label={row.label}
                  value={row.value}
                  href={row.href}
                  color={row.color}
                  delay={i * 0.07}
                />
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-3">
                Find me on
              </p>
              <div className="flex flex-wrap gap-3">
                {profile?.github && (
                  <SocialBtn
                    href={profile.github}
                    icon={FaGithub}
                    label="GitHub"
                    hoverColor="#ffffff"
                    hoverBorder="rgba(255,255,255,0.2)"
                    hoverBg="rgba(255,255,255,0.07)"
                    delay={0}
                  />
                )}
                {profile?.linkedin && (
                  <SocialBtn
                    href={profile.linkedin}
                    icon={FaLinkedin}
                    label="LinkedIn"
                    hoverColor="#60a5fa"
                    hoverBorder="rgba(59,130,246,0.3)"
                    hoverBg="rgba(59,130,246,0.06)"
                    delay={0.07}
                  />
                )}
                {profile?.email && (
                  <SocialBtn
                    href={`mailto:${profile.email}`}
                    icon={Mail}
                    label="Email Me"
                    hoverColor="#00e5ff"
                    hoverBorder="rgba(0,229,255,0.3)"
                    hoverBg="rgba(0,229,255,0.05)"
                    delay={0.14}
                  />
                )}
              </div>
            </div>

            {/* Availability badge */}
            {profile?.available && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-3 rounded-2xl p-4"
                style={{
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.18)",
                }}
              >
                <motion.span
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div>
                  <p className="text-sm font-bold text-emerald-400">
                    Available for Work
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Open to full-time and freelance opportunities
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ════════════════════════════════════
              RIGHT — Contact form
          ════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div
              className="rounded-3xl p-7"
              style={{
                background: "rgba(8,12,28,0.97)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
              }}
            >
              <AnimatePresence mode="wait">

                {/* ── Success ── */}
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-14"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{
                        background: "rgba(16,185,129,0.15)",
                        border: "1px solid rgba(16,185,129,0.3)",
                      }}
                    >
                      <CheckCircle size={30} className="text-emerald-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Thanks for reaching out. I&apos;ll get back to you within
                      24&nbsp;hours.
                    </p>
                  </motion.div>

                ) : (

                  /* ── Form ── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    {/* Form header */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-white mb-1">
                        Send a Message
                      </h3>
                      <p className="text-xs text-slate-500">
                        Fill in the form and I&apos;ll get back to you shortly.
                      </p>
                    </div>

                    {/* Error banner */}
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2.5 p-3 rounded-xl mb-5 text-sm text-red-400"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.2)",
                        }}
                      >
                        <AlertCircle size={15} className="flex-shrink-0" />
                        Failed to send. Please try again.
                      </motion.div>
                    )}

                    {/* Fields */}
                    <div className="flex flex-col gap-4">

                      {/* Name + Email row */}
                      <div className="grid sm:grid-cols-2 gap-4">

                        {/* Name */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                            Your Name *
                          </label>
                          <div className="relative">
                            <User
                              size={13}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
                            />
                            <input
                              name="name"
                              value={form.name}
                              onChange={handleChange}
                              onFocus={focusBorder}
                              onBlur={(e) => blurBorder(e, "name")}
                              placeholder="John Doe"
                              style={inputWithIconStyle(!!errors.name)}
                            />
                          </div>
                          {errors.name && (
                            <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                              <AlertCircle size={10} />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                            Email *
                          </label>
                          <div className="relative">
                            <Mail
                              size={13}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
                            />
                            <input
                              name="email"
                              type="email"
                              value={form.email}
                              onChange={handleChange}
                              onFocus={focusBorder}
                              onBlur={(e) => blurBorder(e, "email")}
                              placeholder="john@example.com"
                              style={inputWithIconStyle(!!errors.email)}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                              <AlertCircle size={10} />
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                          Subject *
                        </label>
                        <div className="relative">
                          <MessageSquare
                            size={13}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
                          />
                          <input
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            onFocus={focusBorder}
                            onBlur={(e) => blurBorder(e, "subject")}
                            placeholder="Project Inquiry"
                            style={inputWithIconStyle(!!errors.subject)}
                          />
                        </div>
                        {errors.subject && (
                          <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                            <AlertCircle size={10} />
                            {errors.subject}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          onFocus={focusBorder}
                          onBlur={(e) => blurBorder(e, "message")}
                          rows={5}
                          placeholder="Tell me about your project..."
                          style={{
                            ...inputStyle(!!errors.message),
                            resize: "none",
                          }}
                        />
                        <div className="flex items-center justify-between mt-1.5">
                          <span>
                            {errors.message && (
                              <p className="text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {errors.message}
                              </p>
                            )}
                          </span>
                          <span
                            className="text-xs ml-auto"
                            style={{
                              color:
                                form.message.length > 480
                                  ? "#f87171"
                                  : "#475569",
                            }}
                          >
                            {form.message.length}/500
                          </span>
                        </div>
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full btn-primary py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none mt-1"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {status === "loading" ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}