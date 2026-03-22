import Link from "next/link";

export default function HeroSection() {
  return (
    <section style={{
      padding: "100px 0 80px",
      borderBottom: "1px solid var(--border)",
    }}>
      <div className="container" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "64px",
        alignItems: "center",
      }}>

        {/* Left — Text */}
        <div className="fade-in">
          <span className="section-label">Independent Music Platform</span>

          <h1 style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.1,
            marginBottom: "24px",
            color: "var(--text)",
          }}>
            Where Artists
            <br />
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>Tell Their Story</em>
          </h1>

          <p style={{
            fontSize: "16px",
            lineHeight: 1.8,
            color: "var(--text-muted)",
            marginBottom: "36px",
            maxWidth: "420px",
          }}>
            Discover independent music, connect with artists, and let AI find
            the perfect playlist for your mood. No algorithms — just real music.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/projects" className="btn-primary">
              Explore Music
            </Link>
            <Link href="/contact" className="btn-outline">
              Work With Us
            </Link>
          </div>
        </div>

        {/* Right — Decorative card stack */}
        <div style={{
          position: "relative",
          height: "380px",
        }} className="hero-visual">

          {/* Background card */}
          <div style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "260px",
            height: "320px",
            background: "var(--highlight)",
            borderRadius: "4px",
            border: "1px solid var(--border)",
          }} />

          {/* Middle card */}
          <div style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "260px",
            height: "320px",
            background: "var(--bg-card)",
            borderRadius: "4px",
            border: "1px solid var(--border)",
          }} />

          {/* Front card */}
          <div style={{
            position: "absolute",
            top: "0",
            right: "0",
            width: "260px",
            height: "320px",
            background: "var(--white)",
            borderRadius: "4px",
            border: "1px solid var(--border)",
            padding: "28px",
            boxShadow: "0 20px 60px rgba(74,63,63,0.12)",
          }}>
            <div style={{
              width: "100%",
              height: "160px",
              background: "var(--bg)",
              borderRadius: "2px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}>
              🎵
            </div>
            <p style={{
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "8px",
            }}>Featured Track</p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: "4px",
            }}>Midnight in Beirut</p>
            <p style={{
              fontSize: "13px",
              color: "var(--text-muted)",
            }}>Alternative · Indie</p>
          </div>
        </div>

      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .hero-visual { display: none; }
        }
      `}</style>
    </section>
  );
}