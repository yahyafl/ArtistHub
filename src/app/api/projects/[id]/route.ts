import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.PROJECTS_READ)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = (session.user as any)?.id as string | undefined;
    const canManageUsers = hasPermission(permissions, PERMISSIONS.USERS_MANAGE);

    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        submissions: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (!canManageUsers && userId && project.author.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.PROJECTS_EDIT)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = (session.user as any)?.id as string | undefined;
    const canManageUsers = hasPermission(permissions, PERMISSIONS.USERS_MANAGE);

    const { id } = await params;
    const existing = await prisma.project.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!canManageUsers && userId && existing.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, genre, mood, imageUrl, trackUrl } = body;

    const project = await prisma.project.update({
      where: { id },
      data: { title, description, genre, mood, imageUrl, trackUrl },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Project PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.PROJECTS_DELETE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = (session.user as any)?.id as string | undefined;
    const canManageUsers = hasPermission(permissions, PERMISSIONS.USERS_MANAGE);

    const { id } = await params;
    const existing = await prisma.project.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!canManageUsers && userId && existing.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}