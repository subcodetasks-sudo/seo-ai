import { serverClient } from "@/lib/server";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const data = await serverClient(
      `auth/login`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      "Login failed",
    );

    return Response.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    return new Response(JSON.stringify({ message }), { status: 400 });
  }
}
