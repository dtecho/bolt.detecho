import React, { useState, useRef, useEffect } from "react";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import MessageHistory from "@/components/chat/MessageHistory";
import MessageInput from "@/components/chat/MessageInput";
import { usePersona } from "@/contexts/PersonaContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Code,
  Send,
  Copy,
  Play,
  Download,
  Upload,
  Settings,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Zap,
  RefreshCw,
  Search,
  FileCode,
  Braces,
  Bug,
  Wand2,
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  codeBlocks?: Array<{
    language: string;
    code: string;
  }>;
}

interface CodeEditorChatProps {
  initialCode?: string;
  initialLanguage?: string;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { name: "JavaScript", value: "javascript", extension: ".js" },
  { name: "TypeScript", value: "typescript", extension: ".ts" },
  { name: "JSX", value: "jsx", extension: ".jsx" },
  { name: "TSX", value: "tsx", extension: ".tsx" },
  { name: "HTML", value: "html", extension: ".html" },
  { name: "CSS", value: "css", extension: ".css" },
  { name: "JSON", value: "json", extension: ".json" },
];

const DEFAULT_CODE = `// Welcome to the CodeEditorChat component
// Edit your code here and ask the AI for help

function greet(name) {
  return \`Hello, ${name}!\`;
}

// Try asking the AI to improve this function
console.log(greet('World'));
`;

interface CodeSuggestion {
  id: string;
  type: "improvement" | "bug" | "performance" | "security" | "best-practice";
  title: string;
  description: string;
  code?: string;
  lineNumber?: number;
  severity: "low" | "medium" | "high";
  applied: boolean;
}

