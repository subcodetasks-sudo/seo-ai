import { NextResponse } from "next/server";

type GoogleOAuthBody = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  user_id?: string;
  email?: string;
  display_name?: string;
  plan_name?: string;
  is_verified?: boolean;
};

const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

// Tokens here already come from the backend's own Google OAuth callback
// (see app/[locale]/oauth/google/callback), which hands them to this app via
// a browser redirect since the backend's callback lives on a different
// origin. This route's only job is turning them into the same httpOnly
// cookies /api/auth/login sets, so the rest of the app can't tell the
// difference between a password login and a Google one.
export async function POST(req: Request) {
  const body: GoogleOAuthBody = await req.json();
  const { access_token, refresh_token, ...safeData } = body;

  if (!access_token || !refresh_token) {
    return NextResponse.json({ status: false, message: "Missing Google OAuth tokens" }, { status: 400 });
  }

  const response = NextResponse.json({
    status: true,
    message: "Signed in with Google",
    data: safeData,
  });

  response.cookies.set("access_token", access_token, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set("refresh_token", refresh_token, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  return response;
}
