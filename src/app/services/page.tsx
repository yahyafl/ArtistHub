import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function ServicesPage() {
  const content = await prisma.siteContent.findUnique({
    where: { page: "services" },
  });

  const data = content?.content as any || {
    headline: "Everything an Independent Artist Needs",
    subheadline: "From showcasing your music to finding collaborators — we've built the tools so you can focus on creating.",
    services: [
      {
        icon: "🎵",
        title: "Music Showcase",
        description: "Create a professional profile for your tracks and albums. Embed your SoundCloud, YouTube, or Spotify links and reach new listeners every day.",
        features: ["Custom project pages", "Embedded players", "Genre & mood tagging"],
      },
      {
        icon: "🤝",
        title: "Collaboration Hub",
        description: "Connect with other artists, producers, and industry professionals. Our inquiry system makes it easy for collaborators to reach you directly.",
        features: ["Direct inquiry forms", "Submission tracking", "Artist networking"],
      },
      {
        icon: "🤖",
        title: "AI Playlist Generator",
        description: "Our AI-powered playlist generator helps listeners find your music by mood and genre. Get discovered by the right audience at the right moment.",
        features: ["Mood-based matching", "Genre detection", "Powered by Gemini AI"],
      },
      {
        icon: "📊",
        title: "Artist Dashboard",
        description: "A powerful yet simple dashboard to manage all your content. Track inquiries, update your projects, and manage your presence on the platform.",
        features: ["Project management", "Inquiry tracking", "Content editing"],
      },
      {
        icon: "📝",
        title: "Blog & News",
        description: "Stay updated with the latest in independent music. Our editorial team publishes stories, insights, and news relevant to independent artists.",
        features: ["Industry insights", "Artist spotlights", "Music news"],
      },
      {
        icon: "🌍",
        title: "Global Reach",
        description: "ArtistHub connects artists across the Arab world and beyond. Your music deserves a global audience — we help you find it.",
        features: ["Multi-language support", "Arabic music focus", "International exposure"],
      },
    ],
  };

  return (
    <main style={{ padding: "64px 0" }}>
      <div className="container">

        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "72px",
          maxWidth: "600px",
          margin: "0 auto 72px",
        }}>
          <span className="section-label">What We Offer</span>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            marginBottom: "20px",
            lineHeight: 1.1,
          }}>
            {data.headline}
          </h1>
          <p style={{
            fontSize: "16px",
            color: "var(--text-muted)",
            lineHeight: 1.7,
          }}>
            {data.subheadline}
          </p>
        </div>

        {/* Services grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
          marginBottom: "80px",
        }}>
          {data.services.map((service: any, index: number) => (
            <div key={index} className="card" style={{ padding: "36px 32px" }}>

              {/* Icon */}
              <div style={{
                fontSize: "36px",
                marginBottom: "20px",
              }}>{service.icon}</div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px",
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: "12px",
              }}>{service.title}</h3>

              {/* Description */}
              <p style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                lineHeight: 1.7,
                marginBottom: "20px",
              }}>{service.description}</p>

              {/* Features */}
              <div style={{
                paddingTop: "20px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}>
                {service.features.map((feature: string, i: number) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                  }}>
                    <span style={{ color: "var(--accent)", fontSize: "16px" }}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          textAlign: "center",
          padding: "64px 40px",
          background: "var(--accent)",
          borderRadius: "4px",
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            color: "var(--white)",
            marginBottom: "16px",
          }}>
            Ready to Share Your Music?
          </h2>
          <p style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "32px",
            maxWidth: "480px",
            margin: "0 auto 32px",
            lineHeight: 1.6,
          }}>
            Join hundreds of independent artists already on the platform.
          </p>
          <Link href="/contact" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--white)",
            color: "var(--accent)",
            padding: "14px 32px",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            textDecoration: "none",
            borderRadius: "2px",
            transition: "opacity 0.2s",
          }}>
            Get Started Today →
          </Link>
        </div>

      </div>
    </main>
  );
}
