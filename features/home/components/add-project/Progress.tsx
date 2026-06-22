"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/components/ui/direction";

interface ProgressProps {
  currentStep: number; // 1, 2, or 3
}

export default function Progress({ currentStep }: ProgressProps) {
  const dir = useDirection();
  const t = useTranslations("home.addProject.progress");
  
  const steps = [
    {
      id: 1,
      label: t("step1"),
    },
    {
      id: 2,
      label: t("step2"),
    },
    {
      id: 3,
      label: t("step3"),
    },
  ];

  return (
    <div className="relative grid grid-cols-3 w-full max-w-[600px]" dir={dir}>
      {/* Background/Progress Connector Line */}
      <div className="absolute top-[18px] left-[16.67%] right-[16.67%] h-[2px] -translate-y-1/2 bg-neutral-200" />

      {/* Steps Wrapper */}
      {steps.map((step) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isUpcoming = currentStep < step.id;

        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
            {/* Step Circle Indicator */}
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-full border transition-all duration-300",
                isCompleted && "border-success-300 bg-success-300 text-white",
                isActive && "border-primary-300 bg-primary-200 text-secondary-500 font-semibold",
                isUpcoming && "border-neutral-200 bg-white text-neutral-400"
              )}
            >
              {isCompleted ? (
                <Check className="size-4 stroke-[3px]" />
              ) : (
                <span className="text-label-md">{step.id}</span>
              )}
            </div>

            {/* Step Label */}
            <span
              className={cn(
                "text-label-md select-none transition-colors duration-300 text-center leading-tight px-1 sm:px-2",
                isCompleted && "text-primary-400 font-medium",
                isActive && "text-primary-400 font-semibold",
                isUpcoming && "text-secondary-100"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
