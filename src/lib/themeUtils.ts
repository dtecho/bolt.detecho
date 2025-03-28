import {
  THEME_STORAGE_KEY,
  ACCENT_COLOR_STORAGE_KEY,
  ACCENT_COLORS,
} from "@/components/sidebar/ThemeSettings";

/**
 * Get the current theme mode from localStorage
 */
export function getThemeMode(): string | null {
  return localStorage.getItem(THEME_STORAGE_KEY);
}

/**
 * Set the theme mode in localStorage
 */
export function setThemeMode(isDark: boolean): void {
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");

  // Apply theme to document
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

/**
 * Get the current accent color from localStorage
 */
export function getAccentColor(): string {
  const savedColor = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
  return savedColor || ACCENT_COLORS[0].value; // Default to first color if not set
}

/**
 * Set the accent color in localStorage
 */
export function setAccentColor(color: string): void {
  localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, color);

  // Apply accent color to CSS variables
  document.documentElement.style.setProperty("--accent-color", color);
}

/**
 * Reset all theme settings to defaults
 */
export function resetThemeSettings(): void {
  localStorage.removeItem(THEME_STORAGE_KEY);
  localStorage.removeItem(ACCENT_COLOR_STORAGE_KEY);

  // Reset to light theme
  document.documentElement.classList.remove("dark");

  // Reset to default accent color
  document.documentElement.style.setProperty(
    "--accent-color",
    ACCENT_COLORS[0].value,
  );
}

/**
 * Apply the current theme settings on page load
 */
export function applyStoredThemeSettings(): void {
  const savedTheme = getThemeMode();
  const savedAccentColor = getAccentColor();

  // Apply theme mode
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // If no preference is saved, check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }

  // Apply accent color
  document.documentElement.style.setProperty(
    "--accent-color",
    savedAccentColor,
  );
}
