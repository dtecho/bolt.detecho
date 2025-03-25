import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "./layout/MainLayout";
import { Toaster } from "./ui/toaster";
import { useToast, toast } from "./ui/use-toast";
import { motion } from "framer-motion";
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
      >
        {/* The MainLayout component handles the structure with sidebar and chat interface */}
      </MainLayout>
      <Toaster />
    </motion.div>
  );
};

export default Home;
