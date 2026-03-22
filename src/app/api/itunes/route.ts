import { NextRequest, NextResponse } from "next/server";
import { fetchTopByGenre } from "@/lib/itunes";

export async function GET(req: NextRequest) {
  const term = req.nextUrl.searchParams.get("term") || "indie";
  const tracks = await fetchTopByGenre(term, 10);
  return NextResponse.json({ tracks });
}