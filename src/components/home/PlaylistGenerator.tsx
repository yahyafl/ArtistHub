"use client";

import { useState } from "react";
import Image from "next/image";
import { ItunesTrack } from "@/types";

const SUGGESTIONS = [
  "Sad Arabic songs for a rainy night",
  "Energetic hip-hop for working out",
  "Chill jazz for studying",
  "Romantic pop songs",
  "Happy indie for a road trip",
];

interface PlaylistResult {
  genre: string;
  mood: string;
  explanation: string;
  tracks: ItunesTrack[];
}

export default function PlaylistGenerator() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlaylistResult | null>(null);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  async function handleGenerate() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    stopAudio();

    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function stopAudio() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlaying(null);
    setAudio(null);
  }

  function togglePlay(track: ItunesTrack) {
    if (playing === track.trackId) {
      stopAudio();
      return;
    }
    stopAudio();
    if (!track.previewUrl) return;
    const a = new Audio(track.previewUrl);
    a.play();
    a.onended = () => setPlaying(null);
    setAudio(a);
    setPlaying(track.trackId);
  }

  return (
    <section
      style={{
        padding: "80px 0",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-card)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="section-label">Powered by Gemini AI</span>
          <h2
            style={{ fontSize: "clamp(24px, 4vw, 40px)", marginBottom: "12px" }}
          >
            AI Playlist Generator
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Describe your mood or what you want to listen to — in any language —
            and we&apos;ll build your playlist.
          </p>
        </div>

        {/* Input */}
        <div style={{ maxWidth: "600px", margin: "0 auto 24px" }}>
          <div
            style={{
              display: "flex",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              overflow: "hidden",
              background: "var(--white)",
              boxShadow: "0 4px 20px rgba(74,63,63,0.08)",
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="e.g. sad Arabic songs for a rainy night..."
              style={{
                flex: 1,
                padding: "16px 20px",
                border: "none",
                outline: "none",
                fontSize: "15px",
                fontFamily: "'DM Sans', sans-serif",
                background: "transparent",
                color: "var(--text)",
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !query.trim()}
              className="btn-primary"
              style={{
                borderRadius: 0,
                padding: "16px 28px",
                opacity: loading || !query.trim() ? 0.6 : 1,
                cursor: loading || !query.trim() ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "..." : "Generate"}
            </button>
          </div>

          {/* Suggestions */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "12px",
            }}
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                style={{
                  fontSize: "12px",
                  padding: "5px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: "100px",
                  background: "transparent",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid var(--border)",
                borderTop: "3px solid var(--accent)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              AI is finding your perfect playlist...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              padding: "16px",
              background: "#FEE2E2",
              border: "1px solid #FECACA",
              borderRadius: "4px",
              color: "#DC2626",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div
            style={{ maxWidth: "720px", margin: "0 auto" }}
            className="fade-in"
          >
            {/* AI explanation */}
            <div
              style={{
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderLeft: "4px solid var(--accent)",
                borderRadius: "4px",
                padding: "20px 24px",
                marginBottom: "24px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: "24px", flexShrink: 0 }}>🤖</span>
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 10px",
                      background: "var(--highlight)",
                      color: "var(--accent)",
                      borderRadius: "100px",
                      fontWeight: 500,
                    }}
                  >
                    Genre: {result.genre}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 10px",
                      background: "var(--highlight)",
                      color: "var(--accent)",
                      borderRadius: "100px",
                      fontWeight: 500,
                    }}
                  >
                    Mood: {result.mood}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text)",
                    lineHeight: 1.6,
                  }}
                >
                  {result.explanation}
                </p>
              </div>
            </div>

            {/* Track list */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {result.tracks.map((track, index) => (
                <div
                  key={track.trackId}
                  onClick={() => togglePlay(track)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px 16px",
                    background:
                      playing === track.trackId
                        ? "var(--highlight)"
                        : "var(--white)",
                    border: "1px solid",
                    borderColor:
                      playing === track.trackId
                        ? "var(--accent)"
                        : "var(--border)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      fontFamily: "'Playfair Display', serif",
                      color: index < 3 ? "var(--accent)" : "var(--text-muted)",
                      width: "24px",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>

                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <Image
                      src={track.artworkUrl100}
                      alt={track.trackName}
                      width={48}
                      height={48}
                      style={{ borderRadius: "2px", display: "block" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "2px",
                        opacity: playing === track.trackId ? 1 : 0,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <span style={{ color: "white", fontSize: "14px" }}>
                        {playing === track.trackId ? "⏸" : "▶"}
                      </span>
                    </div>
                  </div>

                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "var(--text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {track.trackName}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {track.artistName}
                    </p>
                  </div>

                  <span
                    style={{
                      fontSize: "18px",
                      color:
                        playing === track.trackId
                          ? "var(--accent)"
                          : "var(--border)",
                      transition: "color 0.2s",
                    }}
                  >
                    {playing === track.trackId ? "⏸" : "▶"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
