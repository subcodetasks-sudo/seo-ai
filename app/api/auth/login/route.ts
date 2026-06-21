import { serverClient } from "@/lib/server";

export async function POST(req: Request) {
  const body = await req.json();

  const data = await serverClient(`auth/login`, {
    method: "POST",
    body: JSON.stringify(body),
  }, "Login failed");

  return Response.json(data);
}