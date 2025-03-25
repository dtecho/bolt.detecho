import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import ChatInterface from "@/components/chat/ChatInterface";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children?: React.ReactNode;
  isDarkMode?: boolean;
  onThemeChange?: (isDark: boolean) => void;
  accentColor?: string;
  onAccentColorChange?: (color: string) => void;
}

const MainLayout = ({
  children,
  isDarkMode = false,
  onThemeChange = () => {},
  accentColor = "#0ea5e9",
  onAccentColorChange = () => {},
}: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleOpenPersonaEditor = () => {
    setSidebarCollapsed(false); // Ensure sidebar is open
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        isDarkMode={isDarkMode}
        onThemeChange={onThemeChange}
        accentColor={accentColor}
        onAccentColorChange={onAccentColorChange}
      />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-80",
        )}
      >
        <ChatInterface
          onOpenPersonaEditor={handleOpenPersonaEditor}
          className="flex-1"
        />
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
