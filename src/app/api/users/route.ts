import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		const permissions = ((session?.user as any)?.permissions || []) as string[];
		if (!session || !hasPermission(permissions, PERMISSIONS.USERS_MANAGE)) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { name, email, password, roleId } = await req.json();

		if (!name || !email || !password || !roleId) {
			return NextResponse.json(
				{ error: "Name, email, password and role are required" },
				{ status: 400 }
			);
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return NextResponse.json(
				{ error: "Email already registered" },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				status: "ACTIVE",
				roleId,
			},
		});

		return NextResponse.json({ userId: user.id }, { status: 201 });
	} catch (error) {
		console.error("Users POST error:", error);
		return NextResponse.json(
			{ error: "Failed to create user" },
			{ status: 500 }
		);
	}
}
