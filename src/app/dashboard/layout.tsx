import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import BackRefresh from "@/components/dashboard/BackRefresh";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const permissions = (session.user as any)?.permissions || [];
  const userRole = (session.user as any)?.role || "No Role";

  return (
    <div className="dashboard-shell">
      <BackRefresh />
      <DashboardSidebar
        permissions={permissions}
        userName={session.user?.name || "User"}
        userEmail={session.user?.email || ""}
        userRole={userRole}
      />
      <main className="dashboard-main">
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}