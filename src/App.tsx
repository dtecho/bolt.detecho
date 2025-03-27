import React, { Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/home";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import { useRoutes } from "react-router-dom";
import * as tempoRoutes from "tempo-routes";
// Fix for Tempo routes - ensure we're getting a valid component
const routes = (() => {
  if (
    typeof tempoRoutes.default === "function" ||
    React.isValidElement(tempoRoutes.default)
  ) {
    return tempoRoutes.default;
  }
  if (Array.isArray(tempoRoutes.default)) {
    return tempoRoutes.default;
  }
  if (typeof tempoRoutes === "function" || React.isValidElement(tempoRoutes)) {
    return tempoRoutes;
  }
  if (Array.isArray(tempoRoutes)) {
    return tempoRoutes;
  }
  return [];
})();
import { PersonaProvider, usePersona } from "./contexts/PersonaContext";
import ErrorBoundary from "./components/ui/error-boundary";
import { useToast } from "./components/ui/use-toast";
import CodeEditorChat from "./components/editor/CodeEditorChat";
import PersonaTestingPlayground from "./components/playground/PersonaTestingPlayground";
import DevEnvironmentChat from "./components/dev-environment/DevEnvironmentChat";

function AppContent() {
  const location = useLocation();
  const { importFromShareableLink } = usePersona();
  const { toast } = useToast();

  useEffect(() => {
    // Check for shared persona in URL
    const params = new URLSearchParams(location.search);
    const sharedPersona = params.get("sharedPersona");

    if (sharedPersona) {
      try {
        const success = importFromShareableLink(sharedPersona);
        if (success) {
          toast({
            title: "Persona Imported",
            description: "The shared persona has been successfully imported.",
            duration: 5000,
          });

          // Remove the parameter from URL to avoid reimporting on refresh
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        } else {
          toast({
            title: "Import Failed",
            description:
              "Could not import the shared persona. The link may be invalid.",
            variant: "destructive",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error importing shared persona:", error);
        toast({
          title: "Import Error",
          description: "An error occurred while importing the shared persona.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  }, [location, importFromShareableLink, toast]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/code-editor" element={<CodeEditorChat />} />
        <Route
          path="/persona-testing"
          element={<PersonaTestingPlayground className="h-screen p-6" />}
        />
        <Route path="/dev-environment" element={<DevEnvironmentChat />} />
        {/* Add this line to allow Tempo to capture routes before any catchall */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<></>} />
        )}
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary
      onError={(error) => {
        console.error("App Error:", error);
      }}
    >
      <PersonaProvider>
        <AppContent />
      </PersonaProvider>
    </ErrorBoundary>
  );
}

export { App };
export default App;
