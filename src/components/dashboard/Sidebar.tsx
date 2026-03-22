"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface Props {
  userRole: string;
  userName: string;
  userEmail: string;
}

const allLinks = [
  { href: "/dashboard", label: "Overview", icon: "📊", roles: ["ADMIN", "EDITOR", "ARTIST"] },
  { href: "/dashboard/projects", label: "Projects", icon: "🎵", roles: ["ADMIN", "ARTIST"] },
  { href: "/dashboard/blog", label: "Blog", icon: "✍️", roles: ["ADMIN", "EDITOR"] },
  { href: "/dashboard/news", label: "News", icon: "📰", roles: ["ADMIN", "EDITOR"] },
  { href: "/dashboard/submissions", label: "Submissions", icon: "📬", roles: ["ADMIN", "ARTIST"] },
  { href: "/dashboard/contacts", label: "Contact Messages", icon: "✉️", roles: ["ADMIN"] },
  { href: "/dashboard/content", label: "Site Content", icon: "🖊️", roles: ["ADMIN"] },
  { href: "/dashboard/users", label: "Users", icon: "👥", roles: ["ADMIN"] },
];

export default function DashboardSidebar({ userRole, userName, userEmail }: Props) {
  const pathname = usePathname();

  const links = allLinks.filter(link => link.roles.includes(userRole));

  return (
    <aside style={{
      width: "260px",
      minHeight: "100vh",
      background: "var(--text)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "32px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "22px",
          fontWeight: 700,
          color: "white",
        }}>
          Artist<span style={{ color: "var(--accent)" }}>Hub</span>
        </p>
        <p style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.4)",
          marginTop: "4px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>Dashboard</p>
      </div>

      {/* User info */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{
          width: "36px",
          height: "36px",
          background: "var(--accent)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: 700,
          color: "white",
          marginBottom: "10px",
        }}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <p style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "white",
          marginBottom: "2px",
        }}>{userName}</p>
        <p style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.4)",
          marginBottom: "6px",
        }}>{userEmail}</p>
        <span style={{
          fontSize: "10px",
          padding: "2px 8px",
          background: "var(--accent)",
          color: "white",
          borderRadius: "100px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>{userRole}</span>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: "16px 0",
      }}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 24px",
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
                color: isActive ? "white" : "rgba(255,255,255,0.5)",
                textDecoration: "none",
                background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                borderLeft: isActive ? "3px solid var(--accent)" : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: "16px" }}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{
        padding: "16px 24px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <Link href="/" style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.4)",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          ← View Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            background: "none",
            border: "none",
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            textAlign: "left",
            padding: "0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}