"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { ProductTone, TopProductRow } from "../types";

const PRODUCT_TONE_STYLES: Record<ProductTone, { dot: string; bar: string }> = {
  green: { dot: "bg-[#84CC16]", bar: "bg-[#84CC16]" },
  blue: { dot: "bg-[#3B82F6]", bar: "bg-[#3B82F6]" },
  orange: { dot: "bg-[#F97316]", bar: "bg-[#F97316]" },
  purple: { dot: "bg-[#A855F7]", bar: "bg-[#A855F7]" },
};

type EcommerceProductsTableProps = {
  products: TopProductRow[];
};

export function EcommerceProductsTable({ products }: EcommerceProductsTableProps) {
  const t = useTranslations("googleAnalytics.ecommerceDashboard");
  const locale = useLocale();
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US");

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="mb-4 text-start text-h4 font-semibold text-secondary-500">
        {t("topProducts")}
      </h3>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start text-label-sm text-neutral-500">
              {t("table.product")}
            </TableHead>
            <TableHead className="text-end text-label-sm text-neutral-500">
              {t("table.revenue")}
            </TableHead>
            <TableHead className="text-end text-label-sm text-neutral-500">
              {t("table.units")}
            </TableHead>
            <TableHead className="text-end text-label-sm text-neutral-500">
              {t("table.share")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const tone = PRODUCT_TONE_STYLES[product.tone];

            return (
              <TableRow key={product.id}>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("size-2.5 shrink-0 rounded-full", tone.dot)}
                      aria-hidden="true"
                    />
                    <span className="text-label-sm font-medium text-secondary-500">
                      {t(product.labelKey)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatter.format(product.revenue)} {t("currency")}
                </TableCell>
                <TableCell className="py-4 text-end text-label-sm text-secondary-500">
                  {formatter.format(product.units)}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={cn("h-full rounded-full", tone.bar)}
                        style={{ width: `${product.share}%` }}
                      />
                    </div>
                    <span className="w-10 text-end text-label-sm font-medium text-secondary-500">
                      {product.share}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
