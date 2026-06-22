import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/server";

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
  try {
    const body = await req.json();
    const data = await serverClient(
      `projects/${project_id}/verify`,
      { method: "POST", headers: authHeaders, body: JSON.stringify(body) },
      "Failed to verify domain",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message }, { status: 400 });
  }
}
