import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { usePersona } from "@/contexts/PersonaContext";
import PersonaEditor from "@/components/sidebar/PersonaEditor";
import { Code, MessageSquare, Settings, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BoltDIYWorkbench = () => {
  const [activeTab, setActiveTab] = useState<string>("chat");
  const { persona } = usePersona();

  return (
    <div className="flex flex-col w-full h-full bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Bolt.DIY Workbench</h1>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-primary/10 text-primary text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Active Persona: {persona.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Currently using the {persona.name} persona</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={25}
            minSize={20}
            maxSize={40}
            className="border-r"
          >
            <Tabs defaultValue="persona" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="persona">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <Sparkles className="h-4 w-4" />
                          <span className="hidden sm:inline">Persona</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Customize AI assistant behavior</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <Settings className="h-4 w-4" />
                          <span className="hidden sm:inline">Settings</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Configure workbench settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsTrigger>
                <TabsTrigger value="tools">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                          <Code className="h-4 w-4" />
                          <span className="hidden sm:inline">Tools</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Access development tools</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="persona"
                className="p-0 h-[calc(100vh-8rem)] overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <PersonaEditor />
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent
                value="settings"
                className="p-4 h-[calc(100vh-8rem)] overflow-auto"
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Workbench Settings
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Configure your Bolt.DIY workbench environment
                        preferences.
                      </p>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Theme</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="border rounded-md p-2 cursor-pointer hover:bg-accent">
                            <div className="h-20 bg-background border rounded-md mb-2"></div>
                            <p className="text-xs text-center">Light</p>
                          </div>
                          <div className="border rounded-md p-2 cursor-pointer hover:bg-accent">
                            <div className="h-20 bg-slate-900 border rounded-md mb-2"></div>
                            <p className="text-xs text-center">Dark</p>
                          </div>
                          <div className="border rounded-md p-2 cursor-pointer hover:bg-accent">
                            <div className="h-20 bg-gradient-to-b from-background to-slate-900 border rounded-md mb-2"></div>
                            <p className="text-xs text-center">System</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent
                value="tools"
                className="p-4 h-[calc(100vh-8rem)] overflow-auto"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Code className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-sm font-medium">Code Editor</h3>
                        <p className="text-xs text-muted-foreground text-center">
                          Edit code with AI assistance
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-3 rounded-full bg-primary/10">
                          <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-sm font-medium">Chat Interface</h3>
                        <p className="text-xs text-muted-foreground text-center">
                          Interact with your AI assistant
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full h-full"
            >
              <div className="border-b">
                <TabsList className="w-full h-12 bg-transparent justify-start px-4">
                  <TabsTrigger
                    value="chat"
                    className="data-[state=active]:bg-background"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="data-[state=active]:bg-background"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Code
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent
                value="chat"
                className="p-0 h-[calc(100vh-8rem)] flex flex-col"
              >
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  <div className="flex items-start gap-3 max-w-3xl mx-auto">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted p-4 rounded-lg rounded-tl-none">
                      <p className="text-sm">
                        Hello! I'm your {persona.name}. How can I assist you
                        today?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 max-w-3xl mx-auto">
                    <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">You</span>
                    </div>
                    <div className="bg-secondary/10 p-4 rounded-lg rounded-tl-none">
                      <p className="text-sm">
                        I'd like to create a new persona for my project.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 max-w-3xl mx-auto">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted p-4 rounded-lg rounded-tl-none">
                      <p className="text-sm">
                        Great! You can create a new persona using the Persona
                        Editor in the sidebar. Here's how to get started:
                      </p>
                      <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                        <li>Navigate to the Persona tab in the sidebar</li>
                        <li>Click on "Save As New" to create a new persona</li>
                        <li>
                          Customize the name, description, tone, and other
                          attributes
                        </li>
                        <li>
                          Add knowledge domains to specify areas of expertise
                        </li>
                        <li>
                          Adjust response style settings to match your
                          preferences
                        </li>
                        <li>Click "Apply" to start using your new persona</li>
                      </ol>
                      <p className="text-sm mt-2">
                        Would you like me to guide you through creating a
                        specific type of persona?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t p-4">
                  <div className="max-w-3xl mx-auto">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80">
                        <Sparkles className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="code"
                className="p-0 h-[calc(100vh-8rem)] flex flex-col"
              >
                <div className="flex-1 overflow-auto p-4">
                  <div className="max-w-3xl mx-auto">
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                        <span className="text-sm font-medium">
                          persona-config.ts
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className="text-muted-foreground hover:text-foreground">
                            <Code className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 text-sm overflow-auto bg-slate-950 text-slate-50 dark:bg-slate-950 dark:text-slate-50">
                        <code>{`export interface PersonaConfig {
  id?: string;
  name: string;
  description: string;
  tone: string;
  knowledgeDomains: string[];
  responseStyle: string;
  verbosity: number;
  creativity: number;
  formality: number;
  useEmojis: boolean;
  useCodeExamples: boolean;
  customInstructions: string;
}

export const defaultPersona: PersonaConfig = {
  name: "Helpful Assistant",
  description: "A friendly and knowledgeable AI assistant",
  tone: "friendly",
  knowledgeDomains: ["general", "technology"],
  responseStyle: "balanced",
  verbosity: 50,
  creativity: 70,
  formality: 40,
  useEmojis: true,
  useCodeExamples: true,
  customInstructions: "Be helpful, concise, and accurate.",
};`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default BoltDIYWorkbench;
