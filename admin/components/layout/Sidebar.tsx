"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, User, Briefcase, Cpu, GraduationCap, 
  Award, Image, FileText, Brain, Users, Mail, Settings, 
  ShieldCheck, LogOut, ChevronLeft, Menu, X
} from "lucide-react";
import { useSidebarStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Projects", icon: Briefcase, href: "/projects" },
  { label: "Skills", icon: Cpu, href: "/skills" },
  { label: "Experience", icon: Briefcase, href: "/experience" },
  { label: "Education", icon: GraduationCap, href: "/education" },
  { label: "Certificates", icon: Award, href: "/certificates" },
  { label: "Showcase", icon: Image, href: "/showcase" },
  { label: "Resume", icon: FileText, href: "/resume" },
  { label: "AI Knowledge", icon: Brain, href: "/ai" },
  { label: "Visitors", icon: Users, href: "/visitors" },
  { label: "Contacts", icon: Mail, href: "/contacts" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Administrators", icon: ShieldCheck, href: "/admins" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isOpen, setCollapsed, close } = useSidebarStore();
  const { logout, admin } = useAuthStore();

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 260,
          x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0)
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-black border-r border-white/5 flex flex-col transition-all duration-300",
          !isOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="font-bold tracking-tight text-lg"
            >
              ADMIN
            </motion.span>
          )}
          {isCollapsed && <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-bold mx-auto">A</div>}
          
          <button 
            onClick={() => setCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 hover:bg-white/5 rounded-md text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} className={cn("transition-transform", isCollapsed && "rotate-180")} />
          </button>
          
          <button onClick={close} className="lg:hidden p-1.5 text-white/40">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => { if(window.innerWidth < 1024) close() }}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                  active ? "bg-white text-black" : "text-white/40 hover:text-white hover:bg-white/5"
                )}>
                  <item.icon size={20} className={cn("shrink-0", active ? "text-black" : "group-hover:text-white")} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 font-bold">
                      {item.label}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer / User info */}
        <div className="p-4 border-t border-white/5">
          <div className={cn("flex items-center gap-3 mb-4 px-2", isCollapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <User size={14} className="text-white/60" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-medium truncate">{admin?.email}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Admin</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={logout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors group",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}