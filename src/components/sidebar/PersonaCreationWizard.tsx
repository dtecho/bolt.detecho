import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HelpCircle,
  Info,
  MessageSquare,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import {
  usePersona,
  PersonaConfig,
  defaultPersona,
} from "@/contexts/PersonaContext";
import KnowledgeDomainSelector from "./KnowledgeDomainSelector";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PersonaCreationWizardProps {
  onComplete: (persona: PersonaConfig) => void;
  onCancel: () => void;
  initialPersona?: PersonaConfig;
}

const steps = [
  { id: "basic", title: "Basic Information" },
  { id: "tone", title: "Tone & Style" },
  { id: "knowledge", title: "Knowledge Domains" },
  { id: "response", title: "Response Settings" },
  { id: "preview", title: "Preview & Save" },
];

const toneExamples = {
  friendly: "Hey there! I'm happy to help you with that!",
  professional: "I understand your request. Here's a professional analysis.",
  casual: "Sure thing! Let's figure this out together.",
  enthusiastic: "Wow! Great question! I'm excited to help with this!",
  educational: "Let me explain this concept. Understanding this is important.",
};

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

  // Add verbosity based on setting
  if (verbosity > 70) {
    responseContent +=
      "\n\nI'll provide a detailed explanation with all the necessary context and background information to ensure you have a comprehensive understanding of the topic. This includes examining the historical context, current applications, and potential future developments.";
  } else if (verbosity < 30) {
    // Keep it very brief - truncate to first sentence and add period if needed
    const firstSentence = responseContent.split(".")[0];
    responseContent = firstSentence.endsWith(".")
      ? firstSentence
      : firstSentence + ".";
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

const PersonaCreationWizard: React.FC<PersonaCreationWizardProps> = ({
  onComplete,
  onCancel,
  initialPersona,
}) => {
  const { savePersona } = usePersona();
  const [currentStep, setCurrentStep] = useState(0);
  const [persona, setPersona] = useState<PersonaConfig>(
    initialPersona || {
      ...defaultPersona,
      name: "",
      description: "",
    },
  );
  const [previewMessage, setPreviewMessage] = useState(
    "Can you help me understand how this technology works for my business?",
  );
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  // Listen for theme changes
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

  const handleChange = (field: keyof PersonaConfig, value: any) => {
    setPersona((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save the persona
    const savedPersonaId = savePersona(persona);
    onComplete({ ...persona, id: savedPersonaId });
  };

  const isStepValid = () => {
    switch (steps[currentStep].id) {
      case "basic":
        return persona.name.trim() !== "" && persona.description.trim() !== "";
      case "tone":
        return persona.tone !== "";
      case "knowledge":
        return persona.knowledgeDomains.length > 0;
      case "response":
        return true; // All response settings have defaults
      case "preview":
        return true;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "basic":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="persona-name" className="text-base font-medium">
                  Persona Name
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                      >
                        <HelpCircle className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        Choose a descriptive name that reflects the persona's
                        purpose or character.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="persona-name"
                value={persona.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Technical Advisor, Creative Assistant"
                className="w-full"
              />
              {!persona.name.trim() && (
                <p className="text-xs text-muted-foreground">
                  Required: Give your persona a name
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label
                  htmlFor="persona-description"
                  className="text-base font-medium"
                >
                  Description
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                      >
                        <HelpCircle className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        Describe the purpose and characteristics of this
                        persona. What is it designed to help with?
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="persona-description"
                value={persona.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="e.g., A technical assistant focused on explaining complex concepts in simple terms"
                className="min-h-[100px]"
              />
              {!persona.description.trim() && (
                <p className="text-xs text-muted-foreground">
                  Required: Add a brief description
                </p>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mt-6">
              <h3 className="text-sm font-medium flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                Getting Started
              </h3>
              <p className="text-sm mt-2">
                Your persona defines how the AI assistant will communicate with
                you. Start by giving it a clear name and description that
                reflects its purpose.
              </p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-background rounded p-3 border text-sm">
                  <span className="font-medium block mb-1">Good Example:</span>
                  <span className="text-muted-foreground">
                    "Code Reviewer" - A technical assistant that provides code
                    reviews and suggests improvements following best practices.
                  </span>
                </div>
                <div className="bg-background rounded p-3 border text-sm">
                  <span className="font-medium block mb-1">Good Example:</span>
                  <span className="text-muted-foreground">
                    "Learning Coach" - An educational assistant that explains
                    concepts step-by-step and provides examples to aid
                    understanding.
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "tone":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="persona-tone" className="text-base font-medium">
                  Communication Tone
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                      >
                        <HelpCircle className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        The overall tone determines how the AI will communicate
                        with you. Choose a tone that best fits the persona's
                        purpose.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={persona.tone}
                onValueChange={(value) => handleChange("tone", value)}
              >
                <SelectTrigger id="persona-tone">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Tone Examples</h3>
              <div className="space-y-2">
                {Object.entries(toneExamples).map(([tone, example]) => (
                  <div
                    key={tone}
                    className={`p-3 rounded-lg border ${persona.tone === tone ? "border-primary bg-primary/5" : "bg-background"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium capitalize text-sm">
                        {tone}
                      </span>
                      {persona.tone === tone && (
                        <Badge variant="outline" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{example}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Label htmlFor="use-emojis-switch" className="cursor-pointer">
                    Use Emojis
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                        >
                          <HelpCircle className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enable to include emojis in responses</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  id="use-emojis-switch"
                  checked={persona.useEmojis}
                  onCheckedChange={(checked) =>
                    handleChange("useEmojis", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Label
                    htmlFor="use-code-examples-switch"
                    className="cursor-pointer"
                  >
                    Use Code Examples
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                        >
                          <HelpCircle className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Enable to include code examples in responses when
                          relevant
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  id="use-code-examples-switch"
                  checked={persona.useCodeExamples}
                  onCheckedChange={(checked) =>
                    handleChange("useCodeExamples", checked)
                  }
                />
              </div>
            </div>
          </div>
        );

      case "knowledge":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label
                  htmlFor="knowledge-domains"
                  className="text-base font-medium"
                >
                  Knowledge Domains
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                      >
                        <HelpCircle className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        Select domains of knowledge that this persona should
                        specialize in. The order matters - domains listed first
                        have higher priority.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Add domains of knowledge the AI should focus on. Order matters -
                domains listed first have higher priority.
              </p>
              <KnowledgeDomainSelector
                domains={persona.knowledgeDomains}
                onChange={(domains) =>
                  handleChange("knowledgeDomains", domains)
                }
              />
              {persona.knowledgeDomains.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Required: Select at least one knowledge domain
                </p>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <h3 className="text-sm font-medium flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                Domain Specialization
              </h3>
              <p className="text-sm mt-2">
                Knowledge domains help the AI focus on specific areas of
                expertise. For example:
              </p>
              <div className="mt-3 space-y-2">
                <div className="bg-background rounded p-3 border text-sm">
                  <span className="font-medium block mb-1">
                    Technical Assistant:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">programming</Badge>
                    <Badge variant="secondary">software engineering</Badge>
                    <Badge variant="secondary">computer science</Badge>
                  </div>
                </div>
                <div className="bg-background rounded p-3 border text-sm">
                  <span className="font-medium block mb-1">
                    Business Advisor:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">business</Badge>
                    <Badge variant="secondary">marketing</Badge>
                    <Badge variant="secondary">finance</Badge>
                    <Badge variant="secondary">strategy</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "response":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="verbosity-slider"
                    className="text-base font-medium"
                  >
                    Verbosity
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                        >
                          <HelpCircle className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Controls how detailed the responses will be. Higher
                          values result in longer, more detailed responses.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
                  onValueChange={(value) => handleChange("verbosity", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="creativity-slider"
                    className="text-base font-medium"
                  >
                    Creativity
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                        >
                          <HelpCircle className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Controls how creative or conventional the responses
                          will be. Higher values encourage more creative and
                          diverse thinking.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="formality-slider"
                    className="text-base font-medium"
                  >
                    Formality
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                        >
                          <HelpCircle className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Controls how formal or casual the language will be.
                          Higher values result in more formal, professional
                          language.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
                  onValueChange={(value) => handleChange("formality", value[0])}
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex items-center">
                <Label
                  htmlFor="response-style"
                  className="text-base font-medium"
                >
                  Response Style
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                      >
                        <HelpCircle className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        The overall approach to responses. This works together
                        with other settings to shape the AI's communication
                        style.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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

            <div className="space-y-2 pt-4">
              <div className="flex items-center">
                <Label
                  htmlFor="custom-instructions"
                  className="text-base font-medium"
                >
                  Custom Instructions (Optional)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                      >
                        <HelpCircle className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>
                        Add specific instructions for how the AI should behave.
                        For example, "Always provide step-by-step explanations"
                        or "Include real-world examples".
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="custom-instructions"
                value={persona.customInstructions}
                onChange={(e) =>
                  handleChange("customInstructions", e.target.value)
                }
                className="min-h-[100px]"
                placeholder="e.g., Always provide step-by-step explanations, Include real-world examples"
              />
            </div>
          </div>
        );

      case "preview":
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-base font-medium mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                Persona Summary
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-sm">Name:</span>
                  <span className="ml-2">{persona.name}</span>
                </div>
                <div>
                  <span className="font-medium text-sm">Description:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {persona.description}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-sm">Tone:</span>
                  <span className="ml-2 capitalize">{persona.tone}</span>
                </div>
                <div>
                  <span className="font-medium text-sm">
                    Knowledge Domains:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {persona.knowledgeDomains.map((domain, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="font-medium text-sm block">
                      Verbosity:
                    </span>
                    <span className="text-sm">{persona.verbosity}%</span>
                  </div>
                  <div>
                    <span className="font-medium text-sm block">
                      Creativity:
                    </span>
                    <span className="text-sm">{persona.creativity}%</span>
                  </div>
                  <div>
                    <span className="font-medium text-sm block">
                      Formality:
                    </span>
                    <span className="text-sm">{persona.formality}%</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-sm">Response Style:</span>
                  <span className="ml-2 capitalize">
                    {persona.responseStyle}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-sm">Features:</span>
                  <div className="flex gap-2 mt-1">
                    <Badge
                      variant={persona.useEmojis ? "default" : "outline"}
                      className="text-xs"
                    >
                      {persona.useEmojis ? "Uses Emojis" : "No Emojis"}
                    </Badge>
                    <Badge
                      variant={persona.useCodeExamples ? "default" : "outline"}
                      className="text-xs"
                    >
                      {persona.useCodeExamples
                        ? "Uses Code Examples"
                        : "No Code Examples"}
                    </Badge>
                  </div>
                </div>
                {persona.customInstructions && (
                  <div>
                    <span className="font-medium text-sm">
                      Custom Instructions:
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {persona.customInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-secondary/20 p-3 flex justify-between items-center border-b">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">Response Preview</span>
                </div>
                <div className="flex items-center">
                  <Input
                    type="text"
                    value={previewMessage}
                    onChange={(e) => setPreviewMessage(e.target.value)}
                    className="text-xs h-7 w-60"
                    placeholder="Type a test message..."
                  />
                </div>
              </div>
              <div className="p-4 max-h-[300px] overflow-y-auto bg-background">
                <div className="mb-3 p-2 rounded-lg bg-primary/10 border border-primary/20 text-sm">
                  {previewMessage}
                </div>
                <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                  <div className="font-medium text-sm mb-1 flex items-center">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    {persona.name || "AI Assistant"}
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          {initialPersona ? "Edit Persona" : "Create New Persona"}
        </CardTitle>
        <Progress
          value={((currentStep + 1) / steps.length) * 100}
          className="h-1 mt-2"
        />
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">
            Step {currentStep + 1}: {steps[currentStep].title}
          </h2>
          <div className="flex items-center space-x-1">
            {steps.map((step, index) => (
              <Button
                key={step.id}
                variant={currentStep === index ? "default" : "outline"}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentStep(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>

        {renderStepContent()}
      </CardContent>
      <CardFooter className="border-t p-4 flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!isStepValid()}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              <Save className="h-4 w-4 mr-2" />
              Save Persona
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PersonaCreationWizard;
