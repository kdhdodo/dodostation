import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const ALLOWED_EMAIL = "kdh@menuit.io";

const sections = [
  { id: "medical", label: "Medical", status: "준비중" },
];

function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email.toLowerCase() !== ALLOWED_EMAIL) {
      setError("접근 권한이 없는 이메일입니다.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: ALLOWED_EMAIL,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (err) setError(err.message);
    else setSent(true);
  };

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
        marginBottom: 48,
        letterSpacing: "0.05em",
      }}>
        Personal Hub
      </p>

      {sent ? (
        <div style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: 12,
          padding: "32px 40px",
          textAlign: "center",
          maxWidth: 360,
        }}>
          <div style={{ fontSize: "1.1rem", color: "#fff", marginBottom: 12 }}>
            매직링크를 보냈습니다
          </div>
          <div style={{ fontSize: "0.85rem", color: "#888" }}>
            {ALLOWED_EMAIL} 메일함을 확인해주세요.
          </div>
        </div>
      ) : (
        <form onSubmit={handleLogin} style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: 12,
          padding: "32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          minWidth: 300,
        }}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #333",
              background: "#0a0a0a",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
            }}
          />
          {error && (
            <div style={{ color: "#ff6b6b", fontSize: "0.8rem" }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 0",
              borderRadius: 8,
              border: "none",
              background: loading ? "#333" : "#fff",
              color: "#000",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "전송 중..." : "매직링크 보내기"}
          </button>
        </form>
      )}
    </div>
  );
}

function Home({ onLogout }) {
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
      <div style={{ position: "fixed", top: 20, right: 24 }}>
        <button
          onClick={onLogout}
          style={{
            padding: "6px 16px",
            borderRadius: 6,
            border: "1px solid #333",
            background: "transparent",
            color: "#666",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          로그아웃
        </button>
      </div>

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

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s && s.user.email !== ALLOWED_EMAIL) {
        supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(s);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s && s.user.email !== ALLOWED_EMAIL) {
        supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(s);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (!session) return <Login />;

  return <Home onLogout={() => supabase.auth.signOut()} />;
}
