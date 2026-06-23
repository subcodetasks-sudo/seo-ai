import { serverClient } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

type RefreshResponseData = {
  access_token?: string;
  refresh_token?: string;
  [key: string]: unknown;
};

const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function POST(req: NextRequest) {
  const refresh_token = req.cookies.get("refresh_token")?.value;

  if (!refresh_token) {
    return clearAuthCookies(
      NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    );
  }

  try {
    const data = await serverClient<{
      status: boolean;
      message: string;
      data?: RefreshResponseData;
    }>(
      "auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refresh_token }),
      },
      "Token refresh failed",
    );

    const { access_token, refresh_token: newRefreshToken, ...safeData } =
      data.data ?? {};

    const response = NextResponse.json({ ...data, data: safeData });

    if (access_token) {
      response.cookies.set("access_token", access_token, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
    }

    if (newRefreshToken) {
      response.cookies.set("refresh_token", newRefreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    }

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    // Refresh failed — clear cookies so middleware/client treat the user as
    // logged out instead of bouncing them back into an authenticated route.
    return clearAuthCookies(NextResponse.json({ message }, { status: 401 }));
  }
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}
