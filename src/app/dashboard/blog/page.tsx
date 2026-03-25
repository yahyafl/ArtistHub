import prisma from "@/lib/prisma";
import BlogManager from "@/components/dashboard/BlogManager";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasAnyPermission, hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function DashboardBlogPage() {
  const session = await auth();
  const permissions = ((session?.user as any)?.permissions || []) as string[];

  if (!hasAnyPermission(permissions, [
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.BLOG_CREATE,
    PERMISSIONS.BLOG_EDIT,
    PERMISSIONS.BLOG_DELETE,
  ])) {
    redirect("/dashboard");
  }
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  const canCreate = hasPermission(permissions, PERMISSIONS.BLOG_CREATE);
  const canEdit = hasPermission(permissions, PERMISSIONS.BLOG_EDIT);
  const canDelete = hasPermission(permissions, PERMISSIONS.BLOG_DELETE);

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">Content</span>
        <h1 style={{ fontSize: "32px" }}>Blog Posts</h1>
      </div>
      <BlogManager
        blogs={blogs}
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
      />
    </div>
  );
}