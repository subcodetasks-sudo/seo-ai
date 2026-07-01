"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { invoicesQueryOptions } from "../queries/queries";
import { InvoiceRow } from "./invoice-row";

const PER_PAGE = 10;

export function InvoiceHistoryCard() {
  const t = useTranslations("settings.billing");
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery(invoicesQueryOptions(page, PER_PAGE));
  const invoices = data?.data.invoices ?? [];
  const total = data?.data.total ?? 0;
  const hasNextPage = page * PER_PAGE < total;

  return (
    <Card className="settings-card border border-neutral-200 bg-white shadow-none ring-0">
      <CardHeader className="border-b border-neutral-100 pb-4">
        <CardTitle className="text-label-lg font-semibold text-secondary-500">
          {t("invoiceHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {!isPending && invoices.length === 0 ? (
          <p className="py-6 text-center text-label-sm text-neutral-500">{t("noInvoices")}</p>
        ) : (
          invoices.map((invoice) => <InvoiceRow key={invoice.id} invoice={invoice} />)
        )}

        {total > PER_PAGE ? (
          <div className="flex items-center justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="border-neutral-200 text-neutral-500 hover:bg-neutral-50"
            >
              {t("previous")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={() => setPage((value) => value + 1)}
              className="border-neutral-200 text-neutral-500 hover:bg-neutral-50"
            >
              {t("next")}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
