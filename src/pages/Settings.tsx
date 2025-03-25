import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { usePersona } from "@/contexts/PersonaContext";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const { persona, updatePersona } = usePersona();
  const [apiKey, setApiKey] = React.useState("");
  const [darkMode, setDarkMode] = React.useState(true);
  const [accentColor, setAccentColor] = React.useState("#7c3aed");
  const [chatSettings, setChatSettings] = React.useState({
    temperature: 0.7,
    maxTokens: 1000,
    model: "gpt-4",
  });

  const handleSaveAPIKey = () => {
    // In a real app, you would save this securely
    localStorage.setItem("openai_api_key", apiKey);
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved successfully.",
      duration: 3000,
    });
  };

  const handleSaveChatSettings = () => {
    // Save chat settings
    localStorage.setItem("chat_settings", JSON.stringify(chatSettings));
    toast({
      title: "Chat Settings Saved",
      description: "Your chat settings have been updated.",
      duration: 3000,
    });
  };

  const handleSaveThemeSettings = () => {
    // Save theme settings
    localStorage.setItem(
      "theme_settings",
      JSON.stringify({ darkMode, accentColor }),
    );
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.setProperty("--accent-color", accentColor);
    toast({
      title: "Theme Settings Saved",
      description: "Your theme settings have been updated.",
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage your application settings, API keys, and preferences.
      </p>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="chat">Chat Settings</TabsTrigger>
          <TabsTrigger value="persona">Persona</TabsTrigger>
          <TabsTrigger value="interface">Interface</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Configure your API keys for various services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                <Input
                  id="openai-api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
              <Button onClick={handleSaveAPIKey}>Save API Key</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat Configuration</CardTitle>
              <CardDescription>
                Configure settings for the chat interface and AI responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <select
                    id="model"
                    className="w-full p-2 border rounded-md bg-background"
                    value={chatSettings.model}
                    onChange={(e) =>
                      setChatSettings({
                        ...chatSettings,
                        model: e.target.value,
                      })
                    }
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    value={chatSettings.maxTokens}
                    onChange={(e) =>
                      setChatSettings({
                        ...chatSettings,
                        maxTokens: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">
                  Temperature: {chatSettings.temperature}
                </Label>
                <Input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={chatSettings.temperature}
                  onChange={(e) =>
                    setChatSettings({
                      ...chatSettings,
                      temperature: parseFloat(e.target.value),
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Lower values make responses more deterministic, higher values
                  make them more creative.
                </p>
              </div>

              <Button onClick={handleSaveChatSettings}>
                Save Chat Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="persona" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Persona Settings</CardTitle>
              <CardDescription>
                Configure your AI assistant's persona and behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="persona-name">Persona Name</Label>
                <Input
                  id="persona-name"
                  value={persona?.name || ""}
                  onChange={(e) =>
                    updatePersona({ ...persona, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="persona-description">Description</Label>
                <textarea
                  id="persona-description"
                  className="w-full p-2 border rounded-md min-h-[100px] bg-background"
                  value={persona?.description || ""}
                  onChange={(e) =>
                    updatePersona({ ...persona, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="persona-tone">Tone</Label>
                <select
                  id="persona-tone"
                  className="w-full p-2 border rounded-md bg-background"
                  value={persona?.tone || "helpful"}
                  onChange={(e) =>
                    updatePersona({ ...persona, tone: e.target.value })
                  }
                >
                  <option value="helpful">Helpful</option>
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              <Button
                onClick={() => {
                  toast({
                    title: "Persona Updated",
                    description: "Your persona settings have been saved.",
                    duration: 3000,
                  });
                }}
              >
                Save Persona Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interface" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interface Settings</CardTitle>
              <CardDescription>
                Customize the appearance and behavior of the interface.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for the interface.
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="accent-color"
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <Button onClick={handleSaveThemeSettings}>
                Save Interface Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
