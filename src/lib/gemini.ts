import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SUPPORTED_GENRES = [
  "arabic",
  "jazz",
  "indie",
  "hiphop",
  "classical",
  "pop",
  "rock",
  "edm",
  "rnb",
  "folk",
];

const SUPPORTED_MOODS = [
  "sad",
  "happy",
  "chill",
  "energetic",
  "romantic",
  "angry",
  "peaceful",
];

const ARABIC_TEXT_REGEX = /[\u0600-\u06FF]/;

function normalizeValue(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeGenre(raw: string, userInput: string): string {
  const normalized = normalizeValue(raw || "");
  const input = normalizeValue(userInput);

  if (normalized.includes("arab") || input.includes("arab") || ARABIC_TEXT_REGEX.test(userInput)) {
    return "arabic";
  }

  if (normalized.includes("hip hop") || normalized.includes("hip-hop")) {
    return "hiphop";
  }

  if (SUPPORTED_GENRES.includes(normalized)) {
    return normalized;
  }

  const fallback = SUPPORTED_GENRES.find((genre) => normalized.includes(genre));
  return fallback || "indie";
}

function normalizeMood(raw: string, userInput: string): string {
  const normalized = normalizeValue(raw || "");
  const input = normalizeValue(userInput);

  if (normalized.includes("upbeat") || normalized.includes("party") || normalized.includes("workout")) {
    return "energetic";
  }

  if (SUPPORTED_MOODS.includes(normalized)) {
    return normalized;
  }

  const fallback = SUPPORTED_MOODS.find((mood) => normalized.includes(mood));
  if (fallback) return fallback;

  if (input.includes("top") || input.includes("hits")) {
    return "happy";
  }

  return "chill";
}

export interface PlaylistQuery {
  genre: string;
  mood: string;
  explanation: string;
}

export async function extractPlaylistQuery(
  userInput: string
): Promise<PlaylistQuery> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const prompt = `
You are a music assistant. The user wants a playlist.
Analyze their request and return ONLY a JSON object, nothing else.
No markdown, no explanation, just raw JSON.

Rules:
- If the request mentions Arabic (or is written in Arabic), set genre to "arabic".
- Use only these genres: ${SUPPORTED_GENRES.join(", ")}
- Use only these moods: ${SUPPORTED_MOODS.join(", ")}
- If unsure about mood, choose "chill".

User request: "${userInput}"

Return this exact format:
{
  "genre": "one word genre like: arabic, jazz, indie, hiphop, classical, pop, rock",
  "mood": "one word mood like: sad, happy, chill, energetic, romantic, angry, peaceful",
  "explanation": "one friendly sentence explaining why these songs fit their request"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Clean any accidental markdown
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    const genre = normalizeGenre(parsed.genre, userInput);
    const mood = normalizeMood(parsed.mood, userInput);
    const explanation = typeof parsed.explanation === "string" && parsed.explanation.trim()
      ? parsed.explanation
      : "Here are songs that match your vibe.";

    return { genre, mood, explanation };
  } catch (error) {
    console.error("Gemini error:", error);
    // Fallback if AI fails
    return {
      genre: ARABIC_TEXT_REGEX.test(userInput) ? "arabic" : "indie",
      mood: "chill",
      explanation: "Here are some great tracks we think you'll enjoy!",
    };
  }
}