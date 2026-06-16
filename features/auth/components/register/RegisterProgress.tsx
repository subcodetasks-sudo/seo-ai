"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, labelKey: "createAccount" as const },
  { id: 2, labelKey: "verifyEmail" as const },
  { id: 3, labelKey: "finish" as const },
];

type RegisterProgressProps = {
  currentStep: 1 | 2 | 3;
  /** When true on step 3, all steps render as completed (success screen). */
  isComplete?: boolean;
  className?: string;
};

function StepConnector({ completed }: { completed: boolean }) {
  return (
    <div
      className={cn(
        "h-px w-full self-center",
        completed ? "bg-success-200" : "bg-neutral-200"
      )}
      aria-hidden
    />
  );
}

type StepCircleProps = {
  step: number;
  status: "completed" | "active" | "pending";
};

function StepCircle({ step, status }: StepCircleProps) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors sm:size-10",
        status === "completed" && "bg-success-200 text-white",
        status === "active" && "bg-primary-300 text-white",
        status === "pending" &&
          "border-2 border-neutral-200 bg-white text-neutral-400"
      )}
      aria-current={status === "active" ? "step" : undefined}
    >
      {status === "completed" ? (
        <Check className="size-4 sm:size-5" strokeWidth={2.5} aria-hidden />
      ) : (
        step
      )}
    </div>
  );
}

export function RegisterProgress({
  currentStep,
  isComplete = false,
  className,
}: RegisterProgressProps) {
  const t = useTranslations("auth.verify.steps");

  function stepStatus(step: number): StepCircleProps["status"] {
    if (isComplete && currentStep === 3 && step === 3) return "completed";
    if (step < currentStep) return "completed";
    if (step === currentStep) return "active";
    return "pending";
  }

  return (
    <nav
      aria-label={t("label")}
      className={cn("relative w-full", className)}
    >
      <div
        className="pointer-events-none absolute inset-x-[16.666%] top-4.5 grid grid-cols-2 sm:top-5"
        aria-hidden
      >
        <StepConnector completed={currentStep > 1} />
        <StepConnector completed={currentStep > 2} />
      </div>

      <ol className="relative grid w-full grid-cols-3">
        {STEPS.map((step) => (
          <li
            key={step.id}
            className="flex flex-col items-center gap-2 px-1"
          >
            <StepCircle step={step.id} status={stepStatus(step.id)} />
            <span
              className={cn(
                "max-w-24 text-center text-label-sm leading-tight sm:max-w-none",
                stepStatus(step.id) === "pending"
                  ? "text-neutral-400"
                  : "text-secondary-500"
              )}
            >
              {t(step.labelKey)}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
