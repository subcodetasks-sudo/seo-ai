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
import { publicPlansQueryOptions } from "@/features/plans/queries/queries";

import type { CurrentBilling } from "../queries/api";
import { useChangeBillingPlan, useStartBillingCheckout } from "../queries/mutations";

type ChangePlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBilling?: CurrentBilling;
};

export function ChangePlanDialog({ open, onOpenChange, currentBilling }: ChangePlanDialogProps) {
  const t = useTranslations("settings.billing");
  const { data: plans = [] } = useQuery(publicPlansQueryOptions());
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
    // Free / $0 plans or an already-active subscription can be swapped in place;
    // moving to a paid plan needs a payment method via checkout.
    if (selectedPlan.price_monthly == null) return;

    const treatAsFree =
      selectedPlan.price_monthly === 0 || selectedPlan.name.toLowerCase() === "free";
    const needsCheckout = !treatAsFree && !currentBilling?.subscription_status;

    if (needsCheckout) {
      startCheckout(selectedPlan.name, {
        onSuccess: (response) => {
          window.location.href = response.data.payment_url;
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
      <DialogContent className="flex max-h-[85vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl lg:max-w-4xl">
        <DialogHeader className="shrink-0 border-b border-secondary-50 px-5 py-4 sm:px-6 sm:py-5">
          <DialogTitle className="text-start text-secondary-500">{t("choosePlan")}</DialogTitle>
        </DialogHeader>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
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
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 flex-row justify-end gap-2 rounded-b-xl">
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
