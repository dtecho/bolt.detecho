import React, { useState } from "react";
import { X, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

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

        <div className="flex flex-wrap gap-2 mt-2">
          {domains.length === 0 && (
            <div className="text-sm text-muted-foreground italic">
              No knowledge domains added
            </div>
          )}
          {domains.map((domain, index) => (
            <div
              key={domain}
              className="group flex items-center gap-1 bg-secondary text-secondary-foreground rounded-md pl-2 pr-1 py-1"
            >
              <span className="text-sm">{domain}</span>
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
          ))}
        </div>
      </div>
    );
  },
);

export default KnowledgeDomainSelector;
