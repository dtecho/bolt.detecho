import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

interface MessageHistoryProps {
  messages: ChatMessage[];
  personaName?: string;
  className?: string;
}

const MessageHistory: React.FC<MessageHistoryProps> = ({
  messages = [],
  personaName = "Assistant",
  className = "",
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <ScrollArea className={cn("h-full px-4", className)}>
      <div className="flex flex-col gap-4 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col",
              message.sender === "user" ? "items-end" : "items-start",
            )}
          >
            <div
              className={cn(
                "px-4 py-2 rounded-lg max-w-[80%]",
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : message.sender === "system"
                    ? "bg-muted text-muted-foreground"
                    : "bg-secondary text-secondary-foreground",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">
                  {message.sender === "user"
                    ? "You"
                    : message.sender === "system"
                      ? "System"
                      : personaName}
                </span>
                <span className="text-xs opacity-70">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageHistory;
