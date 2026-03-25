"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Music" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--text)",
            textDecoration: "none",
            letterSpacing: "-0.5px",
          }}
        >
          Artist<span style={{ color: "var(--accent)" }}>Hub</span>
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: "flex",
            gap: "36px",
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/register"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--text-muted)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            Join
          </Link>
          <Link
            href="/dashboard"
            className="btn-primary"
            style={{ padding: "8px 20px", fontSize: "13px" }}
          >
            Dashboard
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexDirection: "column",
            gap: "5px",
          }}
          className="mobile-burger"
        >
          <span
            style={{
              display: "block",
              width: "24px",
              height: "1.5px",
              background: "var(--text)",
              transition: "all 0.3s",
            }}
          />
          <span
            style={{
              display: "block",
              width: "24px",
              height: "1.5px",
              background: "var(--text)",
              transition: "all 0.3s",
            }}
          />
          <span
            style={{
              display: "block",
              width: "16px",
              height: "1.5px",
              background: "var(--text)",
              transition: "all 0.3s",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--bg)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "16px",
                color: "var(--text)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
