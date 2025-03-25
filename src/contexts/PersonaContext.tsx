import React, { createContext, useContext, useState, useEffect } from "react";

export interface PersonaConfig {
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
  customInstructions:
    "Be helpful, concise, and accurate. Provide examples when appropriate.",
};

interface PersonaContextType {
  persona: PersonaConfig;
  setPersona: (persona: PersonaConfig) => void;
  resetPersona: () => void;
  isCustomized: boolean;
  savedPersonas: PersonaConfig[];
  savePersona: (persona: PersonaConfig) => void;
  deletePersona: (personaId: string) => void;
  loadPersona: (personaId: string) => void;
  exportPersona: (personaId: string) => void;
  importPersona: (jsonData: string) => boolean;
  generateShareableLink: (personaId: string) => string;
  importFromShareableLink: (encodedData: string) => boolean;
}

const STORAGE_KEY = "bolt_diy_saved_personas";

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [persona, setPersonaState] = useState<PersonaConfig>(defaultPersona);
  const [isCustomized, setIsCustomized] = useState(false);
  const [savedPersonas, setSavedPersonas] = useState<PersonaConfig[]>([]);

  // Load saved personas from localStorage on initial render
  useEffect(() => {
    const savedPersonasJson = localStorage.getItem(STORAGE_KEY);
    if (savedPersonasJson) {
      try {
        const parsed = JSON.parse(savedPersonasJson);
        setSavedPersonas(parsed);
      } catch (error) {
        console.error("Failed to parse saved personas:", error);
      }
    }
  }, []);

  const setPersona = (newPersona: PersonaConfig) => {
    setPersonaState(newPersona);
    setIsCustomized(true);
  };

  const resetPersona = () => {
    setPersonaState(defaultPersona);
    setIsCustomized(false);
  };

  const savePersona = (personaToSave: PersonaConfig) => {
    // Generate a unique ID if one doesn't exist
    const personaWithId = {
      ...personaToSave,
      id: personaToSave.id || `persona_${Date.now()}`,
    };

    // Check if this persona already exists (by ID)
    const existingIndex = savedPersonas.findIndex(
      (p) => p.id === personaWithId.id,
    );

    let updatedPersonas: PersonaConfig[];
    if (existingIndex >= 0) {
      // Update existing persona
      updatedPersonas = [...savedPersonas];
      updatedPersonas[existingIndex] = personaWithId;
    } else {
      // Add new persona
      updatedPersonas = [...savedPersonas, personaWithId];
    }

    // Update state and localStorage
    setSavedPersonas(updatedPersonas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPersonas));

    // Set as current persona
    setPersonaState(personaWithId);
    setIsCustomized(true);

    return personaWithId.id;
  };

  const deletePersona = (personaId: string) => {
    const updatedPersonas = savedPersonas.filter((p) => p.id !== personaId);
    setSavedPersonas(updatedPersonas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPersonas));
  };

  const loadPersona = (personaId: string) => {
    const personaToLoad = savedPersonas.find((p) => p.id === personaId);
    if (personaToLoad) {
      setPersonaState(personaToLoad);
      setIsCustomized(true);
    }
  };

  const exportPersona = (personaId: string) => {
    const personaToExport =
      personaId === "current"
        ? persona
        : savedPersonas.find((p) => p.id === personaId);

    if (personaToExport) {
      // Create a file with the persona data
      const dataStr = JSON.stringify(personaToExport, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

      // Create a download link and trigger it
      const exportFileDefaultName = `${personaToExport.name.replace(/\s+/g, "_").toLowerCase()}_persona.json`;
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    }
  };

  const importPersona = (jsonData: string): boolean => {
    try {
      const importedPersona = JSON.parse(jsonData) as PersonaConfig;

      // Validate the imported data has required fields
      if (!importedPersona.name || typeof importedPersona.name !== "string") {
        throw new Error("Invalid persona data: missing name");
      }

      // Generate a new ID to avoid conflicts
      const personaWithNewId = {
        ...importedPersona,
        id: `imported_${Date.now()}`,
      };

      // Save the imported persona
      savePersona(personaWithNewId);
      return true;
    } catch (error) {
      console.error("Failed to import persona:", error);
      return false;
    }
  };

  const generateShareableLink = (personaId: string): string => {
    const personaToShare =
      personaId === "current"
        ? persona
        : savedPersonas.find((p) => p.id === personaId);

    if (!personaToShare) {
      throw new Error("Persona not found");
    }

    // Create a copy without the ID to avoid conflicts when importing
    const personaForSharing = { ...personaToShare };
    delete personaForSharing.id;

    // Serialize and encode the persona data
    const jsonData = JSON.stringify(personaForSharing);
    const encodedData = btoa(encodeURIComponent(jsonData));

    // Create the shareable URL with the encoded data
    const baseUrl = window.location.origin;
    return `${baseUrl}?sharedPersona=${encodedData}`;
  };

  const importFromShareableLink = (encodedData: string): boolean => {
    try {
      // Decode the data
      const jsonData = decodeURIComponent(atob(encodedData));

      // Import the persona using the existing method
      return importPersona(jsonData);
    } catch (error) {
      console.error("Failed to import persona from link:", error);
      return false;
    }
  };

  return (
    <PersonaContext.Provider
      value={{
        persona,
        setPersona,
        resetPersona,
        isCustomized,
        savedPersonas,
        savePersona,
        deletePersona,
        loadPersona,
        exportPersona,
        importPersona,
        generateShareableLink,
        importFromShareableLink,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = (): PersonaContextType => {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error("usePersona must be used within a PersonaProvider");
  }
  return context;
};
