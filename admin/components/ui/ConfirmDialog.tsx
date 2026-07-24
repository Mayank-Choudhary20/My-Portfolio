"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "default";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  variant = "default",
}: Props) {
  if (!isOpen) return null;

  const danger = variant === "danger";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass-card w-full max-w-md p-6 z-10"
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                danger ? "bg-red-500/10" : "bg-white/5"
              }`}
            >
              <AlertTriangle
                size={18}
                className={danger ? "text-red-500" : "text-white/40"}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-white/40 mt-2">{message}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={danger ? "btn-danger" : "btn-primary"}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}