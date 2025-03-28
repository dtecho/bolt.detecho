import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Paperclip, Image, Sparkles, Settings } from "lucide-react";
import { motion } from "framer-motion";

export interface ChatbotEnhancementsProps {
  onVoiceInput?: () => void;
  onAttachFile?: () => void;
  onAttachImage?: () => void;
  onToggleAI?: () => void;
  onOpenSettings?: () => void;
  className?: string;
  showVoiceInput?: boolean;
  showAttachments?: boolean;
  showAIToggle?: boolean;
  showSettings?: boolean;
  isAIEnabled?: boolean;
  isCompact?: boolean;
  position?: "top" | "bottom";
}

const ChatbotEnhancements: React.FC<ChatbotEnhancementsProps> = ({
  onVoiceInput,
  onAttachFile,
  onAttachImage,
  onToggleAI,
  onOpenSettings,
  className = "",
  showVoiceInput = true,
  showAttachments = true,
  showAIToggle = true,
  showSettings = true,
  isAIEnabled = true,
  isCompact = false,
  position = "top",
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: position === "top" ? -20 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`w-full ${className}`}
    >
      <Card className="bg-card/80 backdrop-blur-sm border-muted">
        <CardContent
          className={`${isCompact ? "p-2" : "p-4"} flex items-center justify-between`}
        >
          <div className="flex items-center space-x-2">
            {showVoiceInput && (
              <Button
                variant="ghost"
                size={isCompact ? "sm" : "icon"}
                onClick={onVoiceInput}
                aria-label="Voice input"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Mic className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
              </Button>
            )}

            {showAttachments && (
              <>
                <Button
                  variant="ghost"
                  size={isCompact ? "sm" : "icon"}
                  onClick={onAttachFile}
                  aria-label="Attach file"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Paperclip className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
                </Button>

                <Button
                  variant="ghost"
                  size={isCompact ? "sm" : "icon"}
                  onClick={onAttachImage}
                  aria-label="Attach image"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Image className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {showAIToggle && (
              <Button
                variant={isAIEnabled ? "subtle" : "ghost"}
                size={isCompact ? "sm" : "default"}
                onClick={onToggleAI}
                aria-label="Toggle AI features"
                className={`${isAIEnabled ? "text-primary" : "text-muted-foreground"}`}
              >
                <Sparkles
                  className={`${isCompact ? "h-4 w-4" : "h-5 w-5"} mr-2`}
                />
                {!isCompact && "AI Features"}
              </Button>
            )}

            {showSettings && (
              <Button
                variant="ghost"
                size={isCompact ? "sm" : "icon"}
                onClick={onOpenSettings}
                aria-label="Open settings"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Settings className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChatbotEnhancements;
