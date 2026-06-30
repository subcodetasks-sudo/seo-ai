import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/lib/server";
import { toErrorResponse } from "@/lib/errors";

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
      "users/me",
      { method: "GET", headers: authHeaders },
      "Failed to fetch user",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(toErrorResponse(error), { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const authHeaders = getAuthHeaders(req);
  if (!authHeaders) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = await serverClient(
      "users/me",
      { method: "PATCH", headers: authHeaders, body: JSON.stringify(body) },
      "Failed to update profile",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(toErrorResponse(error), { status: 400 });
  }
}
