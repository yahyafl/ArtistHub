import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { page, content } = await req.json();
    if (!page || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await prisma.siteContent.upsert({
      where: { page },
      update: { content },
      create: { page, content },
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Content API error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}