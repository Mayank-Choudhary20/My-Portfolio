"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useToastStore } from "@/lib/store";

// ─── useQuery — fetch on mount + refetch support ──────────────────────────────
export function useQuery<T>(
  apiFn: () => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<Error | null>(null);
  const mountedRef            = useRef(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current)
        setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => { mountedRef.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── useApi — mutation helper ─────────────────────────────────────────────────
interface UseApiOptions<T> {
  onSuccess?:      (data: T) => void;
  onError?:        (error: Error) => void;
  successMessage?: string;
  errorMessage?:   string;
}

// ↓ TArgs captures the exact argument tuple of whatever function is passed in
export function useApi<T, TArgs extends unknown[]>(
  apiFn: (...args: TArgs) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<Error | null>(null);
  const { addToast }          = useToastStore();

  const execute = useCallback(
    async (...args: TArgs): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFn(...args);
        setData(result);
        if (options.successMessage) {
          addToast({ type: "success", title: options.successMessage });
        }
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Unknown error");
        setError(e);
        addToast({
          type:  "error",
          title: options.errorMessage || e.message,
        });
        options.onError?.(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiFn]
  );

  return { data, loading, error, execute };
}