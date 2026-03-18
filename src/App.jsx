import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const ALLOWED_EMAIL = "kdh@menuit.io";

const tabs = [
  { id: "home", label: "도도스테이션" },
  { id: "medical", label: "의료" },
  { id: "stock", label: "주식" },
];

const sections = [
  { id: "medical", label: "Medical", status: "준비중" },
  { id: "stock", label: "Stock", status: "준비중" },
];

const medicalSubs = [
  { id: "diagnosis", label: "진단" },
  { id: "treatment", label: "치료" },
  { id: "billing", label: "청구" },
  { id: "insurance", label: "보험" },
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

function Header({ activeTab, setActiveTab, onLogout }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 56,
      background: "#0a0a0a",
      borderBottom: "1px solid #1a1a1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      zIndex: 100,
      fontFamily: "'Noto Sans KR', sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => t.id !== "home" && setActiveTab(t.id)}
            style={{
              background: "none",
              border: "none",
              color: t.id === "home" ? "#fff" : activeTab === t.id ? "#fff" : "#555",
              fontSize: t.id === "home" ? "1rem" : "0.9rem",
              fontWeight: t.id === "home" ? 700 : activeTab === t.id ? 600 : 400,
              cursor: t.id === "home" ? "default" : "pointer",
              padding: "4px 0",
              borderBottom: t.id !== "home" && activeTab === t.id ? "2px solid #fff" : "2px solid transparent",
              letterSpacing: t.id === "home" ? "0.08em" : 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
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
  );
}

function HomePage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 56px)",
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
          }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginBottom: 12 }}>
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
    </div>
  );
}

