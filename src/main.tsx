import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { TempoDevtools } from "tempo-devtools";
import {
  THEME_STORAGE_KEY,
  ACCENT_COLOR_STORAGE_KEY,
  ACCENT_COLORS,
} from "./components/sidebar/ThemeSettings";
TempoDevtools.init();

// Apply theme settings before rendering to prevent flash of incorrect theme
const applyInitialTheme = () => {
  // Check for saved theme preference and apply it immediately
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // If no preference is saved, check for system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark");
      // Save the preference based on system
      localStorage.setItem(THEME_STORAGE_KEY, "dark");
    }
  }

  // Check for saved accent color
  const savedAccentColor = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
  if (savedAccentColor) {
    document.documentElement.style.setProperty(
      "--accent-color",
      savedAccentColor,
    );
  } else {
    // If no accent color is saved, use the default
    const defaultColor = ACCENT_COLORS[0].value;
    document.documentElement.style.setProperty("--accent-color", defaultColor);
    localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, defaultColor);
  }
};

// Apply theme settings immediately
applyInitialTheme();

// Listen for system theme changes
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  // Only apply system preference if user hasn't explicitly set a preference
  if (!savedTheme) {
    document.documentElement.classList.toggle("dark", e.matches);
    localStorage.setItem(THEME_STORAGE_KEY, e.matches ? "dark" : "light");
  }
};

// Add listener for system theme changes
if (mediaQuery.addEventListener) {
  mediaQuery.addEventListener("change", handleSystemThemeChange);
}

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
