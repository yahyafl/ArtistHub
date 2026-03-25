"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Permission {
  id: string;
  name: string;
  label: string;
  section: string;
}

interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: { permission: Permission }[];
  _count: { users: number };
}

interface Props {
  roles: Role[];
  permissions: Permission[];
}

export default function RolesManager({ roles, permissions }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Group permissions by section
  const sections = permissions.reduce((acc, perm) => {
    if (!acc[perm.section]) acc[perm.section] = [];
    acc[perm.section].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  function openCreate() {
    setEditRole(null);
    setName("");
    setDescription("");
    setSelected([]);
    setShowForm(true);
  }

  function openEdit(role: Role) {
    setEditRole(role);
    setName(role.name);
    setDescription(role.description || "");
    setSelected(role.permissions.map(rp => rp.permission.id));
    setShowForm(true);
  }

  function togglePermission(permId: string) {
    setSelected(prev =>
      prev.includes(permId)
        ? prev.filter(id => id !== permId)
        : [...prev, permId]
    );
  }

  function toggleSection(sectionPerms: Permission[]) {
    const allSelected = sectionPerms.every(p => selected.includes(p.id));
    if (allSelected) {
      setSelected(prev => prev.filter(id => !sectionPerms.map(p => p.id).includes(id)));
    } else {
      setSelected(prev => [...new Set([...prev, ...sectionPerms.map(p => p.id)])]);
    }
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const url = editRole ? `/api/roles/${editRole.id}` : "/api/roles";
      const method = editRole ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, permissionIds: selected }),
      });
      if (!res.ok) throw new Error("Failed");
      setShowForm(false);
      router.refresh();
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this role?")) return;
    await fetch(`/api/roles/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    border: "1px solid var(--border)", borderRadius: "2px",
    fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
    background: "var(--white)", color: "var(--text)", outline: "none",
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <button onClick={openCreate} className="btn-primary">
          + Create New Role
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "4px", padding: "32px", marginBottom: "32px",
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px", marginBottom: "24px",
          }}>
            {editRole ? `Edit Role: ${editRole.name}` : "Create New Role"}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
            <div>
              <label style={{
                display: "block", fontSize: "12px", fontWeight: 500,
                color: "var(--text)", marginBottom: "6px",
              }}>Role Name *</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Blog Editor" style={inputStyle} />
            </div>
            <div>
              <label style={{
                display: "block", fontSize: "12px", fontWeight: 500,
                color: "var(--text)", marginBottom: "6px",
              }}>Description</label>
              <input value={description} onChange={e => setDescription(e.target.value)}
                placeholder="What can this role do?" style={inputStyle} />
            </div>
          </div>

          {/* Permissions */}
          <p style={{
            fontSize: "12px", fontWeight: 500, color: "var(--text)",
            marginBottom: "16px", letterSpacing: "0.5px",
          }}>PERMISSIONS</p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}>
            {Object.entries(sections).map(([section, perms]) => {
              const allSelected = perms.every(p => selected.includes(p.id));
              return (
                <div key={section} style={{
                  background: "var(--white)", border: "1px solid var(--border)",
                  borderRadius: "4px", padding: "16px",
                }}>
                  {/* Section header */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: "12px",
                    paddingBottom: "10px", borderBottom: "1px solid var(--border)",
                  }}>
                    <p style={{
                      fontSize: "12px", fontWeight: 600,
                      textTransform: "uppercase", letterSpacing: "1px",
                      color: "var(--accent)",
                    }}>{section}</p>
                    <button onClick={() => toggleSection(perms)} style={{
                      fontSize: "11px", background: "none", border: "none",
                      color: "var(--text-muted)", cursor: "pointer",
                      textDecoration: "underline",
                    }}>
                      {allSelected ? "Deselect all" : "Select all"}
                    </button>
                  </div>

                  {/* Permissions */}
                  {perms.map(perm => (
                    <label key={perm.id} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      marginBottom: "8px", cursor: "pointer",
                    }}>
                      <input
                        type="checkbox"
                        checked={selected.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        style={{ accentColor: "var(--accent)", width: "14px", height: "14px" }}
                      />
                      <span style={{ fontSize: "13px", color: "var(--text)" }}>
                        {perm.label}
                      </span>
                    </label>
                  ))}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving..." : editRole ? "Update Role" : "Create Role"}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Roles list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {roles.map(role => (
          <div key={role.id} style={{
            background: "var(--white)", border: "1px solid var(--border)",
            borderRadius: "4px", padding: "24px",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", marginBottom: "16px",
            }}>
              <div>
                <p style={{
                  fontSize: "17px", fontWeight: 600,
                  color: "var(--text)", marginBottom: "4px",
                }}>{role.name}</p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {role.description} · {role._count.users} users
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => openEdit(role)}
                  className="btn-outline"
                  style={{ padding: "6px 16px", fontSize: "13px" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(role.id)} style={{
                  padding: "6px 16px", fontSize: "13px",
                  border: "1px solid #FECACA", background: "#FEE2E2",
                  color: "#DC2626", borderRadius: "2px", cursor: "pointer",
                }}>Delete</button>
              </div>
            </div>

            {/* Permission tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {role.permissions.map(rp => (
                <span key={rp.permission.id} style={{
                  fontSize: "11px", padding: "3px 10px",
                  background: "var(--highlight)", color: "var(--accent)",
                  borderRadius: "100px",
                }}>{rp.permission.label}</span>
              ))}
              {role.permissions.length === 0 && (
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  No permissions assigned
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}