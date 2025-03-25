import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "../sidebar/Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import ContentArea from "./ContentArea";

interface AppShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
  className?: string;
  contentClassName?: string;
  sidebarProps?: React.ComponentProps<typeof Sidebar>;
  headerProps?: React.ComponentProps<typeof Header>;
  footerProps?: React.ComponentProps<typeof Footer>;
}

const AppShell = ({
  children,
  showHeader = true,
  showFooter = true,
  showSidebar = true,
  className,
  contentClassName,
  sidebarProps,
  headerProps,
  footerProps,
}: AppShellProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden bg-background",
        className,
      )}
    >
      {showSidebar && (
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          {...sidebarProps}
        />
      )}

      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          showSidebar ? (sidebarCollapsed ? "ml-16" : "ml-80") : "",
        )}
      >
        {showHeader && (
          <Header onToggleSidebar={handleToggleSidebar} {...headerProps} />
        )}

        <ContentArea className={cn("flex-1", contentClassName)}>
          {children}
        </ContentArea>

        {showFooter && <Footer {...footerProps} />}
      </div>
    </div>
  );
};

export default AppShell;
