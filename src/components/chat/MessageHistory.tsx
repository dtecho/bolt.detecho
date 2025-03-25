import React from "react";
import ScrollArea from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Bot } from "lucide-react";

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
  className = "",
}: MessageHistoryProps) => {
  // Function to format the timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
      parts.push(
        <div
          key={`code-${index}`}
          className="bg-slate-900 rounded-md p-4 my-3 overflow-x-auto"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{block.language}</span>
            <button className="text-xs text-slate-400 hover:text-white">
              Copy code
            </button>
          </div>
          <pre className="text-sm text-slate-50 font-mono">
            <code>{block.code.replace(/\"/g, '"')}</code>
          </pre>
        </div>,
      );
    });

    return <>{parts}</>;
  };

  return (
    <div className={`bg-white dark:bg-slate-950 h-full ${className}`}>
      <ScrollArea className="h-full p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-3xl ${message.sender === "user" ? "bg-blue-50 dark:bg-blue-950" : "bg-gray-50 dark:bg-slate-900"} p-4 shadow-sm`}
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
                        {message.sender === "user" ? "You" : "Bolt.DIY"}
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
      </ScrollArea>
    </div>
  );
};

export default MessageHistory;
