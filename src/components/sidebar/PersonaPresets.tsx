import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  PlusCircle,
  Check,
  Trash2,
  BookOpen,
  Code,
  Lightbulb,
} from "lucide-react";
import { Badge } from "../ui/badge";
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

// Map persona IDs to their respective icons
const PERSONA_ICONS: Record<string, React.ReactNode> = {
  "helpful-tutor": <BookOpen className="h-10 w-10 text-primary" />,
  "code-reviewer": <Code className="h-10 w-10 text-primary" />,
  "brainstorm-partner": <Lightbulb className="h-10 w-10 text-primary" />,
};

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
          <div className="grid grid-cols-1 gap-4">
            {personas.map((persona) => (
              <Card
                key={persona.id}
                className={`cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden ${selectedPersona?.id === persona.id ? "border-primary border-2" : "border-border"}`}
                onClick={() => onSelectPersona(persona)}
              >
                <div className="relative">
                  {selectedPersona?.id === persona.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check size={16} />
                    </div>
                  )}
                  <div className="flex p-4">
                    <div className="mr-4 flex items-center justify-center">
                      {PERSONA_ICONS[persona.id] || (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold text-lg">
                            {persona.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1 flex items-center">
                        {persona.name}
                        {persona.isCustom && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Custom
                          </Badge>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {persona.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 pb-3">
                    <div className="flex flex-wrap gap-1 mt-2">
                      {persona.tone.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-muted-foreground truncate max-w-[80%]">
                        {persona.knowledgeDomains.slice(0, 2).join(", ")}
                        {persona.knowledgeDomains.length > 2 && "..."}
                      </div>
                      {persona.isCustom && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) =>
                                  handleDeletePersona(persona.id, e)
                                }
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
                    </div>
                  </div>
                </div>
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
