import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.USERS_MANAGE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { role, roleId, status } = body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(roleId !== undefined && { roleId: roleId || null }),
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}