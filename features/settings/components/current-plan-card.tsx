"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { extractRedirectUrl, useOpenBillingPortal } from "../queries/mutations";
import { currentBillingQueryOptions } from "../queries/queries";
import { ChangePlanDialog } from "./change-plan-dialog";

export function CurrentPlanCard() {
  const t = useTranslations("settings.billing");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? arSA : enUS;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data } = useQuery(currentBillingQueryOptions());
  const billing = data?.data;

  const { mutate: openPortal, isPending: isOpeningPortal } = useOpenBillingPortal();

  function handleManageBilling() {
    openPortal(undefined, {
      onSuccess: (response) => {
        const url = extractRedirectUrl(response.data);
        if (url) {
          window.location.href = url;
        } else {
          toast.error(t("portalUnavailable"));
        }
      },
    });
  }

  if (!billing) return null;

  const isActive = billing.subscription_status === "active" || billing.plan_name === "free";
  const expiresAt = format(new Date(billing.expires_at), "d MMMM yyyy", { locale: dateLocale });

  return (
    <>
      <Card className="settings-card border border-neutral-200 bg-white shadow-none ring-0">
        <CardContent className="flex flex-col gap-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-label-md text-neutral-500">{t("currentPlan")}</p>
            {isActive ? (
              <Badge className="bg-primary-50 text-primary-700 hover:bg-primary-50">
                {t("active")}
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-col gap-1 text-start">
            <p className="text-h2 font-semibold text-secondary-500 capitalize">
              {billing.plan_name}
            </p>
            <p className="text-label-md text-neutral-500">
              ${billing.price_monthly_usd} {t("perMonth")}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-label-sm text-neutral-500">{t("projectsUsed")}</p>
              <p className="text-label-sm font-medium text-secondary-500">
                {billing.projects_limit === -1
                  ? `${billing.projects_used} / ${t("unlimited")}`
                  : `${billing.projects_used} / ${billing.projects_limit}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-label-sm text-neutral-500">
            <Calendar size={16} className="shrink-0 text-neutral-400" aria-hidden="true" />
            <span>{t("nextInvoice", { date: expiresAt })}</span>
          </div>

          <div className="flex flex-wrap justify-start gap-3">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary-300 text-secondary-500 hover:bg-primary-400"
            >
              {t("changePlan")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isOpeningPortal}
              onClick={handleManageBilling}
              className="border-neutral-200 text-neutral-500 hover:bg-neutral-50"
            >
              {isOpeningPortal ? t("processing") : t("manageBilling")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangePlanDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} currentBilling={billing} />
    </>
  );
}
