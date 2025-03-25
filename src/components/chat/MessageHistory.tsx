import React, { useState } from "react";
import ScrollArea from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Bot, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface MessageHistoryProps {
  messages?: Message[];
  comparisonMessages?: Message[];
  isComparison?: boolean;
  leftPersonaName?: string;
  rightPersonaName?: string;
  className?: string;
}

const MessageHistory = ({
  messages = [
    {
      id: "1",
      content:
        "Hello! I'm Bolt.DIY, your customizable AI assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(Date.now() - 60000 * 5),
    },
    {
      id: "2",
      content: "Can you help me understand how to use React hooks?",
      sender: "user",
      timestamp: new Date(Date.now() - 60000 * 4),
    },
    {
      id: "3",
      content:
        'Absolutely! React Hooks are functions that let you "hook into" React state and lifecycle features from function components. Here\'s a simple example of the useState hook:',
      sender: "assistant",
      timestamp: new Date(Date.now() - 60000 * 3),
      codeBlocks: [
        {
          language: "jsx",
          code: "import React, { useState } from 'react';\n\nfunction Counter() {\n  // Declare a state variable named \"count\" with initial value 0\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}",
        },
      ],
    },
    {
      id: "4",
      content: "That makes sense! What about useEffect?",
      sender: "user",
      timestamp: new Date(Date.now() - 60000 * 2),
    },
    {
      id: "5",
      content:
        "The useEffect hook lets you perform side effects in function components. It serves a similar purpose to componentDidMount, componentDidUpdate, and componentWillUnmount in React class components, but unified into a single API. Here's how you might use it:",
      sender: "assistant",
      timestamp: new Date(Date.now() - 60000),
      codeBlocks: [
        {
          language: "jsx",
          code: "import React, { useState, useEffect } from 'react';\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n\n  // Similar to componentDidMount and componentDidUpdate:\n  useEffect(() => {\n    // Update the document title using the browser API\n    document.title = `You clicked ${count} times`;\n    \n    // Optional cleanup function (similar to componentWillUnmount)\n    return () => {\n      document.title = 'React App';\n    };\n  }, [count]); // Only re-run the effect if count changes\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}",
        },
      ],
    },
  ],
  comparisonMessages = [],
  isComparison = false,
  leftPersonaName = "Persona A",
  rightPersonaName = "Persona B",
  className = "",
}: MessageHistoryProps) => {
  // Function to format the timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // State to track which code blocks have been copied
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Function to handle copying code to clipboard
  const handleCopyCode = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedStates({ ...copiedStates, [blockId]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [blockId]: false });
      }, 2000);
    });
  };

  // Detect if we're in dark mode
  const isDarkMode = document.documentElement.classList.contains("dark");

  // Function to render code blocks with syntax highlighting
  const renderContent = (message: Message) => {
    if (!message.codeBlocks) {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }

    // Split the content and code blocks
    const parts = [];
    parts.push(
      <p key="content" className="whitespace-pre-wrap mb-3">
        {message.content}
      </p>,
    );

    message.codeBlocks.forEach((block, index) => {
      const blockId = `${message.id}-code-${index}`;
      const isCopied = copiedStates[blockId];

      // Map common language aliases to their proper names
      const languageMap: Record<string, string> = {
        js: "javascript",
        ts: "typescript",
        py: "python",
        rb: "ruby",
        go: "go",
        java: "java",
        c: "c",
        cpp: "cpp",
        cs: "csharp",
        php: "php",
        rust: "rust",
        swift: "swift",
        kotlin: "kotlin",
        scala: "scala",
        html: "html",
        css: "css",
        scss: "scss",
        less: "less",
        json: "json",
        xml: "xml",
        yaml: "yaml",
        markdown: "markdown",
        md: "markdown",
        bash: "bash",
        sh: "bash",
        sql: "sql",
        graphql: "graphql",
        jsx: "jsx",
        tsx: "tsx",
      };

      // Get the normalized language name
      const normalizedLanguage =
        languageMap[block.language.toLowerCase()] || block.language;

      parts.push(
        <div
          key={`code-${index}`}
          className="rounded-md my-3 overflow-hidden border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {block.language.toUpperCase()}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    onClick={() => handleCopyCode(block.code, blockId)}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {isCopied ? "Copied!" : "Copy code to clipboard"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <SyntaxHighlighter
            language={normalizedLanguage}
            style={isDarkMode ? vscDarkPlus : vs}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              lineHeight: 1.5,
              backgroundColor: isDarkMode ? "#1e293b" : "#f8fafc",
            }}
            showLineNumbers={true}
            wrapLongLines={false}
          >
            {block.code.replace(/\"/g, '"')}
          </SyntaxHighlighter>
        </div>,
      );
    });

    return <>{parts}</>;
  };

  // Render a single message column
  const renderMessageColumn = (
    messageList: Message[],
    personaName?: string,
  ) => (
    <div className="space-y-6 w-full">
      {messageList.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <Card
            className={`max-w-full ${message.sender === "user" ? "bg-blue-50 dark:bg-blue-950" : "bg-gray-50 dark:bg-slate-900"} p-4 shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <Avatar
                className={`h-8 w-8 ${message.sender === "user" ? "bg-blue-500" : "bg-emerald-500"}`}
              >
                {message.sender === "user" ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Bot className="h-5 w-5 text-white" />
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">
                    {message.sender === "user"
                      ? "You"
                      : personaName || "Bolt.DIY"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="text-sm">{renderContent(message)}</div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-white dark:bg-slate-950 h-full ${className}`}>
      <ScrollArea className="h-full p-4">
        {isComparison ? (
          <div className="flex flex-col space-y-4">
            {/* Persona headers */}
            <div className="flex justify-between px-4">
              <div className="flex-1 text-center font-semibold border-r border-gray-200 dark:border-gray-700 pr-2">
                {leftPersonaName}
              </div>
              <div className="flex-1 text-center font-semibold pl-2">
                {rightPersonaName}
              </div>
            </div>

            {/* Separator */}
            <Separator className="my-2" />

            {/* Message columns */}
            <div className="flex gap-4">
              <div className="flex-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                {renderMessageColumn(messages, leftPersonaName)}
              </div>
              <div className="flex-1 pl-2">
                {renderMessageColumn(comparisonMessages, rightPersonaName)}
              </div>
            </div>
          </div>
        ) : (
          renderMessageColumn(messages)
        )}
      </ScrollArea>
    </div>
  );
};

export default MessageHistory;
