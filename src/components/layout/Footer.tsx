import React from "react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer
      className={cn(
        "h-10 sm:h-12 w-full flex items-center justify-between px-3 sm:px-4 border-t bg-background text-xs sm:text-sm text-muted-foreground",
        className,
      )}
    >
      <div>© {new Date().getFullYear()} Bolt.DIY</div>
      <div className="flex items-center space-x-4">
        <a href="#" className="hover:text-foreground transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Help
        </a>
      </div>
    </footer>
  );
};

export default Footer;
