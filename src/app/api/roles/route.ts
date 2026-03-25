import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.USERS_MANAGE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, description, permissionIds } = await req.json();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          create: permissionIds.map((id: string) => ({
            permission: { connect: { id } },
          })),
        },
      },
    });

    return NextResponse.json({ role }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}