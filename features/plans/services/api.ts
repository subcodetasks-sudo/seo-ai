import { serverClient } from "@/lib/server";
import type { Plan } from "../types/types";

type PlansResponse = {
  status: boolean;
  message: string;
  data?: {
    plans: Plan[];
  };
};

export async function getPlans(): Promise<Plan[]> {
  try {
    const response = await serverClient<PlansResponse>(
      "billing/plans",
      {
        method: "GET",
      },
      "Failed to fetch plans"
    );

    return response.data?.plans ?? [];
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}
