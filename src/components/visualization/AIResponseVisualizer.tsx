import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  Zap,
  MessageSquare,
  Brain,
  Lightbulb,
  Gauge,
  Wand2,
} from "lucide-react";

interface AIResponseVisualizerProps {
  initialPrompt?: string;
  className?: string;
}

interface PersonaSettings {
  creativity: number;
  verbosity: number;
  formality: number;
  useEmojis: boolean;
  tone: "friendly" | "professional" | "casual" | "enthusiastic" | "educational";
}

interface ResponseMetrics {
  sentiment: number; // -100 to 100
  complexity: number; // 0 to 100
  engagement: number; // 0 to 100
  creativity: number; // 0 to 100
  clarity: number; // 0 to 100
}

const defaultPersonaSettings: PersonaSettings = {
  creativity: 50,
  verbosity: 50,
  formality: 50,
  useEmojis: true,
  tone: "friendly",
};

const defaultPrompt =
  "Explain the concept of artificial intelligence and how it might impact society in the future.";

const AIResponseVisualizer: React.FC<AIResponseVisualizerProps> = ({
  initialPrompt = defaultPrompt,
  className = "",
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [personaSettings, setPersonaSettings] = useState<PersonaSettings>(
    defaultPersonaSettings,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [metrics, setMetrics] = useState<ResponseMetrics>({
    sentiment: 60,
    complexity: 45,
    engagement: 70,
    creativity: 55,
    clarity: 80,
  });
  const [activeTab, setActiveTab] = useState("visualization");
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonSettings, setComparisonSettings] = useState<PersonaSettings>(
    {
      ...defaultPersonaSettings,
      creativity: 80,
      formality: 20,
      tone: "enthusiastic",
    },
  );
  const [comparisonResponse, setComparisonResponse] = useState<string>("");
  const [comparisonMetrics, setComparisonMetrics] = useState<ResponseMetrics>({
    sentiment: 85,
    complexity: 30,
    engagement: 90,
    creativity: 85,
    clarity: 65,
  });

  const responseRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  // Generate a response based on the prompt and persona settings
  const generateResponse = (settings: PersonaSettings) => {
    const { creativity, verbosity, formality, useEmojis, tone } = settings;

    let responseText = "";

    // Generate different responses based on tone
    if (tone === "friendly") {
      responseText = `Hey there! ${useEmojis ? "😊 " : ""}I'd be happy to explain artificial intelligence and its potential impact on society.

AI refers to computer systems designed to perform tasks that typically require human intelligence. These include learning, reasoning, problem-solving, perception, and language understanding. ${useEmojis ? "🧠 " : ""}

In the future, AI will likely transform many aspects of society, from healthcare and education to transportation and work. ${useEmojis ? "🚀 " : ""}It could lead to more personalized medicine, more efficient transportation systems, and automation of routine tasks.`;
    } else if (tone === "professional") {
      responseText = `Artificial Intelligence (AI) encompasses computational systems designed to emulate human cognitive functions including learning, reasoning, and problem-solving.

The societal implications of AI advancement are multifaceted. In the healthcare sector, AI may facilitate more precise diagnostics and treatment protocols. In the transportation industry, autonomous vehicles could potentially reduce accidents and optimize traffic flow. In the labor market, automation of routine tasks may necessitate workforce adaptation and reskilling initiatives.

It is imperative to consider both the opportunities and challenges presented by AI integration into societal frameworks.`;
    } else if (tone === "casual") {
      responseText = `So AI is basically computers that can think and learn kinda like humans do. ${useEmojis ? "🤖 " : ""}They can figure stuff out, solve problems, and understand what we're saying.

In the future? AI's gonna change a lot of things. ${useEmojis ? "👍 " : ""}It'll probably make healthcare better, maybe drive our cars for us, and do a bunch of boring jobs so we don't have to. Some jobs might disappear, but new ones will probably pop up too.

It's gonna be a wild ride, that's for sure!`;
    } else if (tone === "enthusiastic") {
      responseText = `Wow! Artificial intelligence is absolutely FASCINATING! ${useEmojis ? "✨ " : ""}It's one of the most REVOLUTIONARY technologies of our time!

AI systems can learn, adapt, and perform tasks that normally require human intelligence - isn't that AMAZING? ${useEmojis ? "🤯 " : ""}They're already transforming everything from how we shop online to how doctors diagnose diseases!

The future implications are INCREDIBLE! ${useEmojis ? "🚀 " : ""}We could see AI solving some of humanity's biggest challenges - from climate change to disease! Of course, there will be challenges too, but the possibilities are ENDLESS!`;
    } else if (tone === "educational") {
      responseText = `Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think and learn like humans. ${useEmojis ? "🧠 " : ""}Let's break down the key concepts:

1. Machine Learning: AI systems use algorithms to analyze data, learn from it, and make predictions.

2. Neural Networks: These are computing systems inspired by the human brain's structure.

3. Natural Language Processing: This allows machines to understand and respond to human language.

Regarding societal impact, AI will likely transform several sectors:

• Healthcare: More accurate diagnoses and personalized treatment plans
• Transportation: Autonomous vehicles reducing accidents and traffic
• Employment: Automation of routine tasks, creating new job categories
• Education: Personalized learning experiences

However, these advancements also raise important ethical considerations about privacy, bias, and economic disruption that society will need to address.`;
    }

    // Adjust for verbosity
    if (verbosity < 30) {
      // Very concise - just take the first paragraph
      responseText = responseText.split("\n")[0];
    } else if (verbosity > 70) {
      // Very verbose - add more details
      responseText += `\n\nFurthermore, the ethical implications of AI development cannot be overlooked. Questions about privacy, surveillance, algorithmic bias, and the digital divide will become increasingly important as AI systems become more prevalent in our daily lives. ${useEmojis ? "⚖️ " : ""}\n\nThere are also philosophical questions to consider about the nature of intelligence, consciousness, and what it means to be human in a world increasingly shaped by artificial intelligence. As AI systems become more sophisticated, the boundary between human and machine intelligence may become less clear.${useEmojis ? "🤔 " : ""}\n\nUltimately, how AI impacts society will depend largely on how we choose to design, regulate, and implement these technologies. With thoughtful consideration and inclusive decision-making processes, AI has the potential to help address some of humanity's most pressing challenges.`;
    }

    // Adjust for formality
    if (formality < 30 && tone !== "casual") {
      responseText = responseText.replace(/Artificial Intelligence/g, "AI");
      responseText = responseText.replace(/will likely/g, "will probably");
      responseText = responseText.replace(/however/gi, "but");
      responseText = responseText.replace(/furthermore/gi, "also");
    } else if (formality > 70 && tone !== "professional") {
      responseText = responseText.replace(
        /AI is/g,
        "Artificial Intelligence is",
      );
      responseText = responseText.replace(/can't/g, "cannot");
      responseText = responseText.replace(/it'll/gi, "it will");
      responseText = responseText.replace(/gonna/gi, "going to");
    }

    // Adjust for creativity
    if (creativity > 70) {
      responseText += `\n\nImagine a world where your refrigerator not only orders groceries automatically but also suggests recipes based on your health goals and preferences. Or consider AI composers creating personalized music that adapts to your mood throughout the day. ${useEmojis ? "🎵 " : ""}Perhaps we'll see AI systems that can translate animal communications, opening up new ways of understanding the world around us. ${useEmojis ? "🐬 " : ""}The most exciting possibilities may be those we haven't even conceived of yet.`;
    }

    return responseText;
  };

  // Calculate metrics based on persona settings
  const calculateMetrics = (settings: PersonaSettings): ResponseMetrics => {
    const { creativity, verbosity, formality, tone } = settings;

    // Base calculations on persona settings
    let sentiment = 50;
    let complexity = formality * 0.8;
    let engagement = 50;
    let clarity = 100 - complexity * 0.5;

    // Adjust based on tone
    switch (tone) {
      case "friendly":
        sentiment += 20;
        engagement += 15;
        break;
      case "professional":
        complexity += 20;
        clarity -= 10;
        break;
      case "casual":
        sentiment += 10;
        complexity -= 20;
        engagement += 10;
        clarity += 15;
        break;
      case "enthusiastic":
        sentiment += 35;
        engagement += 40;
        break;
      case "educational":
        complexity += 10;
        clarity += 20;
        break;
    }

    // Adjust based on other factors
    if (settings.useEmojis) {
      engagement += 10;
      sentiment += 10;
    }

    // Creativity directly affects the creativity metric
    const creativityMetric = creativity;

    // Ensure all values are within bounds
    return {
      sentiment: Math.max(-100, Math.min(100, sentiment)),
      complexity: Math.max(0, Math.min(100, complexity)),
      engagement: Math.max(0, Math.min(100, engagement)),
      creativity: Math.max(0, Math.min(100, creativityMetric)),
      clarity: Math.max(0, Math.min(100, clarity)),
    };
  };

  // Handle generating responses
  const handleGenerate = () => {
    setIsGenerating(true);
    setResponse("");
    if (showComparison) {
      setComparisonResponse("");
    }

    // Simulate API call delay
    setTimeout(() => {
      const newResponse = generateResponse(personaSettings);
      const newMetrics = calculateMetrics(personaSettings);

      // Animate the response appearing letter by letter
      let i = 0;
      const interval = setInterval(() => {
        setResponse(newResponse.substring(0, i));
        i++;
        if (i > newResponse.length) {
          clearInterval(interval);
          setMetrics(newMetrics);
          setIsGenerating(false);
        }
      }, 15);

      // Generate comparison response if enabled
      if (showComparison) {
        const newComparisonResponse = generateResponse(comparisonSettings);
        const newComparisonMetrics = calculateMetrics(comparisonSettings);

        // Slight delay before starting comparison animation
        setTimeout(() => {
          let j = 0;
          const compInterval = setInterval(() => {
            setComparisonResponse(newComparisonResponse.substring(0, j));
            j++;
            if (j > newComparisonResponse.length) {
              clearInterval(compInterval);
              setComparisonMetrics(newComparisonMetrics);
            }
          }, 15);
        }, 500);
      }
    }, 1000);
  };

  // Update settings handler
  const updateSettings = (key: keyof PersonaSettings, value: any) => {
    setPersonaSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update comparison settings handler
  const updateComparisonSettings = (key: keyof PersonaSettings, value: any) => {
    setComparisonSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Render a metric visualization
  const renderMetric = (
    label: string,
    value: number,
    icon: React.ReactNode,
    color: string,
  ) => {
    return (
      <div className="flex flex-col items-center">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div
          className={`relative h-24 w-4 bg-muted rounded-full overflow-hidden`}
        >
          <motion.div
            className={`absolute bottom-0 w-full ${color}`}
            initial={{ height: 0 }}
            animate={{ height: `${value}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
        <div className="mt-2 flex flex-col items-center">
          <div className="text-primary">{icon}</div>
          <div className="text-sm font-medium mt-1">{value}%</div>
        </div>
      </div>
    );
  };

  // Render the response visualization
  const renderVisualization = (
    responseText: string,
    responseMetrics: ResponseMetrics,
    ref: React.RefObject<HTMLDivElement>,
  ) => {
    return (
      <div className="relative">
        <div
          className="relative p-4 rounded-lg bg-gradient-to-br from-background to-muted border overflow-hidden"
          style={{
            boxShadow: `0 0 20px rgba(var(--primary), ${responseMetrics.sentiment > 0 ? responseMetrics.sentiment / 200 : 0})`,
          }}
        >
          {/* Animated background particles based on creativity */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({
              length: Math.floor(responseMetrics.creativity / 10),
            }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-primary/10"
                style={{
                  width: Math.random() * 50 + 10,
                  height: Math.random() * 50 + 10,
                  x: Math.random() * 100 - 50 + "%",
                  y: Math.random() * 100 - 50 + "%",
                }}
                animate={{
                  x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                  y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>

          {/* Response text */}
          <div
            ref={ref}
            className="relative prose dark:prose-invert max-w-none"
            style={{
              fontSize: `${Math.min(100, Math.max(80, 100 - responseMetrics.complexity / 5))}%`,
              lineHeight: responseMetrics.clarity > 70 ? 1.8 : 1.5,
            }}
          >
            {responseText.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Animated glow effect based on sentiment */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-lg"
            animate={{
              boxShadow:
                responseMetrics.sentiment > 60
                  ? [
                      "0 0 10px rgba(var(--primary), 0.1)",
                      "0 0 20px rgba(var(--primary), 0.2)",
                      "0 0 10px rgba(var(--primary), 0.1)",
                    ]
                  : "none",
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* Metrics visualization */}
        <div className="mt-4 flex justify-between px-2">
          {renderMetric(
            "Sentiment",
            responseMetrics.sentiment,
            <Sparkles size={16} />,
            "bg-green-500",
          )}
          {renderMetric(
            "Complexity",
            responseMetrics.complexity,
            <Brain size={16} />,
            "bg-blue-500",
          )}
          {renderMetric(
            "Engagement",
            responseMetrics.engagement,
            <Zap size={16} />,
            "bg-amber-500",
          )}
          {renderMetric(
            "Creativity",
            responseMetrics.creativity,
            <Lightbulb size={16} />,
            "bg-purple-500",
          )}
          {renderMetric(
            "Clarity",
            responseMetrics.clarity,
            <Gauge size={16} />,
            "bg-cyan-500",
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      <Card className="overflow-hidden border-primary/20">
        <div className="p-6 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Wand2 className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                AI Response Visualizer
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="show-comparison" className="text-sm">
                  Compare
                </Label>
                <Switch
                  id="show-comparison"
                  checked={showComparison}
                  onCheckedChange={setShowComparison}
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Response"}
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full p-3 rounded-md border bg-background/50 focus:ring-1 focus:ring-primary min-h-[80px]"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="visualization" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Visualization
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Wand2 className="h-4 w-4" />
                Persona Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="space-y-4">
              <div
                className={`grid ${showComparison ? "grid-cols-1 md:grid-cols-2 gap-6" : "grid-cols-1"}`}
              >
                <div className="space-y-2">
                  {showComparison && (
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary"
                      >
                        Persona A
                      </Badge>
                    </div>
                  )}
                  {renderVisualization(response, metrics, responseRef)}
                </div>

                {showComparison && (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className="bg-secondary/10 text-secondary-foreground"
                      >
                        Persona B
                      </Badge>
                    </div>
                    {renderVisualization(
                      comparisonResponse,
                      comparisonMetrics,
                      comparisonRef,
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div
                className={`grid ${showComparison ? "grid-cols-1 md:grid-cols-2 gap-6" : "grid-cols-1"}`}
              >
                <div className="space-y-4">
                  {showComparison && (
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary"
                      >
                        Persona A Settings
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Tone</Label>
                        <span className="text-sm text-muted-foreground capitalize">
                          {personaSettings.tone}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "friendly", label: "Friendly" },
                          { value: "professional", label: "Professional" },
                          { value: "casual", label: "Casual" },
                          { value: "enthusiastic", label: "Enthusiastic" },
                          { value: "educational", label: "Educational" },
                        ].map((tone) => (
                          <Button
                            key={tone.value}
                            variant={
                              personaSettings.tone === tone.value
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => updateSettings("tone", tone.value)}
                            className="text-xs"
                          >
                            {tone.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Creativity</Label>
                        <span className="text-sm text-muted-foreground">
                          {personaSettings.creativity}%
                        </span>
                      </div>
                      <Slider
                        value={[personaSettings.creativity]}
                        onValueChange={(values) =>
                          updateSettings("creativity", values[0])
                        }
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Verbosity</Label>
                        <span className="text-sm text-muted-foreground">
                          {personaSettings.verbosity}%
                        </span>
                      </div>
                      <Slider
                        value={[personaSettings.verbosity]}
                        onValueChange={(values) =>
                          updateSettings("verbosity", values[0])
                        }
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Formality</Label>
                        <span className="text-sm text-muted-foreground">
                          {personaSettings.formality}%
                        </span>
                      </div>
                      <Slider
                        value={[personaSettings.formality]}
                        onValueChange={(values) =>
                          updateSettings("formality", values[0])
                        }
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="use-emojis">Use Emojis</Label>
                      <Switch
                        id="use-emojis"
                        checked={personaSettings.useEmojis}
                        onCheckedChange={(checked) =>
                          updateSettings("useEmojis", checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                {showComparison && (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className="bg-secondary/10 text-secondary-foreground"
                      >
                        Persona B Settings
                      </Badge>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Tone</Label>
                          <span className="text-sm text-muted-foreground capitalize">
                            {comparisonSettings.tone}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "friendly", label: "Friendly" },
                            { value: "professional", label: "Professional" },
                            { value: "casual", label: "Casual" },
                            { value: "enthusiastic", label: "Enthusiastic" },
                            { value: "educational", label: "Educational" },
                          ].map((tone) => (
                            <Button
                              key={tone.value}
                              variant={
                                comparisonSettings.tone === tone.value
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                updateComparisonSettings("tone", tone.value)
                              }
                              className="text-xs"
                            >
                              {tone.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Creativity</Label>
                          <span className="text-sm text-muted-foreground">
                            {comparisonSettings.creativity}%
                          </span>
                        </div>
                        <Slider
                          value={[comparisonSettings.creativity]}
                          onValueChange={(values) =>
                            updateComparisonSettings("creativity", values[0])
                          }
                          max={100}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Verbosity</Label>
                          <span className="text-sm text-muted-foreground">
                            {comparisonSettings.verbosity}%
                          </span>
                        </div>
                        <Slider
                          value={[comparisonSettings.verbosity]}
                          onValueChange={(values) =>
                            updateComparisonSettings("verbosity", values[0])
                          }
                          max={100}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Formality</Label>
                          <span className="text-sm text-muted-foreground">
                            {comparisonSettings.formality}%
                          </span>
                        </div>
                        <Slider
                          value={[comparisonSettings.formality]}
                          onValueChange={(values) =>
                            updateComparisonSettings("formality", values[0])
                          }
                          max={100}
                          step={1}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="use-emojis-comparison">
                          Use Emojis
                        </Label>
                        <Switch
                          id="use-emojis-comparison"
                          checked={comparisonSettings.useEmojis}
                          onCheckedChange={(checked) =>
                            updateComparisonSettings("useEmojis", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default AIResponseVisualizer;
