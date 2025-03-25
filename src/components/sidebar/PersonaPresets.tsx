import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Button from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { PlusCircle, Check, Trash2 } from "lucide-react";
import Badge from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export interface Persona {
  id: string;
  name: string;
  description: string;
  tone: string[];
  knowledgeDomains: string[];
  responseStyle: string;
  isCustom?: boolean;
}

interface PersonaPresetsProps {
  selectedPersona?: Persona | null;
  onSelectPersona: (persona: Persona) => void;
  onCreatePersona?: () => void;
  onDeletePersona?: (id: string) => void;
}

const DEFAULT_PERSONAS: Persona[] = [
  {
    id: "helpful-tutor",
    name: "Helpful Tutor",
    description:
      "Patient and educational assistant focused on explaining concepts clearly",
    tone: ["Supportive", "Educational"],
    knowledgeDomains: ["General Knowledge", "Mathematics", "Science"],
    responseStyle: "Detailed explanations with examples",
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    description:
      "Technical assistant that provides code analysis and improvement suggestions",
    tone: ["Technical", "Precise"],
    knowledgeDomains: [
      "Programming",
      "Software Development",
      "Computer Science",
    ],
    responseStyle: "Structured feedback with code examples",
  },
  {
    id: "brainstorm-partner",
    name: "Brainstorm Partner",
    description: "Creative assistant that helps generate and refine ideas",
    tone: ["Creative", "Enthusiastic"],
    knowledgeDomains: ["Creative Writing", "Problem Solving", "Innovation"],
    responseStyle: "Open-ended questions and suggestions",
  },
];

export default function PersonaPresets({
  selectedPersona,
  onSelectPersona,
  onCreatePersona,
  onDeletePersona,
}: PersonaPresetsProps) {
  const [personas, setPersonas] = useState<Persona[]>([...DEFAULT_PERSONAS]);

  const handleDeletePersona = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeletePersona) {
      onDeletePersona(id);
    }
    setPersonas(personas.filter((p) => p.id !== id));
  };

  return (
    <Card className="w-full h-full bg-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Persona Presets</CardTitle>
        <CardDescription>Select a preset or create your own</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {personas.map((persona) => (
              <Card
                key={persona.id}
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${selectedPersona?.id === persona.id ? "border-primary" : "border-border"}`}
                onClick={() => onSelectPersona(persona)}
              >
                <CardHeader className="p-3 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium">
                      {persona.name}
                    </CardTitle>
                    {selectedPersona?.id === persona.id && (
                      <Check size={16} className="text-primary" />
                    )}
                  </div>
                  {persona.isCustom && (
                    <Badge variant="outline" className="text-xs">
                      Custom
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground">
                    {persona.description}
                  </p>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between">
                  <div className="flex flex-wrap gap-1">
                    {persona.tone.slice(0, 2).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  {persona.isCustom && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => handleDeletePersona(persona.id, e)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete persona</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onCreatePersona}>
          <PlusCircle size={16} className="mr-2" />
          Create Custom Persona
        </Button>
      </CardFooter>
    </Card>
  );
}
