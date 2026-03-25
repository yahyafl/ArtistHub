import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProjectsManager from "@/components/dashboard/ProjectsManager";

export default async function DashboardProjectsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = (session.user as any)?.id;
  const permissions = (session.user as any)?.permissions || [];

  // Check if user has permission
  if (!permissions.includes("projects:read")) {
    redirect("/dashboard");
  }

  const canCreate = permissions.includes("projects:create");
  const canEdit = permissions.includes("projects:edit");
  const canDelete = permissions.includes("projects:delete");

  // Super admin sees all, others see only their own
  const isSuperAdmin = permissions.includes("users:manage");

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { submissions: true } },
    },
    where: isSuperAdmin ? undefined : { authorId: userId },
  });

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">Content</span>
        <h1 style={{ fontSize: "32px" }}>Projects</h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
          {isSuperAdmin ? "All projects on the platform." : "Your projects only."}
        </p>
      </div>
      <ProjectsManager
        projects={projects}
        userId={userId}
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
      />
    </div>
  );
}