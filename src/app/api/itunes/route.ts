import { NextRequest, NextResponse } from "next/server";
import { fetchTopByGenre } from "@/lib/itunes";

export async function GET(req: NextRequest) {
  const term = req.nextUrl.searchParams.get("term") || "indie";
  const normalized = term.trim().toLowerCase();
  const isArabic = normalized === "arabic" || normalized === "arab";
  const tracks = await fetchTopByGenre(
    term,
    isArabic ? "hits" : 10,
    isArabic ? 10 : 10,
    {
      strictArabic: isArabic,
      dedupeByCollection: isArabic,
    }
  );
  return NextResponse.json({ tracks });
}