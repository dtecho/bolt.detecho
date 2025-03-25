import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  RotateCcw,
  Trash2,
  Check,
  Info,
  AlertCircle,
  History,
  ArrowUpDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  usePersona,
  PersonaConfig,
  PersonaVersion,
} from "@/contexts/PersonaContext";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VersionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  personaId: string;
  personaName: string;
}

const VersionHistoryDialog: React.FC<VersionHistoryDialogProps> = ({
  isOpen,
  onClose,
  personaId,
  personaName,
}) => {
  const {
    getPersonaVersions,
    restorePersonaVersion,
    deletePersonaVersion,
    savePersonaVersion,
  } = usePersona();

  const [versions, setVersions] = useState<PersonaVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<PersonaVersion | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("versions");
  const [versionNote, setVersionNote] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersion, setCompareVersion] = useState<PersonaVersion | null>(
    null,
  );

  // Load versions when the dialog opens
  useEffect(() => {
    if (isOpen && personaId) {
      const personaVersions = getPersonaVersions(personaId);
      setVersions(personaVersions);
      if (personaVersions.length > 0) {
        setSelectedVersion(personaVersions[0]);
      }
    }
  }, [isOpen, personaId, getPersonaVersions]);

  const handleRestoreVersion = () => {
    if (selectedVersion) {
      restorePersonaVersion(personaId, selectedVersion.timestamp);
      onClose();
    }
  };

  const handleDeleteVersion = () => {
    if (selectedVersion) {
      deletePersonaVersion(personaId, selectedVersion.timestamp);
      // Update the versions list
      setVersions(getPersonaVersions(personaId));
      // Select the next version if available
      if (versions.length > 1) {
        const index = versions.findIndex(
          (v) => v.timestamp === selectedVersion.timestamp,
        );
        if (index > -1 && index < versions.length - 1) {
          setSelectedVersion(versions[index + 1]);
        } else if (index > 0) {
          setSelectedVersion(versions[index - 1]);
        } else {
          setSelectedVersion(null);
        }
      } else {
        setSelectedVersion(null);
      }
      setDeleteDialogOpen(false);
    }
  };

  const handleSaveNote = () => {
    if (selectedVersion && versionNote.trim()) {
      // In a real implementation, you would update the note in the version
      // For now, we'll just create a new version with the note
      savePersonaVersion(personaId, versionNote.trim());
      setVersions(getPersonaVersions(personaId));
      setVersionNote("");
      setActiveTab("versions");
    }
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "MMM d, yyyy h:mm a");
  };

  const getVersionDifferences = () => {
    if (!selectedVersion || !compareVersion) return [];

    const differences: { field: string; before: any; after: any }[] = [];

    // Compare all fields in the persona data
    Object.keys(selectedVersion.data).forEach((key) => {
      const field = key as keyof typeof selectedVersion.data;
      const selectedValue = selectedVersion.data[field];
      const compareValue = compareVersion.data[field];

      // Check if the values are different
      if (JSON.stringify(selectedValue) !== JSON.stringify(compareValue)) {
        differences.push({
          field,
          before: compareValue,
          after: selectedValue,
        });
      }
    });

    return differences;
  };

  const formatFieldValue = (field: string, value: any) => {
    if (field === "knowledgeDomains" && Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (typeof value === "number") {
      return value.toString();
    }
    return value;
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      name: "Name",
      description: "Description",
      tone: "Tone",
      knowledgeDomains: "Knowledge Domains",
      responseStyle: "Response Style",
      verbosity: "Verbosity",
      creativity: "Creativity",
      formality: "Formality",
      useEmojis: "Use Emojis",
      useCodeExamples: "Use Code Examples",
      customInstructions: "Custom Instructions",
    };
    return labels[field] || field;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Version History for {personaName}
          </DialogTitle>
          <DialogDescription>
            View and restore previous versions of this persona
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="notes">Add Notes</TabsTrigger>
            </TabsList>

            {activeTab === "versions" && versions.length > 1 && (
              <Button
                variant={compareMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCompareMode(!compareMode);
                  if (!compareMode && versions.length > 1) {
                    setCompareVersion(versions[1]); // Select the second version by default
                  } else {
                    setCompareVersion(null);
                  }
                }}
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {compareMode ? "Exit Compare" : "Compare Versions"}
              </Button>
            )}
          </div>

          <TabsContent
            value="versions"
            className="flex-1 overflow-hidden mt-4 flex flex-col"
          >
            {versions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">No version history</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  This persona doesn't have any saved versions yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-1 gap-4 overflow-hidden">
                <div className="w-1/3 border rounded-md overflow-hidden flex flex-col">
                  <div className="bg-muted p-2 font-medium text-sm">
                    Version History
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                      {versions.map((version) => (
                        <div
                          key={version.timestamp}
                          className={`p-2 rounded-md cursor-pointer transition-colors ${selectedVersion?.timestamp === version.timestamp ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"}`}
                          onClick={() => setSelectedVersion(version)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {formatDate(version.timestamp)}
                              </span>
                            </div>
                            {compareMode &&
                              selectedVersion?.timestamp !==
                                version.timestamp && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCompareVersion(version);
                                  }}
                                >
                                  {compareVersion?.timestamp ===
                                  version.timestamp
                                    ? "Selected for comparison"
                                    : "Compare"}
                                </Button>
                              )}
                          </div>
                          {version.notes && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {version.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex-1 border rounded-md overflow-hidden flex flex-col">
                  {selectedVersion ? (
                    <>
                      <div className="bg-muted p-2 font-medium text-sm flex justify-between items-center">
                        <div>
                          Version Details -{" "}
                          {formatDate(selectedVersion.timestamp)}
                        </div>
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7"
                                  onClick={handleRestoreVersion}
                                >
                                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                                  Restore
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Restore this version</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <AlertDialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Version
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this version?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteVersion}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <ScrollArea className="flex-1 p-3">
                        {compareMode && compareVersion ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="text-xs">
                                Comparing with version from{" "}
                                {formatDate(compareVersion.timestamp)}
                              </Badge>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              {getVersionDifferences().length > 0 ? (
                                getVersionDifferences().map((diff, index) => (
                                  <div
                                    key={index}
                                    className="border rounded-md overflow-hidden"
                                  >
                                    <div className="bg-muted p-2 font-medium text-sm">
                                      {getFieldLabel(diff.field)}
                                    </div>
                                    <div className="grid grid-cols-2 gap-0">
                                      <div className="p-3 border-r bg-red-50/30 dark:bg-red-900/10">
                                        <div className="text-xs text-muted-foreground mb-1">
                                          Previous Version
                                        </div>
                                        <div className="text-sm whitespace-pre-wrap">
                                          {formatFieldValue(
                                            diff.field,
                                            diff.before,
                                          )}
                                        </div>
                                      </div>
                                      <div className="p-3 bg-green-50/30 dark:bg-green-900/10">
                                        <div className="text-xs text-muted-foreground mb-1">
                                          Selected Version
                                        </div>
                                        <div className="text-sm whitespace-pre-wrap">
                                          {formatFieldValue(
                                            diff.field,
                                            diff.after,
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                  No differences found between these versions
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {selectedVersion.notes && (
                              <div className="bg-muted/30 p-3 rounded-md">
                                <div className="text-sm font-medium mb-1">
                                  Notes:
                                </div>
                                <p className="text-sm">
                                  {selectedVersion.notes}
                                </p>
                              </div>
                            )}

                            <div className="space-y-3">
                              {Object.entries(selectedVersion.data).map(
                                ([key, value]) => (
                                  <div key={key} className="space-y-1">
                                    <Label className="text-xs">
                                      {getFieldLabel(key)}
                                    </Label>
                                    <div className="p-2 rounded-md bg-muted/30 text-sm whitespace-pre-wrap">
                                      {formatFieldValue(key, value)}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </ScrollArea>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8">
                      <Info className="h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="font-medium text-lg">
                        Select a version to view details
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="notes"
            className="flex-1 overflow-hidden mt-4 flex flex-col"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="version-note">
                  Add Note to Current Version
                </Label>
                <Textarea
                  id="version-note"
                  placeholder="Add notes about this version (e.g., what changes were made)"
                  value={versionNote}
                  onChange={(e) => setVersionNote(e.target.value)}
                  className="mt-2 min-h-[150px]"
                />
              </div>

              <div className="bg-muted/30 p-3 rounded-md">
                <div className="text-sm font-medium mb-1 flex items-center">
                  <Info className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  Why add notes?
                </div>
                <p className="text-sm text-muted-foreground">
                  Adding notes helps you remember what changes you made to this
                  persona. This is especially useful when you have multiple
                  versions and need to identify specific changes.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4">
          {activeTab === "notes" ? (
            <>
              <Button
                variant="outline"
                onClick={() => setActiveTab("versions")}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveNote} disabled={!versionNote.trim()}>
                <Check className="mr-2 h-4 w-4" />
                Save Note
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistoryDialog;
