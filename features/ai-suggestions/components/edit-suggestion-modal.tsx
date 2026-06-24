"use client";

import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AiSuggestionDetail } from "../types";
import { FaqEditForm } from "./edit-forms/faq-edit-form";
import { FlatEditForm } from "./edit-forms/flat-edit-form";
import { FLAT_EDIT_CONFIGS } from "./edit-forms/flat-edit-config";
import { InternalLinkEditForm } from "./edit-forms/internal-link-edit-form";
import { JsonEditForm } from "./edit-forms/json-edit-form";

// Types whose forms benefit from a wider dialog (lists / JSON).
const WIDE_TYPES = new Set(["faq", "internal_link", "schema"]);

type EditSuggestionModalProps = {
  open: boolean;
  suggestion: AiSuggestionDetail;
  projectId: string;
  onClose: () => void;
};

export function EditSuggestionModal({
  open,
  suggestion,
  projectId,
  onClose,
}: EditSuggestionModalProps) {
  const t = useTranslations("aiSuggestions.reviewPage");

  function renderForm() {
    const props = { suggestion, projectId, onClose };
    switch (suggestion.type) {
      case "faq":
        return <FaqEditForm {...props} />;
      case "internal_link":
        return <InternalLinkEditForm {...props} />;
      case "schema":
        return <JsonEditForm {...props} field="schema" />;
      default:
        return FLAT_EDIT_CONFIGS[suggestion.type] ? (
          <FlatEditForm {...props} />
        ) : (
          <JsonEditForm {...props} />
        );
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-y-auto",
          WIDE_TYPES.has(suggestion.type) ? "sm:max-w-2xl" : "sm:max-w-lg",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-start text-secondary-500">{t("editTitle")}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
}
