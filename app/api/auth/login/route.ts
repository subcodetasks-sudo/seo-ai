import { NextResponse } from "next/server";
import { serverClient } from "@/lib/server";

type LoginResponseData = {
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

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const data = await serverClient<{
      status: boolean;
      message: string;
      data?: LoginResponseData;
    }>(
      "auth/login",
      { method: "POST", body: JSON.stringify(body) },
      "Login failed",
    );

    const { access_token, refresh_token, ...safeData } = data.data ?? {};

    const response = NextResponse.json({ ...data, data: safeData });

    if (access_token) {
      response.cookies.set("access_token", access_token, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
    }

    if (refresh_token) {
      response.cookies.set("refresh_token", refresh_token, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ status: false, message }, { status: 400 });
  }
}
