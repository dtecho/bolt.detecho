import React, { useState, useEffect, useCallback } from "react";
import Layout from "./layout/index";
import { useToast } from "./ui/use-toast";
import { usePersona } from "@/contexts/PersonaContext";
import Button from "./ui/button";
import { Link } from "react-router-dom";
import {
  Code,
  MessageSquare,
  Settings,
  Sparkles,
  FileCode,
  Terminal,
  Layers,
  Cpu,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import PersonaTestingPlayground from "./playground/PersonaTestingPlayground";
import PersonaCreationWizard from "./sidebar/PersonaCreationWizard";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const Home = () => {
  const { toast } = useToast();
  const { persona, savePersona } = usePersona();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState("#0ea5e9");
  const [showPersonaWizard, setShowPersonaWizard] = useState(false);

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
      showHeader={true}
      showFooter={false}
    >
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Bolt.DIY Workbench</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Your AI-powered development environment with integrated tools and
          features.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Chat Interface
              </CardTitle>
              <CardDescription>
                Interact with the AI assistant to get help with your projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/">Open Chat</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all border-primary/20 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-5 w-5 text-primary" />
                Persona Dashboard
              </CardTitle>
              <CardDescription>
                Access your persona management dashboard to create, edit, and
                manage your AI personas.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link to="/dashboard">Open Dashboard</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Manage all your custom AI personas in one place
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5 text-primary" />
                Code Editor
              </CardTitle>
              <CardDescription>
                Edit code with AI assistance and real-time suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/code-editor">Open Code Editor</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Persona Testing
              </CardTitle>
              <CardDescription>
                Test your personas with different prompts in a sandbox
                environment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/persona-testing">Open Playground</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCode className="mr-2 h-5 w-5 text-primary" />
                Dev Environment
              </CardTitle>
              <CardDescription>
                Integrated development environment with AI assistance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/dev-environment">Open Dev Environment</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Terminal className="mr-2 h-5 w-5 text-primary" />
                Terminal & Console
              </CardTitle>
              <CardDescription>
                Run commands and execute code with integrated terminal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/dev-environment">Open Terminal</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all border-primary/20 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-5 w-5 text-primary" />
                Persona Editor
              </CardTitle>
              <CardDescription>
                Create and customize AI personas with advanced settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Dialog
                open={showPersonaWizard}
                onOpenChange={setShowPersonaWizard}
              >
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Persona
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh]">
                  <PersonaCreationWizard
                    onComplete={(newPersona) => {
                      setShowPersonaWizard(false);
                      toast({
                        title: "Persona Created",
                        description: `Your "${newPersona.name}" persona has been created successfully.`,
                        duration: 3000,
                      });
                    }}
                    onCancel={() => setShowPersonaWizard(false)}
                  />
                </DialogContent>
              </Dialog>
              <Button asChild variant="outline" className="w-full">
                <Link to="/settings?tab=persona">Manage Personas</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="mr-2 h-5 w-5 text-primary" />
                AI Response Visualizer
              </CardTitle>
              <CardDescription>
                Visualize and analyze AI responses with detailed metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/persona-testing">Open Visualizer</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-primary" />
                Settings
              </CardTitle>
              <CardDescription>
                Configure your preferences, API keys, and persona settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/settings">Open Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">
            Persona Testing Playground
          </h2>
          <PersonaTestingPlayground className="h-[800px]" />
        </div>

        <div className="mt-16 mb-10">
          <h2 className="text-2xl font-bold mb-8">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Your recently accessed projects and files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="p-2 hover:bg-accent rounded-md transition-colors">
                    <Link to="/code-editor" className="flex items-center">
                      <FileCode className="mr-2 h-4 w-4 text-primary" />
                      <span>main.tsx</span>
                    </Link>
                  </li>
                  <li className="p-2 hover:bg-accent rounded-md transition-colors">
                    <Link to="/code-editor" className="flex items-center">
                      <FileCode className="mr-2 h-4 w-4 text-primary" />
                      <span>PersonaContext.tsx</span>
                    </Link>
                  </li>
                  <li className="p-2 hover:bg-accent rounded-md transition-colors">
                    <Link to="/code-editor" className="flex items-center">
                      <FileCode className="mr-2 h-4 w-4 text-primary" />
                      <span>App.tsx</span>
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saved Personas</CardTitle>
                <CardDescription>
                  Your custom AI assistant personas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {/* Sample personas - replace with actual data when available */}
                  <li className="p-2 hover:bg-accent rounded-md transition-colors">
                    <button
                      onClick={() => {
                        // Update persona when functionality is available
                        toast({
                          title: "Persona Loaded",
                          description: `Switched to "Helpful Tutor" persona`,
                          duration: 3000,
                        });
                      }}
                      className="flex items-center w-full text-left"
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      <span>Helpful Tutor</span>
                    </button>
                  </li>
                  <li className="p-2 hover:bg-accent rounded-md transition-colors">
                    <button
                      onClick={() => {
                        // Update persona when functionality is available
                        toast({
                          title: "Persona Loaded",
                          description: `Switched to "Code Reviewer" persona`,
                          duration: 3000,
                        });
                      }}
                      className="flex items-center w-full text-left"
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      <span>Code Reviewer</span>
                    </button>
                  </li>
                  <li className="p-2 hover:bg-accent rounded-md transition-colors">
                    <button
                      onClick={() => {
                        // Update persona when functionality is available
                        toast({
                          title: "Persona Loaded",
                          description: `Switched to "Brainstorm Partner" persona`,
                          duration: 3000,
                        });
                      }}
                      className="flex items-center w-full text-left"
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      <span>Brainstorm Partner</span>
                    </button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
