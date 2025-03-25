import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun, Palette, RotateCcw, Keyboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import KeyboardShortcutsDialog from "@/components/ui/keyboard-shortcuts-dialog";

// Polyfill for markup_templating if needed
if (typeof window !== "undefined") {
  // Create a global object for markup_templating if it doesn't exist
  if (!window.hasOwnProperty("require_markup_templating")) {
    Object.defineProperty(window, "require_markup_templating", {
      value: {},
      writable: true,
      configurable: true,
    });
  }

  // Ensure the object has all necessary properties
  const markupTemplating = window.require_markup_templating;
  if (typeof markupTemplating === "object") {
    // Add any required properties/methods that might be missing
    if (!markupTemplating.hasOwnProperty("default")) {
      markupTemplating.default = {};
    }
  }
}

interface ThemeSettingsProps {
  isDarkMode?: boolean;
  onThemeChange?: (isDark: boolean) => void;
  accentColor?: string;
  onAccentColorChange?: (color: string) => void;
}

export const THEME_STORAGE_KEY = "bolt-diy-dark-mode";
export const ACCENT_COLOR_STORAGE_KEY = "bolt-diy-accent-color";

export const ACCENT_COLORS = [
  { name: "Default", value: "#0ea5e9", class: "bg-blue-500" },
  { name: "Purple", value: "#8b5cf6", class: "bg-purple-500" },
  { name: "Green", value: "#10b981", class: "bg-green-500" },
  { name: "Red", value: "#ef4444", class: "bg-red-500" },
  { name: "Amber", value: "#f59e0b", class: "bg-amber-500" },
  { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
];

// Helper functions for theme management
export const getStoredTheme = (): string | null => {
  return localStorage.getItem(THEME_STORAGE_KEY);
};

export const getStoredAccentColor = (): string | null => {
  return localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
};

export const setStoredTheme = (isDark: boolean): void => {
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
};

export const setStoredAccentColor = (color: string): void => {
  localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, color);
};

export const applyTheme = (isDark: boolean): void => {
  document.documentElement.classList.toggle("dark", isDark);
};

export const applyAccentColor = (color: string): void => {
  document.documentElement.style.setProperty("--accent-color", color);
};

const ThemeSettings = ({
  isDarkMode = false,
  onThemeChange = () => {},
  accentColor = ACCENT_COLORS[0].value,
  onAccentColorChange = () => {},
}: ThemeSettingsProps) => {
  const { toast } = useToast();

  // Initialize from localStorage if available
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = getStoredTheme();
    return savedMode === "dark" ? true : isDarkMode;
  });

  const [selectedAccentColor, setSelectedAccentColor] = useState(() => {
    const savedColor = getStoredAccentColor();
    return savedColor || accentColor;
  });

  // Apply theme on initial render
  useEffect(() => {
    applyTheme(darkMode);
    applyAccentColor(selectedAccentColor);
  }, [darkMode, selectedAccentColor]);

  // Sync with props if they change externally
  useEffect(() => {
    if (isDarkMode !== darkMode) {
      setDarkMode(isDarkMode);
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (
      accentColor !== selectedAccentColor &&
      accentColor !== ACCENT_COLORS[0].value
    ) {
      setSelectedAccentColor(accentColor);
    }
  }, [accentColor]);

  const handleThemeToggle = (checked: boolean) => {
    setDarkMode(checked);
    onThemeChange(checked);
    applyTheme(checked);
    setStoredTheme(checked);

    toast({
      title: `${checked ? "Dark" : "Light"} mode activated`,
      description: `Theme preference saved for future visits`,
      duration: 2000,
    });
  };

  const handleAccentColorChange = (color: string) => {
    setSelectedAccentColor(color);
    onAccentColorChange(color);
    applyAccentColor(color);
    setStoredAccentColor(color);

    toast({
      title: "Accent color updated",
      description: "Color preference saved for future visits",
      duration: 2000,
    });
  };

  const resetToDefaults = () => {
    // Reset to default theme (light mode)
    setDarkMode(false);
    onThemeChange(false);
    applyTheme(false);
    setStoredTheme(false);

    // Reset to default accent color
    const defaultColor = ACCENT_COLORS[0].value;
    setSelectedAccentColor(defaultColor);
    onAccentColorChange(defaultColor);
    applyAccentColor(defaultColor);
    setStoredAccentColor(defaultColor);

    toast({
      title: "Theme reset to defaults",
      description: "Light mode and default blue accent color restored",
      duration: 3000,
    });
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
        {/* Keyboard shortcuts dialog */}
        <div className="flex justify-end mb-2">
          <KeyboardShortcutsDialog
            shortcuts={[
              {
                name: "Theme Controls",
                shortcuts: [
                  {
                    key: "D",
                    ctrlKey: true,
                    description: "Toggle dark/light mode",
                    action: () => {},
                  },
                ],
              },
            ]}
            trigger={<div />}
          />
        </div>

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
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground">Ctrl+D</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle dark mode with Ctrl+D</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch
              checked={darkMode}
              onCheckedChange={handleThemeToggle}
              aria-label="Toggle dark mode"
              className="data-[state=checked]:bg-primary"
            />
          </div>
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

        {/* Reset to defaults button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4 text-xs"
          onClick={resetToDefaults}
        >
          <RotateCcw className="h-3.5 w-3.5 mr-2" />
          Reset to Defaults
        </Button>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          Theme preferences are automatically saved for your next visit
        </p>
      </div>
    </div>
  );
};

export default ThemeSettings;
