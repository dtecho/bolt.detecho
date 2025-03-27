import React, { ReactNode } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { ChatInterface } from "../chat/ChatInterface";

interface LayoutProps {
  children?: ReactNode;
  isDarkMode: boolean;
  onThemeChange: (isDark: boolean) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout = ({
  children,
  isDarkMode,
  onThemeChange,
  accentColor,
  onAccentColorChange,
  showHeader = true,
  showFooter = true,
}: LayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <div className="h-full">
        <Sidebar
          isDarkMode={isDarkMode}
          onThemeChange={onThemeChange}
          accentColor={accentColor}
          onAccentColorChange={onAccentColorChange}
        />
      </div>
      <main className="flex-1 overflow-hidden">
        {showHeader && (
          <header className="h-16 border-b flex items-center px-6">
            <h1 className="text-xl font-semibold">Bolt.DIY</h1>
          </header>
        )}
        <div className="flex-1 overflow-auto p-6">
          {children || <ChatInterface />}
        </div>
        {showFooter && (
          <footer className="h-12 border-t flex items-center justify-center text-sm text-muted-foreground">
            Bolt.DIY © {new Date().getFullYear()}
          </footer>
        )}
      </main>
    </div>
  );
};

export default Layout;
export { Layout };
