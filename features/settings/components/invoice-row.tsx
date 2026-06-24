"use client";

import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

import type { Invoice } from "../types";

type InvoiceRowProps = {
  invoice: Invoice;
};

export function InvoiceRow({ invoice }: InvoiceRowProps) {
  const t = useTranslations("settings.billing");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? arSA : enUS;

  const formattedDate = format(new Date(invoice.date), "MMM d, yyyy", {
    locale: dateLocale,
  });

  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-100 py-4 last:border-b-0">
      <div className="flex flex-col gap-1 text-start">
        <p className="text-label-md font-medium text-secondary-500">{formattedDate}</p>
        <p className="text-label-sm text-neutral-500">{t(invoice.planLabelKey)}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-label-md font-semibold text-secondary-500">
          ${invoice.amount.toFixed(2)}
        </p>
        <Badge className="bg-primary-50 text-primary-700 hover:bg-primary-50">
          {t(`status.${invoice.status}`)}
        </Badge>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-label-sm font-medium text-primary-700 hover:underline"
        >
          {t("pdf")}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
