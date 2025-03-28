import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Palette,
  BookMarked,
  Settings,
} from "lucide-react";
import PersonaEditor from "./PersonaEditor";
import { ThemeSettings } from "./ThemeSettings";
import PersonaPresets from "./PersonaPresets";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

const Sidebar = ({
  isCollapsed: propIsCollapsed,
  isMobile = false,
  isOpen = true,
  onToggleCollapse: propOnToggleCollapse,
  className,
}: SidebarProps) => {
  // Use internal state if no external control is provided
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Determine if we're using controlled or uncontrolled mode
  const isControlled = propIsCollapsed !== undefined;
  const isCollapsed = isControlled ? propIsCollapsed : internalCollapsed;

  const handleToggleCollapse = () => {
    if (isControlled && propOnToggleCollapse) {
      propOnToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  // Save collapsed state to localStorage
  useEffect(() => {
    if (!isControlled) {
      localStorage.setItem(
        "sidebar-collapsed",
        internalCollapsed ? "true" : "false",
      );
    }
  }, [internalCollapsed, isControlled]);

  // Load collapsed state from localStorage on initial render
  useEffect(() => {
    if (!isControlled) {
      const savedState = localStorage.getItem("sidebar-collapsed");
      if (savedState !== null) {
        setInternalCollapsed(savedState === "true");
      }
    }
  }, [isControlled]);

  // Animation variants for the sidebar
  const sidebarVariants = {
    expanded: { width: "20rem" }, // 320px (w-80)
    collapsed: { width: "4rem" }, // 64px (w-16)
  };

  // Animation variants for the title
  const titleVariants = {
    expanded: { opacity: 1, width: "auto", marginRight: "0.5rem" },
    collapsed: { opacity: 0, width: 0, marginRight: 0 },
  };

  // Animation variants for content
  const contentVariants = {
    expanded: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 },
  };

  // Animation variants for collapsed icons
  const collapsedIconsVariants = {
    expanded: { opacity: 0, scale: 0.8 },
    collapsed: { opacity: 1, scale: 1 },
  };

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "flex flex-col border-r bg-background overflow-hidden",
        className,
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3 py-2">
        <motion.div
          variants={titleVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center gap-2 font-semibold overflow-hidden"
        >
          <span className="text-primary whitespace-nowrap">Bolt.DIY</span>
          <span className="text-muted-foreground whitespace-nowrap">
            Workbench
          </span>
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleCollapse}
          className="h-8 w-8 ml-auto flex-shrink-0 z-10"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      <ScrollArea
        className={cn("flex-1 overflow-auto", isCollapsed ? "px-2" : "px-4")}
      >
        <div className="py-4">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded-content"
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <PersonaEditor />
                <PersonaPresets />
                <ThemeSettings />
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-content"
                initial="expanded"
                animate="collapsed"
                exit="expanded"
                variants={collapsedIconsVariants}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col items-center gap-4 py-4"
              >
                {/* Collapsed view icons with tooltips */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-primary/10"
                        aria-label="Persona Editor"
                      >
                        <User className="h-5 w-5 text-primary" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Persona Editor</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-primary/10"
                        aria-label="Persona Presets"
                      >
                        <BookMarked className="h-5 w-5 text-primary" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Persona Presets</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-primary/10"
                        aria-label="Theme Settings"
                      >
                        <Palette className="h-5 w-5 text-primary" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Theme Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-primary/10 mt-4"
                        aria-label="Settings"
                      >
                        <Settings className="h-5 w-5 text-primary" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.aside>
  );
};

export default Sidebar;
export { Sidebar };
