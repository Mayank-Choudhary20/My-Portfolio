"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Admin, Toast } from "@/types";

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// ─── Token ────────────────────────────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}
export function setToken(t: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("admin_token", t);
}
export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin_token");
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
interface AuthStore {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      login: (token, admin) => {
        setToken(token);
        set({ token, admin, isAuthenticated: true });
      },
      logout: () => {
        removeToken();
        set({ token: null, admin: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },
    }),
    { name: "admin-auth" }
  )
);

// ─── Toast ────────────────────────────────────────────────────────────────────
interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = generateId();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// ─── Sidebar ──────────────────────────────────────────────────────────────────
interface SidebarStore {
  isOpen: boolean;
  isCollapsed: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  isCollapsed: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setCollapsed: (v) => set({ isCollapsed: v }),
}));

// ─── Command ──────────────────────────────────────────────────────────────────
interface CommandStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));

// ─── Activity ─────────────────────────────────────────────────────────────────
export interface ActivityEntry {
  id: string;
  action: "created" | "updated" | "deleted";
  resource: string;
  label: string;
  timestamp: string;
}

interface ActivityStore {
  activities: ActivityEntry[];
  addActivity: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set) => ({
      activities: [],
      addActivity: (entry) =>
        set((state) => ({
          activities: [
            { ...entry, id: generateId(), timestamp: new Date().toISOString() },
            ...state.activities.slice(0, 49),
          ],
        })),
      clearActivities: () => set({ activities: [] }),
    }),
    { name: "admin-activity" }
  )
);