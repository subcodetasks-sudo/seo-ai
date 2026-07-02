"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExportReportPdfPayload } from "../types";

type ExportReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ExportReportPdfPayload) => void;
  isPending: boolean;
};

export function ExportReportDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: ExportReportDialogProps) {
  const t = useTranslations("reports");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExportReportPdfPayload>({
    defaultValues: { title: "", email: "" },
  });

  function handleClose(value: boolean) {
    if (!value) reset();
    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-start text-secondary-500">
            {t("report.dialogTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="export-report-title" className="text-label-sm text-neutral-600">
              {t("report.titleLabel")}
            </Label>
            <Input
              id="export-report-title"
              placeholder={t("report.titlePlaceholder")}
              className={errors.title ? "border-error-400" : ""}
              {...register("title", { required: true })}
            />
            {errors.title && (
              <p className="text-label-xs text-error-500">{t("report.titleRequired")}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="export-report-email" className="text-label-sm text-neutral-600">
              {t("report.emailLabel")}
            </Label>
            <Input
              id="export-report-email"
              type="email"
              placeholder={t("report.emailPlaceholder")}
              className={errors.email ? "border-error-400" : ""}
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
            />
            {errors.email && (
              <p className="text-label-xs text-error-500">{t("report.emailRequired")}</p>
            )}
          </div>

          <DialogFooter className="mt-2 flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="border-neutral-200 text-neutral-500 hover:bg-neutral-50"
            >
              {t("report.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary-300 text-secondary-500 hover:bg-primary-400 font-medium"
            >
              {isPending ? t("report.generating") : t("report.generate")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
