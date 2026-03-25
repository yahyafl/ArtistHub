"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: Date;
}

interface Props {
  news: NewsItem[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const emptyForm = { title: "", content: "", imageUrl: "" };

export default function NewsManager({ news, canCreate, canEdit, canDelete }: Props) {
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
    if (editId && !canEdit) {
      setError("You do not have permission to edit news posts.");
      return;
    }
    if (!editId && !canCreate) {
      setError("You do not have permission to create news posts.");
      return;
    }
    if (!form.title || !form.content) {
      setError("Title and content are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const url = editId ? `/api/news/${editId}` : "/api/news";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    if (!canDelete) {
      setError("You do not have permission to delete news posts.");
      return;
    }
    if (!confirm("Delete this news item?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function handleEdit(item: NewsItem) {
    setForm({
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl || "",
    });
    setEditId(item.id);
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
      {canCreate && (
        <div style={{ marginBottom: "24px" }}>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
            className="btn-primary"
          >
            {showForm ? "Cancel" : "+ New News Post"}
          </button>
        </div>
      )}

      {showForm && (
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "4px", padding: "32px", marginBottom: "32px",
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px", marginBottom: "24px",
          }}>
            {editId ? "Edit News" : "New News Post"}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="News title" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Image URL</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
                placeholder="https://..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Content *</label>
              <textarea name="content" value={form.content} onChange={handleChange}
                rows={8} placeholder="Write the news content here..."
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>

          {error && (
            <p style={{
              marginTop: "12px", fontSize: "13px", color: "#DC2626",
              padding: "10px", background: "#FEE2E2", borderRadius: "2px",
            }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving..." : editId ? "Update" : "Publish"}
            </button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }}
              className="btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {news.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "4px", color: "var(--text-muted)",
        }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>📰</p>
          <p>No news posts yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {news.map((item) => (
            <div key={item.id} style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: "4px", padding: "20px 24px",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: "16px",
            }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: "16px", fontWeight: 500,
                  color: "var(--text)", marginBottom: "4px",
                }}>{item.title}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })} · {item.content.slice(0, 80)}...
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                {canEdit && (
                  <button onClick={() => handleEdit(item)}
                    className="btn-outline"
                    style={{ padding: "6px 16px", fontSize: "13px" }}>
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button onClick={() => handleDelete(item.id)} style={{
                    padding: "6px 16px", fontSize: "13px",
                    border: "1px solid #FECACA", background: "#FEE2E2",
                    color: "#DC2626", borderRadius: "2px", cursor: "pointer",
                  }}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}