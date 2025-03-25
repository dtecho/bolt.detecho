import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import MessageHistory from "./MessageHistory";
import MessageInput from "./MessageInput";
import { usePersona } from "@/contexts/PersonaContext";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
                  className="prose dark:prose-invert prose-sm max-w-none"
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={isDarkMode ? vscDarkPlus : vs}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md border border-muted my-2"
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
    const { persona, isCustomized, savedPersonas, loadPersona } = usePersona();
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

    const toggleDarkMode = () => {
      const newDarkMode = !isDarkMode;
      document.documentElement.classList.toggle("dark", newDarkMode);
      setIsDarkMode(newDarkMode);
      localStorage.setItem(
        "bolt-diy-dark-mode",
        newDarkMode ? "dark" : "light",
      );
    };

    // Function to generate welcome message for comparison persona
    const generateComparisonWelcomeMessage = React.useCallback(
      (selectedPersona: PersonaConfig) => {
        setIsGeneratingComparison(true);
        try {
          // Clear previous messages if switching personas
          setComparisonMessages([]);

          // Generate welcome message
          setTimeout(() => {
            try {
              const welcomeMessage = generatePersonaResponse(
                "Hello",
                selectedPersona,
              );
              setComparisonMessages([
                {
                  id: "comparison-1",
                  content: welcomeMessage,
                  sender: "assistant",
                  timestamp: new Date(),
                  isMarkdown: true,
                },
              ]);
            } catch (error) {
              console.error("Error generating welcome message:", error);
              setComparisonMessages([
                {
                  id: "comparison-1",
                  content: `Hello! I'm ${selectedPersona.name}. How can I help you today?`,
                  sender: "assistant",
                  timestamp: new Date(),
                  isMarkdown: true,
                },
              ]);
            } finally {
              setIsGeneratingComparison(false);
            }
          }, 300);
        } catch (error) {
          console.error("Error in generateComparisonWelcomeMessage:", error);
          setIsGeneratingComparison(false);
        }
      },
      [],
    );

    // Effect to sync comparison messages when toggling comparison mode off and on
    React.useEffect(() => {
      if (
        isComparisonMode &&
        comparisonPersona &&
        comparisonMessages.length === 0
      ) {
        generateComparisonWelcomeMessage(comparisonPersona);
      }
    }, [
      isComparisonMode,
      comparisonPersona,
      comparisonMessages.length,
      generateComparisonWelcomeMessage,
    ]);

    const handleSendMessage = React.useCallback(
      (content: string) => {
        if (!content.trim()) return;

        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          content,
          sender: "user",
          timestamp: new Date(),
          isMarkdown: false,
        };

        setMessages((prev) => [...prev, userMessage]);

        // Simulate assistant response after a short delay
        setTimeout(() => {
          try {
            // Generate a response that reflects the current persona settings
            let responseContent = generatePersonaResponse(content, persona);

            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: responseContent,
              sender: "assistant",
              timestamp: new Date(),
              isMarkdown: true,
            };

            setMessages((prev) => [...prev, assistantMessage]);
          } catch (error) {
            console.error("Error generating response:", error);
            // Send a fallback error message
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              content:
                "I'm sorry, I encountered an error while processing your request. Please try again.",
              sender: "assistant",
              timestamp: new Date(),
              isMarkdown: true,
            };
            setMessages((prev) => [...prev, errorMessage]);
          }
        }, 1000);
      },
      [persona],
    );

    return (
      <div
        className={`flex flex-col h-full bg-white dark:bg-slate-950 ${className}`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Bolt.DIY</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Customizable AI assistant</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="mr-2 h-8 w-8 rounded-full bg-background hover:bg-accent transition-all duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </Button>

            <Badge
              variant={isCustomized ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              {persona.name}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={onOpenPersonaEditor}
            >
              <Settings className="h-4 w-4" />
              Customize
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="border-b px-4">
            <TabsList className="h-10">
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-background"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="playground"
                className="data-[state=active]:bg-background"
              >
                <Zap className="h-4 w-4 mr-2" />
                Playground
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
            {enableComparison && (
              <div className="flex items-center justify-between border-b p-3 bg-muted/20">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="comparison-mode"
                    checked={isComparisonMode}
                    onCheckedChange={(checked) => {
                      setIsComparisonMode(checked);
                      if (
                        checked &&
                        !comparisonPersona &&
                        savedPersonas.length > 0
                      ) {
                        // Auto-select the first available persona that's not the current one
                        const firstDifferentPersona = savedPersonas.find(
                          (p) => p.id !== persona.id,
                        );
                        if (firstDifferentPersona) {
                          setComparisonPersona(firstDifferentPersona);
                          generateComparisonWelcomeMessage(
                            firstDifferentPersona,
                          );
                        }
                      }
                    }}
                  />
                  <label
                    htmlFor="comparison-mode"
                    className="text-sm font-medium"
                  >
                    Comparison Mode
                  </label>
                </div>
                {isComparisonMode && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Compare with:</span>
                    <select
                      className="text-sm border rounded-md p-1.5 bg-background focus:ring-1 focus:ring-primary"
                      value={comparisonPersona?.id || ""}
                      onChange={(e) => {
                        const selectedPersona = savedPersonas.find(
                          (p) => p.id === e.target.value,
                        );
                        if (selectedPersona) {
                          setComparisonPersona(selectedPersona);
                          generateComparisonWelcomeMessage(selectedPersona);
                        }
                      }}
                      disabled={isGeneratingComparison}
                    >
                      <option value="" disabled>
                        Select a persona
                      </option>
                      {savedPersonas
                        .filter((p) => p.id !== persona.id)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      {savedPersonas.filter((p) => p.id !== persona.id)
                        .length === 0 && (
                        <option value="" disabled>
                          No other personas available
                        </option>
                      )}
                    </select>
                    {isGeneratingComparison && (
                      <span className="text-xs text-muted-foreground animate-pulse">
                        Generating...
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <MessageHistory
                messages={messages}
                comparisonMessages={comparisonMessages}
                isComparison={isComparisonMode && !!comparisonPersona}
                leftPersonaName={persona.name}
                rightPersonaName={comparisonPersona?.name}
              />
            </div>
            <MessageInput
              onSendMessage={(content) => {
                handleSendMessage(content);

                // If in comparison mode, also generate a response with the comparison persona
                if (isComparisonMode && comparisonPersona) {
                  // Add user message to comparison messages
                  const userMessage: Message = {
                    id: `comparison-${Date.now().toString()}`,
                    content,
                    sender: "user",
                    timestamp: new Date(),
                    isMarkdown: false,
                  };

                  setComparisonMessages((prev) => [...prev, userMessage]);
                  setIsGeneratingComparison(true);

                  // Generate response with comparison persona
                  setTimeout(() => {
                    try {
                      const responseContent = generatePersonaResponse(
                        content,
                        comparisonPersona,
                      );

                      const assistantMessage: Message = {
                        id: `comparison-${(Date.now() + 1).toString()}`,
                        content: responseContent,
                        sender: "assistant",
                        timestamp: new Date(),
                        isMarkdown: true,
                      };

                      setComparisonMessages((prev) => [
                        ...prev,
                        assistantMessage,
                      ]);
                    } catch (error) {
                      console.error(
                        "Error generating comparison response:",
                        error,
                      );
                      const errorMessage: Message = {
                        id: `comparison-${(Date.now() + 1).toString()}`,
                        content:
                          "I'm sorry, I encountered an error while processing your request.",
                        sender: "assistant",
                        timestamp: new Date(),
                        isMarkdown: true,
                      };
                      setComparisonMessages((prev) => [...prev, errorMessage]);
                    } finally {
                      setIsGeneratingComparison(false);
                    }
                  }, 1200); // Slightly delayed from the main response
                }
              }}
            />
          </TabsContent>

          <TabsContent value="playground" className="flex-1 p-4">
            <Card className="h-full flex items-center justify-center p-6">
              <div className="text-center space-y-4">
                <Zap className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-2xl font-bold">Playground Mode</h3>
                <p className="text-muted-foreground max-w-md">
                  Experiment with different persona settings and see how they
                  affect the AI's responses in real-time.
                </p>
                <Button onClick={onOpenPersonaEditor}>
                  <Settings className="h-4 w-4 mr-2" />
                  Open Persona Editor
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  },
);

export default ChatInterface;
