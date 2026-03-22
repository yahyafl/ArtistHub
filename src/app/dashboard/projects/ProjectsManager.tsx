"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  genre: string;
  mood: string;
  trackUrl?: string | null;
  createdAt: Date;
  author: { name?: string | null };
  _count: { submissions: number };
}

interface Props {
  projects: Project[];
  userId: string;
  userRole: string;
}

const emptyForm = {
  title: "", description: "", genre: "",
  mood: "", imageUrl: "", trackUrl: "",
};

export default function ProjectsManager({ projects, userId, userRole }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.title || !form.description || !form.genre || !form.mood) {
      setError("Title, description, genre and mood are required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const url = editId ? `/api/projects/${editId}` : "/api/projects";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, authorId: userId }),
      });

      if (!res.ok) throw new Error("Failed");
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function handleEdit(project: any) {
    setForm({
      title: project.title,
      description: project.description || "",
      genre: project.genre,
      mood: project.mood,
      imageUrl: project.imageUrl || "",
      trackUrl: project.trackUrl || "",
    });
    setEditId(project.id);
    setShowForm(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    border: "1px solid var(--border)", borderRadius: "2px",
    fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
    background: "var(--white)", color: "var(--text)", outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "12px", fontWeight: 500,
    color: "var(--text)", marginBottom: "6px",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div>
      {/* Add button */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "+ New Project"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          padding: "32px",
          marginBottom: "32px",
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px", marginBottom: "24px",
          }}>
            {editId ? "Edit Project" : "New Project"}
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="Track title" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Genre *</label>
              <input name="genre" value={form.genre} onChange={handleChange}
                placeholder="Arabic, Jazz, Indie..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Mood *</label>
              <input name="mood" value={form.mood} onChange={handleChange}
                placeholder="Happy, Sad, Chill..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Track URL</label>
              <input name="trackUrl" value={form.trackUrl} onChange={handleChange}
                placeholder="SoundCloud / YouTube / Spotify link" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Image URL</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
                placeholder="https://..." style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <label style={labelStyle}>Description *</label>
            <textarea name="description" value={form.description}
              onChange={handleChange} rows={4}
              placeholder="Describe this track..."
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {error && (
            <p style={{
              marginTop: "12px", fontSize: "13px", color: "#DC2626",
              padding: "10px", background: "#FEE2E2", borderRadius: "2px",
            }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving..." : editId ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }}
              className="btn-outline">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects table */}
      {projects.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "4px", color: "var(--text-muted)",
        }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>🎵</p>
          <p>No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {projects.map((project) => (
            <div key={project.id} style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: "11px", padding: "2px 8px",
                    background: "var(--accent)", color: "white",
                    borderRadius: "100px",
                  }}>{project.genre}</span>
                  <span style={{
                    fontSize: "11px", padding: "2px 8px",
                    background: "var(--highlight)", color: "var(--accent)",
                    borderRadius: "100px",
                  }}>{project.mood}</span>
                </div>
                <p style={{
                  fontSize: "16px", fontWeight: 500,
                  color: "var(--text)", marginBottom: "4px",
                }}>{project.title}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  by {project.author.name} ·{" "}
                  {project._count.submissions} submissions ·{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button onClick={() => handleEdit(project)}
                  className="btn-outline"
                  style={{ padding: "6px 16px", fontSize: "13px" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(project.id)}
                  style={{
                    padding: "6px 16px", fontSize: "13px",
                    border: "1px solid #FECACA", background: "#FEE2E2",
                    color: "#DC2626", borderRadius: "2px", cursor: "pointer",
                  }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}