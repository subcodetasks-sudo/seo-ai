import { NextRequest, NextResponse } from "next/server";

import { serverClient } from "@/lib/server";

type RouteContext = {
	params: {
		project_id: string;
		crawl_id: string;
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

export async function GET(req: NextRequest, { params }: RouteContext) {
	const authHeaders = getAuthHeaders(req);

	if (!authHeaders) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const data = await serverClient(
			`projects/${params.project_id}/crawls/${params.crawl_id}`,
			{
				method: "GET",
				headers: authHeaders,
			},
			"Failed to get crawl status",
		);

		return NextResponse.json(data);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);

		return NextResponse.json({ message }, { status: 400 });
	}
}