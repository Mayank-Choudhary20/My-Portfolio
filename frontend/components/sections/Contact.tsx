"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, User, Send, CheckCircle, AlertCircle, MapPin, Github, Linkedin, Phone } from "lucide-react";
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
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClasses = (field: keyof FormData) =>
    `w-full px-4 py-3.5 rounded-xl glass border text-sm text-slate-200 placeholder-slate-600 bg-transparent transition-all duration-200 focus:outline-none focus:ring-0 ${
      errors[field]
        ? "border-red-500/50 focus:border-red-500/80"
        : "border-white/8 focus:border-cyan-500/40 hover:border-white/15"
    }`;

  const contactInfo = [
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
  ];

  return (
    <section className="relative py-28 overflow-hidden bg-[#020617]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="relative section-container">
        <SectionTitle
          label="Contact"
          title="Let's"
          highlight="Connect"
          description="Have a project in mind or want to discuss opportunities? I'd love to hear from you."
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Open to{" "}
                <span className="gradient-text">Conversations</span>
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Whether you have a question, a project idea, or just want to say hi — my inbox is always open. I typically respond within 24 hours.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-4"
                >
                  {info.href ? (
                    <a href={info.href} className="flex items-center gap-4 group">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${info.color} group-hover:bg-white/8 transition-colors`}>
                        <info.icon size={18} />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">{info.label}</div>
                        <div className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">
                          {info.value}
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${info.color}`}>
                        <info.icon size={18} />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">{info.label}</div>
                        <div className="text-sm text-slate-300 font-medium">{info.value}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-4 font-medium">
                Find me on
              </div>
              <div className="flex gap-3">
                {profile?.github && (
                  <motion.a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl glass border border-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaGithub size={20} />
                  </motion.a>
                )}
                {profile?.linkedin && (
                  <motion.a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl glass border border-white/8 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/20 transition-all"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaLinkedin size={20} />
                  </motion.a>
                )}
                {profile?.email && (
                  <motion.a
                    href={`mailto:${profile.email}`}
                    className="w-12 h-12 rounded-xl glass border border-white/8 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/20 transition-all"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Mail size={20} />
                  </motion.a>
                )}
              </div>
            </div>

            {/* Availability */}
            {profile?.available && (
              <div className="glass-card rounded-2xl p-5 border border-emerald-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <div className="text-sm font-semibold text-emerald-400">Available for Work</div>
                    <div className="text-xs text-slate-500 mt-0.5">Open to full-time and freelance opportunities</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="glass-card rounded-3xl p-8">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle size={32} className="text-emerald-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-400 text-sm">
                      Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Error status */}
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
                      >
                        <AlertCircle size={15} />
                        Failed to send message. Please try again.
                      </motion.div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="text-xs text-slate-500 mb-2 block font-medium">
                          Your Name *
                        </label>
                        <div className="relative">
                          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={`${inputClasses("name")} pl-10`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-xs text-slate-500 mb-2 block font-medium">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className={`${inputClasses("email")} pl-10`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-medium">
                        Subject *
                      </label>
                      <div className="relative">
                        <MessageSquare size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="Project Inquiry"
                          className={`${inputClasses("subject")} pl-10`}
                        />
                      </div>
                      {errors.subject && (
                        <p className="text-xs text-red-400 mt-1">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block font-medium">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell me about your project..."
                        className={`${inputClasses("message")} resize-none`}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.message ? (
                          <p className="text-xs text-red-400">{errors.message}</p>
                        ) : (
                          <span />
                        )}
                        <span className="text-xs text-slate-600">
                          {form.message.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full btn-primary py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {status === "loading" ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </motion.button>
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