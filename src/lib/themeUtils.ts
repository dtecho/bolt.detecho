import {
  THEME_STORAGE_KEY,
  ACCENT_COLOR_STORAGE_KEY,
  ACCENT_COLORS,
} from "@/components/sidebar/ThemeSettings";

/**
 * Theme utility functions for managing theme settings across the application
 */

/**
 * Get the current theme mode from localStorage
 * @returns 'dark' | 'light' | null
 */
export const getThemeMode = (): string | null => {
  return localStorage.getItem(THEME_STORAGE_KEY);
};

/**
 * Get the current accent color from localStorage
 * @returns color string or default color
 */
export const getAccentColor = (): string => {
  return (
    localStorage.getItem(ACCENT_COLOR_STORAGE_KEY) || ACCENT_COLORS[0].value
  );
};

/**
 * Set the theme mode and apply it to the document
 * @param isDark boolean indicating if dark mode should be enabled
 */
export const setThemeMode = (isDark: boolean): void => {
  // Update localStorage
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");

  // Apply to document
  document.documentElement.classList.toggle("dark", isDark);
};

/**
 * Set the accent color and apply it to the document
 * @param color string color value (hex)
 */
export const setAccentColor = (color: string): void => {
  // Update localStorage
  localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, color);

  // Apply to document
  document.documentElement.style.setProperty("--accent-color", color);
};

/**
 * Reset theme settings to defaults
 */
export const resetThemeSettings = (): void => {
  // Reset to light mode
  setThemeMode(false);

  // Reset to default accent color
  setAccentColor(ACCENT_COLORS[0].value);
};

/**
 * Initialize theme settings from localStorage or system preferences
 */
export const initializeThemeSettings = (): void => {
  // Check for saved theme preference
  const savedTheme = getThemeMode();

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // If no preference is saved, check for system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    document.documentElement.classList.toggle("dark", prefersDark);
    localStorage.setItem(THEME_STORAGE_KEY, prefersDark ? "dark" : "light");
  }

  // Check for saved accent color
  const savedAccentColor = getAccentColor();
  document.documentElement.style.setProperty(
    "--accent-color",
    savedAccentColor,
  );
};

/**
 * Setup listener for system theme changes
 */
export const setupSystemThemeListener = (): (() => void) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    const savedTheme = getThemeMode();
    // Only apply system preference if user hasn't explicitly set a preference
    if (!savedTheme) {
      document.documentElement.classList.toggle("dark", e.matches);
      localStorage.setItem(THEME_STORAGE_KEY, e.matches ? "dark" : "light");
    }
  };

  // Add listener for system theme changes
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }

  return () => {};
};
