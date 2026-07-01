"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, Download, ArrowUp, MapPin } from "lucide-react";
import type { Profile } from "@/types/portfolio";
import type { Resume } from "@/types/portfolio";

interface FooterProps {
  profile?: Profile | null;
  resume?: Resume | null;
}

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Showcase", href: "#showcase" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({ profile, resume }: FooterProps) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/5 bg-[#020617] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[100px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      <div className="relative section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white">
                M
              </div>
              <div>
                <div className="font-bold text-white">Mayank Choudhary</div>
                <div className="text-xs text-slate-500">AI & Full Stack Developer</div>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4 max-w-xs">
              {profile?.tagline || "Building intelligent, scalable systems that make a difference."}
            </p>
            {profile?.location && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin size={12} />
                <span>{profile.location}</span>
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-cyan-400 text-xs">›</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">
              Connect
            </h4>
            <div className="space-y-3">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-sm text-slate-500 hover:text-cyan-400 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                    <Mail size={12} />
                  </div>
                  {profile.email}
                </a>
              )}
              {profile?.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-slate-500 hover:text-cyan-400 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                    <FaGithub size={12} />
                  </div>
                  GitHub
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-slate-500 hover:text-cyan-400 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                    <FaLinkedin size={12} />
                  </div>
                  LinkedIn
                </a>
              )}
              {resume?.fileUrl && (
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-slate-500 hover:text-cyan-400 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                    <Download size={12} />
                  </div>
                  Resume
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Mayank Choudhary. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational</span>
            </div>

            {/* Scroll to top */}
            <motion.button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
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