import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AboutPage() {
  // Try to get editable content from DB, fallback to defaults
  const content = await prisma.siteContent.findUnique({
    where: { page: "about" },
  });

  const data = content?.content as any || {
    headline: "We Believe Every Artist Deserves a Stage",
    story: "ArtistHub was born from a simple frustration — talented independent artists were creating incredible music with nowhere to showcase it. Major platforms favor the already-famous, leaving independent voices unheard.\n\nWe built ArtistHub to change that. A platform designed from the ground up for independent artists, giving them the tools to share their music, connect with collaborators, and build a real audience.\n\nFrom Beirut to Cairo, from bedroom producers to seasoned musicians — every artist has a story worth telling.",
    mission: "To democratize music discovery and give independent artists the visibility they deserve.",
    values: [
      { title: "Authenticity", description: "We celebrate music that comes from real experience, not manufactured trends." },
      { title: "Community", description: "Artists grow stronger together. We foster genuine connections." },
      { title: "Independence", description: "No major labels, no gatekeepers. Just artists and their audience." },
      { title: "Diversity", description: "Music has no borders. We celebrate artists from every background." },
    ],
  };

  return (
    <main style={{ padding: "64px 0" }}>
      <div className="container">

        {/* Hero */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
          marginBottom: "96px",
          paddingBottom: "96px",
          borderBottom: "1px solid var(--border)",
        }} className="about-grid">

          {/* Left */}
          <div>
            <span className="section-label">Our Story</span>
            <h1 style={{
              fontSize: "clamp(28px, 5vw, 52px)",
              lineHeight: 1.1,
              marginBottom: "28px",
              color: "var(--text)",
            }}>
              {data.headline}
            </h1>
            <Link href="/contact" className="btn-primary">
              Join the Platform
            </Link>
          </div>

          {/* Right — Story */}
          <div>
            {data.story.split("\n\n").map((paragraph: string, i: number) => (
              <p key={i} style={{
                fontSize: "15px",
                lineHeight: 1.9,
                color: "var(--text-muted)",
                marginBottom: "20px",
              }}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div style={{
          textAlign: "center",
          padding: "64px 40px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          marginBottom: "96px",
        }}>
          <span className="section-label">Our Mission</span>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(20px, 3vw, 32px)",
            fontWeight: 600,
            color: "var(--text)",
            maxWidth: "680px",
            margin: "0 auto",
            lineHeight: 1.4,
          }}>
            "{data.mission}"
          </p>
        </div>

        {/* Values */}
        <div>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="section-label">What We Stand For</span>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)" }}>Our Values</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "24px",
          }}>
            {data.values.map((value: any, index: number) => (
              <div key={index} className="card" style={{ padding: "32px 28px" }}>
                <div style={{
                  width: "40px",
                  height: "3px",
                  background: "var(--accent)",
                  marginBottom: "20px",
                }} />
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: "12px",
                }}>{value.title}</h3>
                <p style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </main>
  );
}