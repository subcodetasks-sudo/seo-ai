"use client";

import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

import type { BillingInvoice } from "../queries/api";

type InvoiceRowProps = {
  invoice: BillingInvoice;
};

export function InvoiceRow({ invoice }: InvoiceRowProps) {
  const t = useTranslations("settings.billing");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? arSA : enUS;

  const formattedDate = invoice.created_at
    ? format(new Date(invoice.created_at), "MMM d, yyyy", { locale: dateLocale })
    : "—";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-100 py-4 last:border-b-0">
      <div className="flex flex-col gap-1 text-start">
        <p className="text-label-md font-medium text-secondary-500">{formattedDate}</p>
        <p className="text-label-sm text-neutral-500 capitalize">{invoice.plan_name ?? "—"}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-label-md font-semibold text-secondary-500">
          {invoice.amount_usd != null ? `$${invoice.amount_usd.toFixed(2)}` : "—"}
        </p>
        {invoice.status ? (
          <Badge
            className={
              invoice.status === "paid"
                ? "bg-primary-50 text-primary-700 hover:bg-primary-50"
                : invoice.status === "pending"
                  ? "bg-amber-100 text-amber-900 hover:bg-amber-100"
                  : invoice.status === "failed" || invoice.status === "canceled" || invoice.status === "cancelled"
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-100"
            }
          >
            {invoice.status === "paid" || invoice.status === "pending"
              ? t(`status.${invoice.status}`)
              : invoice.status === "failed"
                ? t("status.failed")
                : invoice.status === "canceled" || invoice.status === "cancelled"
                  ? t("status.canceled")
                  : invoice.status}
          </Badge>
        ) : null}
        {invoice.invoice_pdf_url ? (
          <a
            href={invoice.invoice_pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-label-sm font-medium text-primary-700 hover:underline"
          >
            {t("pdf")}
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
