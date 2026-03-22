import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.news.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <main style={{ padding: "64px 0" }}>
      <div className="container">

        <Link href="/news" style={{
          fontSize: "13px",
          color: "var(--text-muted)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "40px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          ← Back to News
        </Link>

        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          {/* Label */}
          <span className="section-label">News</span>

          {/* Date */}
          <p style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            marginBottom: "16px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {new Date(item.createdAt).toLocaleDateString("en-US", {
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
          }}>{item.title}</h1>

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
            {item.content}
          </div>

          <div style={{
            marginTop: "64px",
            paddingTop: "32px",
            borderTop: "1px solid var(--border)",
          }}>
            <Link href="/news" className="btn-outline">
              ← Back to News
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}