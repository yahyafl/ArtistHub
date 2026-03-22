import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import SubmissionForm from "@/components/projects/SubmissionForm";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { submissions: true } },
    },
  });

  if (!project) notFound();

  const isYoutube =
    project.trackUrl?.includes("youtube.com") ||
    project.trackUrl?.includes("youtu.be");
  const isSoundcloud = project.trackUrl?.includes("soundcloud.com");
  const isSpotify = project.trackUrl?.includes("spotify.com");

  return (
    <main style={{ padding: "64px 0" }}>
      <div className="container">

        {/* Back link */}
        <a href="/projects" style={{
          fontSize: "13px",
          color: "var(--text-muted)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "40px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          ← Back to Projects
        </a>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "start",
          }}
          className="detail-grid"
        >
          {/* Left — Project Info */}
          <div>

            {/* Genre + Mood */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <span style={{
                fontSize: "11px", padding: "4px 12px",
                background: "var(--accent)", color: "var(--white)",
                borderRadius: "100px",
              }}>
                {project.genre}
              </span>
              <span style={{
                fontSize: "11px", padding: "4px 12px",
                background: "var(--highlight)", color: "var(--accent)",
                borderRadius: "100px",
              }}>
                {project.mood}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              lineHeight: 1.15,
              marginBottom: "20px",
              color: "var(--text)",
            }}>
              {project.title}
            </h1>

            {/* Author */}
            <p style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              marginBottom: "24px",
            }}>
              by{" "}
              <strong style={{ color: "var(--text)" }}>
                {project.author.name || "Unknown Artist"}
              </strong>
              {" · "}
              {project._count.submissions} inquiries
              {" · "}
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {/* Image */}
            <div style={{
              width: "100%",
              height: "280px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "28px",
              overflow: "hidden",
            }}>
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "72px" }}>🎵</span>
              )}
            </div>

            {/* Description */}
            <p style={{
              fontSize: "15px",
              lineHeight: 1.8,
              color: "var(--text-muted)",
              marginBottom: "32px",
            }}>
              {project.description}
            </p>

            {/* Track Player */}
            {project.trackUrl && (
              <div style={{ marginBottom: "32px" }}>
                <p style={{
                  fontSize: "12px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Listen
                </p>

                {isYoutube && (
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeId(project.trackUrl)}`}
                      style={{
                        position: "absolute", top: 0, left: 0,
                        width: "100%", height: "100%",
                        border: "none", borderRadius: "4px",
                      }}
                      allowFullScreen
                    />
                  </div>
                )}

                {isSoundcloud && (
                  <iframe
                    width="100%"
                    height="120"
                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(project.trackUrl)}&color=%23E8622A&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false`}
                    style={{ border: "none", borderRadius: "4px" }}
                  />
                )}

                {isSpotify && (
                  <iframe
                    src={project.trackUrl.replace(
                      "open.spotify.com",
                      "open.spotify.com/embed"
                    )}
                    width="100%"
                    height="80"
                    style={{ border: "none", borderRadius: "4px" }}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  />
                )}

{!isYoutube && !isSoundcloud && !isSpotify && (
  <a
    href={project.trackUrl ?? "#"}
    target="_blank"
    rel="noopener noreferrer"
    className="btn-outline"
    style={{ display: "inline-flex" }}
  >
    ▶ Listen on External Platform
  </a>
)}
              </div>
            )}
          </div>

          {/* Right — Submission Form */}
          <div style={{ position: "sticky", top: "80px" }}>
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "32px",
            }}>
              <p className="section-label">Interested?</p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "24px",
                marginBottom: "8px",
                color: "var(--text)",
              }}>
                Send an Inquiry
              </h2>
              <p style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                marginBottom: "28px",
                lineHeight: 1.6,
              }}>
                Want to collaborate, license, or learn more about this track?
                Fill out the form and the artist will get back to you.
              </p>
              <SubmissionForm projectId={project.id} />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function extractYoutubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  );
  return match ? match[1] : "";
}