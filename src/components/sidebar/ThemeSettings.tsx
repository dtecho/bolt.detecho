import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun, Palette } from "lucide-react";

interface ThemeSettingsProps {
  isDarkMode?: boolean;
  onThemeChange?: (isDark: boolean) => void;
  accentColor?: string;
  onAccentColorChange?: (color: string) => void;
}

const ACCENT_COLORS = [
  { name: "Default", value: "#0ea5e9", class: "bg-blue-500" },
  { name: "Purple", value: "#8b5cf6", class: "bg-purple-500" },
  { name: "Green", value: "#10b981", class: "bg-green-500" },
  { name: "Red", value: "#ef4444", class: "bg-red-500" },
  { name: "Amber", value: "#f59e0b", class: "bg-amber-500" },
  { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
];

const ThemeSettings = ({
  isDarkMode = false,
  onThemeChange = () => {},
  accentColor = ACCENT_COLORS[0].value,
  onAccentColorChange = () => {},
}: ThemeSettingsProps) => {
  // Initialize from localStorage if available
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("bolt-diy-dark-mode");
    return savedMode === "dark" ? true : isDarkMode;
  });

  const [selectedAccentColor, setSelectedAccentColor] = useState(() => {
    const savedColor = localStorage.getItem("bolt-diy-accent-color");
    return savedColor || accentColor;
  });

  // Apply theme on initial render
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.setProperty(
      "--accent-color",
      selectedAccentColor,
    );
  }, [darkMode, selectedAccentColor]);

  const handleThemeToggle = (checked: boolean) => {
    setDarkMode(checked);
    onThemeChange(checked);
    document.documentElement.classList.toggle("dark", checked);
    localStorage.setItem("bolt-diy-dark-mode", checked ? "dark" : "light");
  };

  const handleAccentColorChange = (color: string) => {
    setSelectedAccentColor(color);
    onAccentColorChange(color);
    document.documentElement.style.setProperty("--accent-color", color);
    localStorage.setItem("bolt-diy-accent-color", color);
  };

  return (
    <div className="p-4 space-y-6 bg-background rounded-lg border border-border shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-accent-color bg-clip-text text-transparent">
          Theme Settings
        </h3>
        <Palette className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-4">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center space-x-2">
            {darkMode ? (
              <Moon className="h-4 w-4 text-blue-400" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-sm font-medium">
              {darkMode ? "Dark" : "Light"} Mode
            </span>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={handleThemeToggle}
            aria-label="Toggle dark mode"
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Accent Color Selection */}
        <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
          <label className="text-sm font-medium">Accent Color</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {ACCENT_COLORS.map((color) => (
              <Button
                key={color.value}
                variant="outline"
                className={cn(
                  "h-8 p-0 border-2 transition-all duration-200 hover:scale-105",
                  selectedAccentColor === color.value
                    ? "border-primary ring-2 ring-primary/30 shadow-md"
                    : "border-transparent",
                )}
                onClick={() => handleAccentColorChange(color.value)}
                aria-label={`Select ${color.name} accent color`}
              >
                <div className="flex items-center justify-between w-full px-2">
                  <span className="text-xs">{color.name}</span>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full shadow-inner",
                      color.class,
                    )}
                    style={{ backgroundColor: color.value }}
                  />
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Theme settings are applied in real-time */}
      </div>
    </div>
  );
};

export default ThemeSettings;
