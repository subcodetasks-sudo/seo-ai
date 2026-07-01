"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AiSuggestionDetail, FaqSuggestedValue } from "../../types";
import { EditFormFooter } from "./edit-form-footer";
import { EDIT_INPUT_CLASS } from "./edit-styles";
import { useSubmitEdit } from "./use-submit-edit";

type FaqFormValues = {
  pairs: { question: string; answer: string }[];
};

type FaqEditFormProps = {
  suggestion: AiSuggestionDetail;
  projectId: string;
  onClose: () => void;
};

export function FaqEditForm({ suggestion, projectId, onClose }: FaqEditFormProps) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const sv = suggestion.rawSuggestedValue as unknown as FaqSuggestedValue;

  const { register, control, handleSubmit } = useForm<FaqFormValues>({
    defaultValues: {
      pairs: (sv.pairs ?? []).map((p) => ({ question: p.question, answer: p.answer })),
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "pairs" });
  const { submit, isPending } = useSubmitEdit(projectId, suggestion.id, suggestion.type, onClose);

  function onSubmit(values: FaqFormValues) {
    submit({
      ...suggestion.rawSuggestedValue,
      pairs: values.pairs,
      pair_count: values.pairs.length,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {fields.length === 0 && (
          <p className="text-label-sm text-neutral-400">{t("editForm.emptyList")}</p>
        )}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-label-xs font-medium text-neutral-400">#{index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-neutral-400 transition-colors hover:text-error-500"
                aria-label={t("editForm.remove")}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
            <input
              className={cn(EDIT_INPUT_CLASS, "bg-white")}
              placeholder={t("editForm.question")}
              {...register(`pairs.${index}.question`, { required: true })}
            />
            <textarea
              rows={2}
              className={cn(EDIT_INPUT_CLASS, "resize-none bg-white")}
              placeholder={t("editForm.answer")}
              {...register(`pairs.${index}.answer`, { required: true })}
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ question: "", answer: "" })}
        className="gap-2 border-dashed border-neutral-300 text-neutral-500 hover:bg-neutral-50"
      >
        <Plus className="size-4" aria-hidden="true" />
        {t("editForm.addPair")}
      </Button>

      <EditFormFooter onCancel={onClose} isPending={isPending} />
    </form>
  );
}
