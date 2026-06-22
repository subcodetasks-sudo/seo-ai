"use client";

import { createContext, useCallback, useContext, useState } from "react";

import { useRouter } from "@/i18n/navigation";

type AddProjectContextValue = {
  step: number | null;
  startAddProject: () => void;
  nextStep: () => void;
  backStep: () => void;
  exitAddProject: () => void;
  finishAddProject: () => void;
};

const AddProjectContext = createContext<AddProjectContextValue | null>(null);

export function AddProjectProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [step, setStep] = useState<number | null>(null);

  const startAddProject = useCallback(() => {
    setStep(1);
  }, []);

  const nextStep = useCallback(() => {
    setStep((current) => (current !== null && current < 3 ? current + 1 : current));
  }, []);

  const exitAddProject = useCallback(() => {
    setStep(null);
    router.push("/dashboard");
  }, [router]);

  const backStep = useCallback(() => {
    setStep((current) => {
      if (current === null || current <= 1) {
        return null;
      }
      return current - 1;
    });
  }, []);

  const finishAddProject = useCallback(() => {
    setStep(null);
    router.push("/dashboard");
  }, [router]);

  return (
    <AddProjectContext.Provider
      value={{
        step,
        startAddProject,
        nextStep,
        backStep,
        exitAddProject,
        finishAddProject,
      }}
    >
      {children}
    </AddProjectContext.Provider>
  );
}

export function useAddProject() {
  const context = useContext(AddProjectContext);

  if (!context) {
    throw new Error("useAddProject must be used within AddProjectProvider");
  }

  return context;
}
