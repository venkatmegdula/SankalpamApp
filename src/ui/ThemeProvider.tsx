import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme } from './tokens';

type Mode = 'system' | 'light' | 'dark';

type Ctx = {
  theme: Theme;
  isDark: boolean;
  mode: Mode;
  setMode: (m: Mode) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<Mode>('system');

  const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';

  const value = useMemo<Ctx>(
    () => ({ theme: isDark ? darkTheme : lightTheme, isDark, mode, setMode }),
    [isDark, mode],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

/** Convenience — the overwhelmingly common case is wanting only the palette. */
export function useColors() {
  return useTheme().theme;
}
