import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import Button from "@/components/ui/button";
import {
  Save,
  Trash,
  RefreshCw,
  BookmarkPlus,
  Bookmark,
  AlertCircle,
  Download,
  Upload,
  Eye,
  MessageSquare,
  Sparkles,
  Check,
  FileJson,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import KnowledgeDomainSelector from "./KnowledgeDomainSelector";
import {
  usePersona,
  PersonaConfig,
  defaultPersona,
} from "@/contexts/PersonaContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import PersonaManager from "./PersonaManager";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ResponsivePersonaEditorProps {
  onSave?: (persona: PersonaConfig) => void;
  onReset?: () => void;
  presetPersonas?: PersonaConfig[];
  className?: string;
}

const presetPersonaOptions: PersonaConfig[] = [
  {
    id: "helpful-tutor",
    name: "Helpful Tutor",
    description:
      "Patient and educational assistant focused on explaining concepts clearly",
    tone: "educational",
    knowledgeDomains: ["education", "science", "math"],
    responseStyle: "detailed",
    verbosity: 80,
    creativity: 40,
    formality: 60,
    useEmojis: false,
    useCodeExamples: true,
    customInstructions:
      "Explain concepts step by step. Use analogies to simplify complex ideas. Ask questions to check understanding.",
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    description:
      "Technical assistant focused on code quality and best practices",
    tone: "professional",
    knowledgeDomains: ["programming", "software engineering"],
    responseStyle: "precise",
    verbosity: 60,
    creativity: 30,
    formality: 70,
    useEmojis: false,
    useCodeExamples: true,
    customInstructions:
      "Focus on code quality, performance, and security. Suggest improvements with examples. Be direct but constructive.",
  },
  {
    id: "brainstorm-partner",
    name: "Brainstorm Partner",
    description:
      "Creative assistant focused on generating ideas and possibilities",
    tone: "enthusiastic",
    knowledgeDomains: ["creativity", "innovation", "business"],
    responseStyle: "exploratory",
    verbosity: 70,
    creativity: 90,
    formality: 20,
    useEmojis: true,
    useCodeExamples: false,
    customInstructions:
      "Generate diverse ideas. Think outside the box. Ask thought-provoking questions. Be enthusiastic and encouraging.",
  },
];

