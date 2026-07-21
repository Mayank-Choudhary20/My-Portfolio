"use client";

import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { Mail, Download, ArrowUp, MapPin, Phone } from "lucide-react";
import type { Profile, Resume, Setting } from "@/types/portfolio";

interface FooterProps {
  profile?: Profile | null;
  resume?: Resume | null;
  settings?: Setting | null;
}

export default function Footer({ profile, resume, settings }: FooterProps) {
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const portfolioName =
    settings?.portfolioName || profile?.name || "Mayank Choudhary";
  const tagline =
    profile?.tagline ||
    "Building intelligent, scalable systems that make a difference.";
  const location = settings?.location || profile?.location;
  const email = settings?.email || profile?.email;
  const phone = settings?.phone || profile?.phone;
  const resumeUrl = settings?.resumeUrl || resume?.fileUrl;

  const github = settings?.githubUrl || profile?.github;
  const linkedin = settings?.linkedinUrl || profile?.linkedin;
  const twitter = settings?.twitterUrl || profile?.twitter;
  const instagram = settings?.instagramUrl || profile?.instagram;
  const leetcode = settings?.leetcodeUrl || profile?.leetcode;
  const codechef = settings?.codechefUrl || profile?.codechef;

  const socials = [
    { icon: FaGithub, href: github, label: "GitHub", color: "#ffffff" },
    { icon: FaLinkedin, href: linkedin, label: "LinkedIn", color: "#0ea5e9" },
    { icon: FaTwitter, href: twitter, label: "Twitter", color: "#1da1f2" },
    { icon: FaInstagram, href: instagram, label: "Instagram", color: "#e1306c" },
    { icon: SiLeetcode, href: leetcode, label: "LeetCode", color: "#ffa116" },
    { icon: SiCodechef, href: codechef, label: "CodeChef", color: "#a9733c" },
  ].filter((s) => s.href);

  const navSections = [
    { label: "About", href: "#about" },
    { label: "Education", href: "#education" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Certificates", href: "#certificates" },
    { label: "Showcase", href: "#showcase" },
    { label: "Profiles", href: "#coding-profiles" },
    { label: "Resume", href: "#resume" },
    { label: "Ask AI", href: "#ai" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "rgba(2,6,23,0.95)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/4 blur-[100px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-purple-600/4 blur-[100px]" />
      </div>

      <div className="relative section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #00e5ff, #3b82f6)",
                }}
              >
                {portfolioName[0]}
              </div>
              <div>
                <div className="font-bold text-white text-sm">
                  {portfolioName}
                </div>
                <div className="text-xs text-slate-500">
                  {profile?.title || "AI & Full Stack Developer"}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-xs">
              {tagline}
            </p>
            {location && (
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                <MapPin size={11} />
                <span>{location}</span>
              </div>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-cyan-400 transition-colors mb-2"
              >
                <Mail size={11} />
                <span>{email}</span>
              </a>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone size={11} />
                <span>{phone}</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 tracking-widest uppercase">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navSections.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-cyan-400 text-xs">
                      ›
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white mb-4 tracking-widest uppercase">
              More
            </h4>
            <ul className="space-y-2">
              {navSections.slice(6).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-cyan-400 text-xs">
                      ›
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 tracking-widest uppercase">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2 mb-5">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  whileHover={{
                    y: -3,
                    scale: 1.1,
                    color: s.color,
                    borderColor: `${s.color}40`,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <s.icon size={15} />
                </motion.a>
              ))}
            </div>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(124,58,237,0.2))",
                  border: "1px solid rgba(59,130,246,0.3)",
                }}
              >
                <Download size={12} />
                Download Resume
              </a>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} {portfolioName}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational</span>
            </div>
            <motion.button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}