import React, { useState, useEffect, useRef } from "react";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import FileExplorer from "./FileExplorer";
import Terminal from "./Terminal";
import MessageHistory from "@/components/chat/MessageHistory";
import MessageInput from "@/components/chat/MessageInput";
import { usePersona } from "@/contexts/PersonaContext";
import {
  Save,
  Play,
  FileCode,
  Terminal as TerminalIcon,
  FolderTree,
  MessageSquare,
  Send,
  Code,
  Sparkles,
  RefreshCw,
  Download,
  Copy,
  Check,
  Zap,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Bug,
} from "lucide-react";

interface DevEnvironmentChatProps {
  className?: string;
}

interface FileData {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
  lastModified: Date;
}

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

const getLanguageExtension = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return javascript({ jsx: true });
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    default:
      return javascript();
  }
};

const DevEnvironmentChat: React.FC<DevEnvironmentChatProps> = ({
  className = "",
}) => {
  const { persona } = usePersona();
  const [files, setFiles] = useState<FileData[]>([
    {
      id: "1",
      name: "index.html",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <h1>Hello, World!</h1>
    <p>Welcome to my project</p>
    <button id="btn">Click me</button>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      language: "html",
      path: "/",
      lastModified: new Date(),
    },
    {
      id: "2",
      name: "styles.css",
      content: `body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #0066cc;
}

button {
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0052a3;
}`,
      language: "css",
      path: "/",
      lastModified: new Date(),
    },
    {
      id: "3",
      name: "app.js",
      content: `// Main application code
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn');
  
  btn.addEventListener('click', () => {
    alert('Button clicked!');
  });
  
  console.log('Application initialized');
});

// Helper functions
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}`,
      language: "javascript",
      path: "/",
      lastModified: new Date(),
    },
    {
      id: "4",
      name: "config.json",
      content: `{
  "appName": "My Project",
  "version": "1.0.0",
  "description": "A simple web project",
  "author": "Bolt.DIY User",
  "settings": {
    "theme": "light",
    "fontSize": 14,
    "showLineNumbers": true,
    "autoSave": true
  }
}`,
      language: "json",
      path: "/",
      lastModified: new Date(),
    },
  ]);

  const [currentFile, setCurrentFile] = useState<FileData | null>(files[0]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to Bolt.DIY Terminal",
    "Type 'help' to see available commands",
  ]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [activePanel, setActivePanel] = useState<
    "editor" | "terminal" | "chat"
  >("editor");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Welcome to the Dev Environment Chat! I'm ${persona.name}, and I can help you with your code. What would you like to know?`,
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<
    Array<{
      id: string;
      type:
        | "improvement"
        | "bug"
        | "performance"
        | "security"
        | "best-practice";
      title: string;
      description: string;
      code?: string;
      severity: "low" | "medium" | "high";
      applied: boolean;
    }>
  >([]);
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

  // Update welcome message when persona changes
  useEffect(() => {
    if (messages.length > 0 && messages[0].id === "welcome") {
      const updatedMessages = [...messages];
      updatedMessages[0] = {
        ...updatedMessages[0],
        content: `Welcome to the Dev Environment Chat! I'm ${persona.name}, and I can help you with your code. What would you like to know?`,
      };
      setMessages(updatedMessages);
    }
  }, [persona.name]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleFileSelect = (fileId: string) => {
    const selectedFile = files.find((file) => file.id === fileId);
    if (selectedFile) {
      setCurrentFile(selectedFile);
      setActivePanel("editor");
    }
  };

  const handleFileChange = (content: string) => {
    if (currentFile) {
      const updatedFile = { ...currentFile, content, lastModified: new Date() };
      setCurrentFile(updatedFile);
      setFiles(
        files.map((file) => (file.id === currentFile.id ? updatedFile : file)),
      );
    }
  };

  const handleSaveFile = () => {
    if (currentFile) {
      toast({
        title: "File saved",
        description: `${currentFile.name} has been saved successfully.`,
        duration: 3000,
      });
    }
  };

  const handleRunCode = () => {
    if (currentFile) {
      setActivePanel("terminal");
      setTerminalOutput((prev) => [
        ...prev,
        `> Running ${currentFile.name}...`,
        `[${new Date().toLocaleTimeString()}] Execution started`,
      ]);

      // Simulate execution delay
      setTimeout(() => {
        if (currentFile.name.endsWith(".js")) {
          setTerminalOutput((prev) => [
            ...prev,
            "Application initialized",
            "[LOG] Button event listener attached",
            `[${new Date().toLocaleTimeString()}] Execution completed successfully`,
          ]);
        } else if (currentFile.name.endsWith(".html")) {
          setTerminalOutput((prev) => [
            ...prev,
            "Rendering HTML...",
            "DOM loaded successfully",
            `[${new Date().toLocaleTimeString()}] Page rendered in 42ms`,
          ]);
        } else {
          setTerminalOutput((prev) => [
            ...prev,
            `File ${currentFile.name} executed`,
            `[${new Date().toLocaleTimeString()}] Execution completed`,
          ]);
        }
      }, 1000);
    }
  };

  const handleTerminalCommand = (command: string, customOutput?: string[]) => {
    const commandParts = command.trim().split(" ");
    const mainCommand = commandParts[0].toLowerCase();
    const args = commandParts.slice(1);

    setTerminalOutput((prev) => [...prev, `$ ${command}`]);

    // If custom output is provided (for AI integration commands), use it
    if (customOutput) {
      setTerminalOutput((prev) => [...prev, ...customOutput]);
      return;
    }

    switch (mainCommand) {
      case "help":
        setTerminalOutput((prev) => [
          ...prev,
          "Available commands:",
          "  help - Show this help message",
          "  ls - List files in the current directory",
          "  cat [filename] - Display file contents",
          "  clear - Clear the terminal",
          "  run [filename] - Run a file",
          "  echo [text] - Display text",
          "  date - Show current date and time",
          "  chat - Switch to chat panel",
          "  chat [message] - Send a message to the AI assistant",
          "  explain - Ask the AI to explain the current code",
          "  improve - Ask the AI for code improvement suggestions",
          "  persona - Show current AI persona settings",
        ]);
        break;

      case "ls":
        setTerminalOutput((prev) => [
          ...prev,
          "Files in current directory:",
          ...files.map((file) => `  ${file.name}`),
        ]);
        break;

      case "cat":
        if (args.length === 0) {
          setTerminalOutput((prev) => [...prev, "Error: Missing filename"]);
        } else {
          const fileName = args[0];
          const file = files.find((f) => f.name === fileName);
          if (file) {
            setTerminalOutput((prev) => [
              ...prev,
              `Contents of ${fileName}:`,
              "------------------------",
              file.content,
              "------------------------",
            ]);
          } else {
            setTerminalOutput((prev) => [
              ...prev,
              `Error: File '${fileName}' not found`,
            ]);
          }
        }
        break;

      case "clear":
        setTerminalOutput([]);
        break;

      case "run":
        if (args.length === 0) {
          setTerminalOutput((prev) => [...prev, "Error: Missing filename"]);
        } else {
          const fileName = args[0];
          const file = files.find((f) => f.name === fileName);
          if (file) {
            setTerminalOutput((prev) => [
              ...prev,
              `Running ${fileName}...`,
              `[${new Date().toLocaleTimeString()}] Execution started`,
            ]);

            setTimeout(() => {
              if (fileName.endsWith(".js")) {
                setTerminalOutput((prev) => [
                  ...prev,
                  "Application initialized",
                  "[LOG] Button event listener attached",
                  `[${new Date().toLocaleTimeString()}] Execution completed successfully`,
                ]);
              } else {
                setTerminalOutput((prev) => [
                  ...prev,
                  `File ${fileName} executed`,
                  `[${new Date().toLocaleTimeString()}] Execution completed`,
                ]);
              }
            }, 1000);
          } else {
            setTerminalOutput((prev) => [
              ...prev,
              `Error: File '${fileName}' not found`,
            ]);
          }
        }
        break;

      case "echo":
        setTerminalOutput((prev) => [...prev, args.join(" ")]);
        break;

      case "date":
        setTerminalOutput((prev) => [...prev, new Date().toLocaleString()]);
        break;

      case "chat":
        setActivePanel("chat");
        setTerminalOutput((prev) => [...prev, "Switching to chat panel..."]);
        break;

      default:
        setTerminalOutput((prev) => [
          ...prev,
          `Command not found: ${mainCommand}`,
          "Type 'help' to see available commands",
        ]);
    }
  };

  const handleCreateFile = (fileName: string, content: string = "") => {
    const fileExtension = fileName.split(".").pop() || "";
    let language = "javascript";

    if (fileExtension === "html") language = "html";
    else if (fileExtension === "css") language = "css";
    else if (fileExtension === "json") language = "json";

    const newFile: FileData = {
      id: Date.now().toString(),
      name: fileName,
      content,
      language,
      path: "/",
      lastModified: new Date(),
    };

    setFiles([...files, newFile]);
    setCurrentFile(newFile);
    setActivePanel("editor");

    toast({
      title: "File created",
      description: `${fileName} has been created successfully.`,
      duration: 3000,
    });
  };

  const handleDeleteFile = (fileId: string) => {
    const fileToDelete = files.find((file) => file.id === fileId);
    if (!fileToDelete) return;

    const updatedFiles = files.filter((file) => file.id !== fileId);
    setFiles(updatedFiles);

    if (currentFile && currentFile.id === fileId) {
      setCurrentFile(updatedFiles.length > 0 ? updatedFiles[0] : null);
    }

    toast({
      title: "File deleted",
      description: `${fileToDelete.name} has been deleted.`,
      duration: 3000,
    });
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

    // Analyze code if the message is about code analysis
    if (content.toLowerCase().includes("analyze") && currentFile) {
      analyzeCode();
    }

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

      // Personalize response based on persona settings
      const greeting =
        persona.tone === "friendly"
          ? `${persona.useEmojis ? "😊 " : ""}I'd be happy to help with that!`
          : persona.tone === "professional"
            ? `${persona.useEmojis ? "📝 " : ""}Based on my analysis:`
            : `${persona.useEmojis ? "💡 " : ""}Let me help you with that.`;

      if (isCodeRelated) {
        // Generate a response with code suggestions
        if (content.toLowerCase().includes("improve")) {
          responseContent = `${greeting} Here's an improved version of your code with better error handling:`;
          codeBlocks = [
            {
              language: currentFile?.language || "javascript",
              code: currentFile
                ? improveCode(currentFile.content, currentFile.language)
                : "// No file selected",
            },
          ];
        } else if (
          content.toLowerCase().includes("bug") ||
          content.toLowerCase().includes("error") ||
          content.toLowerCase().includes("fix")
        ) {
          responseContent = `${greeting} I found a potential issue in your code. Here's a fix:`;
          codeBlocks = [
            {
              language: currentFile?.language || "javascript",
              code: currentFile
                ? fixCode(currentFile.content, currentFile.language)
                : "// No file selected",
            },
          ];
        } else if (
          content.toLowerCase().includes("optimize") ||
          content.toLowerCase().includes("refactor")
        ) {
          responseContent = `${greeting} Here's a refactored version with better performance and readability:`;
          codeBlocks = [
            {
              language: currentFile?.language || "javascript",
              code: currentFile
                ? optimizeCode(currentFile.content, currentFile.language)
                : "// No file selected",
            },
          ];
        } else {
          responseContent = `${greeting} Based on your code, here's a suggestion:`;
          codeBlocks = [
            {
              language: currentFile?.language || "javascript",
              code: currentFile
                ? suggestCode(currentFile.content, currentFile.language)
                : "// No file selected",
            },
          ];
        }
      } else if (content.toLowerCase().includes("explain") && currentFile) {
        responseContent = `${greeting} Here's an explanation of your ${currentFile.name} file:`;
        codeBlocks = [
          {
            language: currentFile.language,
            code: currentFile.content,
          },
        ];
        responseContent += explainCode(
          currentFile.content,
          currentFile.language,
        );
      } else {
        // Generate a general response
        responseContent = `${greeting} I'm here to help with your code. You can ask me to improve, fix bugs, or optimize your code. I can also explain concepts or help you implement new features.`;

        // Add more detailed response based on verbosity setting
        if (persona.verbosity > 70) {
          responseContent +=
            "\n\nYou can try asking me to:\n" +
            "1. Analyze your current code for potential issues\n" +
            "2. Suggest improvements or optimizations\n" +
            "3. Explain how specific parts of your code work\n" +
            "4. Help you implement new features or functionality\n" +
            "5. Debug errors or unexpected behavior";
        }
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
    if (!currentFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to send to chat.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const message = `Can you help me understand this ${currentFile.language} code?\n\n\`\`\`${currentFile.language}\n${currentFile.content}\n\`\`\``;
    handleSendMessage(message);
    setActivePanel("chat");
    toast({
      title: "Code sent to chat",
      description: "Your code has been sent to the AI assistant.",
      duration: 3000,
    });
  };

  const handleApplyCodeSuggestion = (code: string) => {
    if (!currentFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to apply the code suggestion.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    handleFileChange(code);
    setActivePanel("editor");
    toast({
      title: "Code suggestion applied",
      description: "The code suggestion has been applied to the current file.",
      duration: 3000,
    });
  };

  // Analyze code and generate suggestions
  const analyzeCode = () => {
    if (!currentFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to analyze.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      // Generate suggestions based on code content
      const newSuggestions = [];
      const code = currentFile.content;
      const language = currentFile.language;

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
          code: improveCode(code, language),
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
          code: code.replace(/['"](.*?)['"] \+ ['"](.*?)['"]/, "`$1$2`"),
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
          code: optimizeCode(code, language),
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
            "Check the suggestions panel to see code improvement suggestions",
          duration: 3000,
        });
      } else {
        toast({
          title: "Code analysis complete",
          description: "No issues found in your code.",
          duration: 3000,
        });
      }
    }, 1000);
  };

  // Apply a suggestion to the code
  const applySuggestion = (suggestion: any) => {
    if (suggestion.code && currentFile) {
      handleFileChange(suggestion.code);

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

  // Helper functions for code suggestions (simplified for demo)
  const improveCode = (code: string, language: string): string => {
    if (language === "javascript" || language === "typescript") {
      return code.replace(
        /function (\w+)\((.*?)\) {/g,
        "function $1($2) {\n  // Input validation\n  if (!$2) {\n    throw new Error('Invalid parameters');\n  }\n",
      );
    }
    return code;
  };

  const fixCode = (code: string, language: string): string => {
    if (language === "javascript" || language === "typescript") {
      return code
        .replace(/console.log\(/g, "console.log(")
        .replace(
          /alert\(/g,
          "// Using console.log instead of alert for better debugging\nconsole.log(",
        );
    }
    return code;
  };

  const optimizeCode = (code: string, language: string): string => {
    if (language === "javascript" || language === "typescript") {
      return code
        .replace(/function (\w+)\((.*?)\) {/g, "const $1 = ($2) => {")
        .replace(
          /for \(let i = 0; i < (.*?); i\+\+\) {/g,
          "// Using forEach for better readability\n$1.forEach((item, index) => {",
        );
    }
    return code;
  };

  const suggestCode = (code: string, language: string): string => {
    if (language === "javascript" || language === "typescript") {
      return (
        code +
        "\n\n// Suggested addition: \n// Add error handling with try/catch\ntry {\n  // Your code here\n} catch (error) {\n  console.error('An error occurred:', error);\n}"
      );
    }
    return code;
  };

  const explainCode = (code: string, language: string): string => {
    return "\n\nThis code appears to be a simple web application. It sets up event listeners for DOM elements, specifically attaching a click handler to a button. The code also includes utility functions for generating random numbers and formatting dates.\n\nThe main functionality is triggered when the DOM content is loaded, which is a good practice to ensure all elements are available before trying to interact with them.";
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FileCode className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">
            Development Environment with AI Chat
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveFile}
            disabled={!currentFile}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunCode}
            disabled={!currentFile}
            className="gap-1"
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendCodeToChat}
            disabled={!currentFile}
            className="gap-1"
          >
            <Send className="h-4 w-4" />
            Ask AI
          </Button>
        </div>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 rounded-lg border"
      >
        {/* File Explorer Panel */}
        <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
          <div className="h-full flex flex-col">
            <div className="p-3 border-b">
              <div className="flex items-center">
                <FolderTree className="h-4 w-4 mr-2 text-primary" />
                <h3 className="text-sm font-medium">Files</h3>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <FileExplorer
                files={files}
                onSelectFile={handleFileSelect}
                onCreateFile={handleCreateFile}
                onDeleteFile={handleDeleteFile}
                selectedFileId={currentFile?.id}
              />
            </div>
          </div>
        </ResizablePanel>

        {/* Editor/Terminal/Chat Panel */}
        <ResizablePanel defaultSize={85}>
          <ResizablePanelGroup direction="vertical">
            {/* Editor Panel */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <Card className="h-full flex flex-col border-0 rounded-none">
                <div className="p-3 border-b">
                  <Tabs
                    value={activePanel}
                    onValueChange={(value) =>
                      setActivePanel(value as "editor" | "terminal" | "chat")
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="editor" className="gap-1">
                        <FileCode className="h-4 w-4" />
                        Editor {currentFile ? `- ${currentFile.name}` : ""}
                      </TabsTrigger>
                      <TabsTrigger value="terminal" className="gap-1">
                        <TerminalIcon className="h-4 w-4" />
                        Terminal
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                        AI Chat
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <TabsContent
                    value="editor"
                    className="h-full m-0 p-0 data-[state=active]:flex flex-col"
                  >
                    {currentFile ? (
                      <CodeMirror
                        value={currentFile.content}
                        height="100%"
                        theme={isDarkMode ? vscodeDark : undefined}
                        extensions={[getLanguageExtension(currentFile.name)]}
                        onChange={handleFileChange}
                        className="h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No file selected
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent
                    value="terminal"
                    className="h-full m-0 p-0 data-[state=active]:flex flex-col"
                  >
                    <Terminal
                      output={terminalOutput}
                      onCommand={handleTerminalCommand}
                      onSendToChat={(output) => {
                        setActivePanel("chat");
                        const message = output.join("\n");
                        handleSendMessage(message);
                      }}
                      onCodeExecution={(code) => {
                        if (currentFile) {
                          handleRunCode();
                        }
                      }}
                      currentCode={currentFile?.content}
                    />
                  </TabsContent>
                  <TabsContent
                    value="chat"
                    className="h-full m-0 p-0 data-[state=active]:flex flex-col"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-auto p-4">
                        <MessageHistory messages={messages} />
                        <div ref={messagesEndRef} />
                      </div>
                      <div className="p-4 border-t">
                        <MessageInput
                          onSendMessage={handleSendMessage}
                          placeholder="Ask about your code or request help..."
                        />
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </ResizablePanel>

            {/* Code Suggestions Panel */}
            <ResizablePanel defaultSize={40}>
              <Card className="h-full flex flex-col border-0 rounded-none">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-primary" />
                      <h3 className="text-sm font-medium">
                        AI Code Suggestions
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={analyzeCode}
                        disabled={isAnalyzing || !currentFile}
                        className="gap-1 h-8"
                      >
                        {isAnalyzing ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Zap className="h-3 w-3" />
                        )}
                        {isAnalyzing ? "Analyzing..." : "Analyze Code"}
                      </Button>
                    </div>
                  </div>
                </div>
                <Tabs
                  defaultValue="suggestions"
                  className="flex-1 flex flex-col"
                >
                  <div className="px-3 border-b">
                    <TabsList className="w-full">
                      <TabsTrigger
                        value="suggestions"
                        className="flex-1 text-xs"
                      >
                        Suggestions{" "}
                        {suggestions.length > 0 && `(${suggestions.length})`}
                      </TabsTrigger>
                      <TabsTrigger
                        value="chat-suggestions"
                        className="flex-1 text-xs"
                      >
                        Chat Suggestions
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent
                    value="suggestions"
                    className="flex-1 p-0 m-0 data-[state=active]:flex flex-col"
                  >
                    <ScrollArea className="flex-1 p-4">
                      {suggestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                          <Lightbulb className="h-12 w-12 mb-4 opacity-20" />
                          <h3 className="text-lg font-medium mb-2">
                            No Code Suggestions Yet
                          </h3>
                          <p className="text-sm max-w-md">
                            Click "Analyze Code" to get AI suggestions for your
                            current file.
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
                                      .slice(0, 5)
                                      .map((line: string, i: number) => (
                                        <div key={i} className="whitespace-pre">
                                          {line}
                                        </div>
                                      ))}
                                    {suggestion.code.split("\n").length > 5 && (
                                      <div className="text-muted-foreground">
                                        ...
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="mt-2 flex justify-end gap-2">
                                  {suggestion.code && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs"
                                      onClick={() =>
                                        applySuggestion(suggestion)
                                      }
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
                    value="chat-suggestions"
                    className="flex-1 p-0 m-0 data-[state=active]:flex flex-col"
                  >
                    <ScrollArea className="flex-1 p-4">
                      {messages.length > 0 &&
                      messages[messages.length - 1].codeBlocks ? (
                        <div className="space-y-4">
                          <p className="text-sm">
                            {messages[messages.length - 1].content}
                          </p>
                          {messages[messages.length - 1].codeBlocks?.map(
                            (block, index) => (
                              <div
                                key={index}
                                className="border rounded-md overflow-hidden"
                              >
                                <div className="bg-muted p-2 flex justify-between items-center">
                                  <span className="text-xs font-medium">
                                    {block.language.toUpperCase()}
                                  </span>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          block.code,
                                        );
                                        toast({
                                          title: "Code copied",
                                          description:
                                            "Code copied to clipboard",
                                          duration: 2000,
                                        });
                                      }}
                                      className="h-7 text-xs gap-1"
                                    >
                                      <Copy className="h-3 w-3" />
                                      Copy
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleApplyCodeSuggestion(block.code)
                                      }
                                      className="h-7 text-xs gap-1"
                                    >
                                      <Check className="h-3 w-3" />
                                      Apply
                                    </Button>
                                  </div>
                                </div>
                                <div className="p-3 bg-card">
                                  <pre className="text-xs overflow-auto whitespace-pre-wrap">
                                    <code>{block.code}</code>
                                  </pre>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                          <Code className="h-12 w-12 mb-4 opacity-20" />
                          <h3 className="text-lg font-medium mb-2">
                            No Chat Suggestions Yet
                          </h3>
                          <p className="text-sm max-w-md">
                            Send your code to the AI assistant using the "Ask
                            AI" button or switch to the chat panel to ask
                            questions about your code.
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DevEnvironmentChat;
