import React, { useState, useEffect } from "react";
import { MainLayout } from "./index";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import {
  getStoredTheme,
  getStoredAccentColor,
  ACCENT_COLORS,
} from "@/components/sidebar/ThemeSettings";

interface LayoutProps {
  children?: React.ReactNode;
  isDarkMode?: boolean;
  onThemeChange?: (isDark: boolean) => void;
  accentColor?: string;
  onAccentColorChange?: (color: string) => void;
  showHeader?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
}

const Layout = ({
  children,
  isDarkMode: propsDarkMode,
  onThemeChange = () => {},
  accentColor: propsAccentColor,
  onAccentColorChange = () => {},
  showHeader = true,
  showFooter = true,
  showSidebar = true,
}: LayoutProps) => {
  // Initialize state from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = getStoredTheme();
    return savedTheme === "dark" ? true : propsDarkMode || false;
  });

  const [accentColor, setAccentColor] = useState(() => {
    const savedColor = getStoredAccentColor();
    return savedColor || propsAccentColor || ACCENT_COLORS[0].value;
  });

  // Sync with props if they change externally
  useEffect(() => {
    if (propsDarkMode !== undefined && propsDarkMode !== isDarkMode) {
      setIsDarkMode(propsDarkMode);
    }
  }, [propsDarkMode]);

  useEffect(() => {
    if (propsAccentColor && propsAccentColor !== accentColor) {
      setAccentColor(propsAccentColor);
    }
  }, [propsAccentColor]);

  // Handle theme changes
  const handleThemeChange = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
    onThemeChange(darkMode);
  };

  // Handle accent color changes
  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    onAccentColorChange(color);
  };

  return (
    <motion.div
      className="min-h-screen bg-background transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MainLayout
        isDarkMode={isDarkMode}
        onThemeChange={handleThemeChange}
        accentColor={accentColor}
        onAccentColorChange={handleAccentColorChange}
        showHeader={showHeader}
        showFooter={showFooter}
      >
        {children}
      </MainLayout>
      <Toaster />
    </motion.div>
  );
};

export default Layout;
