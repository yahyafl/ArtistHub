import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  const [projectCount, blogCount, newsCount, contactCount, submissionCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.blog.count(),
      prisma.news.count(),
      prisma.contactMessage.count(),
      prisma.submission.count(),
    ]);

  const recentContacts = await prisma.contactMessage.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const stats = [
    { label: "Projects", value: projectCount, icon: "🎵", href: "/dashboard/projects", roles: ["ADMIN", "ARTIST"] },
    { label: "Blog Posts", value: blogCount, icon: "✍️", href: "/dashboard/blog", roles: ["ADMIN", "EDITOR"] },
    { label: "News", value: newsCount, icon: "📰", href: "/dashboard/news", roles: ["ADMIN", "EDITOR"] },
    { label: "Messages", value: contactCount, icon: "✉️", href: "/dashboard/contacts", roles: ["ADMIN"] },
    { label: "Submissions", value: submissionCount, icon: "📬", href: "/dashboard/submissions", roles: ["ADMIN", "ARTIST"] },
  ].filter(s => s.roles.includes(role));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <span className="section-label">Dashboard</span>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
          Welcome back, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          Here's what's happening on ArtistHub today.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "48px",
      }}>
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
            <div className="card" style={{
              padding: "24px",
              cursor: "pointer",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "36px",
                fontWeight: 700,
                color: "var(--accent)",
                lineHeight: 1,
                marginBottom: "6px",
              }}>{stat.value}</p>
              <p style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}>{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent messages */}
      {role === "ADMIN" && recentContacts.length > 0 && (
        <div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}>
            <h2 style={{ fontSize: "20px" }}>Recent Messages</h2>
            <Link href="/dashboard/contacts" style={{
              fontSize: "13px",
              color: "var(--accent)",
              textDecoration: "none",
            }}>View all →</Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentContacts.map((msg) => (
              <div key={msg.id} style={{
                padding: "20px 24px",
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
              }}>
                <div>
                  <p style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--text)",
                    marginBottom: "4px",
                  }}>{msg.name}
                    <span style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      fontWeight: 400,
                      marginLeft: "8px",
                    }}>{msg.email}</span>
                  </p>
                  <p style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                  }}>{msg.message.slice(0, 100)}
                    {msg.message.length > 100 ? "..." : ""}
                  </p>
                </div>
                <p style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  flexShrink: 0,
                }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}