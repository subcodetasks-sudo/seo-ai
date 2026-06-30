import { serverClient } from "@/lib/server";
import { toErrorResponse } from "@/lib/errors";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const data = await serverClient(
      `auth/resend-verification`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      "resending verification failed",
    );

    return Response.json(data);
  } catch (error: unknown) {
    return new Response(JSON.stringify(toErrorResponse(error)), { status: 400 });
  }
}
