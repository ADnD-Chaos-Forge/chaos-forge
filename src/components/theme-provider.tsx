"use client";

import { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

function applyTheme(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
  document.documentElement.classList.toggle("light", t === "light");
}

let currentTheme: Theme = "dark";
const listeners = new Set<() => void>();

function getThemeSnapshot(): Theme {
  return currentTheme;
}

function getThemeServerSnapshot(): Theme {
  return "dark";
}

function subscribeToTheme(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function setThemeValue(t: Theme) {
  currentTheme = t;
  listeners.forEach((l) => l());
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getThemeServerSnapshot);

  useEffect(() => {
    const stored = (localStorage.getItem("chaos-forge-theme") as Theme) ?? "dark";
    setThemeValue(stored);
    applyTheme(stored);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("chaos-forge-theme", next);
    setThemeValue(next);
    applyTheme(next);
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
