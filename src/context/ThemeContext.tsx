import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

export interface AppPalette {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceSubtle: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
}

const LIGHT_PALETTE: AppPalette = {
  isDark: false,
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  accent: '#0288D1',
  accentLight: '#E0F2FE',
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#EA580C',
  warningLight: '#FFEDD5',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
};

const DARK_PALETTE: AppPalette = {
  isDark: true,
  background: '#0B1120',
  surface: '#1E293B',
  surfaceSubtle: '#151F32',
  card: '#1E293B',
  cardBorder: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  accent: '#38BDF8',
  accentLight: '#082F49',
  success: '#4ADE80',
  successLight: '#052E16',
  warning: '#FB923C',
  warningLight: '#431407',
  danger: '#F87171',
  dangerLight: '#450A0A',
};

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: AppPalette;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  isDark: false,
  colors: LIGHT_PALETTE,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

const THEME_STORAGE_KEY = '@app_aprendizaje:theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Predeterminado en modo claro 'light'
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') {
          setThemeModeState(saved);
        }
      })
      .catch((err) => console.warn('Error loading theme:', err));
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch(() => {});
  };

  const toggleTheme = () => {
    setThemeModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {});
      return next;
    });
  };

  const isDark = themeMode === 'dark';
  const colors = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  // En navegadores web, asegurar que el fondo general del documento HTML se actualice de inmediato
  useEffect(() => {
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.backgroundColor = colors.background;
      document.body.style.color = colors.textPrimary;
    }
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, colors, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
