import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/server";

function getAuthHeaders(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) return null;
  return { Authorization: `Bearer ${accessToken}` };
}

export async function GET(req: NextRequest) {
  const authHeaders = getAuthHeaders(req);
  if (!authHeaders) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await serverClient(
      "users/me/usage",
      { method: "GET", headers: authHeaders },
      "Failed to fetch usage",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message }, { status: 400 });
  }
}
