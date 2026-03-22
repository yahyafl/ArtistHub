import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ padding: "64px 0" }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <span className="section-label">Our Blog</span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "12px" }}>
            Stories & Insights
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", maxWidth: "480px" }}>
            Thoughts on independent music, artist branding, and the future of the industry.
          </p>
        </div>

        {/* Grid */}
        {blogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>✍️</p>
            <p style={{ fontSize: "18px" }}>No blog posts yet.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "24px",
          }}>
            {blogs.map((blog, index) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="card" style={{ padding: "0", overflow: "hidden", cursor: "pointer" }}>

                  {/* Image / placeholder */}
                  <div style={{
                    height: "200px",
                    background: "var(--bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "48px",
                  }}>
                    {blog.imageUrl ? (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      ["✍️", "🎵", "🎸"][index % 3]
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: "24px" }}>
                    <p style={{
                      fontSize: "11px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginBottom: "10px",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>

                    <h2 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "var(--text)",
                      marginBottom: "12px",
                      lineHeight: 1.3,
                    }}>{blog.title}</h2>

                    <p style={{
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      lineHeight: 1.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      marginBottom: "20px",
                    }}>{blog.content}</p>

                    <span style={{
                      fontSize: "13px",
                      color: "var(--accent)",
                      fontWeight: 500,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}