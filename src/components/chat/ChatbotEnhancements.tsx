import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mic,
  Paperclip,
  Image,
  Sparkles,
  Settings,
  Code,
  MessageSquare,
  Keyboard,
  Maximize2,
  Minimize2,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export interface ChatbotEnhancementsProps {
  onVoiceInput?: () => void;
  onAttachFile?: () => void;
  onAttachImage?: () => void;
  onToggleAI?: () => void;
  onOpenSettings?: () => void;
  onSendCode?: () => void;
  onToggleFullscreen?: () => void;
  onShowKeyboardShortcuts?: () => void;
  onShowHelp?: () => void;
  className?: string;
  showVoiceInput?: boolean;
  showAttachments?: boolean;
  showAIToggle?: boolean;
  showSettings?: boolean;
  showCodeButton?: boolean;
  showFullscreenToggle?: boolean;
  showKeyboardShortcuts?: boolean;
  showHelp?: boolean;
  isAIEnabled?: boolean;
  isCompact?: boolean;
  isFullscreen?: boolean;
  position?: "top" | "bottom";
  variant?: "default" | "minimal" | "expanded";
  theme?: "light" | "dark" | "system";
  unreadMessages?: number;
}

const ChatbotEnhancements: React.FC<ChatbotEnhancementsProps> = ({
  onVoiceInput,
  onAttachFile,
  onAttachImage,
  onToggleAI,
  onOpenSettings,
  onSendCode,
  onToggleFullscreen,
  onShowKeyboardShortcuts,
  onShowHelp,
  className = "",
  showVoiceInput = true,
  showAttachments = true,
  showAIToggle = true,
  showSettings = true,
  showCodeButton = false,
  showFullscreenToggle = false,
  showKeyboardShortcuts = false,
  showHelp = false,
  isAIEnabled = true,
  isCompact = false,
  isFullscreen = false,
  position = "top",
  variant = "default",
  theme = "system",
  unreadMessages = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(variant === "expanded");

  const containerVariants = {
    hidden: { opacity: 0, y: position === "top" ? -20 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const expandedVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

  // Determine if we should use tooltips based on variant and compact mode
  const useTooltips = variant === "minimal" || isCompact;

  // Determine background style based on theme and variant
  const getCardStyle = () => {
    if (variant === "minimal") {
      return "bg-transparent border-none shadow-none";
    }
    return "bg-card/80 backdrop-blur-sm border-muted";
  };

  const renderButton = ({
    icon,
    label,
    onClick,
    ariaLabel,
    isActive = false,
    badge = 0,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    ariaLabel: string;
    isActive?: boolean;
    badge?: number;
  }) => {
    const buttonContent = (
      <Button
        variant={isActive ? "subtle" : "ghost"}
        size={isCompact ? "sm" : "icon"}
        onClick={onClick}
        aria-label={ariaLabel}
        className={`relative ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
      >
        {icon}
        {badge > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-4 min-w-4 text-[10px] flex items-center justify-center px-1"
          >
            {badge}
          </Badge>
        )}
      </Button>
    );

    if (useTooltips) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return buttonContent;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`w-full ${className}`}
    >
      <Card className={getCardStyle()}>
        <CardContent
          className={`${isCompact || variant === "minimal" ? "p-2" : "p-4"} flex flex-col gap-2`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {showVoiceInput &&
                renderButton({
                  icon: <Mic className={isCompact ? "h-4 w-4" : "h-5 w-5"} />,
                  label: "Voice Input",
                  onClick: onVoiceInput,
                  ariaLabel: "Voice input",
                })}

              {showAttachments && (
                <>
                  {renderButton({
                    icon: (
                      <Paperclip
                        className={isCompact ? "h-4 w-4" : "h-5 w-5"}
                      />
                    ),
                    label: "Attach File",
                    onClick: onAttachFile,
                    ariaLabel: "Attach file",
                  })}

                  {renderButton({
                    icon: (
                      <Image className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
                    ),
                    label: "Attach Image",
                    onClick: onAttachImage,
                    ariaLabel: "Attach image",
                  })}
                </>
              )}

              {showCodeButton &&
                renderButton({
                  icon: <Code className={isCompact ? "h-4 w-4" : "h-5 w-5"} />,
                  label: "Send Code",
                  onClick: onSendCode,
                  ariaLabel: "Send code",
                })}

              {variant === "default" && !isCompact && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-muted-foreground hover:text-primary ml-2"
                >
                  {isExpanded ? "Less options" : "More options"}
                </Button>
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
                  {!isCompact && variant !== "minimal" && "AI Features"}
                </Button>
              )}

              {showSettings &&
                renderButton({
                  icon: (
                    <Settings className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
                  ),
                  label: "Settings",
                  onClick: onOpenSettings,
                  ariaLabel: "Open settings",
                })}

              {showFullscreenToggle &&
                renderButton({
                  icon: isFullscreen ? (
                    <Minimize2 className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
                  ) : (
                    <Maximize2 className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
                  ),
                  label: isFullscreen ? "Exit Fullscreen" : "Fullscreen",
                  onClick: onToggleFullscreen,
                  ariaLabel: isFullscreen
                    ? "Exit fullscreen"
                    : "Enter fullscreen",
                })}

              {unreadMessages > 0 &&
                renderButton({
                  icon: (
                    <MessageSquare
                      className={isCompact ? "h-4 w-4" : "h-5 w-5"}
                    />
                  ),
                  label: `${unreadMessages} unread message${unreadMessages > 1 ? "s" : ""}`,
                  ariaLabel: "View unread messages",
                  badge: unreadMessages,
                })}
            </div>
          </div>

          <AnimatePresence>
            {(isExpanded || variant === "expanded") && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={expandedVariants}
                className="pt-2 border-t mt-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {showKeyboardShortcuts &&
                      renderButton({
                        icon: (
                          <Keyboard
                            className={isCompact ? "h-4 w-4" : "h-5 w-5"}
                          />
                        ),
                        label: "Keyboard Shortcuts",
                        onClick: onShowKeyboardShortcuts,
                        ariaLabel: "Show keyboard shortcuts",
                      })}

                    {showHelp &&
                      renderButton({
                        icon: (
                          <HelpCircle
                            className={isCompact ? "h-4 w-4" : "h-5 w-5"}
                          />
                        ),
                        label: "Help",
                        onClick: onShowHelp,
                        ariaLabel: "Show help",
                      })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChatbotEnhancements;
