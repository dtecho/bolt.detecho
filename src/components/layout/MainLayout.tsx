import React, { useState } from "react";
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
  const handleOpenPersonaEditor = () => {
    // This function is passed to ChatInterface to ensure sidebar is open when persona editor is requested
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
