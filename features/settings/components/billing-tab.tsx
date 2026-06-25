import { MOCK_SUBSCRIPTION } from "../services/mock-data";
import { CurrentPlanCard } from "./current-plan-card";
import { InvoiceHistoryCard } from "./invoice-history-card";

export function BillingTab() {
  return (
    <div className="flex flex-col gap-6">
      <CurrentPlanCard subscription={MOCK_SUBSCRIPTION} />
      <InvoiceHistoryCard />
    </div>
  );
}
