import React, { useState, useEffect } from "react";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import FileExplorer from "./FileExplorer";
import Terminal from "./Terminal";
import { Button } from "@/components/ui/button";
import {
  Save,
  Play,
  FileCode,
  Terminal as TerminalIcon,
  FolderTree,
} from "lucide-react";

interface DevEnvironmentProps {
  className?: string;
}

interface FileData {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
  lastModified: Date;
}

const getLanguageExtension = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return javascript({ jsx: true });
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    default:
      return javascript();
  }
};

const DevEnvironment: React.FC<DevEnvironmentProps> = ({ className = "" }) => {
  const [files, setFiles] = useState<FileData[]>([
    {
      id: "1",
      name: "index.html",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app">
    <h1>Hello, World!</h1>
    <p>Welcome to my project</p>
    <button id="btn">Click me</button>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      language: "html",
      path: "/",
      lastModified: new Date(),
    },
    {
      id: "2",
      name: "styles.css",
      content: `body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #0066cc;
}

button {
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0052a3;
}`,
      language: "css",
      path: "/",
      lastModified: new Date(),
    },
    {
      id: "3",
      name: "app.js",
      content: `// Main application code
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn');
  
  btn.addEventListener('click', () => {
    alert('Button clicked!');
  });
  
  console.log('Application initialized');
});

// Helper functions
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}`,
      language: "javascript",
      path: "/",
      lastModified: new Date(),
    },
    {
      id: "4",
      name: "config.json",
      content: `{
  "appName": "My Project",
  "version": "1.0.0",
  "description": "A simple web project",
  "author": "Bolt.DIY User",
  "settings": {
    "theme": "light",
    "fontSize": 14,
    "showLineNumbers": true,
    "autoSave": true
  }
}`,
      language: "json",
      path: "/",
      lastModified: new Date(),
    },
  ]);

  const [currentFile, setCurrentFile] = useState<FileData | null>(files[0]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to Bolt.DIY Terminal",
    "Type 'help' to see available commands",
  ]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [activePanel, setActivePanel] = useState<"editor" | "terminal">(
    "editor",
  );
  const { toast } = useToast();

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const handleFileSelect = (fileId: string) => {
    const selectedFile = files.find((file) => file.id === fileId);
    if (selectedFile) {
      setCurrentFile(selectedFile);
      setActivePanel("editor");
    }
  };

  const handleFileChange = (content: string) => {
    if (currentFile) {
      const updatedFile = { ...currentFile, content, lastModified: new Date() };
      setCurrentFile(updatedFile);
      setFiles(
        files.map((file) => (file.id === currentFile.id ? updatedFile : file)),
      );
    }
  };

  const handleSaveFile = () => {
    if (currentFile) {
      toast({
        title: "File saved",
        description: `${currentFile.name} has been saved successfully.`,
        duration: 3000,
      });
    }
  };

  const handleRunCode = () => {
    if (currentFile) {
      setActivePanel("terminal");
      setTerminalOutput((prev) => [
        ...prev,
        `> Running ${currentFile.name}...`,
        `[${new Date().toLocaleTimeString()}] Execution started`,
      ]);

      // Simulate execution delay
      setTimeout(() => {
        if (currentFile.name.endsWith(".js")) {
          setTerminalOutput((prev) => [
            ...prev,
            "Application initialized",
            "[LOG] Button event listener attached",
            `[${new Date().toLocaleTimeString()}] Execution completed successfully`,
          ]);
        } else if (currentFile.name.endsWith(".html")) {
          setTerminalOutput((prev) => [
            ...prev,
            "Rendering HTML...",
            "DOM loaded successfully",
            `[${new Date().toLocaleTimeString()}] Page rendered in 42ms`,
          ]);
        } else {
          setTerminalOutput((prev) => [
            ...prev,
            `File ${currentFile.name} executed`,
            `[${new Date().toLocaleTimeString()}] Execution completed`,
          ]);
        }
      }, 1000);
    }
  };

  const handleTerminalCommand = (command: string) => {
    const commandParts = command.trim().split(" ");
    const mainCommand = commandParts[0].toLowerCase();
    const args = commandParts.slice(1);

    setTerminalOutput((prev) => [...prev, `$ ${command}`]);

    switch (mainCommand) {
      case "help":
        setTerminalOutput((prev) => [
          ...prev,
          "Available commands:",
          "  help - Show this help message",
          "  ls - List files in the current directory",
          "  cat [filename] - Display file contents",
          "  clear - Clear the terminal",
          "  run [filename] - Run a file",
          "  echo [text] - Display text",
          "  date - Show current date and time",
        ]);
        break;

      case "ls":
        setTerminalOutput((prev) => [
          ...prev,
          "Files in current directory:",
          ...files.map((file) => `  ${file.name}`),
        ]);
        break;

      case "cat":
        if (args.length === 0) {
          setTerminalOutput((prev) => [...prev, "Error: Missing filename"]);
        } else {
          const fileName = args[0];
          const file = files.find((f) => f.name === fileName);
          if (file) {
            setTerminalOutput((prev) => [
              ...prev,
              `Contents of ${fileName}:`,
              "------------------------",
              file.content,
              "------------------------",
            ]);
          } else {
            setTerminalOutput((prev) => [
              ...prev,
              `Error: File '${fileName}' not found`,
            ]);
          }
        }
        break;

      case "clear":
        setTerminalOutput([]);
        break;

      case "run":
        if (args.length === 0) {
          setTerminalOutput((prev) => [...prev, "Error: Missing filename"]);
        } else {
          const fileName = args[0];
          const file = files.find((f) => f.name === fileName);
          if (file) {
            setTerminalOutput((prev) => [
              ...prev,
              `Running ${fileName}...`,
              `[${new Date().toLocaleTimeString()}] Execution started`,
            ]);

            setTimeout(() => {
              if (fileName.endsWith(".js")) {
                setTerminalOutput((prev) => [
                  ...prev,
                  "Application initialized",
                  "[LOG] Button event listener attached",
                  `[${new Date().toLocaleTimeString()}] Execution completed successfully`,
                ]);
              } else {
                setTerminalOutput((prev) => [
                  ...prev,
                  `File ${fileName} executed`,
                  `[${new Date().toLocaleTimeString()}] Execution completed`,
                ]);
              }
            }, 1000);
          } else {
            setTerminalOutput((prev) => [
              ...prev,
              `Error: File '${fileName}' not found`,
            ]);
          }
        }
        break;

      case "echo":
        setTerminalOutput((prev) => [...prev, args.join(" ")]);
        break;

      case "date":
        setTerminalOutput((prev) => [...prev, new Date().toLocaleString()]);
        break;

      default:
        setTerminalOutput((prev) => [
          ...prev,
          `Command not found: ${mainCommand}`,
          "Type 'help' to see available commands",
        ]);
    }
  };

  const handleCreateFile = (fileName: string, content: string = "") => {
    const fileExtension = fileName.split(".").pop() || "";
    let language = "javascript";

    if (fileExtension === "html") language = "html";
    else if (fileExtension === "css") language = "css";
    else if (fileExtension === "json") language = "json";

    const newFile: FileData = {
      id: Date.now().toString(),
      name: fileName,
      content,
      language,
      path: "/",
      lastModified: new Date(),
    };

    setFiles([...files, newFile]);
    setCurrentFile(newFile);
    setActivePanel("editor");

    toast({
      title: "File created",
      description: `${fileName} has been created successfully.`,
      duration: 3000,
    });
  };

  const handleDeleteFile = (fileId: string) => {
    const fileToDelete = files.find((file) => file.id === fileId);
    if (!fileToDelete) return;

    const updatedFiles = files.filter((file) => file.id !== fileId);
    setFiles(updatedFiles);

    if (currentFile && currentFile.id === fileId) {
      setCurrentFile(updatedFiles.length > 0 ? updatedFiles[0] : null);
    }

    toast({
      title: "File deleted",
      description: `${fileToDelete.name} has been deleted.`,
      duration: 3000,
    });
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FileCode className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">Development Environment</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveFile}
            disabled={!currentFile}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunCode}
            disabled={!currentFile}
            className="gap-1"
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
        </div>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 rounded-lg border"
      >
        {/* File Explorer Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full flex flex-col">
            <div className="p-3 border-b">
              <div className="flex items-center">
                <FolderTree className="h-4 w-4 mr-2 text-primary" />
                <h3 className="text-sm font-medium">Files</h3>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <FileExplorer
                files={files}
                onSelectFile={handleFileSelect}
                onCreateFile={handleCreateFile}
                onDeleteFile={handleDeleteFile}
                selectedFileId={currentFile?.id}
              />
            </div>
          </div>
        </ResizablePanel>

        {/* Editor/Terminal Panel */}
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            {/* Editor Panel */}
            <ResizablePanel defaultSize={70} minSize={30}>
              <Card className="h-full flex flex-col border-0 rounded-none">
                <div className="p-3 border-b">
                  <Tabs
                    value={activePanel}
                    onValueChange={(value) =>
                      setActivePanel(value as "editor" | "terminal")
                    }
                  >
                    <TabsList>
                      <TabsTrigger value="editor" className="gap-1">
                        <FileCode className="h-4 w-4" />
                        Editor {currentFile ? `- ${currentFile.name}` : ""}
                      </TabsTrigger>
                      <TabsTrigger value="terminal" className="gap-1">
                        <TerminalIcon className="h-4 w-4" />
                        Terminal
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <TabsContent
                    value="editor"
                    className="h-full m-0 p-0 data-[state=active]:flex flex-col"
                  >
                    {currentFile ? (
                      <CodeMirror
                        value={currentFile.content}
                        height="100%"
                        theme={isDarkMode ? vscodeDark : undefined}
                        extensions={[getLanguageExtension(currentFile.name)]}
                        onChange={handleFileChange}
                        className="h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No file selected
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent
                    value="terminal"
                    className="h-full m-0 p-0 data-[state=active]:flex flex-col"
                  >
                    <Terminal
                      output={terminalOutput}
                      onCommand={handleTerminalCommand}
                    />
                  </TabsContent>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DevEnvironment;
