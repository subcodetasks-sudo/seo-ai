"use client";

import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/navigation";

import type { Subscription } from "../types";

type CurrentPlanCardProps = {
  subscription: Subscription;
};

export function CurrentPlanCard({ subscription }: CurrentPlanCardProps) {
  const t = useTranslations("settings.billing");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? arSA : enUS;

  const usagePercent = Math.round(
    (subscription.usedPages / subscription.totalPages) * 100,
  );

  const nextInvoiceDate = format(new Date(subscription.nextInvoiceDate), "d MMMM yyyy", {
    locale: dateLocale,
  });

  return (
    <Card className="settings-card border border-neutral-200 bg-white shadow-none ring-0">
      <CardContent className="flex flex-col gap-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-label-md text-neutral-500">{t(subscription.planLabelKey)}</p>
          {subscription.status === "active" ? (
            <Badge className="bg-primary-50 text-primary-700 hover:bg-primary-50">
              {t("active")}
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-col gap-1 text-start">
          <p className="text-h2 font-semibold text-secondary-500">
            {subscription.planName}
          </p>
          <p className="text-label-md text-neutral-500">
            ${subscription.priceMonthly} {t("perMonth")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-label-sm text-neutral-500">{t("usedScanPages")}</p>
            <p className="text-label-sm font-medium text-secondary-500">
              {subscription.usedPages} / {subscription.totalPages}
            </p>
          </div>
          <Progress value={usagePercent} className="h-2 bg-neutral-100" />
          <p className="text-label-sm text-neutral-500">
            {t("quotaUsed", { percent: usagePercent })}
          </p>
        </div>

        <div className="flex items-center gap-2 text-label-sm text-neutral-500">
          <Calendar size={16} className="shrink-0 text-neutral-400" aria-hidden="true" />
          <span>{t("nextInvoice", { date: nextInvoiceDate })}</span>
        </div>

        <div className="flex justify-start">
          <Button
            asChild
            className="bg-primary-300 text-secondary-500 hover:bg-primary-400"
          >
            <Link href="/plans">{t("changePlan")}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
