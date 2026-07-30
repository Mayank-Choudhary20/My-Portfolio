"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { Admin, Toast } from "@/types";

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// ─── Token Helpers ────────────────────────────────────────────────────────────
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

// ─── Auth Store ───────────────────────────────────────────────────────────────
interface AuthStore {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      // This flag lives INSIDE the store so React can subscribe to it.
      // It is NOT persisted — it always starts false and becomes true
      // after Zustand finishes reading from localStorage.
      _hasHydrated: false,
      setHasHydrated: (val: boolean) => set({ _hasHydrated: val }),
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
    {
      // CRITICAL: Use ONE consistent name. Clear the old keys from
      // localStorage manually once by opening DevTools console and running:
      // localStorage.removeItem('admin-auth-store')
      // localStorage.removeItem('admin-auth')
      name: "admin-auth",
      storage: createJSONStorage(() => localStorage),
      // Do NOT persist the hydration flag itself
      partialize: (state) => ({
        token: state.token,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
      // Zustand 5.x uses onRehydrateStorage instead of onFinishHydration
      // This is the correct API for Zustand 5.x
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Auth store hydration error:", error);
          }
          // After rehydration completes, flip the flag.
          // This triggers a re-render in all subscribed components.
          if (state) {
            state.setHasHydrated(true);
          }
        };
      },
    }
  )
);

// ─── CORRECT Hydration Hook for Zustand 5.x ───────────────────────────────────
// Reads _hasHydrated directly from the store state.
// No useEffect timing issues. No external subscription needed.
// Components re-render automatically when _hasHydrated flips to true.
export function useAuthHydrated(): boolean {
  return useAuthStore((state) => state._hasHydrated);
}

// ─── Toast Store ──────────────────────────────────────────────────────────────
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
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// ─── Sidebar Store ────────────────────────────────────────────────────────────
interface SidebarStore {
  isOpen: boolean;
  isCollapsed: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: false,
      isCollapsed: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      setCollapsed: (v) => set({ isCollapsed: v }),
    }),
    {
      name: "admin-sidebar",
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);

// ─── Command Store ────────────────────────────────────────────────────────────
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

// ─── Activity Store ───────────────────────────────────────────────────────────
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
            {
              ...entry,
              id: generateId(),
              timestamp: new Date().toISOString(),
            },
            ...state.activities.slice(0, 49),
          ],
        })),
      clearActivities: () => set({ activities: [] }),
    }),
    { name: "admin-activity" }
  )
);