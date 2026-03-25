"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", reason: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    border: "1px solid var(--border)", borderRadius: "2px",
    fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
    background: "var(--white)", color: "var(--text)", outline: "none",
  };

  if (success) {
    return (
      <main style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "var(--bg)",
      }}>
        <div style={{
          width: "100%", maxWidth: "420px",
          padding: "48px 40px", background: "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: "4px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "24px", marginBottom: "12px",
          }}>Application Submitted!</h2>
          <p style={{
            fontSize: "14px", color: "var(--text-muted)",
            lineHeight: 1.7, marginBottom: "24px",
          }}>
            Your account is pending approval. We'll review your application
            and get back to you soon.
          </p>
          <Link href="/login" className="btn-primary"
            style={{ display: "inline-flex" }}>
            Back to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "var(--bg)",
    }}>
      <div style={{
        width: "100%", maxWidth: "420px",
        padding: "48px 40px", background: "var(--bg-card)",
        border: "1px solid var(--border)", borderRadius: "4px",
        boxShadow: "0 20px 60px rgba(74,63,63,0.1)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "28px", fontWeight: 700, color: "var(--text)",
          }}>
            Artist<span style={{ color: "var(--accent)" }}>Hub</span>
          </p>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "6px" }}>
            Apply for an account
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{
              display: "block", fontSize: "12px", fontWeight: 500,
              color: "var(--text)", marginBottom: "6px",
            }}>Full Name</label>
            <input type="text" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div>
            <label style={{
              display: "block", fontSize: "12px", fontWeight: 500,
              color: "var(--text)", marginBottom: "6px",
            }}>Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div>
            <label style={{
              display: "block", fontSize: "12px", fontWeight: 500,
              color: "var(--text)", marginBottom: "6px",
            }}>Password</label>
            <input type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div>
            <label style={{
              display: "block", fontSize: "12px", fontWeight: 500,
              color: "var(--text)", marginBottom: "6px",
            }}>Why do you want to join? <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
            <textarea value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              placeholder="I'm an independent artist looking to showcase my music..."
              rows={3} style={{ ...inputStyle, resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {error && (
            <p style={{
              fontSize: "13px", color: "#DC2626",
              padding: "10px 14px", background: "#FEE2E2",
              borderRadius: "2px",
            }}>{error}</p>
          )}

          <button onClick={handleRegister} disabled={loading}
            className="btn-primary"
            style={{
              width: "100%", justifyContent: "center",
              marginTop: "8px", opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}>
            {loading ? "Submitting..." : "Apply for Access"}
          </button>
        </div>

        <p style={{
          textAlign: "center", fontSize: "13px",
          color: "var(--text-muted)", marginTop: "24px",
        }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}