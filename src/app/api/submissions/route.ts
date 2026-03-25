import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";

export async function GET() {
  try {
    const session = await auth();
    const permissions = ((session?.user as any)?.permissions || []) as string[];
    if (!session || !hasPermission(permissions, PERMISSIONS.SUBMISSIONS_READ)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        project: { select: { id: true, title: true } },
      },
    });
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Submissions GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, projectId } = body;

    if (!name || !email || !message || !projectId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: { name, email, message, projectId },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error("Submission POST error:", error);
    return NextResponse.json(
      { error: "Failed to submit" },
      { status: 500 }
    );
  }
}