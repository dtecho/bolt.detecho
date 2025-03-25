import { useState, useEffect, useCallback } from "react";
import { ACCENT_COLORS } from "@/components/sidebar/ThemeSettings";
import {
  setThemeMode,
  setAccentColor,
  getThemeMode,
  getAccentColor,
  resetThemeSettings,
} from "@/lib/themeUtils";

/**
 * Custom hook for managing theme settings
 */
export function useTheme() {
  // Initialize state from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = getThemeMode();
    return savedTheme === "dark";
  });

  const [accentColor, setAccentColorState] = useState(() => {
    return getAccentColor();
  });

  // Toggle dark mode
  const toggleDarkMode = useCallback(
    (value?: boolean) => {
      const newValue = value !== undefined ? value : !isDarkMode;
      setIsDarkMode(newValue);
      setThemeMode(newValue);
    },
    [isDarkMode],
  );

  // Change accent color
  const changeAccentColor = useCallback((color: string) => {
    setAccentColorState(color);
    setAccentColor(color);
  }, []);

  // Reset to defaults
  const resetTheme = useCallback(() => {
    setIsDarkMode(false);
    setAccentColorState(ACCENT_COLORS[0].value);
    resetThemeSettings();
  }, []);

  // Sync with system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = getThemeMode();
      // Only apply system preference if user hasn't explicitly set a preference
      if (!savedTheme) {
        setIsDarkMode(e.matches);
        setThemeMode(e.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    return undefined;
  }, []);

  return {
    isDarkMode,
    accentColor,
    toggleDarkMode,
    changeAccentColor,
    resetTheme,
  };
}

export default useTheme;
