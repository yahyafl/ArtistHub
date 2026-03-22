import ProjectCard from "@/components/projects/ProjectCard";
import prisma from "@/lib/prisma";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, email: true } },
      _count: { select: { submissions: true } },
    },
  });

  return (
    <main style={{ padding: "64px 0" }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <span className="section-label">All Music</span>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            marginBottom: "12px",
          }}>
            Explore Projects
          </h1>
          <p style={{
            fontSize: "15px",
            color: "var(--text-muted)",
            maxWidth: "480px",
          }}>
            Discover tracks and albums from independent artists around the world.
          </p>
        </div>

        {/* Grid */}
        {projects.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 0",
            color: "var(--text-muted)",
          }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>🎵</p>
            <p style={{ fontSize: "18px" }}>No projects yet.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}