import React from "react";

const sections = [
  { id: "medical", label: "Medical", status: "준비중" },
];

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e0e0e0",
      fontFamily: "'Noto Sans KR', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <h1 style={{
        fontSize: "2.4rem",
        fontWeight: 700,
        letterSpacing: "0.15em",
        color: "#fff",
        marginBottom: 8,
      }}>
        DODO STATION
      </h1>
      <p style={{
        fontSize: "0.95rem",
        color: "#666",
        marginBottom: 60,
        letterSpacing: "0.05em",
      }}>
        Personal Hub
      </p>

      <div style={{
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        {sections.map(s => (
          <div key={s.id} style={{
            width: 200,
            padding: "32px 24px",
            background: "#111",
            borderRadius: 12,
            border: "1px solid #222",
            textAlign: "center",
            transition: "border-color 0.2s",
            cursor: "default",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#444"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
          >
            <div style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#fff",
              marginBottom: 12,
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: "0.8rem",
              color: "#555",
              padding: "4px 12px",
              border: "1px solid #333",
              borderRadius: 20,
              display: "inline-block",
            }}>
              {s.status}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position: "fixed",
        bottom: 24,
        fontSize: "0.75rem",
        color: "#333",
      }}>
        &copy; 2026 DODO STATION
      </div>
    </div>
  );
}
