import { NextRequest, NextResponse } from "next/server";
import { extractPlaylistQuery } from "@/lib/gemini";
import { fetchTopByGenre } from "@/lib/itunes";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "Please enter a request" },
        { status: 400 }
      );
    }

    // Step 1: Ask Gemini to extract genre + mood
    const { genre, mood, explanation } = await extractPlaylistQuery(query);

    // Step 2: Use genre + mood to fetch songs from iTunes
    const tracks = await fetchTopByGenre(genre, mood, 8);

    // Step 3: Return everything
    return NextResponse.json({
      genre,
      mood,
      explanation,
      tracks,
    });
  } catch (error) {
    console.error("Playlist API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