const CodeEditorChat: React.FC<CodeEditorChatProps> = ({
  initialCode = DEFAULT_CODE,
  initialLanguage = "javascript",
  className = "",
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Welcome to the Code Editor Chat! I can help you with your code. What would you like to do?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [realTimeAssistance, setRealTimeAssistance] = useState<boolean>(true);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<CodeSuggestion | null>(null);
  const [assistantTab, setAssistantTab] = useState<string>("suggestions");
  const { persona } = usePersona();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Generate code suggestions when code changes if real-time assistance is enabled
  useEffect(() => {
    if (realTimeAssistance && code.trim().length > 0) {
      const timer = setTimeout(() => {
        analyzeCode();
      }, 1500); // Debounce to avoid too frequent analysis

      return () => clearTimeout(timer);
    }
  }, [code, realTimeAssistance]);

  // Analyze code and generate suggestions
  const analyzeCode = () => {
    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      // Generate mock suggestions based on code content
      const newSuggestions: CodeSuggestion[] = [];

      // Check for console.log statements
      if (code.includes("console.log")) {
        newSuggestions.push({
          id: `suggestion-${Date.now()}-1`,
          type: "best-practice",
          title: "Remove console.log statements",
          description:
            "Console statements should be removed in production code. Consider using a proper logging library instead.",
          severity: "low",
          applied: false,
        });
      }

      // Check for missing error handling
      if (code.includes("try") && !code.includes("catch")) {
        newSuggestions.push({
          id: `suggestion-${Date.now()}-2`,
          type: "bug",
          title: "Missing error handling",
          description:
            "You have a try block without a corresponding catch block. This could lead to unhandled exceptions.",
          severity: "high",
          applied: false,
        });
      }

      // Check for function without parameter validation
      if (
        code.includes("function") &&
        !code.includes("if") &&
        code.includes("(")
      ) {
        newSuggestions.push({
          id: `suggestion-${Date.now()}-3`,
          type: "security",
          title: "Add parameter validation",
          description:
            "Functions should validate their input parameters to prevent unexpected behavior.",
          code: `// Example of parameter validation
function greet(name) {
  if (typeof name !== 'string') {
    throw new Error('Name must be a string');
  }
  return \`Hello, ${name}!\`;
}`,
          severity: "medium",
          applied: false,
        });
      }

      // Check for potential performance issues with string concatenation
      if (code.includes("+") && code.includes("'")) {
        newSuggestions.push({
          id: `suggestion-${Date.now()}-4`,
          type: "performance",
          title: "Use template literals",
          description:
            "For better readability and performance, consider using template literals instead of string concatenation.",
          severity: "low",
          applied: false,
        });
      }

      // Check for potential improvements
      if (code.includes("function") && !code.includes("=>")) {
        newSuggestions.push({
          id: `suggestion-${Date.now()}-5`,
          type: "improvement",
          title: "Use arrow functions",
          description:
            "Consider using arrow functions for cleaner syntax and lexical this binding.",
          code: `// Convert to arrow function
const greet = (name) => \`Hello, ${name}!\`;`,
          severity: "low",
          applied: false,
        });
      }

      setSuggestions(newSuggestions);
      setIsAnalyzing(false);

      if (newSuggestions.length > 0) {
        toast({
          title: `${newSuggestions.length} suggestions found`,
          description:
            "Check the Assistant tab to see code improvement suggestions",
          duration: 3000,
        });
      }
    }, 1000);
  };

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      let responseContent = "";
      let codeBlocks;

      // Check if message contains code-related keywords
      const codeKeywords = [
        "code",
        "function",
        "bug",
        "error",
        "fix",
        "improve",
        "optimize",
        "refactor",
      ];

      const isCodeRelated = codeKeywords.some((keyword) =>
        content.toLowerCase().includes(keyword),
      );

      if (isCodeRelated) {
        // Generate a response with code suggestions
        if (content.toLowerCase().includes("improve")) {
          responseContent =
            "Here's an improved version of your function with TypeScript typing and better error handling:";
          codeBlocks = [
            {
              language: "typescript",
              code: `function greet(name: string): string {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid name provided');
  }
  return \`Hello, ${name}! Welcome to our application.\`;
}

try {
  console.log(greet('World'));
} catch (error) {
  console.error('An error occurred:', error.message);
}`,
            },
          ];
        } else if (
          content.toLowerCase().includes("bug") ||
          content.toLowerCase().includes("error") ||
          content.toLowerCase().includes("fix")
        ) {
          responseContent =
            "I found a potential issue in your code. Here's a fix:";
          codeBlocks = [
            {
              language: "javascript",
              code: `// The template literal syntax might be causing issues
// Let's fix the function

function greet(name) {
  // Add validation
  if (!name) {
    return 'Hello, stranger!';
  }
  // Use concatenation instead if template literals are problematic
  return 'Hello, ' + name + '!';
}

console.log(greet('World'));`,
            },
          ];
        } else if (
          content.toLowerCase().includes("optimize") ||
          content.toLowerCase().includes("refactor")
        ) {
          responseContent =
            "Here's a refactored version with better performance and readability:";
          codeBlocks = [
            {
              language: "javascript",
              code: `// Refactored for better performance and readability
const greet = (name = 'stranger') => \`Hello, ${name}!\`;

// Using default parameter for cleaner code
console.log(greet('World'));
console.log(greet()); // Will use default value`,
            },
          ];
        } else {
          responseContent = "Based on your code, here's a suggestion:";
          codeBlocks = [
            {
              language: language,
              code: `// Enhanced version
function greet(name = 'World') {
  return \`Hello, ${name}!\`;
}

// Now you can call it with or without arguments
console.log(greet());
console.log(greet('Developer'));`,
            },
          ];
        }
      } else {
        // Generate a general response
        responseContent = `I'm here to help with your code. You can ask me to improve, fix bugs, or optimize your code. I can also explain concepts or help you implement new features.`;
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: responseContent,
        sender: "assistant",
        timestamp: new Date(),
        codeBlocks,
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSendCodeToChat = () => {
    const message = `Can you help me improve this ${language} code?\n\n\`\`\`${language}\n${code}\n\`\`\``;
    handleSendMessage(message);
    setActiveTab("chat");
    toast({
      title: "Code sent to chat",
      description: "Your code has been sent to the AI assistant.",
      duration: 3000,
    });
  };

  const handleInsertCodeFromChat = (codeBlock: string) => {
    setCode(codeBlock);
    setActiveTab("editor");
    toast({
      title: "Code inserted",
      description: "The code snippet has been inserted into the editor.",
      duration: 3000,
    });
  };

  const handleRunCode = () => {
    try {
      // Create a safe environment to run the code
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;
      const originalConsoleInfo = console.info;

      let output = [];

      // Override console methods to capture output
      console.log = (...args) => {
        output.push(`[log] ${args.map(String).join(" ")}`);
        originalConsoleLog(...args);
      };

      console.error = (...args) => {
        output.push(`[error] ${args.map(String).join(" ")}`);
        originalConsoleError(...args);
      };

      console.warn = (...args) => {
        output.push(`[warn] ${args.map(String).join(" ")}`);
        originalConsoleWarn(...args);
      };

      console.info = (...args) => {
        output.push(`[info] ${args.map(String).join(" ")}`);
        originalConsoleInfo(...args);
      };

      // Execute the code
      const result = new Function(code)();

      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;

      // If there's a return value, add it to the output
      if (result !== undefined) {
        output.push(`[return] ${String(result)}`);
      }

      // Display the output
      const outputMessage =
        output.length > 0
          ? `Code execution result:\n${output.join("\n")}`
          : "Code executed successfully with no output.";

      handleSendMessage(outputMessage);
    } catch (error) {
      handleSendMessage(`Error executing code: ${error.message}`);
    }
  };

  const handleDownloadCode = () => {
    const extension =
      SUPPORTED_LANGUAGES.find((lang) => lang.value === language)?.extension ||
      ".txt";
    const filename = `code-snippet${extension}`;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Code downloaded",
      description: `Your code has been downloaded as ${filename}`,
      duration: 3000,
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "Your code has been copied to the clipboard.",
      duration: 3000,
    });
  };

  // Apply a suggestion to the code
  const applySuggestion = (suggestion: CodeSuggestion) => {
    if (suggestion.code) {
      setCode(suggestion.code);

      // Mark suggestion as applied
      setSuggestions(
        suggestions.map((s) =>
          s.id === suggestion.id ? { ...s, applied: true } : s,
        ),
      );

      toast({
        title: "Suggestion applied",
        description: suggestion.title,
        duration: 3000,
      });
    }
  };

  // Request a full code review
  const requestCodeReview = () => {
    setIsAnalyzing(true);

    // Send code to chat for review
    const message = `Please review my ${language} code and provide detailed feedback:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    handleSendMessage(message);
    setActiveTab("chat");

    // Simulate analysis
    setTimeout(() => {
      analyzeCode();
      setIsAnalyzing(false);
    }, 1500);
  };

  // Get explanation for selected code
  const explainSelectedCode = () => {
    // Get selected code from CodeMirror (in a real implementation)
    // For now, we'll just use the whole code if it's short, or a portion if it's long
    const selectedCode =
      code.length > 100 ? code.substring(0, 100) + "..." : code;

    const message = `Please explain what this code does:\n\n\`\`\`${language}\n${selectedCode}\n\`\`\``;
    handleSendMessage(message);
    setActiveTab("chat");
  };

  // Get refactoring suggestions
  const getRefactoringSuggestions = () => {
    const message = `Please suggest ways to refactor this ${language} code for better readability and maintainability:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    handleSendMessage(message);
    setActiveTab("chat");
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Code className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">Code Editor Chat</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            className="gap-1"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCode}
            className="gap-1"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunCode}
            className="gap-1"
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={70} minSize={40}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-2">
              <TabsList>
                <TabsTrigger value="editor" className="gap-1">
                  <Code className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="chat" className="gap-1">
                  <Sparkles className="h-4 w-4" />
                  AI Chat
                </TabsTrigger>
              </TabsList>
              {activeTab === "editor" && (
                <Button
                  size="sm"
                  onClick={handleSendCodeToChat}
                  className="gap-1"
                >
                  <Send className="h-4 w-4" />
                  Send to Chat
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="editor" className="h-full m-0 p-0">
                <Card className="h-full flex flex-col">
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <CodeMirror
                      value={code}
                      height="100%"
                      theme={isDarkMode ? vscodeDark : undefined}
                      extensions={[javascript({ jsx: true })]}
                      onChange={(value) => setCode(value)}
                      className="h-full"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="h-full m-0 p-0">
                <Card className="h-full flex flex-col">
                  <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1 p-4">
                      <MessageHistory messages={messages} />
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                    <div className="p-4 border-t">
                      <MessageInput
                        onSendMessage={handleSendMessage}
                        placeholder="Ask about your code or request help..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </ResizablePanel>

        <ResizablePanel defaultSize={30} minSize={20}>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                Code Assistant
              </CardTitle>
              <CardDescription>
                AI-powered suggestions and assistance for your code
              </CardDescription>
            </CardHeader>

            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={analyzeCode}
                  disabled={isAnalyzing}
                  className="gap-1"
                >
                  {isAnalyzing ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <Search className="h-3 w-3" />
                  )}
                  {isAnalyzing ? "Analyzing..." : "Analyze Code"}
                </Button>

                <div className="flex items-center gap-1 text-xs">
                  <span>Real-time:</span>
                  <button
                    onClick={() => setRealTimeAssistance(!realTimeAssistance)}
                    className={`px-2 py-0.5 rounded-full text-xs ${realTimeAssistance ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {realTimeAssistance ? "On" : "Off"}
                  </button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                {suggestions.length} suggestions
              </div>
            </div>

            <Separator className="my-1" />

            <Tabs
              value={assistantTab}
              onValueChange={setAssistantTab}
              className="flex-1 flex flex-col"
            >
              <div className="px-4">
                <TabsList className="w-full">
                  <TabsTrigger value="suggestions" className="flex-1 text-xs">
                    Suggestions
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="flex-1 text-xs">
                    Actions
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="flex-1 p-0 overflow-hidden">
                <TabsContent
                  value="suggestions"
                  className="h-full m-0 data-[state=active]:flex flex-col"
                >
                  <ScrollArea className="flex-1 px-4 py-2">
                    {suggestions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-8 text-center text-muted-foreground">
                        <Lightbulb className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">No suggestions yet</p>
                        <p className="text-xs mt-1">
                          Click "Analyze Code" to get AI suggestions
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {suggestions.map((suggestion) => (
                          <Card
                            key={suggestion.id}
                            className={`overflow-hidden transition-all ${suggestion.applied ? "opacity-60" : ""}`}
                          >
                            <div className="p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2">
                                  {suggestion.type === "bug" && (
                                    <Bug className="h-4 w-4 text-red-500 mt-0.5" />
                                  )}
                                  {suggestion.type === "improvement" && (
                                    <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                                  )}
                                  {suggestion.type === "performance" && (
                                    <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
                                  )}
                                  {suggestion.type === "security" && (
                                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                  )}
                                  {suggestion.type === "best-practice" && (
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                  )}
                                  <div>
                                    <h4 className="text-sm font-medium">
                                      {suggestion.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {suggestion.description}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    suggestion.severity === "high"
                                      ? "destructive"
                                      : suggestion.severity === "medium"
                                        ? "default"
                                        : "outline"
                                  }
                                  className="text-[10px] h-5"
                                >
                                  {suggestion.severity}
                                </Badge>
                              </div>

                              {suggestion.code && (
                                <div className="mt-2 text-xs bg-muted p-2 rounded-md font-mono overflow-x-auto">
                                  {suggestion.code
                                    .split("\n")
                                    .map((line, i) => (
                                      <div key={i} className="whitespace-pre">
                                        {line}
                                      </div>
                                    ))}
                                </div>
                              )}

                              <div className="mt-2 flex justify-end gap-2">
                                {suggestion.code && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => applySuggestion(suggestion)}
                                    disabled={suggestion.applied}
                                  >
                                    {suggestion.applied ? "Applied" : "Apply"}
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs"
                                  onClick={() => {
                                    // Remove this suggestion
                                    setSuggestions(
                                      suggestions.filter(
                                        (s) => s.id !== suggestion.id,
                                      ),
                                    );
                                  }}
                                >
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent
                  value="actions"
                  className="h-full m-0 data-[state=active]:flex flex-col"
                >
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <Card className="overflow-hidden">
                        <button
                          className="p-3 text-left w-full hover:bg-accent transition-colors"
                          onClick={requestCodeReview}
                        >
                          <div className="flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-primary" />
                            <div>
                              <h4 className="text-sm font-medium">
                                Code Review
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Get a comprehensive review of your code
                              </p>
                            </div>
                          </div>
                        </button>
                      </Card>

                      <Card className="overflow-hidden">
                        <button
                          className="p-3 text-left w-full hover:bg-accent transition-colors"
                          onClick={explainSelectedCode}
                        >
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-primary" />
                            <div>
                              <h4 className="text-sm font-medium">
                                Explain Code
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Get an explanation of what your code does
                              </p>
                            </div>
                          </div>
                        </button>
                      </Card>

                      <Card className="overflow-hidden">
                        <button
                          className="p-3 text-left w-full hover:bg-accent transition-colors"
                          onClick={getRefactoringSuggestions}
                        >
                          <div className="flex items-center gap-2">
                            <Braces className="h-4 w-4 text-primary" />
                            <div>
                              <h4 className="text-sm font-medium">
                                Refactoring Ideas
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Get suggestions for refactoring your code
                              </p>
                            </div>
                          </div>
                        </button>
                      </Card>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">
                        Keyboard Shortcuts
                      </h3>
                      <div className="text-xs space-y-1.5 text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Analyze Code</span>
                          <span className="font-mono">Ctrl+Shift+A</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Send to Chat</span>
                          <span className="font-mono">Ctrl+Enter</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Run Code</span>
                          <span className="font-mono">F5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeEditorChat;
