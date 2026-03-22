import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

    return parsed as PlaylistQuery;
  } catch (error) {
    console.error("Gemini error:", error);
    // Fallback if AI fails
    return {
      genre: "indie",
      mood: "chill",
      explanation: "Here are some great tracks we think you'll enjoy!",
    };
  }
}