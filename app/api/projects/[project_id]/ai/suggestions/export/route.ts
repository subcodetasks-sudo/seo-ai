import { NextRequest, NextResponse } from "next/server";

import { env } from "@/config/env";
import { getLanguageHeader } from "@/lib/server";

type RouteContext = {
  params: Promise<{ project_id: string }>;
};

function getAuthHeaders(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) return null;
  return { Authorization: `Bearer ${accessToken}` };
}

export async function GET(req: NextRequest, context: RouteContext) {
  const authHeaders = getAuthHeaders(req);
  if (!authHeaders) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (!env.API_URL) {
    console.error("[export] Missing NEXT_PUBLIC_API_URL env variable");
    return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
  }

  const { project_id } = await context.params;
  const searchParams = req.nextUrl.searchParams.toString();
  const url = `${env.API_URL}${env.API_PREFIX}projects/${project_id}/ai/suggestions/export${searchParams ? `?${searchParams}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { ...authHeaders, ...(await getLanguageHeader()) },
    });

    if (!response.ok) {
      console.error(`[export] Backend responded ${response.status} for ${url}`);
      return NextResponse.json({ message: "Export failed" }, { status: response.status });
    }

    const csv = await response.text();

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ai-suggestions.csv"`,
      },
    });
  } catch (error) {
    console.error("[export] Fetch error:", error);
    return NextResponse.json({ message: "Export failed" }, { status: 500 });
  }
}
