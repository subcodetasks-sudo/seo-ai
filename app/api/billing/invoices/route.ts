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

  const searchParams = req.nextUrl.searchParams.toString();
  const endpoint = `billing/invoices${searchParams ? `?${searchParams}` : ""}`;

  try {
    const data = await serverClient(
      endpoint,
      { method: "GET", headers: authHeaders },
      "Failed to fetch invoices",
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(toErrorResponse(error), { status: 400 });
  }
}
