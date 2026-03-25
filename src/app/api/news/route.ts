import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasAnyPermission, hasPermission } from "@/lib/permissions";

export async function GET() {
	try {
		const session = await auth();
		const permissions = ((session?.user as any)?.permissions || []) as string[];
		if (!session || !hasAnyPermission(permissions, [
			PERMISSIONS.NEWS_READ,
			PERMISSIONS.NEWS_CREATE,
			PERMISSIONS.NEWS_EDIT,
			PERMISSIONS.NEWS_DELETE,
		])) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const news = await prisma.news.findMany({
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json({ news });
	} catch (error) {
		console.error("News GET error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch news" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		const permissions = ((session?.user as any)?.permissions || []) as string[];
		if (!session || !hasPermission(permissions, PERMISSIONS.NEWS_CREATE)) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const body = await req.json();
		const { title, content, imageUrl } = body;

		if (!title || !content) {
			return NextResponse.json(
				{ error: "Title and content are required" },
				{ status: 400 }
			);
		}

		const item = await prisma.news.create({
			data: { title, content, imageUrl },
		});

		return NextResponse.json({ item }, { status: 201 });
	} catch (error) {
		console.error("News POST error:", error);
		return NextResponse.json(
			{ error: "Failed to create news" },
			{ status: 500 }
		);
	}
}
