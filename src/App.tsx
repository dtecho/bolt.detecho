import { Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/home";
import Settings from "./pages/Settings";
import { useRoutes } from "react-router-dom";
import * as tempoRoutes from "tempo-routes";
const routes = tempoRoutes.default || tempoRoutes;
import { PersonaProvider, usePersona } from "./contexts/PersonaContext";
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
    <PersonaProvider>
      <AppContent />
    </PersonaProvider>
  );
}

export default App;
