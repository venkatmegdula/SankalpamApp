import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { OfflineError } from '@/data/repository';

type State<T> = {
  data: T | null;
  loading: boolean;
  error: 'offline' | 'failed' | null;
};

/**
 * Data fetching with real loading and error states.
 * Refetches on screen focus so mutations elsewhere are reflected without a
 * global cache layer — adequate for a mock-backed app, and the shape a real
 * query client would slot into.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const mounted = useRef(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await run();
        if (mounted.current) setState({ data, loading: false, error: null });
      } catch (e) {
        if (mounted.current)
          setState((s) => ({
            ...s,
            loading: false,
            error: e instanceof OfflineError ? 'offline' : 'failed',
          }));
      }
    },
    [run],
  );

  useEffect(() => {
    mounted.current = true;
    void load();
    return () => {
      mounted.current = false;
    };
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load(true);
    }, [load]),
  );

  return { ...state, reload: () => load(false) };
}

/** A ticking clock for countdowns. One interval, shared by whoever needs it. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
