import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) notFound();

  return (
    <main style={{ padding: "64px 0" }}>
      <div className="container">

        {/* Back */}
        <Link href="/blog" style={{
          fontSize: "13px",
          color: "var(--text-muted)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "40px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          ← Back to Blog
        </Link>

        {/* Article */}
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          {/* Date */}
          <p style={{
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "16px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 5vw, 48px)",
            lineHeight: 1.15,
            marginBottom: "32px",
            color: "var(--text)",
          }}>{blog.title}</h1>

          {/* Image */}
          {blog.imageUrl && (
            <div style={{
              width: "100%",
              height: "360px",
              marginBottom: "40px",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}>
              <img
                src={blog.imageUrl}
                alt={blog.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          {/* Divider */}
          <div style={{
            height: "2px",
            width: "48px",
            background: "var(--accent)",
            marginBottom: "32px",
          }} />

          {/* Content */}
          <div style={{
            fontSize: "16px",
            lineHeight: 1.9,
            color: "var(--text-muted)",
            whiteSpace: "pre-wrap",
          }}>
            {blog.content}
          </div>

          {/* Bottom nav */}
          <div style={{
            marginTop: "64px",
            paddingTop: "32px",
            borderTop: "1px solid var(--border)",
          }}>
            <Link href="/blog" className="btn-outline">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}