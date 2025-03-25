import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  X,
  Keyboard,
} from "lucide-react";
import PersonaEditor from "./PersonaEditor";
import ThemeSettings from "./ThemeSettings";
import { cn } from "@/lib/utils";
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
  isCollapsed = false,
  isMobile = false,
  isOpen = false,
  onToggleCollapse,
  className,
}: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<"persona" | "theme">("persona");

  return (
    <div
      className={cn(
        "h-full bg-muted/30 border-r border-border transition-all duration-300",
        isCollapsed && !isMobile ? "w-16" : "w-80",
        className,
      )}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header with collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {(!isCollapsed || isMobile) && (
            <h2 className="font-semibold">Bolt.DIY</h2>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="ml-auto"
                  aria-label={
                    isCollapsed && !isMobile
                      ? "Expand sidebar"
                      : "Collapse sidebar"
                  }
                >
                  {isMobile ? (
                    <X size={18} />
                  ) : isCollapsed ? (
                    <ChevronRight size={18} />
                  ) : (
                    <ChevronLeft size={18} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>
                  {isCollapsed && !isMobile
                    ? "Expand sidebar"
                    : "Collapse sidebar"}{" "}
                  (Ctrl+B)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Sidebar Tabs */}
        {!isCollapsed || isMobile ? (
          <>
            <div className="flex border-b border-border">
              <Button
                variant={activeTab === "persona" ? "subtle" : "ghost"}
                className="flex-1 rounded-none py-2"
                onClick={() => setActiveTab("persona")}
              >
                <User size={16} className="mr-2" />
                Persona
              </Button>
              <Button
                variant={activeTab === "theme" ? "subtle" : "ghost"}
                className="flex-1 rounded-none py-2"
                onClick={() => setActiveTab("theme")}
              >
                <Settings size={16} className="mr-2" />
                Theme
              </Button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto p-4">
              {activeTab === "persona" ? <PersonaEditor /> : <ThemeSettings />}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center pt-4 space-y-4">
            <Button
              variant={activeTab === "persona" ? "subtle" : "ghost"}
              size="icon"
              onClick={() => {
                setActiveTab("persona");
                if (onToggleCollapse) onToggleCollapse();
              }}
            >
              <User size={20} />
            </Button>
            <Button
              variant={activeTab === "theme" ? "subtle" : "ghost"}
              size="icon"
              onClick={() => {
                setActiveTab("theme");
                if (onToggleCollapse) onToggleCollapse();
              }}
            >
              <Settings size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
