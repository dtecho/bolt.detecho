import React, { useState, useEffect, useCallback } from "react";
import { usePersona } from "@/contexts/PersonaContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Send, Trash2, Save, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PersonaTestingPlaygroundProps {
  className?: string;
}

const PersonaTestingPlayground: React.FC<PersonaTestingPlaygroundProps> = ({
  className = "",
}) => {
  const { persona, savedPersonas, loadPersona } = usePersona();
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(
    persona.id || "",
  );
  const [prompt, setPrompt] = useState<string>("");
  const [testHistory, setTestHistory] = useState<
    Array<{ prompt: string; response: string }>
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);

  // Load the selected persona when it changes
  useEffect(() => {
    if (selectedPersonaId && selectedPersonaId !== persona.id) {
      loadPersona(selectedPersonaId);
    }
  }, [selectedPersonaId, loadPersona, persona.id]);

  // Generate a response based on persona settings
  const generateResponse = (
    userPrompt: string,
    personaConfig: PersonaConfig,
  ) => {
    let responseContent = "";
    const {
      tone,
      useEmojis,
      verbosity,
      creativity,
      formality,
      useCodeExamples,
      customInstructions,
      knowledgeDomains,
    } = personaConfig;

    // Determine greeting based on tone
    if (tone === "friendly") {
      responseContent = `Hey there! ${useEmojis ? "😊 " : ""}I'm happy to help you with that!`;
    } else if (tone === "professional") {
      responseContent = `I understand your request. ${useEmojis ? "📝 " : ""}Here's a professional analysis.`;
    } else if (tone === "educational") {
      responseContent = `Let me explain this concept. ${useEmojis ? "🎓 " : ""}Understanding this is important.`;
    } else if (tone === "enthusiastic") {
      responseContent = `Wow! Great question! ${useEmojis ? "✨ " : ""}I'm excited to help with this!`;
    } else if (tone === "casual") {
      responseContent = `Sure thing! ${useEmojis ? "👍 " : ""}Let's figure this out together.`;
    }

    // Add domain-specific content based on knowledge domains
    if (
      knowledgeDomains.includes("technology") &&
      userPrompt.toLowerCase().includes("tech")
    ) {
      responseContent +=
        "\n\nFrom a technology perspective, this involves understanding the underlying systems and how they interact.";
    }

    if (
      knowledgeDomains.includes("business") &&
      userPrompt.toLowerCase().includes("business")
    ) {
      responseContent +=
        "\n\nFrom a business standpoint, we need to consider ROI, market positioning, and strategic alignment.";
    }

    // Adjust formality level
    if (formality > 70) {
      responseContent = responseContent.replace("Hey there!", "Greetings,");
      responseContent = responseContent.replace("Sure thing!", "Certainly.");
      responseContent = responseContent.replace("Wow!", "Indeed,");
    } else if (formality < 30) {
      responseContent = responseContent.replace(
        "I understand your request.",
        "Got it!",
      );
      responseContent = responseContent.replace(
        "Let me explain this concept.",
        "So here's the deal:",
      );
    }

    // Add creativity elements for high creativity settings
    if (creativity > 70) {
      responseContent +=
        "\n\nThinking outside the box, we could also consider an unconventional approach: " +
        (useEmojis ? "🌟 " : "") +
        "what if we looked at this from a completely different angle?";
    }

    // Add verbosity based on setting
    if (verbosity > 70) {
      responseContent +=
        "\n\nI'll provide a detailed explanation with all the necessary context and background information to ensure you have a comprehensive understanding of the topic. This includes examining the historical context, current applications, and potential future developments.";
    } else if (verbosity < 30) {
      // Keep it very brief - truncate to first sentence and add period if needed
      const firstSentence = responseContent.split(".")[0];
      responseContent = firstSentence.endsWith(".")
        ? firstSentence
        : firstSentence + ".";
    }

    // Add code example if enabled and relevant
    if (
      useCodeExamples &&
      (userPrompt.toLowerCase().includes("code") ||
        userPrompt.toLowerCase().includes("example") ||
        userPrompt.toLowerCase().includes("programming"))
    ) {
      const codeExamples = {
        javascript:
          "```javascript\n// Here's an example\nconst example = () => {\n  console.log('This is a code example');\n  return 'Result';\n};\n\n// Call the function\nconst result = example();\n```",
        python:
          "```python\n# Here's an example\ndef example():\n    print('This is a code example')\n    return 'Result'\n    \n# Call the function\nresult = example()\n```",
        react:
          "```jsx\n// React component example\nimport React from 'react';\n\nconst ExampleComponent = ({ name }) => {\n  return (\n    <div className=\"example\">\n      <h2>Hello, {name}!</h2>\n      <p>This is a React component example</p>\n    </div>\n  );\n};\n\nexport default ExampleComponent;\n```",
      };

      // Choose a language based on the message content or randomly if not specified
      let language = "javascript";
      if (userPrompt.toLowerCase().includes("python")) {
        language = "python";
      } else if (
        userPrompt.toLowerCase().includes("react") ||
        userPrompt.toLowerCase().includes("component")
      ) {
        language = "react";
      }

      responseContent += "\n\n" + codeExamples[language];
    }

    // Add custom instructions influence
    if (customInstructions.toLowerCase().includes("step by step")) {
      responseContent +=
        "\n\nLet me break this down step by step:\n1. First, understand the core concept\n2. Then, apply it to your specific situation\n3. Finally, iterate and refine your approach";
    }

    if (
      customInstructions.toLowerCase().includes("example") &&
      !responseContent.includes("example")
    ) {
      responseContent +=
        "\n\nHere's a practical example to illustrate: imagine you're trying to solve a similar problem in a real-world scenario...";
    }

    return responseContent;
  };

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate a delay for response generation
    setTimeout(() => {
      try {
        const response = generateResponse(prompt, persona);

        // Add to test history
        setTestHistory((prev) => [...prev, { prompt, response }]);
        setPrompt("");
      } catch (error) {
        console.error("Error generating response:", error);
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  const handleSavePrompt = () => {
    if (!prompt.trim()) return;
    setSavedPrompts((prev) => [...prev, prompt]);
  };

  const handleLoadSavedPrompt = (savedPrompt: string) => {
    setPrompt(savedPrompt);
  };

  const handleClearHistory = () => {
    setTestHistory([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  return (
    <Card className={`w-full h-full overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Persona Testing Playground
        </CardTitle>
        <CardDescription>
          Test your personas with different prompts without affecting your main
          chat history
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="playground" className="h-[calc(100%-2rem)]">
          <div className="px-6 border-b">
            <TabsList>
              <TabsTrigger value="playground">Playground</TabsTrigger>
              <TabsTrigger value="saved-prompts">Saved Prompts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="playground"
            className="h-full p-0 m-0 data-[state=active]:flex flex-col"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <Label
                      htmlFor="persona-select"
                      className="mb-2 block text-sm font-medium"
                    >
                      Select Persona
                    </Label>
                    <Select
                      value={selectedPersonaId}
                      onValueChange={setSelectedPersonaId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a persona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={persona.id || "current"}>
                          Current: {persona.name}
                        </SelectItem>
                        {savedPersonas.map((p) => (
                          <SelectItem key={p.id} value={p.id || ""}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearHistory}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear History
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSavePrompt}
                      disabled={!prompt.trim()}
                      className="flex items-center gap-1"
                    >
                      <Save className="h-4 w-4" />
                      Save Prompt
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Tone: {persona.tone}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Formality: {persona.formality}/100
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Creativity: {persona.creativity}/100
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Verbosity: {persona.verbosity}/100
                  </Badge>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  {testHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Sparkles className="h-8 w-8 mb-2 opacity-50" />
                      <p>Send a prompt to test the selected persona</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {testHistory.map((item, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex justify-end">
                            <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                              <p className="text-sm">{item.prompt}</p>
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                              <div className="text-sm whitespace-pre-wrap">
                                {item.response}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a prompt to test the persona..."
                    className="min-h-[80px] resize-none"
                  />
                  <Button
                    onClick={handleSendPrompt}
                    disabled={!prompt.trim() || isGenerating}
                    className="self-end"
                  >
                    {isGenerating ? (
                      "Generating..."
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Ctrl+Enter to send
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved-prompts" className="h-full p-6 m-0">
            {savedPrompts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Save className="h-8 w-8 mb-2 opacity-50" />
                <p>No saved prompts yet</p>
                <p className="text-xs mt-2">
                  Save prompts from the playground to reuse them later
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Saved Prompts</h3>
                <div className="grid gap-3">
                  {savedPrompts.map((savedPrompt, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm flex-1">{savedPrompt}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLoadSavedPrompt(savedPrompt)}
                              className="h-8 px-2"
                            >
                              Use
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setSavedPrompts((prev) =>
                                  prev.filter((_, i) => i !== index),
                                )
                              }
                              className="h-8 px-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSavedPrompts([])}
                  className="mt-4"
                >
                  Clear All Saved Prompts
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonaTestingPlayground;
