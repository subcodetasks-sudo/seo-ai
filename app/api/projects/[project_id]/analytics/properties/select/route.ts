import { NextRequest, NextResponse } from "next/server";

import { serverClient } from "@/lib/server";
import { toErrorResponse } from "@/lib/errors";

type RouteContext = {
  params: Promise<{ project_id: string }>;
};

function getAuthHeaders(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) return null;
  return { Authorization: `Bearer ${accessToken}` };
}

export async function POST(req: NextRequest, context: RouteContext) {
  const authHeaders = getAuthHeaders(req);
  if (!authHeaders) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { project_id } = await context.params;
  const searchParams = req.nextUrl.searchParams.toString();
  const endpoint = `projects/${project_id}/analytics/properties/select${searchParams ? `?${searchParams}` : ""}`;

  try {
    const data = await serverClient(
      endpoint,
      { method: "POST", headers: authHeaders },
      "Failed to select Google Analytics property",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(toErrorResponse(error), { status: 400 });
  }
}
