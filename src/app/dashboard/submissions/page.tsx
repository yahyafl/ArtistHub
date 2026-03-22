import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function SubmissionsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      project: { select: { id: true, title: true, authorId: true } },
    },
    where: role === "ARTIST" ? { project: { authorId: userId } } : undefined,
  });

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">Inbox</span>
        <h1 style={{ fontSize: "32px" }}>Project Submissions</h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
          Interest forms submitted by visitors on project pages.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "4px", color: "var(--text-muted)",
        }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>📬</p>
          <p>No submissions yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {submissions.map((sub) => (
            <div key={sub.id} style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: "4px", padding: "24px",
            }}>
              {/* Header */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: "12px",
              }}>
                <div>
                  <p style={{
                    fontSize: "15px", fontWeight: 500,
                    color: "var(--text)", marginBottom: "2px",
                  }}>{sub.name}
                    <span style={{
                      fontSize: "13px", color: "var(--text-muted)",
                      fontWeight: 400, marginLeft: "8px",
                    }}>{sub.email}</span>
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--accent)" }}>
                    Re: {sub.project.title}
                  </p>
                </div>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0 }}>
                  {new Date(sub.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              </div>

              {/* Message */}
              <p style={{
                fontSize: "14px", color: "var(--text-muted)",
                lineHeight: 1.7,
                padding: "12px 16px",
                background: "var(--bg)",
                borderRadius: "2px",
                borderLeft: "3px solid var(--accent)",
              }}>{sub.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}