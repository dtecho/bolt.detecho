import React, { useState } from "react";
import {
  X,
  Plus,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Star,
  StarHalf,
  StarOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface KnowledgeDomainSelectorProps {
  domains: string[];
  onChange: (domains: string[]) => void;
}

// Function to calculate priority color based on index
const getPriorityColor = (index: number, total: number): string => {
  if (total <= 1) return "bg-primary/80";

  // Calculate priority percentage (0 = highest priority, 100 = lowest)
  const priorityPercentage = (index / (total - 1)) * 100;

  if (priorityPercentage < 20) return "bg-primary/90 border-primary";
  if (priorityPercentage < 40) return "bg-primary/80 border-primary/80";
  if (priorityPercentage < 60) return "bg-primary/70 border-primary/70";
  if (priorityPercentage < 80) return "bg-primary/60 border-primary/60";
  return "bg-primary/50 border-primary/50";
};

// Function to get priority stars based on index
const getPriorityStars = (index: number, total: number) => {
  if (total <= 1) return <Star className="h-3 w-3 text-primary" />;

  // Calculate priority level (0-5 scale, 5 being highest priority)
  const maxStars = 3;
  const priorityLevel = Math.max(
    0,
    maxStars - Math.floor((index / total) * maxStars),
  );

  if (priorityLevel === maxStars)
    return <Star className="h-3 w-3 text-primary" />;
  if (priorityLevel > 0) return <StarHalf className="h-3 w-3 text-primary" />;
  return <StarOff className="h-3 w-3 text-muted-foreground" />;
};

// Function to calculate font size based on priority
const getPriorityFontSize = (index: number, total: number): string => {
  if (total <= 1) return "text-sm";

  // Calculate priority percentage (0 = highest priority, 100 = lowest)
  const priorityPercentage = (index / (total - 1)) * 100;

  if (priorityPercentage < 20) return "text-sm font-medium";
  if (priorityPercentage < 50) return "text-sm";
  return "text-xs";
};

const KnowledgeDomainSelector = React.memo(
  ({ domains = [], onChange }: KnowledgeDomainSelectorProps) => {
    const [newDomain, setNewDomain] = useState("");
    const [showTagCloud, setShowTagCloud] = useState(false);

    const handleAddDomain = React.useCallback(() => {
      const trimmedDomain = newDomain.trim();
      if (trimmedDomain && !domains.includes(trimmedDomain)) {
        // Limit the number of domains to prevent performance issues
        if (domains.length >= 20) {
          // Remove the oldest domain if we're at the limit
          const updatedDomains = [...domains.slice(1), trimmedDomain];
          onChange(updatedDomains);
        } else {
          const updatedDomains = [...domains, trimmedDomain];
          onChange(updatedDomains);
        }
        setNewDomain("");
      }
    }, [domains, newDomain, onChange]);

    const handleRemoveDomain = React.useCallback(
      (domain: string) => {
        const updatedDomains = domains.filter((d) => d !== domain);
        onChange(updatedDomains);
      },
      [domains, onChange],
    );

    const handleMoveDomain = React.useCallback(
      (index: number, direction: "up" | "down") => {
        if (
          (direction === "up" && index === 0) ||
          (direction === "down" && index === domains.length - 1)
        ) {
          return;
        }

        const newIndex = direction === "up" ? index - 1 : index + 1;
        const updatedDomains = [...domains];
        [updatedDomains[index], updatedDomains[newIndex]] = [
          updatedDomains[newIndex],
          updatedDomains[index],
        ];
        onChange(updatedDomains);
      },
      [domains, onChange],
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAddDomain();
        }
      },
      [handleAddDomain],
    );

    const handleDragEnd = React.useCallback(
      (result: DropResult) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        const updatedDomains = [...domains];
        const [removed] = updatedDomains.splice(sourceIndex, 1);
        updatedDomains.splice(destinationIndex, 0, removed);

        onChange(updatedDomains);
      },
      [domains, onChange],
    );

    return (
      <div className="space-y-3">
        <div className="flex space-x-2">
          <Input
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="Add knowledge domain"
            className="flex-1"
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddDomain}
            disabled={!newDomain.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {domains.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {domains.length} domain{domains.length !== 1 ? "s" : ""} •
              Priority decreases downward
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setShowTagCloud(!showTagCloud)}
            >
              {showTagCloud ? "List View" : "Tag Cloud"}
            </Button>
          </div>
        )}

        {showTagCloud && domains.length > 0 ? (
          <div className="p-3 bg-muted/30 rounded-md min-h-[100px] flex flex-wrap gap-2 items-center justify-center">
            {domains.map((domain, index) => {
              // Calculate size based on priority (higher index = lower priority)
              const priorityPercentage =
                domains.length > 1 ? index / (domains.length - 1) : 0;
              const fontSize = 1 - priorityPercentage * 0.4; // Scale from 1.0 to 0.6
              const opacity = 1 - priorityPercentage * 0.5; // Scale from 1.0 to 0.5

              return (
                <TooltipProvider key={domain}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleRemoveDomain(domain)}
                        style={{
                          fontSize: `${Math.max(0.8, fontSize)}rem`,
                          opacity: opacity,
                          fontWeight: index < 3 ? 600 - index * 100 : 400,
                          padding: "0.25rem 0.5rem",
                          backgroundColor: `rgba(var(--primary-rgb), ${0.1 + 0.2 * (1 - priorityPercentage)})`,
                          borderRadius: "0.375rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {domain}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>
                        Priority: {index + 1} of {domains.length} (Click to
                        remove)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="domains-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 mt-2"
                >
                  {domains.length === 0 && (
                    <div className="text-sm text-muted-foreground italic">
                      No knowledge domains added
                    </div>
                  )}
                  {domains.map((domain, index) => (
                    <Draggable key={domain} draggableId={domain} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group flex items-center gap-1 ${getPriorityColor(index, domains.length)} text-secondary-foreground rounded-md pl-2 pr-1 py-1 border ${snapshot.isDragging ? "opacity-80 shadow-lg" : ""}`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab mr-1 text-muted-foreground hover:text-foreground"
                          >
                            <GripVertical className="h-3 w-3" />
                          </div>
                          <div className="flex items-center mr-1">
                            {getPriorityStars(index, domains.length)}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className={`${getPriorityFontSize(index, domains.length)} flex-grow`}
                                >
                                  {domain}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>
                                  Priority: {index + 1} of {domains.length}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Badge
                            variant="outline"
                            className="ml-1 h-5 px-1 text-xs font-normal bg-background/50"
                          >
                            {index + 1}
                          </Badge>
                          <div className="flex">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                              onClick={() => handleMoveDomain(index, "up")}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                              onClick={() => handleMoveDomain(index, "down")}
                              disabled={index === domains.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0 text-destructive opacity-70 hover:opacity-100"
                              onClick={() => handleRemoveDomain(domain)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    );
  },
);

export default KnowledgeDomainSelector;
