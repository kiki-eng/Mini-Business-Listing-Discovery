import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loadThemeMode, saveThemeMode } from '../storage/businessStorage';
import { colors, ThemeColors } from '../theme/colors';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    let cancelled = false;
    loadThemeMode().then((stored) => {
      if (!cancelled && stored) {
        setMode(stored);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((current) => {
      const next = current === 'light' ? 'dark' : 'light';
      void saveThemeMode(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      colors: colors[mode],
      isDark: mode === 'dark',
      toggleTheme,
    }),
    [mode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