// Generate a preview response based on persona settings
const generatePreviewResponse = (
  userMessage: string,
  personaConfig: PersonaConfig,
) => {
  let responseContent = "";
  const {
    tone,
    useEmojis,
    verbosity,
    creativity,
    formality,
    useCodeExamples,
    customInstructions,
    knowledgeDomains,
    responseStyle,
  } = personaConfig;

  // Determine greeting based on tone
  if (tone === "friendly") {
    responseContent = `Hey there! ${useEmojis ? "😊 " : ""}I'm happy to help you with that!`;
  } else if (tone === "professional") {
    responseContent = `I understand your request. ${useEmojis ? "📝 " : ""}Here's a professional analysis.`;
  } else if (tone === "educational") {
    responseContent = `Let me explain this concept. ${useEmojis ? "🎓 " : ""}Understanding this is important.`;
  } else if (tone === "enthusiastic") {
    responseContent = `Wow! Great question! ${useEmojis ? "✨ " : ""}I'm excited to help with this!`;
  } else if (tone === "casual") {
    responseContent = `Sure thing! ${useEmojis ? "👍 " : ""}Let's figure this out together.`;
  }

  // Add domain-specific content based on knowledge domains
  if (
    knowledgeDomains.includes("technology") &&
    userMessage.toLowerCase().includes("tech")
  ) {
    responseContent +=
      "\n\nFrom a technology perspective, this involves understanding the underlying systems and how they interact.";
  }

  if (
    knowledgeDomains.includes("business") &&
    userMessage.toLowerCase().includes("business")
  ) {
    responseContent +=
      "\n\nFrom a business standpoint, we need to consider ROI, market positioning, and strategic alignment.";
  }

  if (
    knowledgeDomains.includes("programming") &&
    (userMessage.toLowerCase().includes("code") ||
      userMessage.toLowerCase().includes("program"))
  ) {
    responseContent +=
      "\n\nFrom a programming perspective, we should consider the architecture, maintainability, and performance implications.";
  }

  // Adjust formality level
  if (formality > 70) {
    responseContent = responseContent.replace("Hey there!", "Greetings,");
    responseContent = responseContent.replace("Sure thing!", "Certainly.");
    responseContent = responseContent.replace("Wow!", "Indeed,");
  } else if (formality < 30) {
    responseContent = responseContent.replace(
      "I understand your request.",
      "Got it!",
    );
    responseContent = responseContent.replace(
      "Let me explain this concept.",
      "So here's the deal:",
    );
  }

  // Add creativity elements for high creativity settings
  if (creativity > 70) {
    responseContent +=
      "\n\nThinking outside the box, we could also consider an unconventional approach: " +
      (useEmojis ? "🌟 " : "") +
      "what if we looked at this from a completely different angle?";
  }

  // Adjust based on response style
  if (responseStyle === "concise") {
    // Keep it very brief regardless of verbosity
    const firstSentence = responseContent.split(".")[0];
    responseContent = firstSentence.endsWith(".")
      ? firstSentence
      : firstSentence + ".";
  } else if (responseStyle === "detailed" && verbosity > 50) {
    responseContent +=
      "\n\nI'll provide a comprehensive explanation with all the necessary context and background information to ensure you have a complete understanding of the topic.";
  } else if (responseStyle === "precise") {
    responseContent = responseContent.replace(
      /I'm happy to help|Let's figure this out|I'm excited/g,
      "I'll address this precisely",
    );
  } else if (responseStyle === "exploratory" && creativity > 50) {
    responseContent +=
      "\n\nLet's explore multiple perspectives on this topic to gain a more holistic understanding.";
  }

  // Add verbosity based on setting (if not already handled by response style)
  if (responseStyle !== "concise" && responseStyle !== "detailed") {
    if (verbosity > 70) {
      responseContent +=
        "\n\nI'll provide a detailed explanation with all the necessary context and background information to ensure you have a comprehensive understanding of the topic. This includes examining the historical context, current applications, and potential future developments.";
    } else if (verbosity < 30 && responseStyle !== "precise") {
      // Keep it very brief - truncate to first sentence and add period if needed
      const firstSentence = responseContent.split(".")[0];
      responseContent = firstSentence.endsWith(".")
        ? firstSentence
        : firstSentence + ".";
    }
  }

  // Add code example if enabled and relevant
  if (
    useCodeExamples &&
    (userMessage.toLowerCase().includes("code") ||
      userMessage.toLowerCase().includes("example") ||
      userMessage.toLowerCase().includes("programming"))
  ) {
    const codeExamples = {
      javascript:
        "```javascript\n// Here's an example\nconst example = () => {\n  console.log('This is a code example');\n  return 'Result';\n};\n\n// Call the function\nconst result = example();\n```",
      python:
        "```python\n# Here's an example\ndef example():\n    print('This is a code example')\n    return 'Result'\n    \n# Call the function\nresult = example()\n```",
      react:
        "```jsx\n// React component example\nimport React from 'react';\n\nconst ExampleComponent = ({ name }) => {\n  return (\n    <div className=\"example\">\n      <h2>Hello, {name}!</h2>\n      <p>This is a React component example</p>\n    </div>\n  );\n};\n\nexport default ExampleComponent;\n```",
    };

    // Choose a language based on the message content or randomly if not specified
    let language = "javascript";
    if (userMessage.toLowerCase().includes("python")) {
      language = "python";
    } else if (
      userMessage.toLowerCase().includes("react") ||
      userMessage.toLowerCase().includes("component")
    ) {
      language = "react";
    }

    responseContent += "\n\n" + codeExamples[language];
  }

  // Add custom instructions influence
  if (customInstructions.toLowerCase().includes("step by step")) {
    responseContent +=
      "\n\nLet me break this down step by step:\n1. First, understand the core concept\n2. Then, apply it to your specific situation\n3. Finally, iterate and refine your approach";
  }

  if (
    customInstructions.toLowerCase().includes("example") &&
    !responseContent.includes("example")
  ) {
    responseContent +=
      "\n\nHere's a practical example to illustrate: imagine you're trying to solve a similar problem in a real-world scenario...";
  }

  return responseContent;
};

