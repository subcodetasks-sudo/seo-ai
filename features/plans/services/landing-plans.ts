/** Shared gradient accents for pricing cards (landing + dashboard). */
export const PLAN_BAR_CLASSES = [
  "from-[#caa24a] via-[#5d7a2c] to-[#14210a]",
  "from-[#9ed25a] to-[#3f6e1f]",
  "from-[#dbe7c8] to-[#a9c787]",
  "from-[#5d7a2c] via-[#9ed25a] to-[#dbe7c8]",
];

/** Strip carousel loop suffixes like `-loop-0` from a display id. */
export function getStablePlanId(planId: string): string {
  return planId.replace(/-loop-\d+$/, "");
}
