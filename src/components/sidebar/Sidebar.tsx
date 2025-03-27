import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PersonaEditor from "./PersonaEditor";
import ThemeSettings from "./ThemeSettings";
import PersonaPresets from "./PersonaPresets";

interface SidebarProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

const Sidebar = ({
  isCollapsed = false,
  isMobile = false,
  isOpen = true,
  onToggleCollapse,
  className,
}: SidebarProps) => {
  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background",
        isCollapsed ? "w-16" : "w-80",
        className,
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3 py-2">
        <div
          className={cn(
            "flex items-center gap-2 font-semibold",
            isCollapsed && "hidden",
          )}
        >
          <span className="text-primary">Bolt.DIY</span>
          <span className="text-muted-foreground">Workbench</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
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
              {/* Collapsed view icons */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Persona Editor"
              >
                <span className="text-xl">👤</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Presets"
              >
                <span className="text-xl">📋</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Theme Settings"
              >
                <span className="text-xl">🎨</span>
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
