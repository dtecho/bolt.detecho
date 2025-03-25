import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";
import { getShortcutDisplayName } from "@/hooks/useKeyboardShortcuts";

type ShortcutAction = {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
  preventDefault?: boolean;
};

type ShortcutCategory = {
  name: string;
  shortcuts: ShortcutAction[];
};

interface KeyboardShortcutsDialogProps {
  shortcuts: ShortcutCategory[];
  trigger?: React.ReactNode;
}

export function KeyboardShortcutsDialog({
  shortcuts,
  trigger,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Keyboard className="h-4 w-4" />
            <span className="sr-only">Keyboard shortcuts</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate the application more
            efficiently.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {shortcuts.map((category) => (
            <div key={category.name} className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">
                {category.name}
              </h3>
              <div className="rounded-md border">
                <div className="divide-y">
                  {category.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 text-sm hover:bg-muted/50"
                    >
                      <span className="text-muted-foreground">
                        {shortcut.description}
                      </span>
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        {getShortcutDisplayName(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KeyboardShortcutsDialog;
