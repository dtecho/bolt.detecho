import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

// Constants for theme settings
export const THEME_STORAGE_KEY = "theme-mode";
export const ACCENT_COLOR_STORAGE_KEY = "accent-color";
export const ACCENT_COLORS = [
  { name: "Default", value: "hsl(221.2 83.2% 53.3%)" },
  { name: "Purple", value: "hsl(262.1 83.3% 57.8%)" },
  { name: "Green", value: "hsl(142.1 76.2% 36.3%)" },
  { name: "Orange", value: "hsl(24.6 95% 53.1%)" },
  { name: "Pink", value: "hsl(346.8 77.2% 49.8%)" },
  { name: "Cyan", value: "hsl(189 94% 43%)" },
];

// Helper functions for theme management
export const getStoredTheme = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(THEME_STORAGE_KEY);
  }
  return null;
};

export const getStoredAccentColor = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
  }
  return null;
};

const ThemeSettings = () => {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(
    "system",
  );
  const [accentColor, setAccentColor] = React.useState(ACCENT_COLORS[0].value);

  // Load theme settings from localStorage on component mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark" | "system");
    }

    const savedAccentColor = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
    }
  }, []);

  // Update theme when it changes
  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem(THEME_STORAGE_KEY, "dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(THEME_STORAGE_KEY, "light");
    } else {
      // System preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      localStorage.setItem(THEME_STORAGE_KEY, "system");
    }
  }, [theme]);

  // Update accent color when it changes
  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor);
    localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, accentColor);
  }, [accentColor]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Theme Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application.
        </p>
      </div>
      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <div className="text-xs text-muted-foreground">
              Enable dark mode for the interface.
            </div>
          </div>
          <Switch
            id="dark-mode"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>

        <div className="space-y-2">
          <Label>Theme Mode</Label>
          <RadioGroup
            value={theme}
            onValueChange={(value) =>
              setTheme(value as "light" | "dark" | "system")
            }
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system">System</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Accent Color</Label>
          <div className="grid grid-cols-3 gap-2">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.name}
                className={`h-8 rounded-md border ${accentColor === color.value ? "ring-2 ring-primary" : ""}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setAccentColor(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
export { ThemeSettings };
