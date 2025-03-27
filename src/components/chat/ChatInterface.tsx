import React, { useState, useEffect } from "react";
import MessageHistory from "./MessageHistory";
import MessageInput from "./MessageInput";
import { usePersona } from "@/contexts/PersonaContext";

interface ChatInterfaceProps {
  onOpenPersonaEditor?: () => void;
  className?: string;
  enableComparison?: boolean;
  personaName?: string;
  isPersonaCustomized?: boolean;
  onCodeExecution?: (code: string) => void;
  onCodeRequest?: () => string | null;
  terminalOutput?: string[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onOpenPersonaEditor,
  className = "",
  enableComparison = false,
  personaName,
  isPersonaCustomized,
  onCodeExecution,
  onCodeRequest,
  terminalOutput,
}) => {
  const { persona, isCustomized } = usePersona();
  const [messages, setMessages] = useState<any[]>([]);

  // Use persona context if props are not provided
  const displayName = personaName || persona.name;
  const displayCustomized =
    isPersonaCustomized !== undefined ? isPersonaCustomized : isCustomized;

  // Handle terminal output changes
  useEffect(() => {
    if (terminalOutput && terminalOutput.length > 0) {
      // Add terminal output as a system message
      const terminalMessage = {
        id: `terminal-${Date.now()}`,
        content: `Terminal output:\n\`\`\`\n${terminalOutput.join("\n")}\n\`\`\``,
        sender: "system",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, terminalMessage]);
    }
  }, [terminalOutput]);

  const handleSendMessage = (content: string) => {
    // Check if message is a command to execute code
    if (content.startsWith("/run") && onCodeExecution) {
      const code = onCodeRequest?.() || "";
      if (code) {
        onCodeExecution(code);
        return;
      }
    }

    // Normal message handling would go here
    // This would typically be passed to MessageInput
  };

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      <MessageHistory
        enableComparison={enableComparison}
        personaName={displayName}
        isPersonaCustomized={displayCustomized}
        className="flex-1 overflow-y-auto"
        messages={messages}
      />
      <MessageInput
        onOpenPersonaEditor={onOpenPersonaEditor}
        className="border-t border-border"
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

// Make sure we have a default export
const ChatInterfaceDefault = ChatInterface;
export default ChatInterfaceDefault;
