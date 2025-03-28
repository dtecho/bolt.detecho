import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
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
  HelpCircle,
  Info,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PersonaManager from "./PersonaManager";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface EnhancedPersonaEditorProps {
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

const EnhancedPersonaEditor: React.FC<EnhancedPersonaEditorProps> = ({
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
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  // Update persona name input when persona changes
  useEffect(() => {
    setPersonaNameInput(persona.name);
  }, [persona.name]);

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

  const handleChange = React.useCallback(
    (field: keyof PersonaConfig, value: any) => {
      const updatedPersona = { ...persona, [field]: value };
      setPersonaState(updatedPersona);
      // Update context in real-time for preview
      setContextPersona(updatedPersona);
    },
    [persona, setContextPersona],
  );

  const handlePresetSelect = React.useCallback(
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

  const handleSavedPersonaSelect = React.useCallback(
    (personaId: string) => {
      setSelectedSavedPersona(personaId);
      loadPersona(personaId);
    },
    [loadPersona],
  );

  const handleSave = React.useCallback(() => {
    setContextPersona(persona);
    if (onSave) onSave(persona);
  }, [persona, setContextPersona, onSave]);

  const handleSaveAsNew = React.useCallback(() => {
    // Open save dialog
    setSaveDialogOpen(true);
  }, []);

  const handleConfirmSave = React.useCallback(() => {
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

  const handleDeletePersona = React.useCallback((personaId: string) => {
    setPersonaToDelete(personaId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeletePersona = React.useCallback(() => {
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

  const handleReset = React.useCallback(() => {
    setPersonaState(currentPersona);
    resetContextPersona();
    if (onReset) onReset();
  }, [currentPersona, resetContextPersona, onReset]);

  const handleExportCurrentPersona = React.useCallback(() => {
    exportPersona("current");
  }, [exportPersona]);

  const handleExportSavedPersona = React.useCallback(() => {
    if (selectedSavedPersona) {
      exportPersona(selectedSavedPersona);
    }
  }, [selectedSavedPersona, exportPersona]);

  const handleImportClick = React.useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = React.useCallback(
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

  // Helper component for field with tooltip
  const FieldWithTooltip = ({
    label,
    htmlFor,
    tooltip,
    children,
  }: {
    label: string;
    htmlFor: string;
    tooltip: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor={htmlFor} className="text-base font-medium">
          {label}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                <HelpCircle className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-2">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {children}
    </div>
  );

  return (
    <Card className={`w-full h-full bg-background border-border ${className}`}>
      {showManager ? (
        <PersonaManager
          onEditPersona={(persona) => {
            setPersonaState(persona);
            setShowManager(false);
          }}
          onCreateNewPersona={() => setShowManager(false)}
        />
      ) : (
        <>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Persona Editor
                </CardTitle>
                <CardDescription>
                  Customize how your AI assistant behaves and responds
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowManager(true)}
                    >
                      Manage Personas
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View, edit, and organize all your saved personas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pb-0 overflow-y-auto">
            <FieldWithTooltip
              label="Preset Personas"
              htmlFor="preset-persona"
              tooltip="Choose from pre-configured personas to quickly set up your AI assistant with specific characteristics"
            >
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
            </FieldWithTooltip>

            {savedPersonas.length > 0 && (
              <FieldWithTooltip
                label="Your Saved Personas"
                htmlFor="saved-persona"
                tooltip="Load one of your previously saved custom personas"
              >
                <div className="flex justify-between items-center">
                  <Label htmlFor="saved-persona">Your Saved Personas</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowManager(true)}
                          className="h-6 px-2 text-xs"
                        >
                          View All
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Open the persona manager to view all saved personas
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
              </FieldWithTooltip>
            )}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basic">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full h-full">
                        Basic
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Configure basic persona information</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsTrigger>
                <TabsTrigger value="knowledge">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full h-full">
                        Knowledge
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Set knowledge domains and expertise areas</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsTrigger>
                <TabsTrigger value="style">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full h-full">
                        Style
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Adjust communication style parameters</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full h-full">
                        Advanced
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Configure advanced response settings and custom
                          instructions
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <FieldWithTooltip
                  label="Name"
                  htmlFor="persona-name"
                  tooltip="Give your persona a descriptive name that reflects its purpose or character"
                >
                  <Input
                    id="persona-name"
                    value={persona.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g., Technical Advisor, Creative Assistant"
                  />
                </FieldWithTooltip>

                <FieldWithTooltip
                  label="Description"
                  htmlFor="persona-description"
                  tooltip="Describe the purpose and characteristics of this persona. What is it designed to help with?"
                >
                  <Textarea
                    id="persona-description"
                    value={persona.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="e.g., A technical assistant focused on explaining complex concepts in simple terms"
                  />
                </FieldWithTooltip>

                <FieldWithTooltip
                  label="Tone"
                  htmlFor="persona-tone"
                  tooltip="The overall tone determines how the AI will communicate with you. Choose a tone that best fits the persona's purpose."
                >
                  <Select
                    value={persona.tone}
                    onValueChange={(value) => handleChange("tone", value)}
                  >
                    <SelectTrigger id="persona-tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">
                        <div className="flex flex-col">
                          <span>Friendly</span>
                          <span className="text-xs text-muted-foreground">
                            Warm and approachable communication
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="professional">
                        <div className="flex flex-col">
                          <span>Professional</span>
                          <span className="text-xs text-muted-foreground">
                            Formal and business-like approach
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="casual">
                        <div className="flex flex-col">
                          <span>Casual</span>
                          <span className="text-xs text-muted-foreground">
                            Relaxed and conversational style
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="enthusiastic">
                        <div className="flex flex-col">
                          <span>Enthusiastic</span>
                          <span className="text-xs text-muted-foreground">
                            Energetic and excited communication
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="educational">
                        <div className="flex flex-col">
                          <span>Educational</span>
                          <span className="text-xs text-muted-foreground">
                            Instructive and explanatory approach
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FieldWithTooltip>

                <div className="bg-muted/50 p-4 rounded-lg mt-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Getting Started
                  </h3>
                  <p className="text-sm mt-2">
                    Your persona defines how the AI assistant will communicate
                    with you. Start by giving it a clear name and description
                    that reflects its purpose.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="knowledge" className="space-y-4 mt-4">
                <FieldWithTooltip
                  label="Knowledge Domains"
                  htmlFor="knowledge-domains"
                  tooltip="Select domains of knowledge that this persona should specialize in. The order matters - domains listed first have higher priority."
                >
                  <p className="text-xs text-muted-foreground mb-2">
                    Add domains of knowledge the AI should focus on. Order
                    matters - domains listed first have higher priority.
                  </p>
                  <KnowledgeDomainSelector
                    domains={persona.knowledgeDomains}
                    onChange={(domains) =>
                      handleChange("knowledgeDomains", domains)
                    }
                  />
                </FieldWithTooltip>

                <div className="bg-muted/50 p-4 rounded-lg mt-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Domain Specialization
                  </h3>
                  <p className="text-sm mt-2">
                    Knowledge domains help the AI focus on specific areas of
                    expertise. The AI will prioritize knowledge from domains
                    listed at the top when responding to your questions.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <FieldWithTooltip
                    label="Verbosity"
                    htmlFor="verbosity-slider"
                    tooltip="Controls how detailed the responses will be. Higher values result in longer, more detailed responses."
                  >
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Concise</span>
                      <span>{persona.verbosity}%</span>
                      <span>Detailed</span>
                    </div>
                    <Slider
                      id="verbosity-slider"
                      min={0}
                      max={100}
                      step={1}
                      value={[persona.verbosity]}
                      onValueChange={(value) =>
                        handleChange("verbosity", value[0])
                      }
                    />
                  </FieldWithTooltip>

                  <FieldWithTooltip
                    label="Creativity"
                    htmlFor="creativity-slider"
                    tooltip="Controls how creative or conventional the responses will be. Higher values encourage more creative and diverse thinking."
                  >
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Conventional</span>
                      <span>{persona.creativity}%</span>
                      <span>Creative</span>
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
                  </FieldWithTooltip>

                  <FieldWithTooltip
                    label="Formality"
                    htmlFor="formality-slider"
                    tooltip="Controls how formal or casual the language will be. Higher values result in more formal, professional language."
                  >
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Casual</span>
                      <span>{persona.formality}%</span>
                      <span>Formal</span>
                    </div>
                    <Slider
                      id="formality-slider"
                      min={0}
                      max={100}
                      step={1}
                      value={[persona.formality]}
                      onValueChange={(value) =>
                        handleChange("formality", value[0])
                      }
                    />
                  </FieldWithTooltip>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label
                            htmlFor="use-emojis-switch"
                            className="cursor-pointer flex items-center"
                          >
                            Use Emojis
                            <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Enable to include emojis in responses for a more
                            expressive communication style
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Switch
                      id="use-emojis-switch"
                      checked={persona.useEmojis}
                      onCheckedChange={(checked) =>
                        handleChange("useEmojis", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label
                            htmlFor="use-code-examples-switch"
                            className="cursor-pointer flex items-center"
                          >
                            Use Code Examples
                            <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Enable to include code examples in responses when
                            relevant to programming or technical topics
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                <FieldWithTooltip
                  label="Response Style"
                  htmlFor="response-style"
                  tooltip="The overall approach to responses. This works together with other settings to shape the AI's communication style."
                >
                  <Select
                    value={persona.responseStyle}
                    onValueChange={(value) =>
                      handleChange("responseStyle", value)
                    }
                  >
                    <SelectTrigger id="response-style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">
                        <div className="flex flex-col">
                          <span>Concise</span>
                          <span className="text-xs text-muted-foreground">
                            Brief and to-the-point responses
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="detailed">
                        <div className="flex flex-col">
                          <span>Detailed</span>
                          <span className="text-xs text-muted-foreground">
                            Comprehensive and thorough explanations
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="balanced">
                        <div className="flex flex-col">
                          <span>Balanced</span>
                          <span className="text-xs text-muted-foreground">
                            Moderate level of detail and clarity
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="precise">
                        <div className="flex flex-col">
                          <span>Precise</span>
                          <span className="text-xs text-muted-foreground">
                            Exact and accurate information
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="exploratory">
                        <div className="flex flex-col">
                          <span>Exploratory</span>
                          <span className="text-xs text-muted-foreground">
                            Considers multiple perspectives and possibilities
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FieldWithTooltip>

                <FieldWithTooltip
                  label="Custom Instructions"
                  htmlFor="custom-instructions"
                  tooltip="Add specific instructions for how the AI should behave. For example, 'Always provide step-by-step explanations' or 'Include real-world examples'."
                >
                  <Textarea
                    id="custom-instructions"
                    value={persona.customInstructions}
                    onChange={(e) =>
                      handleChange("customInstructions", e.target.value)
                    }
                    className="min-h-[120px]"
                    placeholder="Add specific instructions for how the AI should behave..."
                  />
                </FieldWithTooltip>

                <div className="bg-muted/50 p-4 rounded-lg mt-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Advanced Settings Tips
                  </h3>
                  <p className="text-sm mt-2">
                    Custom instructions allow you to provide specific guidance
                    to the AI. Examples include "Always provide step-by-step
                    explanations", "Include real-world examples", or "Focus on
                    practical applications".
                  </p>
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

            <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        <RefreshCw className="mr-1 sm:mr-2 h-4 w-4" />
                        <span className="text-xs sm:text-sm">Reset</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset all changes to the last saved state</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {selectedSavedPersona && (
                  <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeletePersona(selectedSavedPersona)
                              }
                            >
                              <Trash className="mr-1 sm:mr-2 h-4 w-4" />
                              <span className="text-xs sm:text-sm">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete the currently selected persona</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveAsNew}
                          >
                            <BookmarkPlus className="mr-1 sm:mr-2 h-4 w-4" />
                            <span className="text-xs sm:text-sm">
                              Save As New
                            </span>
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save the current configuration as a new persona</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="mr-1 sm:mr-2 h-4 w-4" />
                        <span className="text-xs sm:text-sm">Apply</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Apply changes to the current persona</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex justify-between w-full mt-4">
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleImportClick}
                      >
                        <FileJson className="mr-2 h-4 w-4" />
                        Import
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Import a persona from a JSON file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportCurrentPersona}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Current
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Export the current persona configuration to a JSON file
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={showPreview ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {showPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {showPreview
                          ? "Hide the response preview"
                          : "Preview how the AI will respond with current settings"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {selectedSavedPersona && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportSavedPersona}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Selected
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export the selected saved persona to a JSON file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative">
                            <input
                              type="text"
                              value={previewMessage}
                              onChange={(e) =>
                                setPreviewMessage(e.target.value)
                              }
                              className="text-xs p-1 border rounded w-40"
                              placeholder="Type a test message..."
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Type a message to see how the AI would respond</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
        </>
      )}
    </Card>
  );
};

export default EnhancedPersonaEditor;
