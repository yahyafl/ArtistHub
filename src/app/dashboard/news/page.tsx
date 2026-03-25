import prisma from "@/lib/prisma";
import NewsManager from "@/components/dashboard/NewsManager";
import { auth } from "@/lib/auth";
import { PERMISSIONS, hasAnyPermission, hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function DashboardNewsPage() {
  const session = await auth();
  const permissions = ((session?.user as any)?.permissions || []) as string[];

  if (!hasAnyPermission(permissions, [
    PERMISSIONS.NEWS_READ,
    PERMISSIONS.NEWS_CREATE,
    PERMISSIONS.NEWS_EDIT,
    PERMISSIONS.NEWS_DELETE,
  ])) {
    redirect("/dashboard");
  }
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });

  const canCreate = hasPermission(permissions, PERMISSIONS.NEWS_CREATE);
  const canEdit = hasPermission(permissions, PERMISSIONS.NEWS_EDIT);
  const canDelete = hasPermission(permissions, PERMISSIONS.NEWS_DELETE);

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">Content</span>
        <h1 style={{ fontSize: "32px" }}>News</h1>
      </div>
      <NewsManager
        news={news}
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
      />
    </div>
  );
}