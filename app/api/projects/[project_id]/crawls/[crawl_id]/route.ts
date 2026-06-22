import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/server";

type RouteContext = {
  params: Promise<{ project_id: string; crawl_id: string }>;
};

function getAuthHeaders(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) return null;
  return { Authorization: `Bearer ${accessToken}` };
}

export async function GET(req: NextRequest, context: RouteContext) {
  const authHeaders = getAuthHeaders(req);
  if (!authHeaders) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { project_id, crawl_id } = await context.params;
  try {
    const data = await serverClient(
      `projects/${project_id}/crawls/${crawl_id}`,
      { method: "GET", headers: authHeaders },
      "Failed to get crawl status",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message }, { status: 400 });
  }
}
