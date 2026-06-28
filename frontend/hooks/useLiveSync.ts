"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const SSE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/sse";

const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECTS     = 10;

// Debounce window — if multiple events arrive within this period,
// only ONE router.refresh() fires at the end.
// This prevents race conditions when the admin saves and multiple
// SSE events arrive in quick succession.
const REFRESH_DEBOUNCE_MS = 300;

export type SyncStatus = "connecting" | "connected" | "reconnecting" | "failed";

interface UseLiveSyncOptions {
  onStatusChange?: (status: SyncStatus) => void;
}

export function useLiveSync(options: UseLiveSyncOptions = {}) {
  const router             = useRouter();
  const esRef              = useRef<EventSource | null>(null);
  const reconnectCount     = useRef(0);
  const reconnectTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshTimer       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted          = useRef(true);
  const { onStatusChange } = options;

  const setStatus = useCallback(
    (s: SyncStatus) => { onStatusChange?.(s); },
    [onStatusChange],
  );

  // Debounced refresh — collapses rapid-fire events into one refresh
  const scheduleRefresh = useCallback(() => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
    }
    refreshTimer.current = setTimeout(() => {
      if (isMounted.current) {
        router.refresh();
      }
    }, REFRESH_DEBOUNCE_MS);
  }, [router]);

  const connect = useCallback(() => {
    if (!isMounted.current) return;

    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    setStatus("connecting");

    const es = new EventSource(SSE_URL);
    esRef.current = es;

    es.addEventListener("connected", () => {
      reconnectCount.current = 0;
      setStatus("connected");
    });

    es.addEventListener("portfolio-update", () => {
      // Use debounced refresh — not direct router.refresh()
      // This is what fixes the "need to refresh 3 times" problem
      scheduleRefresh();
    });

    es.onerror = () => {
      es.close();
      esRef.current = null;

      if (!isMounted.current) return;

      if (reconnectCount.current >= MAX_RECONNECTS) {
        setStatus("failed");
        return;
      }

      reconnectCount.current += 1;
      setStatus("reconnecting");

      const delay = Math.min(
        RECONNECT_DELAY_MS * Math.pow(1.5, reconnectCount.current - 1),
        30_000,
      );

      reconnectTimer.current = setTimeout(() => {
        if (isMounted.current) connect();
      }, delay);
    };
  }, [setStatus, scheduleRefresh]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (refreshTimer.current)   clearTimeout(refreshTimer.current);
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}