import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Button from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  File,
  FolderClosed,
  Plus,
  FileText,
  FileCode,
  FileJson as FileJsonIcon,
  FileCog,
  FileType,
  Trash2,
  Copy,
  Edit,
} from "lucide-react";

interface FileData {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
  lastModified: Date;
}

interface FileExplorerProps {
  files: FileData[];
  onSelectFile: (fileId: string) => void;
  onCreateFile: (fileName: string, content?: string) => void;
  onDeleteFile: (fileId: string) => void;
  selectedFileId?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  selectedFileId,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "html":
        return <FileType className="h-4 w-4 mr-2 text-orange-500" />;
      case "css":
        return <FileCog className="h-4 w-4 mr-2 text-blue-500" />;
      case "js":
        return <FileCode className="h-4 w-4 mr-2 text-yellow-500" />;
      case "json":
        return <FileJsonIcon className="h-4 w-4 mr-2 text-green-500" />;
      case "md":
        return <FileText className="h-4 w-4 mr-2 text-gray-500" />;
      default:
        return <File className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onCreateFile(newFileName, newFileContent);
      setNewFileName("");
      setNewFileContent("");
      setIsCreateDialogOpen(false);
    }
  };

  return (
    <>
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-1 mb-2"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New File
        </Button>
      </div>

      <ScrollArea className="h-full">
        <div className="p-2">
          {files.map((file) => (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger>
                <Button
                  variant={selectedFileId === file.id ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start mb-1 ${selectedFileId === file.id ? "bg-secondary" : ""}`}
                  onClick={() => onSelectFile(file.id)}
                >
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </Button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => onSelectFile(file.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Open
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onDeleteFile(file.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(file.content);
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Content
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filename">File Name</Label>
              <Input
                id="filename"
                placeholder="e.g. script.js"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Initial Content (Optional)</Label>
              <textarea
                id="content"
                rows={5}
                className="min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="// Your code here"
                value={newFileContent}
                onChange={(e) => setNewFileContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileExplorer;
