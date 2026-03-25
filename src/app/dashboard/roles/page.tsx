import prisma from "@/lib/prisma";
import RolesManager from "@/components/dashboard/RolesManager";

export default async function RolesPage() {
  const [roles, permissions] = await Promise.all([
    prisma.role.findMany({
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.permission.findMany({ orderBy: { section: "asc" } }),
  ]);

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">Access Control</span>
        <h1 style={{ fontSize: "32px" }}>Roles & Permissions</h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
          Create roles and assign specific permissions to control what each user can do.
        </p>
      </div>
      <RolesManager roles={roles} permissions={permissions} />
    </div>
  );
}