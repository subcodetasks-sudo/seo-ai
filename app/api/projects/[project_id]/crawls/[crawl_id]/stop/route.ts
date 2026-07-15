import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/server";
import { toErrorResponse } from "@/lib/errors";

type RouteContext = {
  params: Promise<{ project_id: string; crawl_id: string }>;
};

function getAuthHeaders(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) return null;
  return { Authorization: `Bearer ${accessToken}` };
}

export async function POST(req: NextRequest, context: RouteContext) {
  const authHeaders = getAuthHeaders(req);
  if (!authHeaders) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { project_id, crawl_id } = await context.params;
  try {
    const data = await serverClient(
      `projects/${project_id}/crawls/${crawl_id}/stop`,
      { method: "POST", headers: authHeaders },
      "Failed to stop crawl",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(toErrorResponse(error), { status: 400 });
  }
}
