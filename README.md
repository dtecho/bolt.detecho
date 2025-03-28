# Bolt.DIY - AI Assistant Customization Platform

## Overview
Bolt.DIY is a powerful platform that allows users to create, customize, and interact with AI assistants. The platform features an intuitive interface for modifying AI personas, a code editor with real-time AI assistance, a comprehensive development environment, and a feature-rich chat interface with markdown support.

## Key Features

### Persona Editor
- Customize AI assistant tone, knowledge domains, and response style
- Choose from preset personas (Helpful Tutor, Code Reviewer, Brainstorm Partner)
- Save and manage custom persona configurations
- Real-time preview of persona changes in the chat interface
- Import/export functionality for sharing personas
- Persona sharing via shareable links
- Detailed customization options for verbosity, creativity, and formality
- Knowledge domain selection with priority ordering

### Code Editor
- Integrated CodeMirror editor with syntax highlighting for multiple languages
- Real-time AI code assistance and suggestions
- Code execution capabilities directly in the browser
- Download and copy functionality for code snippets
- Split-pane layout with code editor and chat interface
- Automatic code analysis with improvement suggestions
- Code refactoring recommendations
- Syntax highlighting for JavaScript, TypeScript, HTML, CSS, and JSON

### Development Environment
- Integrated terminal with command history and common operations
- File explorer for navigating project structure
- File creation, editing, and deletion capabilities
- Code execution and preview
- Multiple file type support (HTML, CSS, JavaScript, JSON)
- Seamless integration with the chat interface for AI assistance
- Split-pane layout for simultaneous file editing and terminal use

### Chat Interface
- Markdown and syntax highlighting support
- Message history with clear conversation threading
- Responsive design that works across devices
- Real-time AI responses based on selected persona
- AI response visualization for better understanding
- Code snippet support with syntax highlighting
- Voice input capabilities for hands-free interaction
- Ability to send code from editor to chat for analysis

### Theme Customization
- Light/dark mode toggle with system preference detection
- Accent color selection
- Font size adjustment
- Persistent theme settings via local storage
- Consistent theming across all components

### AI Response Visualization
- Visual representation of AI thought processes
- Step-by-step reasoning display
- Confidence level indicators for responses
- Interactive elements to explore AI decision paths
- Toggle between simplified and detailed explanations

### Keyboard Shortcuts
- Comprehensive keyboard shortcut system
- Customizable key bindings
- Shortcut overlay/help dialog
- Context-sensitive shortcuts for different tools
- Efficiency-focused navigation options

### Version History
- Track changes to personas over time
- Restore previous persona configurations
- Compare different versions side by side
- Automatic periodic saving of changes
- Manual version saving with annotations

### Collaborative Features
- Real-time collaboration indicators
- Shared editing capabilities
- Persona sharing between team members
- Version control for collaborative work
- Team-based knowledge domain management

## Development

### Getting Started
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Built With
- React + TypeScript + Vite
- Tailwind CSS for styling
- Shadcn UI components
- CodeMirror for code editing
- React Router for navigation
- Supabase for backend services
- React Resizable Panels for flexible layouts
- React Markdown for rendering markdown content
- Lucide React for consistent iconography
- React Syntax Highlighter for code formatting
- Framer Motion for smooth animations and transitions

### Project Structure
- `/src/components` - UI components organized by feature
  - `/chat` - Chat interface components (MessageHistory, MessageInput, ChatInterface, VoiceInput)
  - `/dev-environment` - Development environment components (Terminal, FileExplorer, DevEnvironment)
  - `/editor` - Code editor components (CodeEditorChat, CollaborativeIndicator)
  - `/sidebar` - Sidebar and persona management components (PersonaEditor, PersonaPresets, ThemeSettings)
  - `/ui` - Reusable UI components based on Shadcn UI
  - `/visualization` - AI response visualization components (AIResponseVisualizer)
  - `/playground` - Testing and demonstration components (PersonaTestingPlayground)
  - `/layout` - Layout components for consistent page structure
- `/src/contexts` - React context providers (PersonaContext)
- `/src/hooks` - Custom React hooks (useTheme, useKeyboardShortcuts)
- `/src/lib` - Utility functions and helpers (themeUtils, utils)
- `/src/pages` - Main application pages/routes (Dashboard, Settings)
- `/src/types` - TypeScript type definitions
- `/src/stories` - Component stories for documentation and testing

## Routes
- `/` - Home page with overview of features and quick access to main tools
- `/dashboard` - Main dashboard with persona management and chat interface
- `/settings` - Application settings for theme, keyboard shortcuts, and preferences
- `/code-editor` - CodeMirror editor with AI assistance for code development
- `/persona-testing` - Playground for testing persona configurations
- `/dev-environment` - Development environment with terminal and file explorer

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
