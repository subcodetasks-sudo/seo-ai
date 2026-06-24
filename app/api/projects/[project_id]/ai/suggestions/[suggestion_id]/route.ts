import { NextRequest, NextResponse } from "next/server";

import { serverClient } from "@/lib/server";

type RouteContext = {
  params: Promise<{ project_id: string; suggestion_id: string }>;
};

function getAuthHeaders(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) return null;
  return { Authorization: `Bearer ${accessToken}` };
}

export async function GET(req: NextRequest, context: RouteContext) {
  const authHeaders = getAuthHeaders(req);
  if (!authHeaders) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { project_id, suggestion_id } = await context.params;

  try {
    const data = await serverClient(
      `projects/${project_id}/ai/suggestions/${suggestion_id}`,
      { method: "GET", headers: authHeaders },
      "Failed to get suggestion",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message }, { status: 400 });
  }
}
