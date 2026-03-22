import Link from "next/link";

interface Props {
  project: {
    id: string;
    title: string;
    description: string;
    genre: string;
    mood: string;
    imageUrl?: string | null;
    trackUrl?: string | null;
    createdAt: Date;
    author: { name?: string | null };
    _count: { submissions: number };
  };
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link href={`/projects/${project.id}`} style={{ textDecoration: "none" }}>
      <div className="card" style={{ overflow: "hidden", cursor: "pointer" }}>

        {/* Image */}
        <div style={{
          width: "100%",
          height: "180px",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid var(--border)",
          position: "relative",
        }}>
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "48px" }}>🎵</span>
          )}

          {/* Mood badge */}
          <span style={{
            position: "absolute",
            top: "12px", right: "12px",
            fontSize: "11px",
            padding: "4px 10px",
            background: "var(--accent)",
            color: "var(--white)",
            borderRadius: "100px",
            fontFamily: "'DM Sans', sans-serif",
          }}>{project.mood}</span>

          {/* Has track indicator */}
          {project.trackUrl && (
            <span style={{
              position: "absolute",
              bottom: "12px", left: "12px",
              fontSize: "11px",
              padding: "4px 10px",
              background: "rgba(0,0,0,0.6)",
              color: "white",
              borderRadius: "100px",
              fontFamily: "'DM Sans', sans-serif",
            }}>▶ Listen</span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "20px" }}>
          <p style={{
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "8px",
            fontFamily: "'DM Sans', sans-serif",
          }}>{project.genre}</p>

          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: "10px",
            lineHeight: 1.3,
          }}>{project.title}</h3>

          <p style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: "16px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>{project.description}</p>

          {/* Footer */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "16px",
            borderTop: "1px solid var(--border)",
          }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              by {project.author.name || "Unknown"}
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {project._count.submissions} inquiries
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}