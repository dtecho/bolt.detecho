import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash,
  Check,
  BookmarkPlus,
  AlertCircle,
  Search,
  Download,
  Upload,
  Plus,
  ArrowLeft,
  Star,
  Sparkles,
  Filter,
  SlidersHorizontal,
  FileJson,
} from "lucide-react";
import { usePersona, PersonaConfig } from "@/contexts/PersonaContext";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AlertDialog, {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface PersonaManagerProps {
  onEditPersona?: (persona: PersonaConfig) => void;
  onCreateNewPersona?: () => void;
  onBack?: () => void;
}

const PersonaManager = ({
  onEditPersona,
  onCreateNewPersona,
  onBack,
}: PersonaManagerProps) => {
  const {
    persona: currentPersona,
    savedPersonas,
    loadPersona,
    deletePersona,
    exportPersona,
    importPersona,
  } = usePersona();

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Mock favorites for demo - in a real app, this would be stored in the context
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (personaId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setFavorites((prev) =>
      prev.includes(personaId)
        ? prev.filter((id) => id !== personaId)
        : [...prev, personaId],
    );
  };

  const handleDeletePersona = (personaId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setPersonaToDelete(personaId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePersona = () => {
    if (personaToDelete) {
      deletePersona(personaToDelete);
      setPersonaToDelete(null);
      setDeleteDialogOpen(false);
      // Also remove from favorites if it was favorited
      setFavorites((prev) => prev.filter((id) => id !== personaToDelete));
    }
  };

  const handleSelectPersona = (personaId: string) => {
    loadPersona(personaId);
  };

  const handleEditPersona = (persona: PersonaConfig, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (onEditPersona) {
      onEditPersona(persona);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      setImportError("File too large. Maximum size is 1MB.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file type
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setImportError("Invalid file type. Only JSON files are supported.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const success = importPersona(content);
        if (!success) {
          setImportError("Failed to import persona. Invalid format.");
        } else {
          // Show success message
          setImportError("success");
          setTimeout(() => setImportError(null), 3000);
        }
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        setImportError("Failed to import persona. Invalid format.");
        console.error("Import error:", error);
      }
    };
    reader.onerror = () => {
      setImportError("Error reading file. Please try again.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  // Filter and sort personas based on current settings
  const processedPersonas = savedPersonas
    .filter((persona) => {
      // Apply search filter
      const matchesSearch =
        persona.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        persona.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply tab filter
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "favorites" && favorites.includes(persona.id || ""));

      // Apply favorites filter toggle
      const matchesFavoriteFilter =
        !filterFavorites || favorites.includes(persona.id || "");

      return matchesSearch && matchesTab && matchesFavoriteFilter;
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "recent") {
        // This would ideally use a lastModified timestamp
        // For demo purposes, we'll use the ID which might contain a timestamp
        const idA = a.id || "";
        const idB = b.id || "";
        return idB.localeCompare(idA); // Newest first
      } else if (sortBy === "tone") {
        return a.tone.localeCompare(b.tone);
      }
      return 0;
    });

  return (
    <Card className="w-full h-full bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="mr-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <CardTitle className="text-lg font-semibold">
                Persona Dashboard
              </CardTitle>
              <CardDescription>
                Manage your AI assistant personas
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleImportClick}
                  >
                    <FileJson className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import persona</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="default" onClick={onCreateNewPersona}>
              <Plus className="h-4 w-4 mr-2" />
              New Persona
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {importError && (
          <div
            className={`w-full p-2 mb-2 text-sm rounded-md flex items-center ${importError === "success" ? "text-green-500 bg-green-50 dark:bg-green-950 dark:text-green-300" : "text-red-500 bg-red-50 dark:bg-red-950 dark:text-red-300"}`}
          >
            {importError === "success" ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Persona imported successfully!
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                {importError}
              </>
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto sm:flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search personas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="tone">Tone</SelectItem>
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={filterFavorites ? "default" : "outline"}
                    size="icon"
                    onClick={() => setFilterFavorites(!filterFavorites)}
                  >
                    <Star
                      className={`h-4 w-4 ${filterFavorites ? "text-yellow-300 fill-yellow-300" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{filterFavorites ? "Show all" : "Show favorites only"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All Personas
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1">
              Favorites
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {processedPersonas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookmarkPlus className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="font-medium text-lg">
              {activeTab === "favorites"
                ? "No favorite personas"
                : searchQuery
                  ? "No matching personas"
                  : "No saved personas"}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 mb-4">
              {activeTab === "favorites"
                ? "Mark personas as favorites to see them here"
                : searchQuery
                  ? "Try a different search term"
                  : "Create and save personas to see them here"}
            </p>
            {!searchQuery && (
              <Button onClick={onCreateNewPersona}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Persona
              </Button>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-380px)] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {processedPersonas.map((persona) => (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleSelectPersona(persona.id || "")}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
                    currentPersona.id === persona.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-base">
                          {persona.name}
                        </h3>
                        {currentPersona.id === persona.id && (
                          <Badge
                            variant="outline"
                            className="ml-1 bg-primary/10"
                          >
                            <Check className="h-3 w-3 mr-1" /> Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                        {persona.description}
                      </p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => toggleFavorite(persona.id || "", e)}
                          >
                            <Star
                              className={`h-4 w-4 ${favorites.includes(persona.id || "") ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {favorites.includes(persona.id || "")
                              ? "Remove from favorites"
                              : "Add to favorites"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {persona.tone}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {persona.responseStyle}
                    </Badge>
                    {persona.verbosity > 70 && (
                      <Badge variant="secondary" className="text-xs">
                        Verbose
                      </Badge>
                    )}
                    {persona.verbosity < 30 && (
                      <Badge variant="secondary" className="text-xs">
                        Concise
                      </Badge>
                    )}
                    {persona.creativity > 70 && (
                      <Badge variant="secondary" className="text-xs">
                        Creative
                      </Badge>
                    )}
                    {persona.useEmojis && (
                      <Badge variant="secondary" className="text-xs">
                        Emojis
                      </Badge>
                    )}
                    {persona.useCodeExamples && (
                      <Badge variant="secondary" className="text-xs">
                        Code Examples
                      </Badge>
                    )}
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Sparkles className="h-3.5 w-3.5 text-primary mr-1.5" />
                      <span className="text-xs text-muted-foreground">
                        {persona.knowledgeDomains.slice(0, 2).join(", ")}
                        {persona.knowledgeDomains.length > 2 && ", ..."}
                      </span>
                    </div>

                    <div className="flex space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                exportPersona(persona.id || "");
                              }}
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Export persona</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => handleEditPersona(persona, e)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit persona</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) =>
                                handleDeletePersona(persona.id || "", e)
                              }
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete persona</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          {processedPersonas.length}{" "}
          {processedPersonas.length === 1 ? "persona" : "personas"}{" "}
          {searchQuery && "matching search"}
        </div>

        <Button variant="outline" size="sm" onClick={onCreateNewPersona}>
          <Plus className="mr-2 h-4 w-4" />
          New Persona
        </Button>
      </CardFooter>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Persona</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this persona? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePersona}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PersonaManager;
