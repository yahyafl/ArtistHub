import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasAnyPermission, hasPermission } from "@/lib/permissions";

export async function GET() {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasAnyPermission(permissions, [
      PERMISSIONS.BLOG_READ,
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT,
      PERMISSIONS.BLOG_DELETE,
    ])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Blog GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.BLOG_CREATE)) {
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

    const blog = await prisma.blog.create({
      data: { title, content, imageUrl },
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    console.error("Blog POST error:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}