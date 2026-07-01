"use client";

import { useContext } from "react";
import { OTPInputContext } from "input-otp";

import { cn } from "@/lib/utils";

export function CircularOtpSlot({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  const filled = Boolean(char);

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-12 items-center justify-center rounded-full border-2 bg-white text-lg font-medium transition-all outline-none sm:size-14 sm:text-xl",
        filled || isActive
          ? "border-primary-300 text-secondary-500"
          : "border-neutral-200 text-neutral-400",
        isActive && "ring-2 ring-primary-75",
        className
      )}
    >
      {char ?? "–"}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      ) : null}
    </div>
  );
}
