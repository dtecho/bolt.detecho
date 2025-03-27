import React from "react";
import { Users, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isActive: boolean;
  lastActive?: Date;
}

interface CollaborativeIndicatorProps {
  collaborators: Collaborator[];
  isEnabled: boolean;
  onToggle: () => void;
  className?: string;
}

const CollaborativeIndicator: React.FC<CollaborativeIndicatorProps> = ({
  collaborators,
  isEnabled,
  onToggle,
  className = "",
}) => {
  const activeCollaborators = collaborators.filter((c) => c.isActive);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={`flex items-center justify-center h-8 px-2 rounded-md transition-colors ${isEnabled ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {isEnabled ? (
                <>
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Collaborative</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Solo</span>
                </>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isEnabled ? "Disable" : "Enable"} collaborative editing</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isEnabled && activeCollaborators.length > 0 && (
        <div className="flex -space-x-2">
          {activeCollaborators.slice(0, 3).map((collaborator) => (
            <TooltipProvider key={collaborator.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar
                    className="h-6 w-6 border-2 border-background"
                    style={{ borderColor: collaborator.color }}
                  >
                    {collaborator.avatar ? (
                      <AvatarImage
                        src={collaborator.avatar}
                        alt={collaborator.name}
                      />
                    ) : (
                      <AvatarFallback
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{collaborator.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          {activeCollaborators.length > 3 && (
            <Badge
              variant="outline"
              className="h-6 w-6 rounded-full flex items-center justify-center text-xs"
            >
              +{activeCollaborators.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default CollaborativeIndicator;
