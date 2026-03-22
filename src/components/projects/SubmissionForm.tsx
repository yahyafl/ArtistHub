"use client";

import { useState } from "react";

interface Props {
  projectId: string;
}

export default function SubmissionForm({ projectId }: Props) {
  const [form, setForm] = useState({
    name: "", email: "", message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, projectId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px 20px",
      }}>
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>✅</p>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "22px",
          marginBottom: "8px",
          color: "var(--text)",
        }}>Inquiry Sent!</h3>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>
          Thank you! The artist will review your message and get back to you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="btn-outline"
          style={{ marginTop: "24px" }}
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Name */}
      <div>
        <label style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--text)",
          marginBottom: "6px",
          letterSpacing: "0.5px",
          fontFamily: "'DM Sans', sans-serif",
        }}>Your Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
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
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
      </div>

      {/* Email */}
      <div>
        <label style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--text)",
          marginBottom: "6px",
          letterSpacing: "0.5px",
          fontFamily: "'DM Sans', sans-serif",
        }}>Email Address</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
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
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
      </div>

      {/* Message */}
      <div>
        <label style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--text)",
          marginBottom: "6px",
          letterSpacing: "0.5px",
          fontFamily: "'DM Sans', sans-serif",
        }}>Your Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="I'm interested in collaborating on this track..."
          rows={4}
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
            resize: "vertical",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
      </div>

      {/* Error */}
      {error && (
        <p style={{
          fontSize: "13px",
          color: "#DC2626",
          padding: "10px 14px",
          background: "#FEE2E2",
          borderRadius: "2px",
        }}>{error}</p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary"
        style={{
          width: "100%",
          justifyContent: "center",
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Sending..." : "Send Inquiry"}
      </button>

      <p style={{
        fontSize: "11px",
        color: "var(--text-muted)",
        textAlign: "center",
        lineHeight: 1.5,
      }}>
        Your message will be sent directly to the artist.
      </p>
    </div>
  );
}