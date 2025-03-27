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
import ThemeSettings from "./ThemeSettings";
import PersonaPresets from "./PersonaPresets";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-80",
        className,
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3 py-2">
        <div
          className={cn(
            "flex items-center gap-2 font-semibold transition-opacity duration-200",
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
          )}
        >
          <span className="text-primary">Bolt.DIY</span>
          <span className="text-muted-foreground">Workbench</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleCollapse}
          className="h-8 w-8 ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea
        className={cn("flex-1 overflow-auto", isCollapsed ? "px-2" : "px-4")}
      >
        <div className="py-4">
          {!isCollapsed && (
            <>
              <PersonaEditor />
              <PersonaPresets />
              <ThemeSettings />
            </>
          )}
          {isCollapsed && (
            <div className="flex flex-col items-center gap-4 py-4">
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
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
