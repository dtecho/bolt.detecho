import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Link, Share2 } from "lucide-react";
import { PersonaConfig } from "@/contexts/PersonaContext";

interface PersonaShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaConfig;
  shareableLink: string;
}

const PersonaShareDialog = ({
  isOpen,
  onClose,
  persona,
  shareableLink,
}: PersonaShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Persona
          </DialogTitle>
          <DialogDescription>
            Share your "{persona.name}" persona with others using this link.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-2">
          <div className="grid flex-1 gap-2">
            <div className="flex h-10 items-center rounded-md border bg-muted/50 px-3">
              <Link className="h-4 w-4 text-muted-foreground mr-2" />
              <Input
                ref={inputRef}
                className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs sm:text-sm"
                readOnly
                value={shareableLink}
              />
            </div>
          </div>
          <Button
            type="button"
            size="icon"
            onClick={handleCopy}
            className="h-10 w-10 flex-shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
        <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground mt-2">
          <p className="text-xs sm:text-sm">
            When someone opens this link, they'll be able to import your persona
            with all its settings.
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex gap-2 w-full justify-between flex-col sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Close
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleCopy}
              className="flex-1 sm:flex-initial"
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonaShareDialog;
