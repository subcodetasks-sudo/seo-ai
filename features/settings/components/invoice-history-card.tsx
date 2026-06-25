"use client";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MOCK_INVOICES } from "../services/mock-data";
import { InvoiceRow } from "./invoice-row";

export function InvoiceHistoryCard() {
  const t = useTranslations("settings.billing");

  return (
    <Card className="settings-card border border-neutral-200 bg-white shadow-none ring-0">
      <CardHeader className="border-b border-neutral-100 pb-4">
        <CardTitle className="text-label-lg font-semibold text-secondary-500">
          {t("invoiceHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {MOCK_INVOICES.map((invoice) => (
          <InvoiceRow key={invoice.id} invoice={invoice} />
        ))}
      </CardContent>
    </Card>
  );
}
