import React from "react";
import MainLayout from "./MainLayout";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";

interface LayoutProps {
  children?: React.ReactNode;
  isDarkMode?: boolean;
  onThemeChange?: (isDark: boolean) => void;
  accentColor?: string;
  onAccentColorChange?: (color: string) => void;
  showHeader?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
}

const Layout = ({
  children,
  isDarkMode = false,
  onThemeChange = () => {},
  accentColor = "#0ea5e9",
  onAccentColorChange = () => {},
  showHeader = true,
  showFooter = true,
  showSidebar = true,
}: LayoutProps) => {
  return (
    <motion.div
      className="min-h-screen bg-background transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MainLayout
        isDarkMode={isDarkMode}
        onThemeChange={onThemeChange}
        accentColor={accentColor}
        onAccentColorChange={onAccentColorChange}
        showHeader={showHeader}
        showFooter={showFooter}
      >
        {children}
      </MainLayout>
      <Toaster />
    </motion.div>
  );
};

export default Layout;