const ResponsivePersonaEditor: React.FC<ResponsivePersonaEditorProps> = ({
  onSave,
  onReset,
  presetPersonas = presetPersonaOptions,
  className = "",
}) => {
  const {
    persona: currentPersona,
    setPersona: setContextPersona,
    resetPersona: resetContextPersona,
    savedPersonas,
    savePersona,
    deletePersona,
    loadPersona,
    exportPersona,
    importPersona,
  } = usePersona();

  const [persona, setPersonaState] = useState<PersonaConfig>(currentPersona);
  const [activeTab, setActiveTab] = useState("basic");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [personaNameInput, setPersonaNameInput] = useState("");
  const [selectedSavedPersona, setSelectedSavedPersona] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState<string | null>(null);
  const [showManager, setShowManager] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMessage, setPreviewMessage] = useState(
    "Hello! How can I help you today?",
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile with improved breakpoints
  useEffect(() => {
    const checkMobile = () => {
      // Use standard breakpoints: xs < 640px, sm < 768px
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkMobile();

    // Debounced resize handler for better performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Update persona name input when persona changes
  useEffect(() => {
    setPersonaNameInput(persona.name);
  }, [persona.name]);

  // Watch for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const handleChange = useCallback(
    (field: keyof PersonaConfig, value: any) => {
      const updatedPersona = { ...persona, [field]: value };
      setPersonaState(updatedPersona);
      // Update context in real-time for preview
      setContextPersona(updatedPersona);
    },
    [persona, setContextPersona],
  );

  const handlePresetSelect = useCallback(
    (presetId: string) => {
      const selected = presetPersonas.find((p) => p.id === presetId);
      if (selected) {
        setPersonaState(selected);
        // Update context immediately for real-time preview
        setContextPersona(selected);
      }
    },
    [presetPersonas, setContextPersona],
  );

  const handleSavedPersonaSelect = useCallback(
    (personaId: string) => {
      setSelectedSavedPersona(personaId);
      loadPersona(personaId);
    },
    [loadPersona],
  );

  const handleSave = useCallback(() => {
    setContextPersona(persona);
    if (onSave) onSave(persona);
  }, [persona, setContextPersona, onSave]);

  const handleSaveAsNew = useCallback(() => {
    // Open save dialog
    setSaveDialogOpen(true);
  }, []);

  const handleConfirmSave = useCallback(() => {
    if (!personaNameInput.trim()) return;

    // Create a copy of the current persona with the new name
    const personaToSave = {
      ...persona,
      name: personaNameInput.trim(),
      // Remove any existing ID to create a new one
      id: undefined,
    };

    // Save to context/localStorage
    savePersona(personaToSave);

    // Close dialog
    setSaveDialogOpen(false);
  }, [persona, personaNameInput, savePersona]);

  const handleDeletePersona = useCallback((personaId: string) => {
    setPersonaToDelete(personaId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeletePersona = useCallback(() => {
    if (personaToDelete) {
      deletePersona(personaToDelete);
      setPersonaToDelete(null);
      setDeleteDialogOpen(false);

      // If the deleted persona was selected, reset selection
      if (selectedSavedPersona === personaToDelete) {
        setSelectedSavedPersona("");
      }
    }
  }, [personaToDelete, deletePersona, selectedSavedPersona]);

  const handleReset = useCallback(() => {
    setPersonaState(currentPersona);
    resetContextPersona();
    if (onReset) onReset();
  }, [currentPersona, resetContextPersona, onReset]);

  const handleExportCurrentPersona = useCallback(() => {
    exportPersona("current");
  }, [exportPersona]);

  const handleExportSavedPersona = useCallback(() => {
    if (selectedSavedPersona) {
      exportPersona(selectedSavedPersona);
    }
  }, [selectedSavedPersona, exportPersona]);

  const handleImportClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setImportError(null);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        setImportError("File too large. Maximum size is 1MB.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validate file type
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        setImportError("Invalid file type. Only JSON files are supported.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const success = importPersona(content);
          if (!success) {
            setImportError("Failed to import persona. Invalid format.");
          } else {
            // Show success message
            setImportError("success");
            setTimeout(() => setImportError(null), 3000);
          }
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (error) {
          setImportError("Failed to import persona. Invalid format.");
          console.error("Import error:", error);
        }
      };
      reader.onerror = () => {
        setImportError("Error reading file. Please try again.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsText(file);
    },
    [importPersona],
  );

  // Get the selected saved persona name for display
  const getSelectedPersonaName = () => {
    if (!selectedSavedPersona) return "";
    const selected = savedPersonas.find((p) => p.id === selectedSavedPersona);
    return selected ? selected.name : "";
  };

  // Render mobile menu with improved touch interactions
  const renderMobileMenu = () => {
    return (
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[90vw] sm:w-[385px] p-0 overflow-hidden"
        >
          <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
            <SheetTitle className="text-left flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              Persona Editor
            </SheetTitle>
            <SheetDescription className="text-left">
              Customize your AI assistant
            </SheetDescription>
          </SheetHeader>

          <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-10rem)] pb-24">
            <div className="space-y-3">
              <Label
                htmlFor="mobile-preset-persona"
                className="text-base font-medium"
              >
                Preset Personas
              </Label>
              <Select onValueChange={handlePresetSelect}>
                <SelectTrigger
                  id="mobile-preset-persona"
                  className="h-11 text-base"
                >
                  <SelectValue placeholder="Select a preset persona" />
                </SelectTrigger>
                <SelectContent>
                  {presetPersonas.map((preset) => (
                    <SelectItem
                      key={preset.id}
                      value={preset.id || ""}
                      className="text-base py-2.5"
                    >
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {savedPersonas.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="mobile-saved-persona"
                    className="text-base font-medium"
                  >
                    Your Saved Personas
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowManager(true);
                    }}
                    className="h-8 px-3 text-sm"
                  >
                    View All
                  </Button>
                </div>
                <Select
                  value={selectedSavedPersona}
                  onValueChange={handleSavedPersonaSelect}
                >
                  <SelectTrigger
                    id="mobile-saved-persona"
                    className="h-11 text-base"
                  >
                    <SelectValue placeholder="Select a saved persona">
                      {getSelectedPersonaName() || "Select a saved persona"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {savedPersonas.map((saved) => (
                      <SelectItem
                        key={saved.id}
                        value={saved.id || ""}
                        className="text-base py-2.5"
                      >
                        {saved.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col space-y-3 pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleImportClick}
                className="h-12 text-base w-full justify-start"
              >
                <FileJson className="mr-3 h-5 w-5" />
                Import Persona
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleExportCurrentPersona}
                className="h-12 text-base w-full justify-start"
              >
                <Download className="mr-3 h-5 w-5" />
                Export Current
              </Button>

              {selectedSavedPersona && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleExportSavedPersona}
                  className="h-12 text-base w-full justify-start"
                >
                  <Download className="mr-3 h-5 w-5" />
                  Export Selected
                </Button>
              )}

              <Button
                variant={showPreview ? "default" : "outline"}
                size="lg"
                onClick={() => {
                  setShowPreview(!showPreview);
                  setIsMobileMenuOpen(false);
                }}
                className="h-12 text-base w-full justify-start"
              >
                <Eye className="mr-3 h-5 w-5" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
          </div>

          <SheetFooter className="p-4 border-t sticky bottom-0 bg-background z-10 mt-auto">
            <div className="flex w-full justify-between gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 h-12"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back
              </Button>

              <Button
                size="lg"
                onClick={() => {
                  handleSave();
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 h-12"
              >
                <Save className="mr-2 h-5 w-5" />
                Apply
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  };

  // If showing the persona manager, render that instead
  if (showManager) {
    return (
      <Card
        className={`w-full h-full bg-background border-border ${className}`}
      >
        <PersonaManager
          onEditPersona={(persona) => {
            setPersonaState(persona);
            setShowManager(false);
          }}
          onCreateNewPersona={() => setShowManager(false)}
        />
      </Card>
    );
  }

  return (
    <Card className={`w-full h-full bg-background border-border ${className}`}>
      <CardHeader className="pb-3 sticky top-0 bg-background z-10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center">
              {isMobile && (
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 h-10 w-10 -ml-1.5 touch-manipulation"
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              )}
              Persona Editor
            </CardTitle>
            <CardDescription className="hidden sm:block">
              Customize how your AI assistant behaves and responds
            </CardDescription>
          </div>
          {isMobile ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowManager(true)}
              className="h-9 px-3 touch-manipulation"
              aria-label="Manage Personas"
            >
              Manage
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowManager(true)}
              className="hidden sm:flex"
            >
              Manage Personas
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent
        className="space-y-4 pb-0 overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        {!isMobile && (
          <>
            <div className="space-y-2">
              <Label htmlFor="preset-persona">Preset Personas</Label>
              <Select onValueChange={handlePresetSelect}>
                <SelectTrigger id="preset-persona">
                  <SelectValue placeholder="Select a preset persona" />
                </SelectTrigger>
                <SelectContent>
                  {presetPersonas.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id || ""}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {savedPersonas.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="saved-persona">Your Saved Personas</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowManager(true)}
                    className="h-6 px-2 text-xs"
                  >
                    View All
                  </Button>
                </div>
                <Select
                  value={selectedSavedPersona}
                  onValueChange={handleSavedPersonaSelect}
                >
                  <SelectTrigger id="saved-persona">
                    <SelectValue placeholder="Select a saved persona">
                      {getSelectedPersonaName() || "Select a saved persona"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {savedPersonas.map((saved) => (
                      <SelectItem key={saved.id} value={saved.id || ""}>
                        {saved.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full sticky top-16 bg-background z-10">
            <TabsTrigger
              value="basic"
              className={isMobile ? "py-3 text-sm" : ""}
            >
              Basic
            </TabsTrigger>
            <TabsTrigger
              value="knowledge"
              className={isMobile ? "py-3 text-sm" : ""}
            >
              Knowledge
            </TabsTrigger>
            <TabsTrigger
              value="style"
              className={isMobile ? "py-3 text-sm" : ""}
            >
              Style
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className={isMobile ? "py-3 text-sm" : ""}
            >
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label
                htmlFor="persona-name"
                className={isMobile ? "text-base font-medium" : ""}
              >
                Name
              </Label>
              <Input
                id="persona-name"
                value={persona.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={isMobile ? "h-12 text-base px-4" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="persona-description"
                className={isMobile ? "text-base font-medium" : ""}
              >
                Description
              </Label>
              <Textarea
                id="persona-description"
                value={persona.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={isMobile ? "text-base px-4 py-3 min-h-[100px]" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="persona-tone"
                className={isMobile ? "text-base font-medium" : ""}
              >
                Tone
              </Label>
              <Select
                value={persona.tone}
                onValueChange={(value) => handleChange("tone", value)}
              >
                <SelectTrigger
                  id="persona-tone"
                  className={isMobile ? "h-12 text-base" : ""}
                >
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="friendly"
                    className={isMobile ? "text-base py-2.5" : ""}
                  >
                    Friendly
                  </SelectItem>
                  <SelectItem
                    value="professional"
                    className={isMobile ? "text-base py-2.5" : ""}
                  >
                    Professional
                  </SelectItem>
                  <SelectItem
                    value="casual"
                    className={isMobile ? "text-base py-2.5" : ""}
                  >
                    Casual
                  </SelectItem>
                  <SelectItem
                    value="enthusiastic"
                    className={isMobile ? "text-base py-2.5" : ""}
                  >
                    Enthusiastic
                  </SelectItem>
                  <SelectItem
                    value="educational"
                    className={isMobile ? "text-base py-2.5" : ""}
                  >
                    Educational
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="knowledge-domains">Knowledge Domains</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Add domains of knowledge the AI should focus on. Order matters -
                domains listed first have higher priority.
              </p>
              <KnowledgeDomainSelector
                domains={persona.knowledgeDomains}
                onChange={(domains) =>
                  handleChange("knowledgeDomains", domains)
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="verbosity-slider">Verbosity</Label>
                  <span className="text-xs text-muted-foreground">
                    {persona.verbosity}%
                  </span>
                </div>
                <Slider
                  id="verbosity-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={[persona.verbosity]}
                  onValueChange={(value) => handleChange("verbosity", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="creativity-slider">Creativity</Label>
                  <span className="text-xs text-muted-foreground">
                    {persona.creativity}%
                  </span>
                </div>
                <Slider
                  id="creativity-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={[persona.creativity]}
                  onValueChange={(value) =>
                    handleChange("creativity", value[0])
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="formality-slider">Formality</Label>
                  <span className="text-xs text-muted-foreground">
                    {persona.formality}%
                  </span>
                </div>
                <Slider
                  id="formality-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={[persona.formality]}
                  onValueChange={(value) => handleChange("formality", value[0])}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="use-emojis-switch" className="cursor-pointer">
                  Use Emojis
                </Label>
                <Switch
                  id="use-emojis-switch"
                  checked={persona.useEmojis}
                  onCheckedChange={(checked) =>
                    handleChange("useEmojis", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="use-code-examples-switch"
                  className="cursor-pointer"
                >
                  Use Code Examples
                </Label>
                <Switch
                  id="use-code-examples-switch"
                  checked={persona.useCodeExamples}
                  onCheckedChange={(checked) =>
                    handleChange("useCodeExamples", checked)
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="response-style">Response Style</Label>
              <Select
                value={persona.responseStyle}
                onValueChange={(value) => handleChange("responseStyle", value)}
              >
                <SelectTrigger id="response-style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="precise">Precise</SelectItem>
                  <SelectItem value="exploratory">Exploratory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-instructions">Custom Instructions</Label>
              <Textarea
                id="custom-instructions"
                value={persona.customInstructions}
                onChange={(e) =>
                  handleChange("customInstructions", e.target.value)
                }
                className="min-h-[120px]"
                placeholder="Add specific instructions for how the AI should behave..."
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-6">
        {importError && (
          <div
            className={`w-full p-2 mb-2 text-sm rounded-md flex items-center ${importError === "success" ? "text-green-500 bg-green-50 dark:bg-green-950 dark:text-green-300" : "text-red-500 bg-red-50 dark:bg-red-950 dark:text-red-300"}`}
          >
            {importError === "success" ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Persona imported successfully!
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                {importError}
              </>
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />

        {/* Mobile action buttons with improved touch targets */}
        {isMobile ? (
          <div className="flex justify-between w-full sticky bottom-0 bg-background pt-4 pb-2 border-t mt-4 z-10">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="h-12 px-4 touch-manipulation"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Reset
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleSaveAsNew}
                className="h-12 px-4 touch-manipulation"
              >
                <BookmarkPlus className="mr-2 h-5 w-5" />
                Save As
              </Button>

              <Button
                size="lg"
                onClick={handleSave}
                className="h-12 px-4 touch-manipulation"
              >
                <Save className="mr-2 h-5 w-5" />
                Apply
              </Button>
            </div>
          </div>
        ) : (
          /* Desktop action buttons */
          <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="text-xs sm:text-sm">Reset</span>
              </Button>

              {selectedSavedPersona && (
                <AlertDialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePersona(selectedSavedPersona)}
                    >
                      <Trash className="mr-1 sm:mr-2 h-4 w-4" />
                      <span className="text-xs sm:text-sm">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Persona</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this persona? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDeletePersona}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="flex space-x-2 justify-end">
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleSaveAsNew}>
                    <BookmarkPlus className="mr-1 sm:mr-2 h-4 w-4" />
                    <span className="text-xs sm:text-sm">Save As New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Save Persona</DialogTitle>
                    <DialogDescription>
                      Give your persona a name to save it for future use.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="persona-save-name">Persona Name</Label>
                    <Input
                      id="persona-save-name"
                      value={personaNameInput}
                      onChange={(e) => setPersonaNameInput(e.target.value)}
                      className="mt-2"
                      placeholder="My Custom Persona"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleConfirmSave}
                      disabled={!personaNameInput.trim()}
                    >
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save Persona
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button size="sm" onClick={handleSave}>
                <Save className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="text-xs sm:text-sm">Apply</span>
              </Button>
            </div>
          </div>
        )}

        {!isMobile && (
          <div className="flex justify-between w-full mt-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleImportClick}>
                <FileJson className="mr-2 h-4 w-4" />
                Import
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCurrentPersona}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Current
              </Button>

              <Button
                variant={showPreview ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>

            {selectedSavedPersona && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSavedPersona}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
            )}
          </div>
        )}

        {showPreview && (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <div className="bg-secondary/20 p-2 flex justify-between items-center border-b">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium">
                  Preview: {persona.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={previewMessage}
                  onChange={(e) => setPreviewMessage(e.target.value)}
                  className="text-xs p-1 border rounded w-40"
                  placeholder="Type a test message..."
                />
              </div>
            </div>
            <div className="p-3 max-h-[200px] overflow-y-auto bg-background">
              <div className="mb-3 p-2 rounded-lg bg-primary/10 border border-primary/20 text-sm">
                {previewMessage}
              </div>
              <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="font-medium text-sm mb-1 flex items-center">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  {persona.name}
                </div>
                <ReactMarkdown
                  className="prose dark:prose-invert prose-sm max-w-none text-sm"
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={isDarkMode ? vscDarkPlus : vs}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md border border-muted my-2 text-xs"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {generatePreviewResponse(previewMessage, persona)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </CardFooter>

      {/* Mobile menu sheet */}
      {renderMobileMenu()}
    </Card>
  );
};

export default ResponsivePersonaEditor;
