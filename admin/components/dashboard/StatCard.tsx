"use client";

import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  loading?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="glass-card p-6 h-32 flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="w-24 h-4 skeleton" />
          <div className="w-8 h-8 skeleton rounded-lg" />
        </div>
        <div className="w-16 h-8 skeleton" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ translateY: -2 }}
      className="glass-card p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-white/40">{title}</span>
        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
          <Icon size={18} className="text-white" />
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full",
            trend >= 0 ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
          )}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </motion.div>
  );
}