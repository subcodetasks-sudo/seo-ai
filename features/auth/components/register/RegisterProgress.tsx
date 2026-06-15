"use client";

import { Fragment } from "react";
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
  className?: string;
};

function StepConnector({ completed }: { completed: boolean }) {
  return (
    <div
      className={cn(
        "mt-5 h-px min-w-4 flex-1 sm:min-w-8",
        completed ? "bg-success-200" : "bg-neutral-200 border-2 border-neutral-200"
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

export function RegisterProgress({ currentStep, className }: RegisterProgressProps) {
  const t = useTranslations("auth.verify.steps");

  function stepStatus(step: number): StepCircleProps["status"] {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "active";
    return "pending";
  }

  return (
    <nav
      aria-label={t("label")}
      className={cn("w-full", className)}
    >
      <ol className="flex w-full items-start">
        {STEPS.map((step, index) => (
          <Fragment key={step.id}>
            {index > 0 ? (
              <StepConnector completed={currentStep > index} />
            ) : null}
            <li className="flex min-w-0 flex-1 flex-col items-center gap-2 px-1 last:flex-none">
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
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
