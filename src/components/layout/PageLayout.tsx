import React from "react";
import { cn } from "@/lib/utils";
import Header from "./Header";
import Footer from "./Footer";
import ContentArea from "./ContentArea";

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
  contentClassName?: string;
  headerProps?: React.ComponentProps<typeof Header>;
  footerProps?: React.ComponentProps<typeof Footer>;
}

const PageLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  className,
  contentClassName,
  headerProps,
  footerProps,
}: PageLayoutProps) => {
  return (
    <div className={cn("flex flex-col min-h-screen bg-background", className)}>
      {showHeader && <Header {...headerProps} />}
      <ContentArea className={cn("flex-1", contentClassName)}>
        {children}
      </ContentArea>
      {showFooter && <Footer {...footerProps} />}
    </div>
  );
};

export default PageLayout;
