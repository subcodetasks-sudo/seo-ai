"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlanCard } from "@/features/plans";

import type { CurrentBilling } from "../queries/api";
import { extractRedirectUrl, useChangeBillingPlan, useStartBillingCheckout } from "../queries/mutations";
import { billingPlansQueryOptions } from "../queries/queries";

type ChangePlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBilling?: CurrentBilling;
};

export function ChangePlanDialog({ open, onOpenChange, currentBilling }: ChangePlanDialogProps) {
  const t = useTranslations("settings.billing");
  const { data } = useQuery(billingPlansQueryOptions());
  const plans = data?.data.plans ?? [];
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const { mutate: changePlan, isPending: isChangingPlan } = useChangeBillingPlan();
  const { mutate: startCheckout, isPending: isStartingCheckout } = useStartBillingCheckout();
  const isPending = isChangingPlan || isStartingCheckout;

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
  const isCurrentPlan = selectedPlan?.name === currentBilling?.plan_name;

  function handleClose(value: boolean) {
    if (!value) setSelectedPlanId(null);
    onOpenChange(value);
  }

  function handleConfirm() {
    if (!selectedPlan || isCurrentPlan) return;

    // Free plan or an already-active subscription can be swapped in place;
    // moving from free to a paid plan needs a payment method via checkout.
    const needsCheckout = selectedPlan.name !== "free" && !currentBilling?.subscription_status;

    if (needsCheckout) {
      startCheckout(selectedPlan.name, {
        onSuccess: (response) => {
          const url = extractRedirectUrl(response.data);
          if (url) {
            window.location.href = url;
            return;
          }
          toast.success(t("planChanged"));
          handleClose(false);
        },
      });
      return;
    }

    changePlan(selectedPlan.name, {
      onSuccess: () => {
        toast.success(t("planChanged"));
        handleClose(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-start text-secondary-500">{t("choosePlan")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              isPopular={plan.name.toLowerCase() === "pro"}
              onSelect={() => setSelectedPlanId(plan.id)}
            />
          ))}
        </div>

        <DialogFooter className="mt-2 flex-row justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            className="border-neutral-200 text-neutral-500 hover:bg-neutral-50"
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            disabled={!selectedPlan || isCurrentPlan || isPending}
            onClick={handleConfirm}
            className="bg-primary-300 text-secondary-500 hover:bg-primary-400"
          >
            {isPending ? t("processing") : t("confirmChange")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
