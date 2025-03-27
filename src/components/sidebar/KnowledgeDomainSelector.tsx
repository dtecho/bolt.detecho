import React, { useState } from "react";
import { X, Plus, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
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

const KnowledgeDomainSelector = React.memo(
  ({ domains = [], onChange }: KnowledgeDomainSelectorProps) => {
    const [newDomain, setNewDomain] = useState("");

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
                        className={`group flex items-center gap-1 bg-secondary text-secondary-foreground rounded-md pl-2 pr-1 py-1 ${snapshot.isDragging ? "opacity-80 shadow-lg" : ""}`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab mr-1 text-muted-foreground hover:text-foreground"
                        >
                          <GripVertical className="h-3 w-3" />
                        </div>
                        <span className="text-sm flex-grow">{domain}</span>
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
      </div>
    );
  },
);

export default KnowledgeDomainSelector;
