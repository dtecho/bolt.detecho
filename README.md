# Bolt.DIY - AI Assistant Customization Platform

## Overview
Bolt.DIY is a powerful platform that allows users to create, customize, and interact with AI assistants. The platform features an intuitive interface for modifying AI personas, a code editor with real-time AI assistance, and a comprehensive chat interface with markdown support.

## Key Features

### Persona Editor
- Customize AI assistant tone, knowledge domains, and response style
- Choose from preset personas (Helpful Tutor, Code Reviewer, Brainstorm Partner)
- Save and manage custom persona configurations
- Real-time preview of persona changes in the chat interface

### Code Editor
- Integrated CodeMirror editor with syntax highlighting
- Support for multiple programming languages
- Real-time AI code assistance and suggestions
- Code execution capabilities directly in the browser
- Download and copy functionality for code snippets

### Chat Interface
- Markdown and syntax highlighting support
- Message history with clear conversation threading
- Responsive design that works across devices
- Real-time AI responses based on selected persona

### Theme Customization
- Light/dark mode toggle
- Accent color selection
- Font size adjustment
- Persistent theme settings via local storage

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

### Project Structure
- `/src/components` - UI components organized by feature
- `/src/contexts` - React context providers
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and helpers
- `/src/pages` - Main application pages/routes
- `/src/types` - TypeScript type definitions

## License
This project is licensed under the MIT License - see the LICENSE file for details.
