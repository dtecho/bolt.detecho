import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
  className?: string;
}

const Header = ({ onToggleSidebar, className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "h-16 w-full flex items-center px-4 border-b bg-background",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="mr-4"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bolt.DIY</h1>
        <div className="flex items-center space-x-2">
          {/* Additional header elements can be added here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
