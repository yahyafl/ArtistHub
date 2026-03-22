import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ProjectsManager from "@/components/dashboard/ProjectsManager";

export default async function DashboardProjectsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { submissions: true } },
    },
    // Artists only see their own projects
    where: role === "ARTIST" ? { authorId: userId } : undefined,
  });

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">Content</span>
        <h1 style={{ fontSize: "32px" }}>Projects</h1>
      </div>
      <ProjectsManager
        projects={projects}
        userId={userId}
        userRole={role}
      />
    </div>
  );
}