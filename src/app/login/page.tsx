"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        padding: "48px 40px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        boxShadow: "0 20px 60px rgba(74,63,63,0.1)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--text)",
          }}>
            Artist<span style={{ color: "var(--accent)" }}>Hub</span>
          </p>
          <p style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginTop: "6px",
          }}>Sign in to your dashboard</p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text)",
              marginBottom: "6px",
              fontFamily: "'DM Sans', sans-serif",
            }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="artist@artisthub.com"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: "2px",
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
                background: "var(--white)",
                color: "var(--text)",
                outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text)",
              marginBottom: "6px",
              fontFamily: "'DM Sans', sans-serif",
            }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: "2px",
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
                background: "var(--white)",
                color: "var(--text)",
                outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {error && (
            <p style={{
              fontSize: "13px",
              color: "#DC2626",
              padding: "10px 14px",
              background: "#FEE2E2",
              borderRadius: "2px",
            }}>{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "8px",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p style={{
          textAlign: "center",
          fontSize: "12px",
          color: "var(--text-muted)",
          marginTop: "24px",
        }}>
         
        </p>
      </div>
    </main>
  );
}