import prisma from "@/lib/prisma";
import BlogManager from "@/components/dashboard/BlogManager";

export default async function DashboardBlogPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">Content</span>
        <h1 style={{ fontSize: "32px" }}>Blog Posts</h1>
      </div>
      <BlogManager blogs={blogs} />
    </div>
  );
}