"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { AiSuggestionDetail } from "../../types";
import { EditFormFooter } from "./edit-form-footer";
import { EDIT_INPUT_CLASS } from "./edit-styles";
import { useSubmitEdit } from "./use-submit-edit";

type JsonEditFormProps = {
  suggestion: AiSuggestionDetail;
  projectId: string;
  onClose: () => void;
  // When set, only this key of suggested_value is edited as JSON (e.g. "schema").
  // When omitted, the entire suggested_value is edited as JSON (unknown-type fallback).
  field?: string;
};

export function JsonEditForm({ suggestion, projectId, onClose, field }: JsonEditFormProps) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const sv = suggestion.rawSuggestedValue;
  const initial = field ? sv[field] ?? {} : sv;

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<{ json: string }>({
    defaultValues: { json: JSON.stringify(initial, null, 2) },
  });
  const [error, setError] = useState<string | null>(null);
  const { submit, isPending } = useSubmitEdit(projectId, suggestion.id, onClose);

  function onSubmit({ json }: { json: string }) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      setError(t("editForm.invalidJson"));
      return;
    }
    setError(null);
    submit(field ? { ...sv, [field]: parsed } : (parsed as Record<string, unknown>));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-label-sm font-medium text-neutral-600">{t("jsonValue")}</label>
        <textarea
          rows={14}
          dir="ltr"
          spellCheck={false}
          className={cn(EDIT_INPUT_CLASS, "resize-none font-mono text-xs leading-relaxed")}
          {...register("json", { required: true })}
        />
        {error && <span className="text-label-xs text-error-500">{error}</span>}
      </div>
      <EditFormFooter onCancel={onClose} isPending={isPending} disabled={!isDirty} />
    </form>
  );
}
