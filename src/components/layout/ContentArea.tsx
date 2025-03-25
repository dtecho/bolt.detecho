import React from "react";
import { cn } from "@/lib/utils";

interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
}

const ContentArea = ({ children, className }: ContentAreaProps) => {
  return (
    <main className={cn("flex-1 overflow-auto p-4", className)}>
      {children}
    </main>
  );
};

export default ContentArea;
