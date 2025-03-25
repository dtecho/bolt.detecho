import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash,
  Check,
  BookmarkPlus,
  AlertCircle,
  Search,
} from "lucide-react";
import { usePersona, PersonaConfig } from "@/contexts/PersonaContext";
import { Input } from "@/components/ui/input";
import ScrollArea from "@/components/ui/scroll-area";
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

interface PersonaManagerProps {
  onEditPersona?: (persona: PersonaConfig) => void;
  onCreateNewPersona?: () => void;
}

const PersonaManager = ({
  onEditPersona,
  onCreateNewPersona,
}: PersonaManagerProps) => {
  const {
    persona: currentPersona,
    savedPersonas,
    loadPersona,
    deletePersona,
  } = usePersona();

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState<string | null>(null);

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

  const filteredPersonas = savedPersonas.filter((persona) =>
    persona.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="w-full h-full bg-background border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Persona Manager</CardTitle>
        <CardDescription>
          View and manage your saved AI personas
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search personas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {filteredPersonas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookmarkPlus className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="font-medium text-lg">No saved personas</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-4">
              {searchQuery
                ? "No personas match your search"
                : "Create and save personas to see them here"}
            </p>
            {!searchQuery && (
              <Button onClick={onCreateNewPersona}>
                <BookmarkPlus className="mr-2 h-4 w-4" />
                Create New Persona
              </Button>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-280px)] pr-4">
            <div className="space-y-3">
              {filteredPersonas.map((persona) => (
                <div
                  key={persona.id}
                  onClick={() => handleSelectPersona(persona.id || "")}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                    currentPersona.id === persona.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-base">{persona.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {persona.description}
                      </p>
                    </div>
                    {currentPersona.id === persona.id && (
                      <Badge variant="outline" className="ml-2 bg-primary/10">
                        <Check className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {persona.tone}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {persona.responseStyle}
                    </Badge>
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

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleEditPersona(persona, e)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeletePersona(persona.id || "", e)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {filteredPersonas.length > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onCreateNewPersona}
          >
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Create New Persona
          </Button>
        )}

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
      </CardContent>
    </Card>
  );
};

export default PersonaManager;
