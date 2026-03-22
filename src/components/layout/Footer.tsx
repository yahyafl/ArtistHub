import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      background: "var(--bg)",
      marginTop: "80px",
    }}>
      <div className="container" style={{
        padding: "48px 24px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: "48px",
      }}>
        {/* Brand */}
        <div>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "12px",
          }}>
            Artist<span style={{ color: "var(--accent)" }}>Hub</span>
          </p>
          <p style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            maxWidth: "280px",
          }}>
            A home for independent artists. Discover music, connect with creators, and find your next favorite track.
          </p>
        </div>

        {/* Explore */}
        <div>
          <p style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px", color: "var(--text-muted)" }}>Explore</p>
          {[
            { href: "/projects", label: "Music" },
            { href: "/blog", label: "Blog" },
            { href: "/news", label: "News" },
            { href: "/about", label: "About" },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{
              display: "block",
              fontSize: "14px",
              color: "var(--text)",
              textDecoration: "none",
              marginBottom: "10px",
            }}>{l.label}</Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px", color: "var(--text-muted)" }}>Connect</p>
          <Link href="/contact" style={{
            display: "block", fontSize: "14px",
            color: "var(--text)", textDecoration: "none", marginBottom: "10px"
          }}>Contact Us</Link>
          <Link href="/dashboard" style={{
            display: "block", fontSize: "14px",
            color: "var(--text)", textDecoration: "none"
          }}>Dashboard</Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "16px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} ArtistHub. Built for independent music.
        </p>
      </div>
    </footer>
  );
}