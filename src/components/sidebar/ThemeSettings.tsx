import React from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Sun, Moon, Palette } from "lucide-react";

// Storage keys
export const THEME_STORAGE_KEY = "theme";
export const ACCENT_COLOR_STORAGE_KEY = "accentColor";

// Constants for theme settings
export const ACCENT_COLORS = [
  { name: "Blue", value: "#0284c7" },
  { name: "Green", value: "#16a34a" },
  { name: "Red", value: "#dc2626" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Orange", value: "#ea580c" },
];

// Helper functions for theme storage
export const getStoredTheme = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(THEME_STORAGE_KEY) || "light";
  }
  return "light";
};

export const setStoredTheme = (theme: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};

export const getStoredAccentColor = (): string => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem(ACCENT_COLOR_STORAGE_KEY) || ACCENT_COLORS[0].value
    );
  }
  return ACCENT_COLORS[0].value;
};

export const setStoredAccentColor = (color: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, color);
  }
};

const ThemeSettings = () => {
  const [theme, setTheme] = React.useState<"light" | "dark">(
    () => getStoredTheme() as "light" | "dark",
  );
  const [accentColor, setAccentColor] = React.useState<string>(() =>
    getStoredAccentColor(),
  );
  const [fontSize, setFontSize] = React.useState<number>(16);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    setStoredAccentColor(color);
  };

  return (
    <div className="space-y-6 bg-background p-4 rounded-lg border">
      <div>
        <h3 className="text-lg font-medium">Theme Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of your workspace.
        </p>
      </div>
      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {theme === "light" ? (
              <Sun className="h-4 w-4 text-primary" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
            <Label htmlFor="theme-mode">Dark Mode</Label>
          </div>
          <Switch
            id="theme-mode"
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-primary" />
            <Label>Accent Color</Label>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {ACCENT_COLORS.map((colorObj) => (
              <Button
                key={colorObj.value}
                variant="outline"
                className="w-full h-8 p-0 border-2"
                style={{
                  backgroundColor: colorObj.value,
                  borderColor:
                    colorObj.value === accentColor ? "white" : "transparent",
                }}
                onClick={() => handleAccentColorChange(colorObj.value)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
          <Slider
            id="font-size"
            min={12}
            max={24}
            step={1}
            value={[fontSize]}
            onValueChange={(value) => setFontSize(value[0])}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="mr-2">
          Reset
        </Button>
        <Button size="sm">Apply</Button>
      </div>
    </div>
  );
};

export default ThemeSettings;
