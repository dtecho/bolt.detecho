import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Share2 } from "lucide-react";
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
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Persona
          </DialogTitle>
          <DialogDescription>
            Share your "{persona.name}" persona with others using this link.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-2">
          <Input
            value={shareableLink}
            readOnly
            className="flex-1"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogDescription className="text-xs">
            Anyone with this link will be able to import this persona into their
            own collection.
          </DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonaShareDialog;
