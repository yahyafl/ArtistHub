import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasAnyPermission, hasPermission } from "@/lib/permissions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const item = await prisma.news.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.NEWS_EDIT)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    const item = await prisma.news.update({
      where: { id },
      data: { title: body.title, content: body.content, imageUrl: body.imageUrl },
    });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.NEWS_DELETE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}