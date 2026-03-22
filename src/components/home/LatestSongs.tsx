"use client";

import { useState } from "react";
import Image from "next/image";
import { ItunesTrack } from "@/types";

const GENRES = ["Indie", "Arabic", "Jazz", "Hip-Hop", "Classical", "Pop", "Rock", "Soul"];

interface Props {
  initialTracks: ItunesTrack[];
}

export default function TopSongs({ initialTracks }: Props) {
  const [tracks, setTracks] = useState<ItunesTrack[]>(initialTracks);
  const [activeGenre, setActiveGenre] = useState("Indie");
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  async function handleGenre(genre: string) {
    setActiveGenre(genre);
    setLoading(true);
    stopAudio();
    try {
      const res = await fetch(`/api/itunes?term=${genre}`);
      const data = await res.json();
      setTracks(data.tracks);
    } catch {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  function stopAudio() {
    if (audio) { audio.pause(); audio.currentTime = 0; }
    setPlaying(null);
    setAudio(null);
  }

  function togglePlay(track: ItunesTrack) {
    if (playing === track.trackId) { stopAudio(); return; }
    stopAudio();
    if (!track.previewUrl) return;
    const a = new Audio(track.previewUrl);
    a.play();
    a.onended = () => setPlaying(null);
    setAudio(a);
    setPlaying(track.trackId);
  }

  return (
    <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="section-label">Top Charts</span>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", marginBottom: "8px" }}>
            Top 10 in {activeGenre}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Most popular tracks — click any to preview
          </p>
        </div>

        {/* Genre Pills */}
        <div style={{
          display: "flex", gap: "8px",
          flexWrap: "wrap", justifyContent: "center",
          marginBottom: "48px",
        }}>
          {GENRES.map((g) => (
            <button key={g} onClick={() => handleGenre(g)} style={{
              padding: "8px 20px",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
              border: "1px solid",
              borderColor: activeGenre === g ? "var(--accent)" : "var(--border)",
              background: activeGenre === g ? "var(--accent)" : "transparent",
              color: activeGenre === g ? "var(--white)" : "var(--text-muted)",
              borderRadius: "100px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontWeight: activeGenre === g ? 500 : 400,
            }}>
              {g}
            </button>
          ))}
        </div>

        {/* Track List */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "720px",
          margin: "0 auto",
        }}>
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{
                  height: "68px",
                  background: "var(--bg-card)",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                  animation: "pulse 1.5s ease infinite",
                }} />
              ))
            : tracks.map((track, index) => (
                <div
                  key={track.trackId}
                  onClick={() => togglePlay(track)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px 16px",
                    background: playing === track.trackId ? "var(--highlight)" : "var(--bg-card)",
                    border: "1px solid",
                    borderColor: playing === track.trackId ? "var(--accent)" : "var(--border)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Rank */}
                  <span style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "'Playfair Display', serif",
                    color: index < 3 ? "var(--accent)" : "var(--text-muted)",
                    width: "24px",
                    textAlign: "center",
                    flexShrink: 0,
                  }}>
                    {index + 1}
                  </span>

                  {/* Artwork */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <Image
                      src={track.artworkUrl100}
                      alt={track.trackName}
                      width={48}
                      height={48}
                      style={{ borderRadius: "2px", display: "block" }}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(0,0,0,0.45)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "2px",
                      opacity: playing === track.trackId ? 1 : 0,
                      transition: "opacity 0.2s",
                    }}>
                      <span style={{ color: "white", fontSize: "14px" }}>
                        {playing === track.trackId ? "⏸" : "▶"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <p style={{
                      fontSize: "15px", fontWeight: 500,
                      color: "var(--text)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{track.trackName}</p>
                    <p style={{
                      fontSize: "13px", color: "var(--text-muted)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{track.artistName}</p>
                  </div>

                  {/* Genre + play indicator */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span style={{
                      fontSize: "11px",
                      color: "var(--accent)",
                      background: "var(--highlight)",
                      padding: "3px 10px",
                      borderRadius: "100px",
                    }}>{track.primaryGenreName}</span>
                    <span style={{
                      fontSize: "18px",
                      color: playing === track.trackId ? "var(--accent)" : "var(--border)",
                      transition: "color 0.2s",
                    }}>
                      {playing === track.trackId ? "⏸" : "▶"}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}