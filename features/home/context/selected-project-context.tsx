"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type SelectedProjectContextType = {
  selectedProjectId: string | null;
  setSelectedProjectId: (projectId: string | null) => void;
  clearSelectedProject: () => void;
};

const SelectedProjectContext = createContext<SelectedProjectContextType | undefined>(undefined);

const STORAGE_KEY = "selectedProjectId";

export function SelectedProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProjectId, setSelectedProjectIdState] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSelectedProjectIdState(stored);
    }
  }, []);

  const handleSetProjectId = (projectId: string | null) => {
    setSelectedProjectIdState(projectId);
    if (projectId) {
      localStorage.setItem(STORAGE_KEY, projectId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleClearProject = () => {
    setSelectedProjectIdState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SelectedProjectContext.Provider
      value={{
        selectedProjectId: isMounted ? selectedProjectId : null,
        setSelectedProjectId: handleSetProjectId,
        clearSelectedProject: handleClearProject,
      }}
    >
      {children}
    </SelectedProjectContext.Provider>
  );
}

export function useSelectedProject() {
  const context = useContext(SelectedProjectContext);
  if (context === undefined) {
    throw new Error("useSelectedProject must be used within SelectedProjectProvider");
  }
  return context;
}
