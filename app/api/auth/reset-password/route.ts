import { serverClient } from "@/lib/server";
import { toErrorResponse } from "@/lib/errors";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const data = await serverClient(
      `auth/reset-password`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      "Password reset failed",
    );

    return Response.json(data);
  } catch (error: unknown) {
    return new Response(JSON.stringify(toErrorResponse(error)), { status: 400 });
  }
}
