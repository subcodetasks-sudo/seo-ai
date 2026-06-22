import { NextRequest, NextResponse } from "next/server";

import { serverClient } from "@/lib/server";

type RouteContext = {
	params: {
		project_id: string;
	};
};

function getAuthHeaders(req: NextRequest) {
	const accessToken = req.cookies.get("access_token")?.value;

	if (!accessToken) {
		return null;
	}

	return {
		Authorization: `Bearer ${accessToken}`,
	};
}

export async function POST(req: NextRequest, { params }: RouteContext) {
	const authHeaders = getAuthHeaders(req);

	if (!authHeaders) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const data = await serverClient(
			`projects/${params.project_id}/crawls`,
			{
				method: "POST",
				headers: authHeaders,
			},
			"Failed to start crawl",
		);

		return NextResponse.json(data);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);

		return NextResponse.json({ message }, { status: 400 });
	}
}

export async function GET(req: NextRequest, { params }: RouteContext) {
	const authHeaders = getAuthHeaders(req);

	if (!authHeaders) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const page = req.nextUrl.searchParams.get("page") ?? "1";
	const pageSize = req.nextUrl.searchParams.get("page_size") ?? "20";

	try {
		const data = await serverClient(
			`projects/${params.project_id}/crawls?page=${page}&page_size=${pageSize}`,
			{
				method: "GET",
				headers: authHeaders,
			},
			"Failed to list crawls",
		);

		return NextResponse.json(data);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);

		return NextResponse.json({ message }, { status: 400 });
	}
}