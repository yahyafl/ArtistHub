"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { PERMISSIONS, hasAnyPermission } from "@/lib/permissions";

interface Props {
  permissions: string[];
  userName: string;
  userEmail: string;
  userRole: string;
}

const allLinks = [
  { href: "/dashboard", label: "Overview", icon: "📊", permissions: null },
  {
    href: "/dashboard/projects",
    label: "Projects",
    icon: "🎵",
    permissions: [
      PERMISSIONS.PROJECTS_READ,
      PERMISSIONS.PROJECTS_CREATE,
      PERMISSIONS.PROJECTS_EDIT,
      PERMISSIONS.PROJECTS_DELETE,
    ],
  },
  {
    href: "/dashboard/blog",
    label: "Blog",
    icon: "✍️",
    permissions: [
      PERMISSIONS.BLOG_READ,
      PERMISSIONS.BLOG_CREATE,
      PERMISSIONS.BLOG_EDIT,
      PERMISSIONS.BLOG_DELETE,
    ],
  },
  {
    href: "/dashboard/news",
    label: "News",
    icon: "📰",
    permissions: [
      PERMISSIONS.NEWS_READ,
      PERMISSIONS.NEWS_CREATE,
      PERMISSIONS.NEWS_EDIT,
      PERMISSIONS.NEWS_DELETE,
    ],
  },
  {
    href: "/dashboard/submissions",
    label: "Submissions",
    icon: "📬",
    permissions: [PERMISSIONS.SUBMISSIONS_READ],
  },
  {
    href: "/dashboard/contacts",
    label: "Contact Messages",
    icon: "✉️",
    permissions: [PERMISSIONS.CONTACTS_READ],
  },
  {
    href: "/dashboard/content",
    label: "Site Content",
    icon: "🖊️",
    permissions: [PERMISSIONS.CONTENT_EDIT],
  },
  {
    href: "/dashboard/roles",
    label: "Roles",
    icon: "🔑",
    permissions: [PERMISSIONS.USERS_MANAGE],
  },
  {
    href: "/dashboard/users",
    label: "Users",
    icon: "👥",
    permissions: [PERMISSIONS.USERS_MANAGE],
  },
];

export default function DashboardSidebar({ permissions, userName, userEmail, userRole }: Props) {
  const pathname = usePathname();

  const links = allLinks.filter((link) =>
    link.permissions === null || hasAnyPermission(permissions, link.permissions)
  );

  return (
    <aside className="dashboard-sidebar">
      {/* Logo */}
      <div className="dashboard-sidebar__logo">
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "22px", fontWeight: 700, color: "white",
        }}>
          Artist<span style={{ color: "var(--accent)" }}>Hub</span>
        </p>
        <p style={{
          fontSize: "11px", color: "rgba(255,255,255,0.4)",
          marginTop: "4px", letterSpacing: "1px", textTransform: "uppercase",
        }}>Dashboard</p>
      </div>

      {/* User info */}
      <div className="dashboard-sidebar__user">
        <div style={{
          width: "36px", height: "36px", background: "var(--accent)",
          borderRadius: "50%", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "14px", fontWeight: 700,
          color: "white", marginBottom: "10px",
        }}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "white", marginBottom: "2px" }}>
          {userName}
        </p>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
          {userEmail}
        </p>
        <span style={{
          fontSize: "10px", padding: "2px 8px", background: "var(--accent)",
          color: "white", borderRadius: "100px", letterSpacing: "1px",
          textTransform: "uppercase",
        }}>{userRole}</span>
      </div>

      {/* Navigation */}
      <nav className="dashboard-sidebar__nav">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`dashboard-nav-link${isActive ? " is-active" : ""}`}
            >
              <span style={{ fontSize: "16px" }}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="dashboard-sidebar__bottom">
        <Link href="/" style={{
          fontSize: "13px", color: "var(--sidebar-muted)",
          textDecoration: "none", display: "flex", alignItems: "center", gap: "8px",
        }}>← View Website</Link>
        <button onClick={() => signOut({ callbackUrl: "/login" })} style={{
          background: "none", border: "none", fontSize: "13px",
          color: "var(--sidebar-muted)", cursor: "pointer",
          textAlign: "left", padding: "0", display: "flex",
          alignItems: "center", gap: "8px",
        }}>🚪 Sign Out</button>
      </div>
    </aside>
  );
}