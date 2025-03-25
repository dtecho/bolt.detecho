import React, { createContext, useContext, useState, useEffect } from "react";

export interface PersonaVersion {
  timestamp: number;
  data: Omit<PersonaConfig, "versions" | "id">;
  notes?: string;
}

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
  lastModified?: number;
  versionNumber?: number;
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
  savePersona: (persona: PersonaConfig) => string;
  deletePersona: (personaId: string) => void;
  loadPersona: (personaId: string) => void;
  exportPersona: (personaId: string) => void;
  importPersona: (jsonData: string) => boolean;
  generateShareableLink: (personaId: string) => string;
  importFromShareableLink: (encodedData: string) => boolean;
  getPersonaVersions: (personaId: string) => PersonaVersion[];
  savePersonaVersion: (personaId: string, notes?: string) => void;
  restorePersonaVersion: (personaId: string, timestamp: number) => void;
  deletePersonaVersion: (personaId: string, timestamp: number) => void;
}

const STORAGE_KEY = "bolt_diy_saved_personas";
const VERSION_STORAGE_KEY = "bolt_diy_persona_versions";
const MAX_VERSIONS_PER_PERSONA = 20;

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [persona, setPersonaState] = useState<PersonaConfig>(defaultPersona);
  const [isCustomized, setIsCustomized] = useState(false);
  const [savedPersonas, setSavedPersonas] = useState<PersonaConfig[]>([]);
  const [personaVersions, setPersonaVersions] = useState<
    Record<string, PersonaVersion[]>
  >({});

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

    // Load version histories
    const versionsJson = localStorage.getItem(VERSION_STORAGE_KEY);
    if (versionsJson) {
      try {
        const parsed = JSON.parse(versionsJson);
        setPersonaVersions(parsed);
      } catch (error) {
        console.error("Failed to parse persona versions:", error);
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
    const now = Date.now();
    // Generate a unique ID if one doesn't exist
    const personaWithId = {
      ...personaToSave,
      id: personaToSave.id || `persona_${now}`,
      lastModified: now,
      versionNumber: (personaToSave.versionNumber || 0) + 1,
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

      // Automatically create a version when updating an existing persona
      savePersonaVersion(personaWithId.id || "");
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

    return personaWithId.id || "";
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

  // Get all versions for a specific persona
  const getPersonaVersions = (personaId: string): PersonaVersion[] => {
    return personaVersions[personaId] || [];
  };

  // Save the current state of a persona as a new version
  const savePersonaVersion = (personaId: string, notes?: string) => {
    if (!personaId) return;

    const personaToVersion = savedPersonas.find((p) => p.id === personaId);
    if (!personaToVersion) return;

    // Create a version object without the ID and version-specific fields
    const { id, lastModified, versionNumber, ...versionData } =
      personaToVersion;

    const newVersion: PersonaVersion = {
      timestamp: Date.now(),
      data: versionData,
      notes,
    };

    // Get existing versions or initialize empty array
    const existingVersions = personaVersions[personaId] || [];

    // Add new version at the beginning (newest first)
    let updatedVersions = [newVersion, ...existingVersions];

    // Limit the number of versions stored
    if (updatedVersions.length > MAX_VERSIONS_PER_PERSONA) {
      updatedVersions = updatedVersions.slice(0, MAX_VERSIONS_PER_PERSONA);
    }

    // Update state and localStorage
    const newVersions = { ...personaVersions, [personaId]: updatedVersions };
    setPersonaVersions(newVersions);
    localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(newVersions));
  };

  // Restore a persona to a previous version
  const restorePersonaVersion = (personaId: string, timestamp: number) => {
    const versions = personaVersions[personaId] || [];
    const versionToRestore = versions.find((v) => v.timestamp === timestamp);

    if (!versionToRestore) return;

    // Find the current persona
    const currentPersona = savedPersonas.find((p) => p.id === personaId);
    if (!currentPersona) return;

    // Create a new persona object with the version data but keep the ID
    const restoredPersona: PersonaConfig = {
      ...versionToRestore.data,
      id: personaId,
      lastModified: Date.now(),
      versionNumber: (currentPersona.versionNumber || 0) + 1,
    };

    // Save the restored persona
    savePersona(restoredPersona);

    // If this is the currently active persona, update it
    if (persona.id === personaId) {
      setPersonaState(restoredPersona);
    }
  };

  // Delete a specific version
  const deletePersonaVersion = (personaId: string, timestamp: number) => {
    const versions = personaVersions[personaId] || [];
    if (versions.length === 0) return;

    // Filter out the version to delete
    const updatedVersions = versions.filter((v) => v.timestamp !== timestamp);

    // Update state and localStorage
    const newVersions = { ...personaVersions, [personaId]: updatedVersions };
    setPersonaVersions(newVersions);
    localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(newVersions));
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
        getPersonaVersions,
        savePersonaVersion,
        restorePersonaVersion,
        deletePersonaVersion,
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
