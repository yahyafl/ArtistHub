"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: { projects: number };
}

interface Props { users: User[]; }

export default function UsersManager({ users }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleRoleChange(userId: string, newRole: string) {
    setLoading(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      router.refresh();
    } catch {
      alert("Failed to update role.");
    } finally {
      setLoading(null);
    }
  }

  const roleColors: Record<string, string> = {
    ADMIN: "#DC2626",
    EDITOR: "#2563EB",
    ARTIST: "var(--accent)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {users.map((user) => (
        <div key={user.id} style={{
          background: "var(--white)", border: "1px solid var(--border)",
          borderRadius: "4px", padding: "20px 24px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: "16px",
        }}>
          {/* Avatar + info */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "40px", height: "40px",
              background: roleColors[user.role] || "var(--accent)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", fontWeight: 700, color: "white", flexShrink: 0,
            }}>
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{
                fontSize: "15px", fontWeight: 500,
                color: "var(--text)", marginBottom: "2px",
              }}>{user.name || "No name"}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {user.email} · {user._count.projects} projects ·{" "}
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Role selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <select
              value={user.role}
              onChange={e => handleRoleChange(user.id, e.target.value)}
              disabled={loading === user.id}
              style={{
                padding: "6px 12px",
                border: "1px solid var(--border)",
                borderRadius: "2px",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
                background: "var(--white)",
                color: "var(--text)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="ADMIN">Admin</option>
              <option value="EDITOR">Editor</option>
              <option value="ARTIST">Artist</option>
            </select>
            <span style={{
              fontSize: "11px", padding: "3px 10px",
              background: roleColors[user.role] + "20",
              color: roleColors[user.role],
              borderRadius: "100px", fontWeight: 500,
            }}>{user.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}