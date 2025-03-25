import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, Mic, Paperclip, Smile } from "lucide-react";

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput = ({
  onSendMessage = () => {},
  placeholder = "Type your message here...",
  disabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full border-t bg-background p-4">
      <div className="flex flex-col space-y-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[80px] resize-none rounded-lg border-muted focus:border-primary"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="text-muted-foreground hover:text-foreground"
            >
              <Paperclip size={18} />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="text-muted-foreground hover:text-foreground"
            >
              <Mic size={18} />
              <span className="sr-only">Voice input</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="text-muted-foreground hover:text-foreground"
            >
              <Smile size={18} />
              <span className="sr-only">Emoji</span>
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || disabled}
            className="gap-2"
          >
            Send
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { MessageInput };
export default MessageInput;
