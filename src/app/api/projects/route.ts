import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";

export async function GET() {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.PROJECTS_READ)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = (session.user as any)?.id as string | undefined;
    const canManageUsers = hasPermission(permissions, PERMISSIONS.USERS_MANAGE);

    const projects = await prisma.project.findMany({
      where: !canManageUsers && userId ? { authorId: userId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.PROJECTS_CREATE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, genre, mood, imageUrl, trackUrl } = body;
    const authorId = (session.user as any)?.id as string | undefined;

    if (!title || !description || !genre || !mood || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: { title, description, genre, mood, imageUrl, trackUrl, authorId },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}