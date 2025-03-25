import React, { useState, useRef, useEffect } from "react";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import MessageHistory from "@/components/chat/MessageHistory";
import MessageInput from "@/components/chat/MessageInput";
import { usePersona } from "@/contexts/PersonaContext";
import {
  Code,
  Send,
  Copy,
  Play,
  Download,
  Upload,
  Settings,
  Sparkles,
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
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
            <Button size="sm" onClick={handleSendCodeToChat} className="gap-1">
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
    </div>
  );
};

export default CodeEditorChat;
