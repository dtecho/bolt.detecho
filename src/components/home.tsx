import React, { useState, useEffect, useCallback } from "react";
import Layout from "./layout/index";
import { useToast } from "./ui/use-toast";
import { usePersona } from "@/contexts/PersonaContext";

const Home = () => {
  const { toast } = useToast();
  const { persona } = usePersona();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState("#0ea5e9");

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("bolt-diy-dark-mode");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Check for saved accent color
    const savedAccentColor = localStorage.getItem("bolt-diy-accent-color");
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
      document.documentElement.style.setProperty(
        "--accent-color",
        savedAccentColor,
      );
    }

    toast({
      title: "Persona Active",
      description: `Your assistant is using the "${persona.name}" persona.`,
      duration: 3000,
    });
  }, [persona.name, toast]);

  const handleThemeChange = useCallback(
    (isDark: boolean) => {
      setIsDarkMode(isDark);
      // Apply dark mode class to document
      document.documentElement.classList.toggle("dark", isDark);
      // Save preference to localStorage
      localStorage.setItem("bolt-diy-dark-mode", isDark ? "dark" : "light");
      toast({
        title: "Theme Updated",
        description: `Theme switched to ${isDark ? "dark" : "light"} mode.`,
        duration: 3000,
      });
    },
    [toast],
  );

  const handleAccentColorChange = useCallback(
    (color: string) => {
      setAccentColor(color);
      // Update CSS variable for accent color
      document.documentElement.style.setProperty("--accent-color", color);
      // Save preference to localStorage
      localStorage.setItem("bolt-diy-accent-color", color);
      toast({
        title: "Accent Color Updated",
        description: "The interface accent color has been changed.",
        duration: 3000,
      });
    },
    [toast],
  );

  return (
    <Layout
      isDarkMode={isDarkMode}
      onThemeChange={handleThemeChange}
      accentColor={accentColor}
      onAccentColorChange={handleAccentColorChange}
      showHeader={false}
      showFooter={false}
    >
      {/* The Layout component handles the structure with sidebar and chat interface */}
    </Layout>
  );
};

export default Home;
