import prisma from "@/lib/prisma";

export default async function ContactsPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">Inbox</span>
        <h1 style={{ fontSize: "32px" }}>Contact Messages</h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
          Messages submitted through the contact form.
        </p>
      </div>

      {messages.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "4px", color: "var(--text-muted)",
        }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>✉️</p>
          <p>No messages yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: "4px", padding: "24px",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: "12px",
              }}>
                <div>
                  <p style={{
                    fontSize: "15px", fontWeight: 500,
                    color: "var(--text)", marginBottom: "2px",
                  }}>{msg.name}
                    <span style={{
                      fontSize: "13px", color: "var(--text-muted)",
                      fontWeight: 400, marginLeft: "8px",
                    }}>{msg.email}</span>
                  </p>
                </div>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0 }}>
                  {new Date(msg.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              </div>
              <p style={{
                fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7,
                padding: "12px 16px", background: "var(--bg)",
                borderRadius: "2px", borderLeft: "3px solid var(--accent)",
              }}>{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}