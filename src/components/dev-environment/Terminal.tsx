import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { usePersona } from "@/contexts/PersonaContext";

interface TerminalProps {
  output: string[];
  onCommand: (command: string) => void;
  onSendToChat?: (output: string[]) => void;
  onCodeExecution?: (code: string) => void;
  currentCode?: string;
}

const Terminal: React.FC<TerminalProps> = ({
  output,
  onCommand,
  onSendToChat,
  onCodeExecution,
  currentCode,
}) => {
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [output]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { persona } = usePersona();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      // Special commands for integration with chat and editor
      if (command.startsWith("chat ")) {
        const message = command.substring(5).trim();
        if (message && onSendToChat) {
          onSendToChat([`User sent message to chat: ${message}`]);
        }
      } else if (command === "run" && currentCode && onCodeExecution) {
        onCodeExecution(currentCode);
      } else if (command === "help") {
        // Enhanced help command with AI assistant integration info
        onCommand(command);
        setTimeout(() => {
          const aiHelpOutput = [
            "AI Assistant Integration:",
            "  chat [message] - Send a message to the AI assistant",
            "  run - Execute the current code in the editor",
            "  explain - Ask the AI to explain the current code",
            "  improve - Ask the AI for code improvement suggestions",
            `  persona - Show current AI persona (${persona.name})`,
          ];
          onCommand("ai-help", aiHelpOutput);
        }, 100);
      } else if (command === "persona" && onSendToChat) {
        onSendToChat([
          `Current AI Persona: ${persona.name}`,
          `Description: ${persona.description}`,
          `Tone: ${persona.tone}`,
        ]);
      } else if (command === "explain" && currentCode && onSendToChat) {
        onSendToChat([`User requested code explanation. Analyzing code...`]);
        // In a real implementation, this would trigger the AI to analyze the code
      } else if (command === "improve" && currentCode && onSendToChat) {
        onSendToChat([`User requested code improvements. Analyzing code...`]);
        // In a real implementation, this would trigger the AI to suggest improvements
      } else {
        // Regular command handling
        onCommand(command);
      }

      setCommandHistory((prev) => [...prev, command]);
      setCommand("");
      setHistoryIndex(-1);
    }
  };

  // Add command completion for AI-related commands
  const aiCommands = ["chat", "run", "explain", "improve", "persona"];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle up arrow for command history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (
        commandHistory.length > 0 &&
        historyIndex < commandHistory.length - 1
      ) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }
    // Handle down arrow for command history
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("");
      }
    }
    // Handle tab for auto-completion (simple implementation)
    else if (e.key === "Tab") {
      e.preventDefault();
      const commonCommands = [
        "help",
        "ls",
        "cat",
        "clear",
        "run",
        "echo",
        "date",
        "chat",
        "explain",
        "improve",
        "persona",
      ];
      const matchingCommands = commonCommands.filter((cmd) =>
        cmd.startsWith(command),
      );

      if (matchingCommands.length === 1) {
        setCommand(matchingCommands[0]);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono text-sm p-2">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-2 whitespace-pre-wrap">
          {output.map((line, index) => (
            <div key={index} className="mb-1">
              {line}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="mt-2 flex items-center">
        <span className="mr-2">$</span>
        <Input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none text-green-400 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-green-700"
          placeholder="Type a command..."
        />
      </form>
    </div>
  );
};

export default Terminal;
