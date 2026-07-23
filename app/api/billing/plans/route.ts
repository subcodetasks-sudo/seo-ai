import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/server";
import { toErrorResponse } from "@/lib/errors";

/**
 * Plan catalog is public marketing data (names, limits, prices).
 * Auth is optional — attach Bearer when present so authenticated clients
 * share the same cache key / response shape.
 */
export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const headers: HeadersInit = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};

  try {
    const data = await serverClient(
      "billing/plans",
      { method: "GET", headers },
      "Failed to fetch plans",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(toErrorResponse(error), { status: 400 });
  }
}
