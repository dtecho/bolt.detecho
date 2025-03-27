import React from "react";
import MessageHistory from "./MessageHistory";
import MessageInput from "./MessageInput";

interface ChatInterfaceProps {
  onOpenPersonaEditor?: () => void;
  className?: string;
  enableComparison?: boolean;
  personaName?: string;
  isPersonaCustomized?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onOpenPersonaEditor,
  className = "",
  enableComparison = false,
  personaName = "Assistant",
  isPersonaCustomized = false,
}) => {
  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      <MessageHistory
        enableComparison={enableComparison}
        personaName={personaName}
        isPersonaCustomized={isPersonaCustomized}
        className="flex-1 overflow-y-auto"
      />
      <MessageInput
        onOpenPersonaEditor={onOpenPersonaEditor}
        className="border-t border-border"
      />
    </div>
  );
};

export default ChatInterface;
