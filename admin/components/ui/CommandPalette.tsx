"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Briefcase, Cpu, User, FileText, Settings, X } from "lucide-react";
import { useCommandStore } from "@/lib/store";

const commands = [
  { group: "General", items: [
    { label: "Dashboard", href: "/dashboard", icon: Command },
    { label: "Settings", href: "/settings", icon: Settings },
  ]},
  { group: "Content", items: [
    { label: "Manage Profile", href: "/profile", icon: User },
    { label: "Add Project", href: "/projects/new", icon: Briefcase },
    { label: "Update Skills", href: "/skills", icon: Cpu },
    { label: "Upload Resume", href: "/resume", icon: FileText },
  ]},
];

export function CommandPalette() {
  const { isOpen, close } = useCommandStore();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!query) return commands;
    return commands.map(group => ({
      ...group,
      items: group.items.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    })).filter(group => group.items.length > 0);
  }, [query]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [close]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={close} className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-xl glass-card shadow-2xl overflow-hidden relative z-10 border-white/10"
        >
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <Search size={18} className="text-white/30" />
            <input
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20 text-sm"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={close} className="p-1 hover:bg-white/5 rounded text-white/20"><X size={16}/></button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredItems.length === 0 && (
              <div className="p-8 text-center text-white/20 text-sm">No results found.</div>
            )}
            {filteredItems.map((group) => (
              <div key={group.group} className="mb-4">
                <div className="px-3 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">{group.group}</div>
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { router.push(item.href); close(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white text-sm text-left group"
                  >
                    <item.icon size={16} className="text-white/20 group-hover:text-white" />
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-white/[0.02] border-t border-white/5 flex justify-between items-center px-4">
            <div className="flex gap-4">
              <span className="text-[10px] text-white/20 flex items-center gap-1">
                <kbd className="bg-white/10 px-1 rounded text-white/40">↑↓</kbd> Navigate
              </span>
              <span className="text-[10px] text-white/20 flex items-center gap-1">
                <kbd className="bg-white/10 px-1 rounded text-white/40">↵</kbd> Select
              </span>
            </div>
            <span className="text-[10px] text-white/20">
              <kbd className="bg-white/10 px-1 rounded text-white/40">ESC</kbd> Close
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}