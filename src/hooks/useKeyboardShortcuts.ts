import { useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

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

type UseKeyboardShortcutsProps = {
  shortcuts: ShortcutCategory[];
  enabled?: boolean;
  showToasts?: boolean;
};

/**
 * Hook to handle keyboard shortcuts
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
  showToasts = true,
}: UseKeyboardShortcutsProps) {
  const { toast } = useToast();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Check if the active element is an input, textarea, or has role="textbox"
      const activeElement = document.activeElement;
      const isEditableTarget =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.getAttribute("role") === "textbox" ||
        activeElement?.isContentEditable;

      // Process all shortcut categories
      for (const category of shortcuts) {
        for (const shortcut of category.shortcuts) {
          // Skip if this shortcut should only work in editable elements and we're not in one
          // or if it should not work in editable elements and we are in one
          if (
            (shortcut.key === "Enter" && !isEditableTarget) ||
            (shortcut.key !== "Enter" &&
              isEditableTarget &&
              !shortcut.key.startsWith("/"))
          ) {
            continue;
          }

          const keyMatches = event.key === shortcut.key;
          const ctrlMatches =
            shortcut.ctrlKey === undefined ||
            event.ctrlKey === shortcut.ctrlKey;
          const altMatches =
            shortcut.altKey === undefined || event.altKey === shortcut.altKey;
          const shiftMatches =
            shortcut.shiftKey === undefined ||
            event.shiftKey === shortcut.shiftKey;
          const metaMatches =
            shortcut.metaKey === undefined ||
            event.metaKey === shortcut.metaKey;

          if (
            keyMatches &&
            ctrlMatches &&
            altMatches &&
            shiftMatches &&
            metaMatches
          ) {
            if (shortcut.preventDefault !== false) {
              event.preventDefault();
            }

            shortcut.action();

            if (showToasts) {
              toast({
                title: `Shortcut: ${getShortcutDisplayName(shortcut)}`,
                description: shortcut.description,
                duration: 2000,
              });
            }

            break;
          }
        }
      }
    },
    [enabled, shortcuts, showToasts, toast],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    shortcuts,
    getShortcutDisplayName,
  };
}

/**
 * Get a display name for a keyboard shortcut
 */
export function getShortcutDisplayName(shortcut: ShortcutAction): string {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  const parts: string[] = [];

  if (shortcut.ctrlKey) {
    parts.push(isMac ? "⌃" : "Ctrl");
  }

  if (shortcut.altKey) {
    parts.push(isMac ? "⌥" : "Alt");
  }

  if (shortcut.shiftKey) {
    parts.push(isMac ? "⇧" : "Shift");
  }

  if (shortcut.metaKey) {
    parts.push(isMac ? "⌘" : "Win");
  }

  // Format the key name
  let keyName = shortcut.key;
  if (keyName === " ") keyName = "Space";
  else if (keyName === "ArrowUp") keyName = "↑";
  else if (keyName === "ArrowDown") keyName = "↓";
  else if (keyName === "ArrowLeft") keyName = "←";
  else if (keyName === "ArrowRight") keyName = "→";
  else if (keyName.length === 1) keyName = keyName.toUpperCase();

  parts.push(keyName);

  return parts.join(isMac ? " " : "+");
}

export default useKeyboardShortcuts;
