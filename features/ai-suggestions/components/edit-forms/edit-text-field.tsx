"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { EDIT_INPUT_CLASS } from "./edit-styles";

type EditTextFieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  value: string;
  multiline?: boolean;
  rows?: number;
  charHint?: { min: number; max: number };
};

export function EditTextField({
  label,
  registration,
  value,
  multiline,
  rows,
  charHint,
}: EditTextFieldProps) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const isIdeal = charHint
    ? value.length >= charHint.min && value.length <= charHint.max
    : null;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-label-sm font-medium text-neutral-600">{label}</label>
      {multiline ? (
        <textarea rows={rows ?? 4} className={cn(EDIT_INPUT_CLASS, "resize-none")} {...registration} />
      ) : (
        <input type="text" className={EDIT_INPUT_CLASS} {...registration} />
      )}
      {charHint && (
        <div className="flex items-center justify-between">
          <span className="text-label-xs text-neutral-400">{t("chars", { count: value.length })}</span>
          <span
            className={
              isIdeal
                ? "text-label-xs font-medium text-success-600"
                : "text-label-xs text-neutral-400"
            }
          >
            {t("idealLength", { min: charHint.min, max: charHint.max })}
          </span>
        </div>
      )}
    </div>
  );
}
