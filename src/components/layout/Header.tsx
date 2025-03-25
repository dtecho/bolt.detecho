import React from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Button from "@/components/ui/button";

interface HeaderProps {
  className?: string;
  onToggleSidebar?: () => void;
}

const Header = ({ className, onToggleSidebar }: HeaderProps) => {
  return (
    <header
      className={cn(
        "h-14 sm:h-16 w-full flex items-center justify-between px-3 sm:px-4 border-b bg-background",
        className,
      )}
    >
      <div className="flex items-center">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="mr-2"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="font-semibold text-lg">Bolt.DIY</div>
      </div>
      <div className="flex items-center space-x-2">
        {/* Header actions can go here */}
      </div>
    </header>
  );
};

export default Header;
