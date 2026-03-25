import { ItunesTrack } from "@/types";

const ITUNES_TIMEOUT_MS = 4500;
const ITUNES_MAX_ATTEMPTS = 2;
const ARABIC_TEXT_REGEX = /[\u0600-\u06FF]/;

interface ItunesFetchOptions {
  country?: string;
  lang?: string;
}

interface ItunesRankingOptions {
  strictArabic?: boolean;
  dedupeByCollection?: boolean;
}

const GENRE_ALIASES: Record<string, string[]> = {
  arabic: ["arabic", "arab", "arab pop", "arab hits", "arabic hits", "اغاني", "عربي", "موسيقى عربية"],
};

const MOOD_KEYWORDS: Record<string, string[]> = {
  sad: ["sad", "melancholy", "heartbreak", "acoustic", "slow"],
  happy: ["happy", "upbeat", "feel good", "dance", "summer"],
  chill: ["chill", "lofi", "relax", "calm", "smooth"],
  energetic: ["energetic", "workout", "hype", "party", "club", "dance", "power", "fast", "pump"],
  romantic: ["romantic", "love", "ballad", "slow"],
  angry: ["intense", "aggressive", "hard", "power"],
  peaceful: ["peaceful", "ambient", "soft", "instrumental"],
};

const MOOD_LOCAL_KEYWORDS: Record<string, string[]> = {
  sad: ["حزين", "حزينة", "حزينه", "فراق", "دموع", "وجع"],
  happy: ["مبهج", "فرح", "سعيد"],
  chill: ["هادي", "هادئ", "استرخاء"],
  romantic: ["حب", "غرام"],
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function collectGenreKeywords(genre: string): string[] {
  const normalizedGenre = normalize(genre || "indie");
  return [...new Set([normalizedGenre, ...(GENRE_ALIASES[normalizedGenre] || [])])];
}

function collectMoodKeywords(mood: string): string[] {
  const normalizedMood = normalize(mood || "chill");
  const globalMood = MOOD_KEYWORDS[normalizedMood] || [normalizedMood];
  const localMood = MOOD_LOCAL_KEYWORDS[normalizedMood] || [];
  return [...new Set([normalizedMood, ...globalMood, ...localMood])];
}

function buildSearchTerms(genre: string, mood: string): string[] {
  const normalizedGenre = normalize(genre || "indie");
  const normalizedMood = normalize(mood || "chill");
  const genreKeywords = collectGenreKeywords(normalizedGenre);
  const moodKeywords = collectMoodKeywords(normalizedMood);

  const isHiphop = normalizedGenre === "hiphop" || normalizedGenre === "hip-hop";
  const energeticBoost =
    normalizedMood === "energetic"
      ? ["workout", "party", "club", "dance", "hype", "power"]
      : [];

  const localizedTerms =
    normalizedGenre === "arabic"
      ? [
          "اغاني عربية",
          "اغاني عربية حديثة",
          "arabic songs",
          "arabic hits",
          "arabic top songs",
          "arabic pop",
        ]
      : [];

  const terms = [
    `${normalizedMood} ${normalizedGenre} songs`,
    ...(isHiphop ? [
      "hip hop workout",
      "hip hop party",
      "hip hop club",
      "rap workout",
      "rap party",
    ] : []),
    ...genreKeywords.flatMap((genreKeyword) =>
      moodKeywords.map((moodKeyword) => `${genreKeyword} ${moodKeyword} songs`)
    ),
    ...energeticBoost.map((boost) => `${normalizedGenre} ${boost} songs`),
    ...localizedTerms,
    `${normalizedGenre} hits`,
  ];

  return [...new Set(terms.filter((term) => term.trim().length > 0))];
}

function isArabicTrack(track: ItunesTrack): boolean {
  const text = `${track.trackName} ${track.artistName} ${track.collectionName}`;
  const genre = (track.primaryGenreName || "").toLowerCase();
  return (
    ARABIC_TEXT_REGEX.test(text) ||
    genre.includes("arab") ||
    genre.includes("middle eastern") ||
    genre.includes("world")
  );
}

function scoreTrack(track: ItunesTrack, genre: string, mood: string): number {
  const normalizedGenre = normalize(genre || "indie");
  const normalizedMood = normalize(mood || "chill");
  const haystack = `${track.trackName} ${track.artistName} ${track.collectionName} ${track.primaryGenreName}`.toLowerCase();
  const genreKeywords = collectGenreKeywords(normalizedGenre);
  const moodKeywords = collectMoodKeywords(normalizedMood);

  let score = 0;

  for (const keyword of genreKeywords) {
    if (haystack.includes(keyword)) {
      score += 5;
    }
  }

  for (const keyword of moodKeywords) {
    if (haystack.includes(keyword)) {
      score += 3;
    }
  }

  if (normalizedMood === "energetic") {
    const energeticSignals = ["dance", "club", "remix", "workout", "hype", "power", "party", "rush", "fast", "pump"];
    const mellowSignals = ["acoustic", "slow", "ballad", "lullaby", "piano", "chill", "relax", "smooth"];

    for (const keyword of energeticSignals) {
      if (haystack.includes(keyword)) score += 4;
    }
    for (const keyword of mellowSignals) {
      if (haystack.includes(keyword)) score -= 4;
    }
  }

  if (normalizedGenre === "arabic") {
    const hasArabicText = ARABIC_TEXT_REGEX.test(
      `${track.trackName} ${track.artistName} ${track.collectionName}`
    );
    if (hasArabicText) {
      score += 8;
    }
    if ((track.primaryGenreName || "").toLowerCase().includes("arab")) {
      score += 6;
    }
  }

  if (track.previewUrl) {
    score += 1;
  }

  return score;
}

function rankAndFilterTracks(
  tracks: ItunesTrack[],
  genre: string,
  mood: string,
  limit: number,
  options: ItunesRankingOptions = {}
): ItunesTrack[] {
  const normalizedGenre = normalize(genre || "indie");
  const scored = tracks
    .map((track) => ({ track, score: scoreTrack(track, genre, mood) }))
    .sort((a, b) => b.score - a.score)
    .filter((entry) => entry.score > 0)
    .map((entry) => entry.track);

  const strictArabic = options.strictArabic ?? normalizedGenre === "arabic";

  if (normalizedGenre === "arabic" && strictArabic) {
    const arabicFirstPass = scored.filter((track) => isArabicTrack(track));

    if (arabicFirstPass.length > 0) {
      return arabicFirstPass.slice(0, limit);
    }
  }

  let results = scored.slice(0, limit);

  if (options.dedupeByCollection) {
    const seen = new Set<string>();
    const deduped: ItunesTrack[] = [];

    for (const track of results) {
      const key = `${track.collectionName || track.trackName}-${track.artistName}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(track);
      if (deduped.length >= limit) break;
    }

    results = deduped;
  }

  return results;
}

async function fetchByTerm(
  term: string,
  limit: number,
  options: ItunesFetchOptions = {}
): Promise<ItunesTrack[]> {
  const params = new URLSearchParams({
    term,
    media: "music",
    entity: "song",
    limit: String(limit),
  });

  if (options.country) {
    params.set("country", options.country);
  }

  if (options.lang) {
    params.set("lang", options.lang);
  }

  const url = `https://itunes.apple.com/search?${params.toString()}`;

  for (let attempt = 1; attempt <= ITUNES_MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ITUNES_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        throw new Error(`iTunes responded ${res.status}`);
      }

      const data = await res.json();
      return data.results as ItunesTrack[];
    } catch (error) {
      if (attempt === ITUNES_MAX_ATTEMPTS) {
        console.warn(`[iTunes] term failed after retries: \"${term}\"`, error);
        return [];
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return [];
}

export async function fetchTopByGenre(
  genre: string = "indie",
  moodOrLimit: string | number = "chill",
  limit: number = 10,
  options: ItunesRankingOptions = {}
): Promise<ItunesTrack[]> {
  const mood = typeof moodOrLimit === "string" ? moodOrLimit : "chill";
  const resolvedLimit = typeof moodOrLimit === "number" ? moodOrLimit : limit;
  const normalizedGenre = normalize(genre || "indie");
  const terms = buildSearchTerms(genre, mood);
  const perRequestLimit = Math.max(resolvedLimit, 12);

  const localeOptions: ItunesFetchOptions =
    normalizedGenre === "arabic"
      ? { country: "AE", lang: "ar_sa" }
      : {};

  const allTracks: ItunesTrack[] = [];
  for (const term of terms.slice(0, 5)) {
    const tracks = await fetchByTerm(term, perRequestLimit, localeOptions);
    allTracks.push(...tracks);

    if (allTracks.length >= perRequestLimit * 2) {
      break;
    }
  }

  const uniqueTracks = new Map<number, ItunesTrack>();
  for (const track of allTracks) {
    if (!uniqueTracks.has(track.trackId)) {
      uniqueTracks.set(track.trackId, track);
    }
  }

  let ranked = rankAndFilterTracks(
    Array.from(uniqueTracks.values()),
    genre,
    mood,
    resolvedLimit,
    options
  );

  if (normalizedGenre === "arabic" && ranked.length < resolvedLimit) {
    const fallbackTerms = ["اغاني عربية", "arabic hits", "arabic pop", "arabic top songs"];
    const fallbackCountries = ["AE", "SA", "EG"];

    for (const country of fallbackCountries) {
      for (const term of fallbackTerms) {
        const tracks = await fetchByTerm(term, perRequestLimit, { country, lang: "ar_sa" });
        tracks.forEach((track) => uniqueTracks.set(track.trackId, track));
      }
    }

    ranked = rankAndFilterTracks(
      Array.from(uniqueTracks.values()),
      genre,
      mood,
      resolvedLimit,
      options
    );
  }

  return ranked;
}