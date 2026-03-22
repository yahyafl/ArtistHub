"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: Date;
}

interface Props { blogs: Blog[]; }

const emptyForm = { title: "", content: "", imageUrl: "" };

export default function BlogManager({ blogs }: Props) {
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
    if (!form.title || !form.content) {
      setError("Title and content are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const url = editId ? `/api/blog/${editId}` : "/api/blog";
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
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function handleEdit(blog: Blog) {
    setForm({
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl || "",
    });
    setEditId(blog.id);
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
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "+ New Blog Post"}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "4px", padding: "32px", marginBottom: "32px",
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px", marginBottom: "24px",
          }}>
            {editId ? "Edit Post" : "New Blog Post"}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="Blog post title" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Image URL</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
                placeholder="https://..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Content *</label>
              <textarea name="content" value={form.content} onChange={handleChange}
                rows={10} placeholder="Write your blog post here..."
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

      {/* Blog list */}
      {blogs.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "4px", color: "var(--text-muted)",
        }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>✍️</p>
          <p>No blog posts yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {blogs.map((blog) => (
            <div key={blog.id} style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: "4px", padding: "20px 24px",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: "16px",
            }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: "16px", fontWeight: 500,
                  color: "var(--text)", marginBottom: "4px",
                }}>{blog.title}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })} · {blog.content.slice(0, 80)}...
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button onClick={() => handleEdit(blog)}
                  className="btn-outline"
                  style={{ padding: "6px 16px", fontSize: "13px" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(blog.id)} style={{
                  padding: "6px 16px", fontSize: "13px",
                  border: "1px solid #FECACA", background: "#FEE2E2",
                  color: "#DC2626", borderRadius: "2px", cursor: "pointer",
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}