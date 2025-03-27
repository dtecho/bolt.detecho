import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Badge from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Settings,
  Zap,
  MessageSquare,
  Info,
  Sparkles,
  Moon,
  Sun,
  Download,
  Upload,
  FileJson,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MessageHistory from "./MessageHistory";
import MessageInput from "./MessageInput";
import { usePersona, PersonaConfig } from "@/contexts/PersonaContext";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vscDarkPlus as vsDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  codeBlocks?: Array<{
    language: string;
    code: string;
  }>;
  isMarkdown?: boolean;
}

interface ChatInterfaceProps {
  personaName?: string;
  isPersonaCustomized?: boolean;
  onOpenPersonaEditor?: () => void;
  className?: string;
  enableComparison?: boolean;
}

// Define a fallback component to use if the MessageHistory import fails
const FallbackMessageHistory = React.memo(
  ({ messages = [] }: { messages: Message[] }) => {
    const isDarkMode = document.documentElement.classList.contains("dark");

    return (
      <div className="p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary/10 ml-12 border border-primary/20"
                  : "bg-secondary/10 mr-12 border border-secondary/20"
              } transition-all duration-200`}
            >
              <div className="font-medium mb-1 flex items-center">
                {message.sender === "user" ? (
                  "You"
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    Assistant
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              {message.isMarkdown ? (
                <ReactMarkdown
                  components={{
                    code(props) {
                      const { children, className, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          style={isDarkMode ? vsDark : vs}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md border border-muted my-2"
                          {...rest}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...rest}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <div>{message.content}</div>
              )}
            </div>
          ))
        )}
      </div>
    );
  },
);

// Generate a response based on persona settings
const generatePersonaResponse = (
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

const ChatInterface = React.memo(
  ({
    onOpenPersonaEditor = () => {},
    className = "",
    enableComparison = true,
  }: ChatInterfaceProps) => {
    const {
      persona,
      isCustomized,
      savedPersonas,
      loadPersona,
      exportPersona,
      importPersona,
    } = usePersona();
    const [messages, setMessages] = useState<Message[]>([
      {
        id: "1",
        content:
          "Hello! I'm Bolt.DIY, your customizable AI assistant. How can I help you today?",
        sender: "assistant",
        timestamp: new Date(Date.now() - 60000 * 5),
        isMarkdown: true,
      },
    ]);

    // Update all messages when persona changes
    useEffect(() => {
      try {
        // Always update the welcome message
        if (messages.length > 0) {
          const welcomeMessage = generatePersonaResponse("Hello", persona);
          const updatedMessages = [...messages];

          // Update the first message (welcome message)
          updatedMessages[0] = {
            id: "1",
            content: welcomeMessage,
            sender: "assistant",
            timestamp: new Date(),
            isMarkdown: true,
          };

          // Regenerate all assistant responses based on the new persona
          for (let i = 1; i < updatedMessages.length; i++) {
            if (updatedMessages[i].sender === "assistant") {
              // Find the preceding user message to generate a response to
              let userMessageIndex = i - 1;
              while (
                userMessageIndex >= 0 &&
                updatedMessages[userMessageIndex].sender !== "user"
              ) {
                userMessageIndex--;
              }

              if (userMessageIndex >= 0) {
                const userMessage = updatedMessages[userMessageIndex].content;
                const newResponse = generatePersonaResponse(
                  userMessage,
                  persona,
                );

                updatedMessages[i] = {
                  ...updatedMessages[i],
                  content: newResponse,
                  timestamp: new Date(),
                };
              }
            }
          }

          setMessages(updatedMessages);
        } else {
          // If no messages, create a welcome message
          const welcomeMessage = generatePersonaResponse("Hello", persona);
          setMessages([
            {
              id: "1",
              content: welcomeMessage,
              sender: "assistant",
              timestamp: new Date(),
              isMarkdown: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Error updating messages with new persona:", error);
        // Only reset the welcome message if there's an error
        if (
          messages.length === 0 ||
          (messages.length === 1 && messages[0].id === "1")
        ) {
          setMessages([
            {
              id: "1",
              content:
                "Hello! I'm Bolt.DIY, your customizable AI assistant. How can I help you today?",
              sender: "assistant",
              timestamp: new Date(),
              isMarkdown: true,
            },
          ]);
        }
      }
    }, [persona]);

    const [activeTab, setActiveTab] = useState("chat");
    const [isComparisonMode, setIsComparisonMode] = useState(false);
    const [isGeneratingComparison, setIsGeneratingComparison] = useState(false);
    const [comparisonPersona, setComparisonPersona] =
      useState<PersonaConfig | null>(null);
    const [comparisonMessages, setComparisonMessages] = useState<Message[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(() => {
      return document.documentElement.classList.contains("dark");
    });

    // Import/Export state
    const [importStatus, setImportStatus] = useState<
      "idle" | "importing" | "success" | "error"
    >("idle");
    const [exportStatus, setExportStatus] = useState<
      "idle" | "exporting" | "success" | "error"
    >("idle");

    const handleSendMessage = (content: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);

      // Generate AI response based on persona
      setTimeout(() => {
        const aiResponse = generatePersonaResponse(content, persona);
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: "assistant",
          timestamp: new Date(),
          isMarkdown: true,
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 500);
    };

    const toggleDarkMode = () => {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      document.documentElement.classList.toggle("dark", newMode);
    };

    const handleComparisonToggle = () => {
      if (!isComparisonMode && !comparisonPersona) {
        // Initialize comparison with a different persona
        const availablePersonas = Object.keys(savedPersonas);
        if (availablePersonas.length > 0) {
          // Find a persona different from current one
          const differentPersona = availablePersonas.find(
            (name) => name !== "current",
          );
          if (differentPersona) {
            setComparisonPersona(savedPersonas[differentPersona]);
          } else {
            // Create a different persona if none exists
            const newPersona = {
              ...persona,
              tone: persona.tone === "friendly" ? "professional" : "friendly",
            };
            setComparisonPersona(newPersona);
          }
        } else {
          // Create a different persona if none exists
          const newPersona = {
            ...persona,
            tone: persona.tone === "friendly" ? "professional" : "friendly",
          };
          setComparisonPersona(newPersona);
        }
      }

      setIsComparisonMode(!isComparisonMode);

      if (!isComparisonMode) {
        // Generate comparison responses
        setIsGeneratingComparison(true);
        setTimeout(() => {
          const updatedComparisonMessages = messages
            .filter((msg) => msg.sender === "user")
            .flatMap((userMsg) => {
              const userMessage = {
                ...userMsg,
                id: `comparison-${userMsg.id}`,
              };

              const aiResponse = comparisonPersona
                ? generatePersonaResponse(userMsg.content, comparisonPersona)
                : "Comparison persona not set";

              const aiMessage: Message = {
                id: `comparison-ai-${userMsg.id}`,
                content: aiResponse,
                sender: "assistant",
                timestamp: new Date(),
                isMarkdown: true,
              };

              return [userMessage, aiMessage];
            });

          setComparisonMessages(updatedComparisonMessages);
          setIsGeneratingComparison(false);
        }, 1000);
      }
    };

    const handleExportPersona = () => {
      setExportStatus("exporting");
      setTimeout(() => {
        try {
          exportPersona();
          setExportStatus("success");
          setTimeout(() => setExportStatus("idle"), 2000);
        } catch (error) {
          console.error("Error exporting persona:", error);
          setExportStatus("error");
          setTimeout(() => setExportStatus("idle"), 2000);
        }
      }, 500);
    };

    const handleImportPersona = () => {
      setImportStatus("importing");
      setTimeout(() => {
        try {
          importPersona();
          setImportStatus("success");
          setTimeout(() => setImportStatus("idle"), 2000);
        } catch (error) {
          console.error("Error importing persona:", error);
          setImportStatus("error");
          setTimeout(() => setImportStatus("idle"), 2000);
        }
      }, 500);
    };

    return (
      <Card className={`flex flex-col h-full overflow-hidden ${className}`}>
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Chat</h2>
            {isCustomized && (
              <Badge variant="outline" className="ml-2 text-xs">
                Custom Persona
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {enableComparison && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center mr-2">
                      <Switch
                        checked={isComparisonMode}
                        onCheckedChange={handleComparisonToggle}
                        className="mr-2"
                      />
                      <span className="text-sm">Compare</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Compare responses with a different persona</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="h-8 w-8"
                  >
                    {isDarkMode ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onOpenPersonaEditor}>
                  <Zap className="h-4 w-4 mr-2" />
                  Edit Persona
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPersona}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Persona
                  {exportStatus === "exporting" && "..."}
                  {exportStatus === "success" && (
                    <Check className="h-4 w-4 ml-2 text-green-500" />
                  )}
                  {exportStatus === "error" && (
                    <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportPersona}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Persona
                  {importStatus === "importing" && "..."}
                  {importStatus === "success" && (
                    <Check className="h-4 w-4 ml-2 text-green-500" />
                  )}
                  {importStatus === "error" && (
                    <AlertCircle className="h-4 w-4 ml-2 text-red-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileJson className="h-4 w-4 mr-2" />
                  View JSON Config
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs
          defaultValue="chat"
          className="flex-1 flex flex-col overflow-hidden"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="border-b px-3">
            <TabsList className="h-10">
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-muted"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-muted"
              >
                <Info className="h-4 w-4 mr-1" />
                Info
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="chat"
            className="flex-1 flex flex-col overflow-hidden p-0"
          >
            <div className="flex-1 overflow-hidden">
              {isComparisonMode ? (
                <div className="grid grid-cols-2 h-full">
                  <div className="border-r overflow-hidden flex flex-col">
                    <div className="p-2 bg-muted/50 text-center text-sm font-medium border-b">
                      Current Persona
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <MessageHistory messages={messages} />
                    </div>
                  </div>
                  <div className="overflow-hidden flex flex-col">
                    <div className="p-2 bg-muted/50 text-center text-sm font-medium border-b">
                      Comparison Persona
                      {isGeneratingComparison && " (Generating...)"}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      {isGeneratingComparison ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-pulse flex flex-col items-center">
                            <Sparkles className="h-8 w-8 text-primary mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Generating comparison responses...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <MessageHistory messages={comparisonMessages} />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <MessageHistory messages={messages} />
              )}
            </div>
            <div className="p-3 border-t">
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </TabsContent>

          <TabsContent value="info" className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About this AI Assistant</h3>
              <p>
                This is a customizable AI assistant powered by Bolt.DIY. You can
                adjust its persona to change how it responds to your messages.
              </p>

              <div className="bg-muted/50 p-3 rounded-md">
                <h4 className="font-medium mb-2">Current Persona Settings:</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <span className="font-medium">Tone:</span> {persona.tone}
                  </li>
                  <li>
                    <span className="font-medium">Formality:</span>{" "}
                    {persona.formality}/100
                  </li>
                  <li>
                    <span className="font-medium">Verbosity:</span>{" "}
                    {persona.verbosity}/100
                  </li>
                  <li>
                    <span className="font-medium">Creativity:</span>{" "}
                    {persona.creativity}/100
                  </li>
                  <li>
                    <span className="font-medium">Uses Emojis:</span>{" "}
                    {persona.useEmojis ? "Yes" : "No"}
                  </li>
                  <li>
                    <span className="font-medium">Uses Code Examples:</span>{" "}
                    {persona.useCodeExamples ? "Yes" : "No"}
                  </li>
                  <li>
                    <span className="font-medium">Knowledge Domains:</span>{" "}
                    {persona.knowledgeDomains.join(", ") || "None specified"}
                  </li>
                </ul>
              </div>

              <Button
                onClick={onOpenPersonaEditor}
                className="w-full mt-4"
                variant="outline"
              >
                <Zap className="h-4 w-4 mr-2" />
                Customize Persona
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    );
  },
);

export default ChatInterface;
