import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import { PersonaProvider } from "./contexts/PersonaContext";

function App() {
  return (
    <PersonaProvider>
      <Suspense fallback={<p>Loading...</p>}>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add this line to allow Tempo to capture routes before any catchall */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<></>} />
          )}
        </Routes>
      </Suspense>
    </PersonaProvider>
  );
}

export default App;
