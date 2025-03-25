import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import ChatInterface from "@/components/chat/ChatInterface";
import { cn } from "@/lib/utils";
import Header from "./Header";
import Footer from "./Footer";
import ContentArea from "./ContentArea";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleOpenPersonaEditor = () => {
    setSidebarCollapsed(false); // Ensure sidebar is open when persona editor is requested
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-80",
        )}
      >
        {showHeader && <Header onToggleSidebar={handleToggleSidebar} />}

        <ContentArea className="flex-1">
          {children ? (
            children
          ) : (
            <ChatInterface
              onOpenPersonaEditor={handleOpenPersonaEditor}
              className="h-full"
            />
          )}
        </ContentArea>

        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default MainLayout;
