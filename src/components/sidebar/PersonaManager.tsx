import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Edit,
  Trash,
  Download,
  Share,
  MoreVertical,
  Clock,
  ArrowLeft,
  Sparkles,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { usePersona, PersonaConfig } from "@/contexts/PersonaContext";
import PersonaEditor from "./PersonaEditor";
import PersonaShareDialog from "@/components/ui/dialog/PersonaShareDialog";
import { format } from "date-fns";

interface PersonaManagerProps {
  onEditPersona?: (persona: PersonaConfig) => void;
  onCreateNewPersona?: () => void;
  isDashboard?: boolean;
}

const PersonaManager = ({
  onEditPersona,
  onCreateNewPersona,
  isDashboard = false,
}: PersonaManagerProps) => {
  const {
    savedPersonas,
    deletePersona,
    exportPersona,
    generateShareableLink,
    loadPersona,
  } = usePersona();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPersonas, setFilteredPersonas] = useState<PersonaConfig[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("grid");
  const [selectedPersona, setSelectedPersona] = useState<PersonaConfig | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [personaToDelete, setPersonaToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter and sort personas when search query or saved personas change
  useEffect(() => {
    let filtered = [...savedPersonas];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (persona) =>
          persona.name.toLowerCase().includes(query) ||
          persona.description.toLowerCase().includes(query) ||
          persona.tone.toLowerCase().includes(query) ||
          persona.knowledgeDomains.some((domain) =>
            domain.toLowerCase().includes(query),
          ),
      );
    }

    // Sort by last modified date
    filtered.sort((a, b) => {
      const dateA = a.lastModified || 0;
      const dateB = b.lastModified || 0;
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredPersonas(filtered);
  }, [savedPersonas, searchQuery, sortOrder]);

  const handleEditPersona = (persona: PersonaConfig) => {
    if (onEditPersona) {
      onEditPersona(persona);
    } else {
      setSelectedPersona(persona);
      setIsEditing(true);
    }
  };

  const handleCreateNewPersona = () => {
    if (onCreateNewPersona) {
      onCreateNewPersona();
    } else {
      setSelectedPersona(null);
      setIsEditing(true);
    }
  };

  const handleBackToList = () => {
    setIsEditing(false);
    setSelectedPersona(null);
  };

  const handleSharePersona = (persona: PersonaConfig) => {
    try {
      const link = generateShareableLink(persona.id || "");
      setShareableLink(link);
      setSelectedPersona(persona);
      setIsShareDialogOpen(true);
    } catch (error) {
      console.error("Error generating shareable link:", error);
    }
  };

  const handleDeleteClick = (personaId: string) => {
    setPersonaToDelete(personaId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (personaToDelete) {
      deletePersona(personaToDelete);
      setPersonaToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleLoadPersona = (persona: PersonaConfig) => {
    if (persona.id) {
      loadPersona(persona.id);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // Render the persona editor view
  if (isEditing) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {selectedPersona ? "Edit Persona" : "Create New Persona"}
          </h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <PersonaEditor
            presetPersonas={[]}
            onSave={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  // Render the persona list view
  return (
    <div className="h-full flex flex-col">
      {/* Share dialog */}
      {selectedPersona && (
        <PersonaShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          persona={selectedPersona}
          shareableLink={shareableLink}
        />
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
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
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header with search and actions */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {isDashboard ? "Persona Management" : "Saved Personas"}
          </h2>
          <Button onClick={handleCreateNewPersona} size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Create New Persona
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search personas..."
            className="pl-8 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={toggleSortOrder}
            >
              {sortOrder === "desc" ? (
                <>
                  <SortDesc className="h-3.5 w-3.5" />
                  Newest First
                </>
              ) : (
                <>
                  <SortAsc className="h-3.5 w-3.5" />
                  Oldest First
                </>
              )}
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-8">
              <TabsTrigger value="grid" className="px-2 py-1">
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="px-2 py-1">
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Personas list */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {filteredPersonas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-center p-4 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-2">
                {searchQuery
                  ? "No personas match your search"
                  : "No saved personas yet"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateNewPersona}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Persona
              </Button>
            </div>
          ) : (
            <TabsContent value="grid" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPersonas.map((persona) => (
                  <Card
                    key={persona.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-medium">
                          {persona.name}
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditPersona(persona)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleLoadPersona(persona)}
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              Use This Persona
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => exportPersona(persona.id || "")}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSharePersona(persona)}
                            >
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                handleDeleteClick(persona.id || "")
                              }
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {persona.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {persona.tone}
                        </Badge>
                        {persona.knowledgeDomains
                          .slice(0, 2)
                          .map((domain, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {domain}
                            </Badge>
                          ))}
                        {persona.knowledgeDomains.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{persona.knowledgeDomains.length - 2} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {persona.lastModified
                          ? format(new Date(persona.lastModified), "PPP")
                          : "No date"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="list" className="m-0">
            <div className="space-y-2">
              {filteredPersonas.map((persona) => (
                <div
                  key={persona.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/10 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className="font-medium text-sm truncate">
                      {persona.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {persona.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {persona.lastModified
                        ? format(new Date(persona.lastModified), "PPP")
                        : "No date"}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditPersona(persona)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => exportPersona(persona.id || "")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleSharePersona(persona)}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(persona.id || "")}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PersonaManager;
