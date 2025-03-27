import React, { useState, useEffect } from "react";
import { Keyboard, Plus, X, Save, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Hotkey {
  id: string;
  name: string;
  description: string;
  keys: string[];
  action: string;
  isCustom: boolean;
}

interface HotkeysManagerProps {
  defaultHotkeys?: Hotkey[];
  onHotkeyChange?: (hotkeys: Hotkey[]) => void;
}

const DEFAULT_HOTKEYS: Hotkey[] = [
  {
    id: "analyze-code",
    name: "Analyze Code",
    description: "Analyze the current code for suggestions",
    keys: ["Control", "Shift", "A"],
    action: "analyzeCode",
    isCustom: false,
  },
  {
    id: "send-to-chat",
    name: "Send to Chat",
    description: "Send the current code to the AI chat",
    keys: ["Control", "Enter"],
    action: "sendToChat",
    isCustom: false,
  },
  {
    id: "run-code",
    name: "Run Code",
    description: "Execute the current code",
    keys: ["F5"],
    action: "runCode",
    isCustom: false,
  },
  {
    id: "save-persona",
    name: "Save Persona",
    description: "Save the current persona configuration",
    keys: ["Control", "S"],
    action: "savePersona",
    isCustom: false,
  },
  {
    id: "toggle-theme",
    name: "Toggle Theme",
    description: "Switch between light and dark mode",
    keys: ["Control", "Shift", "T"],
    action: "toggleTheme",
    isCustom: false,
  },
];

const HotkeysManager: React.FC<HotkeysManagerProps> = ({
  defaultHotkeys = DEFAULT_HOTKEYS,
  onHotkeyChange,
}) => {
  const [hotkeys, setHotkeys] = useState<Hotkey[]>(defaultHotkeys);
  const [isOpen, setIsOpen] = useState(false);
  const [editingHotkey, setEditingHotkey] = useState<Hotkey | null>(null);
  const [recordingKeys, setRecordingKeys] = useState(false);
  const [currentKeys, setCurrentKeys] = useState<string[]>([]);
  const { toast } = useToast();

  // Load saved hotkeys from localStorage on mount
  useEffect(() => {
    const savedHotkeys = localStorage.getItem("bolt-diy-hotkeys");
    if (savedHotkeys) {
      try {
        const parsed = JSON.parse(savedHotkeys);
        setHotkeys(parsed);
      } catch (error) {
        console.error("Failed to parse saved hotkeys:", error);
      }
    }
  }, []);

  // Save hotkeys to localStorage when they change
  useEffect(() => {
    localStorage.setItem("bolt-diy-hotkeys", JSON.stringify(hotkeys));
    if (onHotkeyChange) {
      onHotkeyChange(hotkeys);
    }
  }, [hotkeys, onHotkeyChange]);

  // Handle key recording
  useEffect(() => {
    if (!recordingKeys) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      // Don't record modifier keys alone
      if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) {
        return;
      }

      const keys: string[] = [];
      if (e.ctrlKey) keys.push("Control");
      if (e.altKey) keys.push("Alt");
      if (e.shiftKey) keys.push("Shift");
      if (e.metaKey) keys.push("Meta");

      // Add the main key (capitalize for function keys)
      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      keys.push(key);

      setCurrentKeys(keys);
      setRecordingKeys(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [recordingKeys]);

  const startRecording = () => {
    setCurrentKeys([]);
    setRecordingKeys(true);
  };

  const formatKeyCombo = (keys: string[]) => {
    return keys.join(" + ");
  };

  const handleSaveHotkey = () => {
    if (!editingHotkey || !currentKeys.length) return;

    // Check for duplicate key combinations
    const isDuplicate = hotkeys.some(
      (h) =>
        h.id !== editingHotkey.id &&
        h.keys.length === currentKeys.length &&
        h.keys.every((k, i) => k === currentKeys[i]),
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate hotkey",
        description:
          "This key combination is already in use. Please choose another.",
        variant: "destructive",
      });
      return;
    }

    const updatedHotkey = {
      ...editingHotkey,
      keys: currentKeys,
    };

    setHotkeys(
      hotkeys.map((h) => (h.id === updatedHotkey.id ? updatedHotkey : h)),
    );
    setEditingHotkey(null);
    setCurrentKeys([]);

    toast({
      title: "Hotkey updated",
      description: `${updatedHotkey.name} is now set to ${formatKeyCombo(updatedHotkey.keys)}`,
    });
  };

  const handleAddCustomHotkey = () => {
    const newHotkey: Hotkey = {
      id: `custom-${Date.now()}`,
      name: "New Hotkey",
      description: "Custom hotkey",
      keys: [],
      action: "custom",
      isCustom: true,
    };

    setHotkeys([...hotkeys, newHotkey]);
    setEditingHotkey(newHotkey);
    setCurrentKeys([]);
  };

  const handleDeleteHotkey = (id: string) => {
    setHotkeys(hotkeys.filter((h) => h.id !== id));
    if (editingHotkey?.id === id) {
      setEditingHotkey(null);
      setCurrentKeys([]);
    }

    toast({
      title: "Hotkey deleted",
      description: "The hotkey has been removed.",
    });
  };

  const handleResetToDefaults = () => {
    setHotkeys(defaultHotkeys);
    setEditingHotkey(null);
    setCurrentKeys([]);

    toast({
      title: "Hotkeys reset",
      description: "All hotkeys have been reset to their default values.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          Keyboard Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Customize keyboard shortcuts for faster workflow. Click on a
            shortcut to edit it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Available Shortcuts</h3>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={handleAddCustomHotkey}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Custom
              </Button>
            </div>

            <ScrollArea className="h-[300px] border rounded-md p-2">
              <div className="space-y-2">
                {hotkeys.map((hotkey) => (
                  <div
                    key={hotkey.id}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${editingHotkey?.id === hotkey.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"}`}
                    onClick={() => {
                      setEditingHotkey(hotkey);
                      setCurrentKeys(hotkey.keys);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{hotkey.name}</span>
                      {hotkey.isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHotkey(hotkey.id);
                          }}
                        >
                          <Trash className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {hotkey.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {hotkey.keys.length > 0 ? (
                        hotkey.keys.map((key, index) => (
                          <React.Fragment key={index}>
                            <kbd className="px-2 py-0.5 text-xs font-semibold bg-muted border rounded">
                              {key}
                            </kbd>
                            {index < hotkey.keys.length - 1 && (
                              <span className="text-muted-foreground">+</span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No shortcut set
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              {editingHotkey
                ? `Edit: ${editingHotkey.name}`
                : "Select a shortcut to edit"}
            </h3>

            {editingHotkey ? (
              <div className="space-y-4 border rounded-md p-4">
                {editingHotkey.isCustom && (
                  <div className="space-y-2">
                    <Label htmlFor="hotkey-name">Name</Label>
                    <Input
                      id="hotkey-name"
                      value={editingHotkey.name}
                      onChange={(e) => {
                        setEditingHotkey({
                          ...editingHotkey,
                          name: e.target.value,
                        });
                      }}
                    />
                  </div>
                )}

                {editingHotkey.isCustom && (
                  <div className="space-y-2">
                    <Label htmlFor="hotkey-description">Description</Label>
                    <Input
                      id="hotkey-description"
                      value={editingHotkey.description}
                      onChange={(e) => {
                        setEditingHotkey({
                          ...editingHotkey,
                          description: e.target.value,
                        });
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Shortcut Keys</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-10 px-3 py-2 border rounded-md flex items-center gap-1 bg-muted/50">
                      {currentKeys.length > 0 ? (
                        currentKeys.map((key, index) => (
                          <React.Fragment key={index}>
                            <kbd className="px-2 py-0.5 text-xs font-semibold bg-background border rounded">
                              {key}
                            </kbd>
                            {index < currentKeys.length - 1 && (
                              <span className="text-muted-foreground">+</span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <span className="text-muted-foreground">
                          {recordingKeys
                            ? "Press keys..."
                            : "Click 'Record' to set shortcut"}
                        </span>
                      )}
                    </div>
                    <Button
                      variant={recordingKeys ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() => {
                        if (recordingKeys) {
                          setRecordingKeys(false);
                        } else {
                          startRecording();
                        }
                      }}
                    >
                      {recordingKeys ? (
                        <>
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </>
                      ) : (
                        <>Record</>
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full mt-2 gap-2"
                  onClick={handleSaveHotkey}
                  disabled={currentKeys.length === 0}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="border rounded-md p-8 flex flex-col items-center justify-center text-center h-[300px]">
                <Keyboard className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a shortcut from the list to edit it
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={handleResetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HotkeysManager;
