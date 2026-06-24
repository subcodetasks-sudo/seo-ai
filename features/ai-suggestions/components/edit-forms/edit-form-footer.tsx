"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

type EditFormFooterProps = {
  onCancel: () => void;
  isPending: boolean;
  disabled?: boolean;
};

export function EditFormFooter({ onCancel, isPending, disabled }: EditFormFooterProps) {
  const t = useTranslations("aiSuggestions.reviewPage");

  return (
    <DialogFooter className="flex-row justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-neutral-200 text-neutral-500 hover:bg-neutral-50"
      >
        {t("cancel")}
      </Button>
      <Button
        type="submit"
        disabled={disabled || isPending}
        className="bg-primary-300 font-medium text-secondary-500 hover:bg-primary-400 disabled:opacity-50"
      >
        {isPending ? t("saving") : t("save")}
      </Button>
    </DialogFooter>
  );
}
