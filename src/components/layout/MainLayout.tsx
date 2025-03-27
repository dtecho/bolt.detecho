import React, { useState, useEffect, useCallback } from "react";
import AppShell from "./AppShell";
import { ChatInterface } from "../chat/ChatInterface";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/components/ui/use-toast";
import KeyboardShortcutsDialog from "@/components/ui/keyboard-shortcuts-dialog";
import { usePersona } from "@/contexts/PersonaContext";
import { Sparkles, Share2, Save, Download, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MainLayoutProps {
  children?: React.ReactNode;
  isDarkMode?: boolean;
  onThemeChange?: (isDark: boolean) => void;
  accentColor?: string;
  onAccentColorChange?: (color: string) => void;
  showHeader?: boolean;
  showFooter?: boolean;
}

const MainLayout = ({
  children,
  isDarkMode = false,
  onThemeChange = () => {},
  accentColor = "#0ea5e9",
  onAccentColorChange = () => {},
  showHeader = false,
  showFooter = false,
}: MainLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  const [showComparisonMode, setShowComparisonMode] = useState(false);
  const { toast } = useToast();
  const {
    persona,
    isCustomized,
    savedPersonas,
    loadPersona,
    savePersona,
    exportPersona,
    importPersona,
    generateShareableLink,
  } = usePersona();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleOpenPersonaEditor = useCallback(() => {
    // Open sidebar when persona editor is requested on mobile
    if (isMobile) {
      setSidebarOpen(true);
    }

    toast({
      title: "Persona Editor Opened",
      description: `Customize your ${persona.name} persona settings`,
      duration: 3000,
    });
  }, [isMobile, persona.name, toast]);

  const handleSaveCurrentPersona = useCallback(() => {
    const personaId = savePersona(persona);
    toast({
      title: "Persona Saved",
      description: `${persona.name} has been saved to your collection`,
      duration: 3000,
    });
    return personaId;
  }, [persona, savePersona, toast]);

  const handleExportPersona = useCallback(() => {
    exportPersona("current");
    toast({
      title: "Persona Exported",
      description: `${persona.name} has been exported as JSON`,
      duration: 3000,
    });
  }, [exportPersona, persona.name, toast]);

  const handleSharePersona = useCallback(() => {
    try {
      const shareableLink = generateShareableLink("current");
      navigator.clipboard.writeText(shareableLink);
      toast({
        title: "Share Link Created",
        description: "Shareable link copied to clipboard",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not generate shareable link",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [generateShareableLink, toast]);

  const toggleComparisonMode = useCallback(() => {
    setShowComparisonMode((prev) => !prev);
    toast({
      title: `Comparison Mode ${showComparisonMode ? "Disabled" : "Enabled"}`,
      description: showComparisonMode
        ? "Returned to single persona view"
        : "Now comparing multiple personas",
      duration: 3000,
    });
  }, [showComparisonMode, toast]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
    toast({
      title: `Sidebar ${sidebarOpen ? "collapsed" : "expanded"}`,
      duration: 2000,
    });
  }, [sidebarOpen, toast]);

  const toggleDarkMode = useCallback(() => {
    onThemeChange(!isDarkMode);
    toast({
      title: `${!isDarkMode ? "Dark" : "Light"} mode activated`,
      duration: 2000,
    });
  }, [isDarkMode, onThemeChange, toast]);

  const toggleShortcutsDialog = useCallback(() => {
    setShowShortcutsDialog((prev) => !prev);
  }, []);

  // Define keyboard shortcuts
  const shortcuts = [
    {
      name: "Navigation",
      shortcuts: [
        {
          key: "B",
          ctrlKey: true,
          description: "Toggle sidebar",
          action: toggleSidebar,
        },
        {
          key: "/",
          ctrlKey: true,
          description: "Show keyboard shortcuts",
          action: toggleShortcutsDialog,
        },
      ],
    },
    {
      name: "Appearance",
      shortcuts: [
        {
          key: "D",
          ctrlKey: true,
          description: "Toggle dark/light mode",
          action: toggleDarkMode,
        },
      ],
    },
    {
      name: "Bolt.DIY Functions",
      shortcuts: [
        {
          key: "P",
          ctrlKey: true,
          description: "Open persona editor",
          action: handleOpenPersonaEditor,
        },
        {
          key: "C",
          ctrlKey: true,
          description: "Toggle comparison mode",
          action: toggleComparisonMode,
        },
        {
          key: "S",
          ctrlKey: true,
          shiftKey: true,
          description: "Save current persona",
          action: handleSaveCurrentPersona,
        },
        {
          key: "E",
          ctrlKey: true,
          description: "Export current persona",
          action: handleExportPersona,
        },
        {
          key: "H",
          ctrlKey: true,
          description: "Share current persona",
          action: handleSharePersona,
        },
      ],
    },
  ];

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts,
    enabled: true,
    showToasts: true,
  });

  return (
    <>
      <AppShell
        showHeader={showHeader}
        showFooter={showFooter}
        sidebarProps={{
          isOpen: sidebarOpen,
          onToggleCollapse: toggleSidebar,
        }}
      >
        {children ? (
          children
        ) : (
          <div className="h-full flex flex-col">
            {/* Persona Status Bar */}
            <div className="flex items-center justify-between p-2 bg-muted/30 border-b">
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant={isCustomized ? "default" : "outline"}
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={handleOpenPersonaEditor}
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{persona.name}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to edit persona (Ctrl+P)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <span className="text-xs text-muted-foreground hidden sm:inline-block">
                  {persona.description.length > 50
                    ? `${persona.description.substring(0, 50)}...`
                    : persona.description}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={toggleComparisonMode}
                      >
                        {showComparisonMode ? "Single Mode" : "Compare"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle comparison mode (Ctrl+C)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Save
                        className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary"
                        onClick={handleSaveCurrentPersona}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save persona (Ctrl+Shift+S)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Download
                        className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary"
                        onClick={handleExportPersona}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export persona (Ctrl+E)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Share2
                        className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary"
                        onClick={handleSharePersona}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share persona (Ctrl+H)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <ChatInterface
              onOpenPersonaEditor={handleOpenPersonaEditor}
              className="flex-1"
              enableComparison={showComparisonMode}
              personaName={persona.name}
              isPersonaCustomized={isCustomized}
            />
          </div>
        )}
      </AppShell>

      {/* Global keyboard shortcuts dialog */}
      {showShortcutsDialog && (
        <KeyboardShortcutsDialog shortcuts={shortcuts} trigger={<div />} />
      )}
    </>
  );
};

export default MainLayout;
