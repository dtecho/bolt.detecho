import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Palette, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

// Constants for theme storage
export const THEME_STORAGE_KEY = "theme-mode";
export const ACCENT_COLOR_STORAGE_KEY = "accent-color";
export const ACCENT_COLORS = [
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Violet", value: "violet" },
  { label: "Pink", value: "pink" },
  { label: "Orange", value: "orange" },
];

// Helper functions for theme storage
export const getStoredTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(THEME_STORAGE_KEY) || "system";
  }
  return "system";
};

export const getStoredAccentColor = () => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem(ACCENT_COLOR_STORAGE_KEY) || ACCENT_COLORS[0].value
    );
  }
  return ACCENT_COLORS[0].value;
};

interface ThemeSettingsProps {
  className?: string;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ className }) => {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    accentColor,
    setAccentColor,
  } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing window/localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Palette className="mr-2 h-5 w-5 text-primary" />
        Theme Settings
      </h3>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base">Appearance</Label>
          <div className="flex items-center justify-between gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setTheme("system")}
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="font-size" className="text-base">
              Font Size
            </Label>
            <span className="text-sm text-muted-foreground">{fontSize}px</span>
          </div>
          <Slider
            id="font-size"
            min={12}
            max={20}
            step={1}
            value={[fontSize]}
            onValueChange={(value) => setFontSize(value[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="accent-color" className="text-base">
            Accent Color
          </Label>
          <Select value={accentColor} onValueChange={setAccentColor}>
            <SelectTrigger id="accent-color">
              <SelectValue placeholder="Select accent color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="violet">Violet</SelectItem>
              <SelectItem value="pink">Pink</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
