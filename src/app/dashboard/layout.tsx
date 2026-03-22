import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--bg)",
    }}>
      <DashboardSidebar
        userRole={(session.user as any).role}
        userName={session.user?.name || "User"}
        userEmail={session.user?.email || ""}
      />
      <main style={{
        flex: 1,
        padding: "40px",
        overflowY: "auto",
      }}>
        {children}
      </main>
    </div>
  );
}