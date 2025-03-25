import React, { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if we're on mobile and collapse sidebar by default
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Auto-collapse sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden bg-background",
        className,
      )}
    >
      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={handleToggleSidebar}
          aria-hidden="true"
        />
      )}

      {showSidebar && (
        <Sidebar
          isCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggleCollapse={handleToggleSidebar}
          {...sidebarProps}
          className={cn(
            isMobile && "fixed z-40 h-full",
            isMobile && !sidebarOpen && "transform -translate-x-full",
            "transition-all duration-300",
          )}
        />
      )}

      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          showSidebar && !isMobile
            ? sidebarCollapsed
              ? "ml-16"
              : "ml-80"
            : "",
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
