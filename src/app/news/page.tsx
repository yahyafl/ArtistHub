import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ padding: "64px 0" }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <span className="section-label">Latest News</span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "12px" }}>
            What's Happening
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", maxWidth: "480px" }}>
            Updates, announcements, and news from ArtistHub and the independent music world.
          </p>
        </div>

        {/* List */}
        {news.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>📰</p>
            <p style={{ fontSize: "18px" }}>No news yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="card" style={{
                  padding: "28px 32px",
                  display: "flex",
                  gap: "32px",
                  alignItems: "center",
                  cursor: "pointer",
                }} className="card news-card">

                  {/* Date block */}
                  <div style={{
                    flexShrink: 0,
                    textAlign: "center",
                    width: "60px",
                  }}>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "32px",
                      fontWeight: 700,
                      color: "var(--accent)",
                      lineHeight: 1,
                    }}>
                      {new Date(item.createdAt).getDate()}
                    </p>
                    <p style={{
                      fontSize: "11px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      marginTop: "4px",
                    }}>
                      {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short" })}
                    </p>
                  </div>

                  {/* Divider */}
                  <div style={{
                    width: "1px",
                    height: "60px",
                    background: "var(--border)",
                    flexShrink: 0,
                  }} />

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h2 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "var(--text)",
                      marginBottom: "8px",
                      lineHeight: 1.3,
                    }}>{item.title}</h2>
                    <p style={{
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>{item.content}</p>
                  </div>

                  {/* Arrow */}
                  <span style={{
                    fontSize: "20px",
                    color: "var(--border)",
                    flexShrink: 0,
                  }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}