"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  name?: string | null;
  email: string;
  status: string;
  role?: Role | null;
  createdAt: Date;
  _count: { projects: number };
}

interface Props {
  users: User[];
  roles: Role[];
}

export default function UsersManager({ users, roles }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"pending" | "active">("pending");
  const [loading, setLoading] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "", email: "", password: "", roleId: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const pending = users.filter(u => u.status === "PENDING");
  const active = users.filter(u => u.status === "ACTIVE");

  async function handleApprove(userId: string, roleId: string) {
    if (!roleId) { alert("Please select a role first."); return; }
    setLoading(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE", roleId }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function handleReject(userId: string) {
    if (!confirm("Reject this user?")) return;
    setLoading(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function handleRoleChange(userId: string, roleId: string) {
    setLoading(userId);
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function handleCreate() {
    if (!createForm.name || !createForm.email || !createForm.password || !createForm.roleId) {
      setCreateError("All fields are required.");
      return;
    }
    setCreateLoading(true);
    setCreateError("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) { setCreateError(data.error); return; }
      setShowCreate(false);
      setCreateForm({ name: "", email: "", password: "", roleId: "" });
      router.refresh();
    } catch {
      setCreateError("Something went wrong.");
    } finally {
      setCreateLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    border: "1px solid var(--border)", borderRadius: "2px",
    fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
    background: "var(--white)", color: "var(--text)", outline: "none",
  };

  return (
    <div>
      {/* Top actions */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px" }}>
          {(["pending", "active"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 20px", fontSize: "14px",
              fontFamily: "'DM Sans', sans-serif",
              background: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "white" : "var(--text-muted)",
              border: "1px solid",
              borderColor: tab === t ? "var(--accent)" : "var(--border)",
              borderRadius: "2px", cursor: "pointer",
            }}>
              {t === "pending" ? `Pending (${pending.length})` : `Active (${active.length})`}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
          + Create User
        </button>
      </div>

      {/* Create user form */}
      {showCreate && (
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "4px", padding: "28px", marginBottom: "24px",
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "18px", marginBottom: "20px",
          }}>Create New User</h3>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "16px", marginBottom: "16px",
          }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>
                Full Name
              </label>
              <input value={createForm.name}
                onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="John Doe" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>
                Email
              </label>
              <input type="email" value={createForm.email}
                onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="john@example.com" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>
                Password
              </label>
              <input type="password" value={createForm.password}
                onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="••••••••" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, marginBottom: "6px" }}>
                Role
              </label>
              <select value={createForm.roleId}
                onChange={e => setCreateForm({ ...createForm, roleId: e.target.value })}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select a role...</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
          {createError && (
            <p style={{
              fontSize: "13px", color: "#DC2626",
              padding: "10px", background: "#FEE2E2",
              borderRadius: "2px", marginBottom: "16px",
            }}>{createError}</p>
          )}
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleCreate} disabled={createLoading}
              className="btn-primary" style={{ opacity: createLoading ? 0.7 : 1 }}>
              {createLoading ? "Creating..." : "Create User"}
            </button>
            <button onClick={() => setShowCreate(false)} className="btn-outline">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pending users */}
      {tab === "pending" && (
        <div>
          {pending.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px",
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "4px", color: "var(--text-muted)",
            }}>
              <p style={{ fontSize: "32px", marginBottom: "12px" }}>✅</p>
              <p>No pending applications.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {pending.map(user => (
                <PendingUserCard
                  key={user.id}
                  user={user}
                  roles={roles}
                  loading={loading === user.id}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active users */}
      {tab === "active" && (
        <div>
          {active.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px",
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "4px", color: "var(--text-muted)",
            }}>
              <p>No active users yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {active.map(user => (
                <ActiveUserCard
                  key={user.id}
                  user={user}
                  roles={roles}
                  loading={loading === user.id}
                  onRoleChange={handleRoleChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PendingUserCard({ user, roles, loading, onApprove, onReject }: any) {
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div style={{
      background: "var(--white)", border: "1px solid var(--border)",
      borderRadius: "4px", padding: "20px 24px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", gap: "16px",
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text)", marginBottom: "2px" }}>
          {user.name || "No name"}
        </p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          {user.email} · Applied {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
          style={{
            padding: "6px 12px", border: "1px solid var(--border)",
            borderRadius: "2px", fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            background: "var(--white)", color: "var(--text)",
            cursor: "pointer", outline: "none",
          }}>
          <option value="">Assign role...</option>
          {roles.map((r: any) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <button onClick={() => onApprove(user.id, selectedRole)}
          disabled={loading}
          style={{
            padding: "6px 16px", fontSize: "13px",
            border: "1px solid #A7F3D0", background: "#D1FAE5",
            color: "#065F46", borderRadius: "2px", cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}>
          Approve
        </button>

        <button onClick={() => onReject(user.id)} disabled={loading} style={{
          padding: "6px 16px", fontSize: "13px",
          border: "1px solid #FECACA", background: "#FEE2E2",
          color: "#DC2626", borderRadius: "2px", cursor: "pointer",
        }}>
          Reject
        </button>
      </div>
    </div>
  );
}

function ActiveUserCard({ user, roles, loading, onRoleChange }: any) {
  return (
    <div style={{
      background: "var(--white)", border: "1px solid var(--border)",
      borderRadius: "4px", padding: "20px 24px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", gap: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{
          width: "40px", height: "40px", background: "var(--accent)",
          borderRadius: "50%", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "16px",
          fontWeight: 700, color: "white", flexShrink: 0,
        }}>
          {(user.name || user.email).charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text)", marginBottom: "2px" }}>
            {user.name || "No name"}
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {user.email} · {user._count.projects} projects
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <select
          value={user.role?.id || ""}
          onChange={e => onRoleChange(user.id, e.target.value)}
          disabled={loading}
          style={{
            padding: "6px 12px", border: "1px solid var(--border)",
            borderRadius: "2px", fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            background: "var(--white)", color: "var(--text)",
            cursor: "pointer", outline: "none",
          }}>
          <option value="">No role</option>
          {roles.map((r: any) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <span style={{
          fontSize: "11px", padding: "3px 10px",
          background: "var(--highlight)", color: "var(--accent)",
          borderRadius: "100px",
        }}>
          {user.role?.name || "No Role"}
        </span>
      </div>
    </div>
  );
}