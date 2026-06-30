import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/server";
import { toErrorResponse } from "@/lib/errors";

function getAuthHeaders(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) return null;
  return { Authorization: `Bearer ${accessToken}` };
}

export async function POST(req: NextRequest) {
  const authHeaders = getAuthHeaders(req);
  if (!authHeaders) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Body: { notification_ids: string[] | null } — null marks everything read.
  const body = await req.json().catch(() => ({ notification_ids: null }));

  try {
    const data = await serverClient(
      "notifications/mark-read",
      { method: "POST", headers: authHeaders, body: JSON.stringify(body) },
      "Failed to mark notifications as read",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(toErrorResponse(error), { status: 400 });
  }
}
