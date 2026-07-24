"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { useToastStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const iconMap = {
  success: <CheckCircle className="text-green-500" size={18} />,
  error: <AlertCircle className="text-red-500" size={18} />,
  warning: <AlertTriangle className="text-amber-500" size={18} />,
  info: <Info className="text-blue-500" size={18} />,
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-[380px]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="glass-card flex items-start gap-3 p-4 shadow-2xl relative overflow-hidden group"
          >
            <div className="mt-0.5">{iconMap[toast.type]}</div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-white/50 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/20 hover:text-white/60 transition-colors"
            >
              <X size={16} />
            </button>
            {/* Progress bar timer */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
              className={cn(
                "absolute bottom-0 left-0 h-[2px] opacity-40",
                toast.type === "success" && "bg-green-500",
                toast.type === "error" && "bg-red-500",
                toast.type === "warning" && "bg-amber-500",
                toast.type === "info" && "bg-blue-500"
              )}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}