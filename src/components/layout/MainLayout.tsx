import React, { useState, useEffect } from "react";
import AppShell from "./AppShell";
import ChatInterface from "@/components/chat/ChatInterface";

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

  return (
    <AppShell showHeader={showHeader} showFooter={showFooter}>
      {children ? (
        children
      ) : (
        <ChatInterface
          onOpenPersonaEditor={handleOpenPersonaEditor}
          className="h-full"
        />
      )}
    </AppShell>
  );
};

export default MainLayout;
