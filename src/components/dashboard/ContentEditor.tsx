"use client";

import { useState } from "react";

interface Props {
  homeContent: any;
  aboutContent: any;
  servicesContent: any;
}

export default function ContentEditor({ homeContent, aboutContent, servicesContent }: Props) {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "services">("about");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [about, setAbout] = useState({
    headline: aboutContent?.headline || "We Believe Every Artist Deserves a Stage",
    story: aboutContent?.story || "",
    mission: aboutContent?.mission || "",
  });

  const [services, setServices] = useState({
    headline: servicesContent?.headline || "Everything an Independent Artist Needs",
    subheadline: servicesContent?.subheadline || "",
  });

  const [home, setHome] = useState({
    heroTitle: homeContent?.heroTitle || "Where Artists Tell Their Story",
    heroSubtitle: homeContent?.heroSubtitle || "",
  });

  async function handleSave(page: string, data: any) {
    setLoading(true);
    setSuccess("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, content: data }),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(`${page} content saved successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      alert("Something went wrong.");
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

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "12px", fontWeight: 500,
    color: "var(--text)", marginBottom: "6px",
    fontFamily: "'DM Sans', sans-serif",
  };

  const tabs = ["about", "services", "home"] as const;

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "32px", borderBottom: "1px solid var(--border)" }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "10px 24px", fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            background: "none", border: "none",
            borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
            color: activeTab === tab ? "var(--accent)" : "var(--text-muted)",
            cursor: "pointer", textTransform: "capitalize",
            marginBottom: "-1px",
          }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {success && (
        <div style={{
          padding: "12px 16px", background: "#D1FAE5",
          border: "1px solid #A7F3D0", borderRadius: "4px",
          color: "#065F46", fontSize: "14px", marginBottom: "24px",
        }}>{success}</div>
      )}

      {/* About Tab */}
      {activeTab === "about" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Page Headline</label>
            <input value={about.headline}
              onChange={e => setAbout({ ...about, headline: e.target.value })}
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Our Story</label>
            <textarea value={about.story} rows={6}
              onChange={e => setAbout({ ...about, story: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle}>Mission Statement</label>
            <input value={about.mission}
              onChange={e => setAbout({ ...about, mission: e.target.value })}
              style={inputStyle} />
          </div>
          <button onClick={() => handleSave("about", about)}
            disabled={loading} className="btn-primary"
            style={{ alignSelf: "flex-start", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : "Save About Page"}
          </button>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === "services" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Page Headline</label>
            <input value={services.headline}
              onChange={e => setServices({ ...services, headline: e.target.value })}
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Subheadline</label>
            <textarea value={services.subheadline} rows={3}
              onChange={e => setServices({ ...services, subheadline: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <button onClick={() => handleSave("services", services)}
            disabled={loading} className="btn-primary"
            style={{ alignSelf: "flex-start", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : "Save Services Page"}
          </button>
        </div>
      )}

      {/* Home Tab */}
      {activeTab === "home" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Hero Title</label>
            <input value={home.heroTitle}
              onChange={e => setHome({ ...home, heroTitle: e.target.value })}
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Hero Subtitle</label>
            <textarea value={home.heroSubtitle} rows={3}
              onChange={e => setHome({ ...home, heroSubtitle: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <button onClick={() => handleSave("home", home)}
            disabled={loading} className="btn-primary"
            style={{ alignSelf: "flex-start", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : "Save Home Page"}
          </button>
        </div>
      )}
    </div>
  );
}