import React, { useState, useEffect, useCallback } from "react";
import AppShell from "./AppShell";
import ChatInterface from "@/components/chat/ChatInterface";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/components/ui/use-toast";
import KeyboardShortcutsDialog from "@/components/ui/keyboard-shortcuts-dialog";

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
  const { toast } = useToast();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleOpenPersonaEditor = () => {
    // Open sidebar when persona editor is requested on mobile
    if (isMobile) {
      setSidebarOpen(true);
    }
  };

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
          <ChatInterface
            onOpenPersonaEditor={handleOpenPersonaEditor}
            className="h-full"
          />
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