function SubTabs({ items, active, setActive }) {
  return (
    <div style={{
      display: "flex",
      gap: 0,
      borderBottom: "1px solid #1a1a1a",
      padding: "0 24px",
    }}>
      {items.map(t => (
        <button
          key={t.id}
          onClick={() => setActive(t.id)}
          style={{
            background: "none",
            border: "none",
            borderBottom: active === t.id ? "2px solid #888" : "2px solid transparent",
            color: active === t.id ? "#ddd" : "#555",
            fontSize: "0.82rem",
            fontWeight: active === t.id ? 600 : 400,
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function BodyDiagram() {
  const organs = [
    { id: "dental", label: "치과", y: 60, bodyX: 200, color: "#e0e0e0" },
    { id: "thyroid", label: "갑상선", y: 102, bodyX: 200, color: "#6ec6ff" },
    { id: "lung", label: "폐", y: 155, bodyX: 200, color: "#81c784" },
    { id: "stomach", label: "위", y: 210, bodyX: 210, color: "#ffb74d" },
    { id: "pancreas", label: "췌장", y: 240, bodyX: 205, color: "#ce93d8" },
    { id: "colon", label: "대장", y: 280, bodyX: 200, color: "#ef9a9a" },
    { id: "testicle", label: "고환", y: 370, bodyX: 200, color: "#90caf9" },
  ];
  const lineEnd = 340;
  const labelX = 355;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <svg width="500" height="480" viewBox="0 0 500 480">
        {/* Head */}
        <ellipse cx="200" cy="45" rx="28" ry="32" fill="none" stroke="#444" strokeWidth="1.5" />
        {/* Neck */}
        <line x1="200" y1="77" x2="200" y2="95" stroke="#444" strokeWidth="1.5" />
        {/* Body torso */}
        <path d="M160,95 Q140,95 135,115 L130,200 Q128,260 140,300 L155,340 Q160,355 165,360 L170,370"
          fill="none" stroke="#444" strokeWidth="1.5" />
        <path d="M240,95 Q260,95 265,115 L270,200 Q272,260 260,300 L245,340 Q240,355 235,360 L230,370"
          fill="none" stroke="#444" strokeWidth="1.5" />
        {/* Shoulders */}
        <path d="M160,95 Q140,95 110,110 L85,130" fill="none" stroke="#444" strokeWidth="1.5" />
        <path d="M240,95 Q260,95 290,110 L315,130" fill="none" stroke="#444" strokeWidth="1.5" />
        {/* Arms left */}
        <path d="M85,130 L65,200 L55,260 L60,280" fill="none" stroke="#444" strokeWidth="1.5" />
        {/* Arms right */}
        <path d="M315,130 L335,200 L345,260 L340,280" fill="none" stroke="#444" strokeWidth="1.5" />
        {/* Hips to legs */}
        <path d="M170,370 L165,375 Q160,385 165,400 L175,470" fill="none" stroke="#444" strokeWidth="1.5" />
        <path d="M230,370 L235,375 Q240,385 235,400 L225,470" fill="none" stroke="#444" strokeWidth="1.5" />
        {/* Center line (subtle) */}
        <line x1="200" y1="95" x2="200" y2="370" stroke="#222" strokeWidth="0.5" strokeDasharray="4,4" />

        {/* Organ dots, lines, labels */}
        {organs.map(o => (
          <g key={o.id}>
            {/* Dot on body */}
            <circle cx={o.bodyX} cy={o.y} r="5" fill={o.color} opacity="0.7" />
            <circle cx={o.bodyX} cy={o.y} r="8" fill={o.color} opacity="0.15" />
            {/* Line from body to label */}
            <line
              x1={o.bodyX + 10} y1={o.y}
              x2={lineEnd} y2={o.y}
              stroke={o.color} strokeWidth="1" opacity="0.4"
              strokeDasharray="3,3"
            />
            {/* Label */}
            <text
              x={labelX} y={o.y + 5}
              fill={o.color}
              fontSize="14"
              fontFamily="'Noto Sans KR', sans-serif"
              fontWeight="600"
            >
              {o.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const cardStyle = { background: "#111", border: "1px solid #1a1a1a", borderRadius: 8, padding: "12px 16px", marginBottom: 8 };
const subBtnStyle = { padding: "6px 14px", borderRadius: 6, border: "1px solid #333", background: "transparent", color: "#888", fontSize: "0.8rem", cursor: "pointer" };

function FileUploadSection({ bucket, title, description }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.storage.from(bucket).list("", { sortBy: { column: "created_at", order: "desc" } });
    if (data) setFiles(data.filter(f => f.name !== ".emptyFolderPlaceholder"));
  };
  useEffect(() => { load(); }, [bucket]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    await supabase.storage.from(bucket).upload(`${Date.now()}_${file.name}`, file);
    setUploading(false);
    load();
    e.target.value = "";
  };

  const handleDownload = async (name) => {
    const { data } = await supabase.storage.from(bucket).createSignedUrl(name, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const handleDelete = async (name) => {
    await supabase.storage.from(bucket).remove([name]);
    load();
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#ccc" }}>{title}</div>
        <label style={{ ...subBtnStyle, opacity: uploading ? 0.5 : 1 }}>
          {uploading ? "업로드 중..." : "파일 업로드"}
          <input type="file" hidden onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {description && <div style={{ fontSize: "0.8rem", color: "#555", marginBottom: 16 }}>{description}</div>}
      {files.length === 0 ? (
        <div style={{ textAlign: "center", color: "#444", fontSize: "0.85rem", padding: 40 }}>업로드된 파일이 없습니다</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {files.map(f => (
            <div key={f.name} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div onClick={() => handleDownload(f.name)} style={{ fontSize: "0.85rem", color: "#aaa", cursor: "pointer", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {f.name.replace(/^\d+_/, "")}
              </div>
              <div style={{ display: "flex", gap: 8, marginLeft: 12, flexShrink: 0 }}>
                <span style={{ fontSize: "0.7rem", color: "#555" }}>{new Date(f.created_at).toLocaleDateString("ko-KR")}</span>
                <button onClick={() => handleDelete(f.name)} style={{ background: "none", border: "none", color: "#555", fontSize: "0.75rem", cursor: "pointer" }}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MedicalPage() {
  const [subTab, setSubTab] = useState("diagnosis");

  return (
    <div>
      <SubTabs items={medicalSubs} active={subTab} setActive={setSubTab} />
      {subTab === "diagnosis" && (
        <div>
          <BodyDiagram />
          <FileUploadSection bucket="diagnosis" title="진단서" description="진단서를 업로드하면 부위별로 자동 정리됩니다" />
        </div>
      )}
      {subTab === "treatment" && <FileUploadSection bucket="treatment-docs" title="치료 기록" description="치료 과정 관련 서류를 업로드해주세요" />}
      {subTab === "billing" && <FileUploadSection bucket="billing-docs" title="청구 내역" description="치료일 기준 보험 청구 서류를 업로드해주세요" />}
      {subTab === "insurance" && <FileUploadSection bucket="insurance-docs" title="보험 가입 내역 / 약관" description="보험 증권, 약관 등을 업로드해주세요" />}
    </div>
  );
}

function ComingSoon({ title }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 56px)",
    }}>
      <div style={{ fontSize: "1.4rem", fontWeight: 600, color: "#fff", marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ fontSize: "0.9rem", color: "#555" }}>준비중</div>
    </div>
  );
}

function Home({ onLogout }) {
  const [activeTab, setActiveTab] = useState("medical");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e0e0e0",
      fontFamily: "'Noto Sans KR', sans-serif",
    }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <div style={{ paddingTop: 56 }}>
        {activeTab === "home" && <HomePage />}
        {activeTab === "medical" && <MedicalPage />}
        {activeTab === "stock" && <ComingSoon title="Stock" />}
      </div>
      <div style={{
        position: "fixed",
        bottom: 24,
        left: 0,
        right: 0,
        textAlign: "center",
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
