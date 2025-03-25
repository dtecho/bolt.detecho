import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, Mic, Paperclip, Smile, Image } from "lucide-react";
import { motion } from "framer-motion";

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
  const [isFocused, setIsFocused] = useState(false);

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
    <motion.div
      initial={{ opacity: 0.8, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full border-t bg-background p-2 sm:p-4 rounded-b-lg shadow-sm"
    >
      <div className="flex flex-col space-y-3">
        <div
          className={`relative rounded-xl transition-all duration-200 ${isFocused ? "ring-2 ring-primary shadow-md" : "shadow-sm"}`}
        >
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[60px] sm:min-h-[80px] resize-none rounded-xl border-muted focus:border-primary pr-3 pl-3 sm:pr-4 sm:pl-4 pt-2 sm:pt-3 pb-12 text-sm sm:text-base"
          />
          <div className="absolute bottom-2 left-1 sm:left-2 right-1 sm:right-2 flex items-center justify-between px-1 sm:px-2 py-1">
            <div className="flex items-center space-x-0 sm:space-x-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full h-7 w-7 sm:h-8 sm:w-8"
                >
                  <Paperclip size={14} className="sm:h-4 sm:w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full h-7 w-7 sm:h-8 sm:w-8"
                >
                  <Image size={14} className="sm:h-4 sm:w-4" />
                  <span className="sr-only">Add image</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full h-7 w-7 sm:h-8 sm:w-8"
                >
                  <Mic size={14} className="sm:h-4 sm:w-4" />
                  <span className="sr-only">Voice input</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full h-7 w-7 sm:h-8 sm:w-8"
                >
                  <Smile size={14} className="sm:h-4 sm:w-4" />
                  <span className="sr-only">Emoji</span>
                </Button>
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-auto"
            >
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || disabled}
                className={`gap-1 sm:gap-2 rounded-full px-3 sm:px-4 ${!message.trim() || disabled ? "opacity-70" : "shadow-md hover:shadow-lg"}`}
                size="sm"
              >
                <span className="text-xs sm:text-sm">Send</span>
                <Send size={12} className="sm:h-4 sm:w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageInput;
