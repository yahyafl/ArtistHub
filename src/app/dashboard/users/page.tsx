import prisma from "@/lib/prisma";
import UsersManager from "@/components/dashboard/UsersManager";

export default async function UsersPage() {
  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        role: true,
        _count: { select: { projects: true } },
      },
    }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">Admin</span>
        <h1 style={{ fontSize: "32px" }}>Users</h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
          Approve registrations, assign roles, and manage user access.
        </p>
      </div>
      <UsersManager users={users as any} roles={roles} />
    </div>
  );
}
