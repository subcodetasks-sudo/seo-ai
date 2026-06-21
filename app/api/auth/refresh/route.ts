import { serverClient } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const refresh_token = await req.cookies.get("refresh_token")?.value;

    if (!refresh_token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await serverClient(
      `auth/refresh`,
      {
        method: "POST",
        body: JSON.stringify({ refresh_token }),
      },
      "Token refresh failed",
    );

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json({ message }, { status: 400 });
  }
}
