import React from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { NavLink as Link } from "react-router-dom";
import {
  Home,
  Settings,
  Users,
  MessageSquare,
  Code,
  LayoutDashboard,
} from "lucide-react";

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavigationBarProps {
  className?: string;
  variant?: "horizontal" | "vertical";
  items?: NavigationItem[];
}

const defaultNavItems: NavigationItem[] = [
  {
    label: "Home",
    path: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Chat",
    path: "/chat",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: "Code Editor",
    path: "/code-editor",
    icon: <Code className="h-5 w-5" />,
  },
  {
    label: "Personas",
    path: "/personas",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const NavigationBar = ({
  className,
  variant = "horizontal",
  items = defaultNavItems,
}: NavigationBarProps) => {
  const location = useLocation();

  return (
    <nav
      className={cn(
        "bg-background border-border",
        variant === "horizontal"
          ? "flex items-center space-x-1 px-2 py-1 border-b"
          : "flex flex-col space-y-1 p-2 border-r h-full",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "ghost"}
            size={variant === "horizontal" ? "sm" : "default"}
            className={cn(
              variant === "vertical" && "justify-start w-full",
              !isActive && "text-muted-foreground",
            )}
            asChild
          >
            <Link to={item.path}>
              {item.icon}
              <span className={variant === "horizontal" ? "ml-2" : "ml-3"}>
                {item.label}
              </span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};

export default NavigationBar;
