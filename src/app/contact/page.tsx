import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <main style={{ padding: "64px 0" }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "start",
        }} className="contact-grid">

          {/* Left — Info */}
          <div>
            <span className="section-label">Get In Touch</span>
            <h1 style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              marginBottom: "20px",
              lineHeight: 1.15,
            }}>
              Let's Work<br />
              <em style={{ color: "var(--accent)", fontStyle: "italic" }}>Together</em>
            </h1>
            <p style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              lineHeight: 1.8,
              marginBottom: "48px",
              maxWidth: "400px",
            }}>
              Whether you're an artist looking to join the platform, a collaborator,
              or just want to say hello — we'd love to hear from you.
            </p>

            {/* Contact details */}
            {[
              { label: "Email", value: "hello@artisthub.com" },
              { label: "Location", value: "Beirut, Lebanon" },
              { label: "Response Time", value: "Within 24 hours" },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                marginBottom: "24px",
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "var(--highlight)",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: "16px" }}>
                    {item.label === "Email" ? "✉️" : item.label === "Location" ? "📍" : "⏱"}
                  </span>
                </div>
                <div>
                  <p style={{
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}>{item.label}</p>
                  <p style={{
                    fontSize: "15px",
                    color: "var(--text)",
                    fontWeight: 500,
                  }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Form */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "40px",
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              marginBottom: "24px",
              color: "var(--text)",
            }}>Send a Message</h2>
            <ContactForm />
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}