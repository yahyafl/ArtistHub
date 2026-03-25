import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { PERMISSIONS, hasAnyPermission, hasPermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const permissions = ((session?.user as any)?.permissions || []) as string[];

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
    {
      label: "Projects",
      value: projectCount,
      icon: "🎵",
      href: "/dashboard/projects",
      permissions: [
        PERMISSIONS.PROJECTS_READ,
        PERMISSIONS.PROJECTS_CREATE,
        PERMISSIONS.PROJECTS_EDIT,
        PERMISSIONS.PROJECTS_DELETE,
      ],
    },
    {
      label: "Blog Posts",
      value: blogCount,
      icon: "✍️",
      href: "/dashboard/blog",
      permissions: [
        PERMISSIONS.BLOG_READ,
        PERMISSIONS.BLOG_CREATE,
        PERMISSIONS.BLOG_EDIT,
        PERMISSIONS.BLOG_DELETE,
      ],
    },
    {
      label: "News",
      value: newsCount,
      icon: "📰",
      href: "/dashboard/news",
      permissions: [
        PERMISSIONS.NEWS_READ,
        PERMISSIONS.NEWS_CREATE,
        PERMISSIONS.NEWS_EDIT,
        PERMISSIONS.NEWS_DELETE,
      ],
    },
    {
      label: "Messages",
      value: contactCount,
      icon: "✉️",
      href: "/dashboard/contacts",
      permissions: [PERMISSIONS.CONTACTS_READ],
    },
    {
      label: "Submissions",
      value: submissionCount,
      icon: "📬",
      href: "/dashboard/submissions",
      permissions: [PERMISSIONS.SUBMISSIONS_READ],
    },
  ].filter((s) => hasAnyPermission(permissions, s.permissions));

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <span className="section-label">Dashboard</span>
        <h1 style={{ fontSize: "32px" }}>
          Welcome back, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="dashboard-subtle">
          Here's what's happening on ArtistHub today.
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
            <div className="card stat-card">
              <p className="stat-card__icon">{stat.icon}</p>
              <p className="stat-card__value">{stat.value}</p>
              <p className="stat-card__label">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent messages */}
      {hasPermission(permissions, PERMISSIONS.CONTACTS_READ) && recentContacts.length > 0 && (
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
              <div key={msg.id} className="dashboard-card" style={{
                padding: "20px 24px",
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