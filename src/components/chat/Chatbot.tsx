import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MessageHistory from "./MessageHistory";
import MessageInput from "./MessageInput";
import ChatbotEnhancements from "./ChatbotEnhancements";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant" | "system";
  timestamp: Date;
  codeBlocks?: Array<{
    language: string;
    code: string;
  }>;
}

export interface ChatbotProps {
  title?: string;
  subtitle?: string;
  initialMessages?: ChatMessage[];
  placeholder?: string;
  className?: string;
  botName?: string;
  avatarUrl?: string;
  onSendMessage?: (message: string) => Promise<ChatMessage | null>;
  isLoading?: boolean;
  theme?: "light" | "dark" | "system";
  accentColor?: string;
  showEnhancements?: boolean;
  enhancementsPosition?: "top" | "bottom";
  onVoiceInput?: () => void;
  onAttachFile?: () => void;
  onAttachImage?: () => void;
  onToggleAI?: () => void;
  onOpenSettings?: () => void;
  showVoiceInput?: boolean;
  showAttachments?: boolean;
  showAIToggle?: boolean;
  showSettings?: boolean;
  isAIEnabled?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({
  title = "Chatbot",
  subtitle,
  initialMessages = [
    {
      id: "welcome",
      content: "Hello! How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ],
  placeholder = "Type your message here...",
  className = "",
  botName = "Assistant",
  avatarUrl,
  onSendMessage,
  isLoading = false,
  theme = "system",
  accentColor,
  showEnhancements = true,
  enhancementsPosition = "top",
  onVoiceInput = () => {},
  onAttachFile = () => {},
  onAttachImage = () => {},
  onToggleAI = () => {},
  onOpenSettings = () => {},
  showVoiceInput = true,
  showAttachments = true,
  showAIToggle = true,
  showSettings = true,
  isAIEnabled = true,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  // Apply accent color if provided
  React.useEffect(() => {
    if (accentColor) {
      document.documentElement.style.setProperty("--accent-color", accentColor);
      return () => {
        document.documentElement.style.removeProperty("--accent-color");
      };
    }
  }, [accentColor]);

  // Apply theme if provided
  React.useEffect(() => {
    if (theme === "system") return;

    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);

    return () => {
      // Reset to system preference on unmount
      if (theme === "dark" || theme === "light") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    };
  }, [theme]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Show typing indicator
      setIsTyping(true);

      try {
        // If custom handler provided, use it
        if (onSendMessage) {
          const response = await onSendMessage(content);
          if (response) {
            setMessages((prev) => [...prev, response]);
          }
        } else {
          // Default echo response with slight delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Simple response generation
          let responseText = "I received your message.";

          if (
            content.toLowerCase().includes("hello") ||
            content.toLowerCase().includes("hi")
          ) {
            responseText = "Hello there! How can I assist you today?";
          } else if (content.toLowerCase().includes("help")) {
            responseText =
              "I'm here to help! What do you need assistance with?";
          } else if (content.toLowerCase().includes("thank")) {
            responseText =
              "You're welcome! Is there anything else you'd like to know?";
          } else if (content.includes("?")) {
            responseText = "That's a good question. Let me think about that...";
          }

          const botResponse: ChatMessage = {
            id: `assistant-${Date.now()}`,
            content: responseText,
            sender: "assistant",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, botResponse]);
        }
      } catch (error) {
        console.error("Error sending message:", error);

        // Add error message
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          content: "Sorry, there was an error processing your request.",
          sender: "system",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [onSendMessage],
  );

  return (
    <Card className={`flex flex-col h-full overflow-hidden ${className}`}>
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={botName}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <Bot className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        {showEnhancements && enhancementsPosition === "top" && (
          <div className="px-4 pt-4">
            <ChatbotEnhancements
              onVoiceInput={onVoiceInput}
              onAttachFile={onAttachFile}
              onAttachImage={onAttachImage}
              onToggleAI={onToggleAI}
              onOpenSettings={onOpenSettings}
              showVoiceInput={showVoiceInput}
              showAttachments={showAttachments}
              showAIToggle={showAIToggle}
              showSettings={showSettings}
              isAIEnabled={isAIEnabled}
              position="top"
            />
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <MessageHistory
            messages={messages}
            personaName={botName}
            className="h-full"
          />
        </div>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-2 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-1">
              <div
                className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </motion.div>
        )}
        {showEnhancements && enhancementsPosition === "bottom" && (
          <div className="px-4 pb-2">
            <ChatbotEnhancements
              onVoiceInput={onVoiceInput}
              onAttachFile={onAttachFile}
              onAttachImage={onAttachImage}
              onToggleAI={onToggleAI}
              onOpenSettings={onOpenSettings}
              showVoiceInput={showVoiceInput}
              showAttachments={showAttachments}
              showAIToggle={showAIToggle}
              showSettings={showSettings}
              isAIEnabled={isAIEnabled}
              position="bottom"
            />
          </div>
        )}
        <div className="border-t">
          <MessageInput
            onSendMessage={handleSendMessage}
            placeholder={placeholder}
            disabled={isLoading || isTyping}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
