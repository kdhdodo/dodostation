import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import StockPage from "./StockPage";

function useMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

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
  const [password, setPassword] = useState("");
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
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError("이메일 또는 비밀번호가 올바르지 않습니다.");
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
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (next !== confirm) { setError("새 비밀번호가 일치하지 않습니다."); return; }
    if (next.length < 8) { setError("비밀번호는 8자 이상이어야 합니다."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password: next });
    setLoading(false);
    if (err) setError(err.message);
    else setSuccess(true);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#111", border: "1px solid #222", borderRadius: 12,
        padding: "32px 40px", minWidth: 320, display: "flex", flexDirection: "column", gap: 16,
      }}>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>비밀번호 변경</div>
        {success ? (
          <div style={{ color: "#4ecdc4", fontSize: "0.9rem" }}>
            변경 완료됐습니다.
            <button onClick={onClose} style={{ marginLeft: 12, background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.8rem" }}>닫기</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="password" placeholder="새 비밀번호" value={next} onChange={e => setNext(e.target.value)} required
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #333", background: "#0a0a0a", color: "#fff", fontSize: "0.9rem", outline: "none" }} />
            <input type="password" placeholder="새 비밀번호 확인" value={confirm} onChange={e => setConfirm(e.target.value)} required
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #333", background: "#0a0a0a", color: "#fff", fontSize: "0.9rem", outline: "none" }} />
            {error && <div style={{ color: "#ff6b6b", fontSize: "0.8rem" }}>{error}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #333", background: "transparent", color: "#666", fontSize: "0.85rem", cursor: "pointer" }}>취소</button>
              <button type="submit" disabled={loading} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: loading ? "#333" : "#fff", color: "#000", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                {loading ? "변경 중..." : "변경"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Header({ activeTab, setActiveTab, onLogout, onChangePassword }) {
  const isMobile = useMobile();
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
      padding: "0 16px",
      zIndex: 100,
      fontFamily: "'Noto Sans KR', sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 16 : 32 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => t.id !== "home" && setActiveTab(t.id)}
            style={{
              background: "none",
              border: "none",
              color: t.id === "home" ? "#fff" : activeTab === t.id ? "#fff" : "#555",
              fontSize: t.id === "home" ? (isMobile ? "0.85rem" : "1rem") : (isMobile ? "0.8rem" : "0.9rem"),
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
      <div style={{ display: "flex", gap: 8 }}>
        {!isMobile && <button
          onClick={onChangePassword}
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
          비밀번호 변경
        </button>}
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

const organMap = {
  "치과": "dental", "갑상선": "thyroid", "폐": "lung",
  "위": "stomach", "췌장": "pancreas", "대장": "colon", "고환": "testicle",
};

function BodyDiagram({ diagnoses, onSelect }) {
  const isMobile = useMobile();
  const activeOrgans = new Set((diagnoses || []).map(d => organMap[d.organ]).filter(Boolean));

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
    <div style={{ display: "flex", justifyContent: "center", padding: "24px 0", overflowX: "hidden" }}>
      <svg width={isMobile ? "100%" : "500"} height={isMobile ? "auto" : "480"} viewBox="0 0 500 480" style={{ maxWidth: 500 }}>
        <ellipse cx="200" cy="45" rx="28" ry="32" fill="none" stroke="#444" strokeWidth="1.5" />
        <line x1="200" y1="77" x2="200" y2="95" stroke="#444" strokeWidth="1.5" />
        <path d="M160,95 Q140,95 135,115 L130,200 Q128,260 140,300 L155,340 Q160,355 165,360 L170,370" fill="none" stroke="#444" strokeWidth="1.5" />
        <path d="M240,95 Q260,95 265,115 L270,200 Q272,260 260,300 L245,340 Q240,355 235,360 L230,370" fill="none" stroke="#444" strokeWidth="1.5" />
        <path d="M160,95 Q140,95 110,110 L85,130" fill="none" stroke="#444" strokeWidth="1.5" />
        <path d="M240,95 Q260,95 290,110 L315,130" fill="none" stroke="#444" strokeWidth="1.5" />
        <path d="M85,130 L65,200 L55,260 L60,280" fill="none" stroke="#444" strokeWidth="1.5" />
        <path d="M315,130 L335,200 L345,260 L340,280" fill="none" stroke="#444" strokeWidth="1.5" />
        <path d="M170,370 L165,375 Q160,385 165,400 L175,470" fill="none" stroke="#444" strokeWidth="1.5" />
        <path d="M230,370 L235,375 Q240,385 235,400 L225,470" fill="none" stroke="#444" strokeWidth="1.5" />
        <line x1="200" y1="95" x2="200" y2="370" stroke="#222" strokeWidth="0.5" strokeDasharray="4,4" />

        {organs.map(o => {
          const active = activeOrgans.has(o.id);
          const diag = (diagnoses || []).find(d => organMap[d.organ] === o.id);
          return (
            <g key={o.id} onClick={() => active && onSelect(o)} style={{ cursor: active ? "pointer" : "default" }}>
              {active && <circle cx={o.bodyX} cy={o.y} r="14" fill={o.color} opacity="0.1">
                <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
              </circle>}
              <circle cx={o.bodyX} cy={o.y} r="5" fill={o.color} opacity={active ? 1 : 0.3} />
              <circle cx={o.bodyX} cy={o.y} r="8" fill={o.color} opacity={active ? 0.25 : 0.08} />
              <line x1={o.bodyX + 10} y1={o.y} x2={lineEnd} y2={o.y}
                stroke={o.color} strokeWidth="1" opacity={active ? 0.7 : 0.2} strokeDasharray={active ? "0" : "3,3"} />
              <text x={labelX} y={o.y + 5} fill={o.color} fontSize="14"
                fontFamily="'Noto Sans KR', sans-serif" fontWeight={active ? "700" : "400"}
                opacity={active ? 1 : 0.4}>
                {o.label}
              </text>
              {active && diag && (
                <text x={labelX} y={o.y + 22} fill={o.color} fontSize="10"
                  fontFamily="'Noto Sans KR', sans-serif" opacity="0.7">
                  {diag.diagnosis.length > 25 ? diag.diagnosis.slice(0, 25) + "..." : diag.diagnosis}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DiagnosisFileModal({ organ, diagnoses, onClose }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewUrl, setViewUrl] = useState(null);
  const [viewName, setViewName] = useState("");
  const folder = organ.id;

  const load = async () => {
    const { data } = await supabase.storage.from("diagnosis").list(folder, { sortBy: { column: "created_at", order: "desc" } });
    if (data) setFiles(data.filter(f => f.name !== ".emptyFolderPlaceholder"));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    await supabase.storage.from("diagnosis").upload(`${folder}/${Date.now()}_${file.name}`, file);
    setUploading(false);
    load();
    e.target.value = "";
  };

  const handleView = async (name) => {
    if (viewName === name) { setViewUrl(null); setViewName(""); return; }
    const { data } = await supabase.storage.from("diagnosis").createSignedUrl(`${folder}/${name}`, 300);
    if (data?.signedUrl) { setViewUrl(data.signedUrl); setViewName(name); }
  };

  const handleDelete = async (name) => {
    await supabase.storage.from("diagnosis").remove([`${folder}/${name}`]);
    if (viewName === name) { setViewUrl(null); setViewName(""); }
    load();
  };

  const isImage = (name) => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(name);
  const isPdf = (name) => /\.pdf$/i.test(name);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 28, width: "90%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{organ.label}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #333", color: "#888", fontSize: "0.78rem", cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.5 : 1 }}>
              {uploading ? "업로드 중..." : "파일 업로드"}
              <input type="file" hidden onChange={handleUpload} disabled={uploading} />
            </label>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
          </div>
        </div>

        {diagnoses.length > 0 && (
          <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {diagnoses.map((d, i) => (
              <div key={d.id} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: "0.72rem", color: "#555", fontWeight: 700, minWidth: 24 }}>{i + 1}.</span>
                  <span style={{ fontSize: "0.9rem", color: "#ddd" }}>{d.diagnosis}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#555", paddingLeft: 32 }}>{d.date}{d.note ? ` · ${d.note}` : ""}</div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ color: "#555", fontSize: "0.85rem", textAlign: "center", padding: 20 }}>로딩 중...</div>
        ) : files.length === 0 ? (
          <div style={{ color: "#555", fontSize: "0.85rem", textAlign: "center", padding: 30 }}>업로드된 파일이 없습니다</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {files.map(f => (
              <div key={f.name} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#aaa", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.name.replace(/^\d+_/, "")}
                  </span>
                  <div style={{ display: "flex", gap: 6, marginLeft: 10, flexShrink: 0 }}>
                    <button onClick={() => handleView(f.name)} style={{ background: "none", border: "1px solid #333", borderRadius: 6, color: "#888", fontSize: "0.75rem", padding: "4px 10px", cursor: "pointer" }}>
                      {viewName === f.name ? "닫기" : "보기"}
                    </button>
                    <button onClick={() => handleDelete(f.name)} style={{ background: "none", border: "none", color: "#555", fontSize: "0.75rem", cursor: "pointer" }}>삭제</button>
                  </div>
                </div>
                {viewUrl && viewName === f.name && (
                  <div style={{ padding: "0 14px 14px" }}>
                    {isImage(f.name) ? (
                      <img src={viewUrl} alt={f.name} style={{ width: "100%", borderRadius: 6, maxHeight: 500, objectFit: "contain" }} />
                    ) : isPdf(f.name) ? (
                      <iframe src={viewUrl} style={{ width: "100%", height: 500, borderRadius: 6, border: "none" }} />
                    ) : (
                      <a href={viewUrl} target="_blank" rel="noreferrer" style={{ color: "#4a9eff", fontSize: "0.85rem" }}>파일 열기</a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
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
  const [diagnoses, setDiagnoses] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    supabase.from("medical_diagnosis").select("*").order("date", { ascending: false })
      .then(({ data }) => { if (data) setDiagnoses(data); });
  }, []);

  return (
    <div>
      {selected && (
        <DiagnosisFileModal
          organ={selected}
          diagnoses={diagnoses.filter(d => organMap[d.organ] === selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
      <SubTabs items={medicalSubs} active={subTab} setActive={setSubTab} />
      {subTab === "diagnosis" && (
        <div>
          <BodyDiagram diagnoses={diagnoses} onSelect={setSelected} />
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

const stockSubs = [
  { id: "search", label: "찾기" },
  { id: "rsimap", label: "RSIMAP" },
];

function calcScore(ticker, data) {
  const d = data.d.find(i => i.ticker === ticker);
  const w = data.w.find(i => i.ticker === ticker);
  const m = data.m.find(i => i.ticker === ticker);
  const dScore = [3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.3, 0.2, 0.1, 0.0];
  const wScore = [3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.3, 0.2, 0.0];
  const mScore = [0.0, 1.0, 2.0, 3.0, 3.5, 3.0, 2.5, 2.0, 1.0, 0.0];
  const ds = d ? dScore[d.level - 1] : 0;
  const ws = w ? wScore[w.level - 1] : 0;
  const ms = m ? mScore[m.level - 1] : 0;
  return Math.round((ds + ws + ms) * 10) / 10;
}


function rsiCalc(closes) {
  const p = 14;
  return closes.map((_, i) => {
    if (i < p) return null;
    let g = 0, l = 0;
    for (let j = i - p + 1; j <= i; j++) { const d = closes[j] - closes[j-1]; d > 0 ? g += d : l -= d; }
    const rs = l === 0 ? 100 : (g/p)/(l/p);
    return 100 - 100/(1+rs);
  });
}

function levelColor(level) {
  if (level <= 3) return `hsl(${220 - level*5}, 80%, ${30 + level*5}%)`;
  if (level >= 8) return `hsl(${(10-level)*8}, 80%, ${30 + (level-7)*8}%)`;
  return `hsl(0, 0%, ${38 + level*3}%)`;
}


function toRSITVSymbol(sym) {
  const map = { "GC=F":"XAUUSD","SI=F":"XAGUSD","CL=F":"USOIL","NG=F":"NATURALGAS","DX-Y.NYB":"DXY","BTC-USD":"BTCUSD","ETH-USD":"ETHUSD" };
  return map[sym.toUpperCase()] || sym;
}

function RSITVChart({ symbol }) {
  const ref = useRef(null);
  const tvSym = toRSITVSymbol(symbol);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    s.async = true;
    s.innerHTML = JSON.stringify({ autosize:true, symbol:tvSym, interval:"D", timezone:"Asia/Seoul", theme:"dark", style:"1", locale:"kr", backgroundColor:"rgba(10,10,10,1)", gridColor:"rgba(30,33,48,0.6)", allow_symbol_change:false, calendar:false, studies:["RSI@tv-basicstudies","MACD@tv-basicstudies"] });
    ref.current.appendChild(s);
  }, [tvSym]);
  return <div ref={ref} style={{ height:"100%" }} />;
}

async function fetchMaxDaily(symbol) {
  const cacheKey = `max_${symbol}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=max`);
  const json = await res.json();
  const result0 = json?.chart?.result?.[0];
  if (!result0) { console.warn("[fetchMaxDaily] no data", symbol, json); return null; }

  const timestamps = result0.timestamp || [];
  const closes = result0.indicators?.quote?.[0]?.close || [];

  // 주봉: 주 마지막 거래일
  const weeklyCloses = [], weeklyTs = [];
  let wBuf = [], wTsBuf = [];
  for (let i = 0; i < timestamps.length; i++) {
    if (closes[i] == null) continue;
    wBuf.push(closes[i]); wTsBuf.push(timestamps[i]);
    const curDay = new Date(timestamps[i] * 1000).getDay();
    const nextDay = timestamps[i+1] ? new Date(timestamps[i+1] * 1000).getDay() : -1;
    if (nextDay === -1 || nextDay <= curDay) {
      weeklyCloses.push(wBuf[wBuf.length-1]);
      weeklyTs.push(wTsBuf[wTsBuf.length-1]);
      wBuf = []; wTsBuf = [];
    }
  }

  // 월봉: 월 마지막 거래일
  const monthlyCloses = [], monthlyTs = [];
  let mBuf = [], mTsBuf = [], curMonth = null;
  for (let i = 0; i < timestamps.length; i++) {
    if (closes[i] == null) continue;
    const mo = new Date(timestamps[i] * 1000).toISOString().slice(0, 7);
    if (curMonth && mo !== curMonth) {
      monthlyCloses.push(mBuf[mBuf.length-1]);
      monthlyTs.push(mTsBuf[mTsBuf.length-1]);
      mBuf = []; mTsBuf = [];
    }
    curMonth = mo; mBuf.push(closes[i]); mTsBuf.push(timestamps[i]);
  }
  if (mBuf.length) { monthlyCloses.push(mBuf[mBuf.length-1]); monthlyTs.push(mTsBuf[mTsBuf.length-1]); }

  const result = { timestamps, closes, weeklyCloses, weeklyTs, monthlyCloses, monthlyTs };
  try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch {}
  return result;
}


function sortinoScore(rets) {
  if (rets.length < 3) return -Infinity;
  const sorted = [...rets].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const capped = rets.map(r => Math.min(r, p95));
  const avg = capped.reduce((s, v) => s + v, 0) / capped.length;
  const downside = capped.filter(r => r < 0);
  let dd = 0.5;
  if (downside.length >= 2) {
    const dm = downside.reduce((s, v) => s + v, 0) / downside.length;
    dd = Math.max(Math.sqrt(downside.reduce((s, v) => s + (v - dm) ** 2, 0) / downside.length), 0.5);
  }
  return avg / dd;
}

function BacktestPanel({ symbol, currentScore }) {
  const [holdDays, setHoldDays] = useState(20);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const dailyRef = useRef(null);
  const scoredBaseRef = useRef(null);
  const [goldenTh, setGoldenTh] = useState(null);
  const [btTab, setBtTab] = useState("backtest");
  const [priceInfo, setPriceInfo] = useState(null);

  const DS = [3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.3, 0.2, 0.1, 0.0];
  const WS = [3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.3, 0.2, 0.0];
  const MS = [0.0, 1.0, 2.0, 3.0, 3.5, 3.0, 2.5, 2.0, 1.0, 0.0];
  const THRESHOLDS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

  function calcRows(daily, scoredBase, hd) {
    const scored = scoredBase.map(({ idx, score, date, buyPrice }) => {
      const futureCloses = [];
      for (let j=1; j<=hd; j++) { if (daily[idx+j]?.close) futureCloses.push(daily[idx+j].close); }
      if (!futureCloses.length) return null;
      const avgClose = futureCloses.reduce((s,v)=>s+v,0)/futureCloses.length;
      const ret = ((avgClose - parseFloat(buyPrice)) / parseFloat(buyPrice)) * 100;
      return { date, score, buyPrice, avgClose: avgClose.toFixed(2), ret: ret.toFixed(2) };
    }).filter(Boolean);

    return THRESHOLDS.map((th, idx2) => {
      const next = THRESHOLDS[idx2+1];
      const trades = next ? scored.filter(t=>t.score>=th&&t.score<next) : scored.filter(t=>t.score>=th);
      const wins = trades.filter(t=>parseFloat(t.ret)>0).length;
      const avgRet = trades.length ? (trades.reduce((s,t)=>s+parseFloat(t.ret),0)/trades.length).toFixed(2) : null;
      const winRate = trades.length ? (wins/trades.length*100).toFixed(1) : null;
      const label = next ? `${th}~${next}점` : `${th}점+`;
      const ss = sortinoScore(trades.map(t => parseFloat(t.ret)));
      return { th, label, trades, avgRet, winRate, ss };
    });
  }

  // 슬라이더 변경 시 재계산
  useEffect(() => {
    if (!dailyRef.current || !scoredBaseRef.current) return;
    setRows(calcRows(dailyRef.current, scoredBaseRef.current, holdDays));
    setExpanded(null);
  }, [holdDays]);

  // 최초 데이터 fetch (max range)
  useEffect(() => {
    (async () => {
      setLoading(true);
      setRows(null);
      try {
        const av = await fetchMaxDaily(symbol);
        if (!av) { setLoading(false); return; }
        const { timestamps, closes, weeklyCloses, weeklyTs, monthlyCloses, monthlyTs } = av;
        const dRsi = rsiCalc(closes);
        const wRsi = rsiCalc(weeklyCloses);
        const mRsi = rsiCalc(monthlyCloses);
        const wMap = {}, mMap = {};
        weeklyTs.forEach((ts,i) => { if(wRsi[i]!=null) wMap[ts]=Math.min(10,Math.max(1,Math.ceil(wRsi[i]/10))); });
        monthlyTs.forEach((ts,i) => { if(mRsi[i]!=null) mMap[ts]=Math.min(10,Math.max(1,Math.ceil(mRsi[i]/10))); });
        const wKeys=Object.keys(wMap).map(Number).sort((a,b)=>a-b);
        const mKeys=Object.keys(mMap).map(Number).sort((a,b)=>a-b);
        function getLv(ts,keys,mp){let lo=0,hi=keys.length-1,res=null;while(lo<=hi){const mid=(lo+hi)>>1;if(keys[mid]<=ts){res=keys[mid];lo=mid+1;}else hi=mid-1;}return res!=null?mp[res]:null;}
        const daily = timestamps.map((ts,i)=>({ts,close:closes[i],rsi:dRsi[i]})).filter(d=>d.close!=null&&d.rsi!=null);
        dailyRef.current = daily;
        const scoredBase = [];
        for(let i=0;i<daily.length-1;i++){
          const {ts,close,rsi}=daily[i];
          const dLv=Math.min(10,Math.max(1,Math.ceil(rsi/10)));
          const wLv=getLv(ts,wKeys,wMap), mLv=getLv(ts,mKeys,mMap);
          if(!wLv||!mLv) continue;
          const score=Math.round((DS[dLv-1]+WS[wLv-1]+MS[mLv-1])*10)/10;
          scoredBase.push({idx:i,score,date:new Date(ts*1000).toISOString().slice(0,10),buyPrice:close.toFixed(2)});
        }
        scoredBaseRef.current = scoredBase;
        const rows180 = calcRows(daily, scoredBase, 180);
        const best = rows180.filter(r=>r.ss > -Infinity).reduce((a,b)=>b.ss>a.ss?b:a,{ss:-Infinity});
        setGoldenTh(best.th ?? null);
        setRows(calcRows(daily, scoredBase, holdDays));
        // 현재 상태 요약
        const gTh = best.th ?? null;
        const gNext = gTh != null ? (THRESHOLDS[THRESHOLDS.indexOf(gTh)+1] ?? null) : null;
        const goldenRow = gTh != null ? rows180.find(r => r.th === gTh) : null;
        setPriceInfo({ goldenTh: gTh, goldenNext: gNext, goldenAvgRet: goldenRow?.avgRet ?? null, goldenWinRate: goldenRow?.winRate ?? null, goldenCount: goldenRow?.trades.length ?? 0 });
      } catch(e) { console.error(e); }
      setLoading(false);
    })();
  }, [symbol]);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* 탭 헤더 */}
      <div style={{ display:"flex", borderBottom:"1px solid #1a1a1a", marginBottom:12 }}>
        {[["backtest","백테스팅"],["price","매수적정가"]].map(([id,label]) => (
          <button key={id} onClick={() => setBtTab(id)} style={{ padding:"6px 14px", background:"transparent", border:"none", borderBottom: btTab===id?"2px solid #f5c518":"2px solid transparent", color: btTab===id?"#fff":"#555", cursor:"pointer", fontSize:12, fontWeight: btTab===id?600:400 }}>
            {label}
          </button>
        ))}
        {loading && <span style={{ color:"#555", fontSize:12, marginLeft:"auto", alignSelf:"center" }}>로딩 중...</span>}
      </div>
      {btTab === "backtest" && (
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <span style={{ color:"#888", fontSize:13, whiteSpace:"nowrap" }}>보유 <span style={{ color:"#fff", fontWeight:600 }}>{holdDays}일</span></span>
        <input type="range" min={1} max={180} step={1} value={holdDays} onChange={e => setHoldDays(parseInt(e.target.value))}
          style={{ flex:1, accentColor:"#888", cursor:"pointer" }} />
      </div>
      )}

      {btTab === "backtest" && rows && (
        <div style={{ flex:1, overflowY:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ color:"#555", borderBottom:"1px solid #1a1a1a" }}>
                {["진입점수","횟수","승률","평균수익률"].map(h => (
                  <th key={h} style={{ textAlign:h==="진입점수"?"left":"right", padding:"4px 8px", fontWeight:400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <>
                  <tr key={row.th} onClick={() => setExpanded(expanded===row.th ? null : row.th)}
                    style={{ borderBottom:"1px solid #111", cursor:row.trades.length?"pointer":"default", background: expanded===row.th?"#161820":"transparent", outline: row.th===goldenTh?"2px solid #f5c518":"none", outlineOffset:"-1px" }}>
                    <td style={{ padding:"6px 8px", fontWeight:600, color:"#ffcc44" }}>{row.label}</td>
                    <td style={{ padding:"6px 8px", color:"#aaa", textAlign:"right" }}>{row.trades.length}회</td>
                    <td style={{ padding:"6px 8px", textAlign:"right", color: row.winRate==null?"#555":parseFloat(row.winRate)>=50?"#4caf50":"#f44336" }}>
                      {row.winRate!=null?`${row.winRate}%`:"-"}
                    </td>
                    <td style={{ padding:"6px 8px", textAlign:"right", color: row.avgRet==null?"#555":parseFloat(row.avgRet)>=0?"#4caf50":"#f44336" }}>
                      {row.avgRet!=null?`${row.avgRet}%`:"-"}
                    </td>
                  </tr>
                  {expanded===row.th && row.trades.map((t,i) => (
                    <tr key={i} style={{ background:"#0d0f14", borderBottom:"1px solid #0a0a0a" }}>
                      <td style={{ padding:"4px 8px 4px 20px", color:"#666" }}>{t.date}</td>
                      <td style={{ padding:"4px 8px", color:"#888", textAlign:"right" }}>{t.score}점</td>
                      <td style={{ padding:"4px 8px", color:"#666", textAlign:"right" }}>{t.buyPrice} → {t.avgClose}</td>
                      <td style={{ padding:"4px 8px", textAlign:"right", color:parseFloat(t.ret)>=0?"#4caf50":"#f44336" }}>{t.ret}%</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {btTab === "backtest" && !rows && !loading && (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:13 }}>
          데이터 로딩 중...
        </div>
      )}
      {btTab === "price" && (() => {
        if (!priceInfo) return <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:13 }}>로딩 중...</div>;
        const { goldenTh: gTh, goldenNext: gNext, goldenAvgRet, goldenWinRate, goldenCount } = priceInfo;
        const isGolden = gTh != null && currentScore != null && currentScore >= gTh && (gNext == null || currentScore < gNext);
        const gap = gTh != null && currentScore != null ? Math.round((gTh - currentScore) * 10) / 10 : null;
        return (
          <div style={{ flex:1, padding:"16px 0", display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ display:"flex", gap:12 }}>
              {/* 현재 점수 */}
              <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:"16px", display:"flex", flexDirection:"column", gap:6 }}>
                <span style={{ color:"#555", fontSize:11 }}>현재 점수</span>
                <span style={{ color: isGolden ? "#f5c518" : "#fff", fontSize:28, fontWeight:700 }}>{currentScore ?? "-"}점</span>
                {isGolden
                  ? <span style={{ color:"#f5c518", fontSize:12 }}>✦ 골든존 진입 중</span>
                  : gap != null && gap > 0
                    ? <span style={{ color:"#888", fontSize:12 }}>골든존까지 +{gap}점 필요</span>
                    : gap != null && gap <= 0
                      ? <span style={{ color:"#4caf50", fontSize:12 }}>골든존 통과</span>
                      : null
                }
                <span style={{ color:"#333", fontSize:11, marginTop:4 }}>골든 {gTh ?? "-"}{gNext ? `~${gNext}` : "+"}점</span>
              </div>
              {/* 골든 진입 통계 */}
              <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:"16px", display:"flex", flexDirection:"column", gap:10 }}>
                <span style={{ color:"#555", fontSize:11 }}>골든 진입 시 성과 <span style={{ color:"#333" }}>(180일 보유)</span></span>
                {goldenCount > 0 ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                      <span style={{ color:"#555", fontSize:11 }}>평균 수익률</span>
                      <span style={{ color: parseFloat(goldenAvgRet) >= 0 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>{goldenAvgRet}%</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                      <span style={{ color:"#555", fontSize:11 }}>승률</span>
                      <span style={{ color: parseFloat(goldenWinRate) >= 50 ? "#4caf50" : "#f44336", fontSize:18, fontWeight:600 }}>{goldenWinRate}%</span>
                    </div>
                    <span style={{ color:"#333", fontSize:11 }}>과거 {goldenCount}회 진입 기준</span>
                  </>
                ) : (
                  <span style={{ color:"#555", fontSize:12 }}>골든 진입 이력 없음</span>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

const YAHOO_IV = { d: { interval: "1d", range: "3mo" }, w: { interval: "1wk", range: "1y" }, m: { interval: "1mo", range: "5y" } };

async function fetchRSIForInterval(watchlist, iv) {
  const { interval, range } = YAHOO_IV[iv];
  const results = await Promise.all(watchlist.map(async (item) => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      let res;
      try {
        res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(item.ticker)}?interval=${interval}&range=${range}`, { signal: controller.signal });
      } finally { clearTimeout(timer); }
      const json = await res.json();
      const closes = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.filter(v => v != null) ?? [];
      if (closes.length < 15) return { ticker: item.ticker, rsi: null, level: null };
      const rsiArr = rsiCalc(closes);
      const rsi = rsiArr.filter(v => v != null).pop();
      const level = rsi != null ? Math.min(10, Math.max(1, Math.ceil(rsi / 10))) : null;
      return { ticker: item.ticker, rsi: rsi?.toFixed(1), level };
    } catch { return { ticker: item.ticker, rsi: null, level: null }; }
  }));
  return results.filter(i => i.level != null);
}

const BT_DS = [3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.3, 0.2, 0.1, 0.0];
const BT_WS = [3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.3, 0.2, 0.0];
const BT_MS = [0.0, 1.0, 2.0, 3.0, 3.5, 3.0, 2.5, 2.0, 1.0, 0.0];
const BT_THRESHOLDS = [1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0,9.5,10.0];

async function calcGoldenMap(watchlist) {
  const map = new Map();
  await Promise.all(watchlist.map(async item => {
    try {
      const av = await fetchMaxDaily(item.ticker);
      if (!av) return;
      const { timestamps, closes, weeklyCloses, weeklyTs, monthlyCloses, monthlyTs } = av;
      const dRsi=rsiCalc(closes), wRsi=rsiCalc(weeklyCloses), mRsi=rsiCalc(monthlyCloses);
      const wMap={}, mMap={};
      weeklyTs.forEach((ts,i)=>{ if(wRsi[i]!=null) wMap[ts]=Math.min(10,Math.max(1,Math.ceil(wRsi[i]/10))); });
      monthlyTs.forEach((ts,i)=>{ if(mRsi[i]!=null) mMap[ts]=Math.min(10,Math.max(1,Math.ceil(mRsi[i]/10))); });
      const wKeys=Object.keys(wMap).map(Number).sort((a,b)=>a-b);
      const mKeys=Object.keys(mMap).map(Number).sort((a,b)=>a-b);
      function getLv(ts,keys,mp){let lo=0,hi=keys.length-1,res=null;while(lo<=hi){const mid=(lo+hi)>>1;if(keys[mid]<=ts){res=keys[mid];lo=mid+1;}else hi=mid-1;}return res!=null?mp[res]:null;}
      const daily=timestamps.map((ts,i)=>({ts,close:closes[i],rsi:dRsi[i]})).filter(d=>d.close!=null&&d.rsi!=null);
      const scored=[];
      for(let i=0;i<daily.length-180;i++){
        const {ts,close,rsi}=daily[i];
        const dLv=Math.min(10,Math.max(1,Math.ceil(rsi/10)));
        const wLv=getLv(ts,wKeys,wMap), mLv=getLv(ts,mKeys,mMap);
        if(!wLv||!mLv) continue;
        const score=Math.round((BT_DS[dLv-1]+BT_WS[wLv-1]+BT_MS[mLv-1])*10)/10;
        const fut=[];for(let j=1;j<=180;j++){if(daily[i+j]?.close)fut.push(daily[i+j].close);}
        if(!fut.length) continue;
        const avg=fut.reduce((s,v)=>s+v,0)/fut.length;
        scored.push({score, ret:((avg-close)/close)*100});
      }
      if(!scored.length) return;
      const best = BT_THRESHOLDS.reduce((bestRow, th, idx) => {
        const next = BT_THRESHOLDS[idx+1];
        const group = next ? scored.filter(t=>t.score>=th&&t.score<next) : scored.filter(t=>t.score>=th);
        const ss = sortinoScore(group.map(t=>t.ret));
        return ss > bestRow.ss ? { th, next: next??null, ss } : bestRow;
      }, { ss: -Infinity });
      if(best.ss > -Infinity) map.set(item.ticker, { th: best.th, next: best.next });
    } catch {}
  }));
  return map;
}

function RSIMap() {
  const [data, setData] = useState({ d: [], w: [], m: [] });
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState("");
  const [selected, setSelected] = useState(null);
  const [rightTab, setRightTab] = useState("chart");
  const [goldenMap, setGoldenMap] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setProgress("일봉 계산 중...");
      const { data: wl } = await supabase.from("stock_watchlist").select("*");
      if (!wl || wl.length === 0) { setLoading(false); return; }
      const daily = await fetchRSIForInterval(wl, "d");
      setData(prev => ({ ...prev, d: daily }));
      setProgress("주봉 계산 중...");
      const weekly = await fetchRSIForInterval(wl, "w");
      setData(prev => ({ ...prev, w: weekly }));
      setProgress("월봉 계산 중...");
      const monthly = await fetchRSIForInterval(wl, "m");
      setData(prev => ({ ...prev, m: monthly }));
      setLoading(false);
      setProgress("골든 구간 계산 중...");
      const gr = await calcGoldenMap(wl);
      setGoldenMap(gr);
      setProgress("");
      console.log("[goldenMap]", Object.fromEntries(gr));
    })();
  }, []);

  const cx = 310, cy = 310, total = 10;
  // 3개 링: 안(일) 중(주) 바깥(월) — 월봉은 2배 두께
  const rings = [
    { iv:"d", label:"일", outerR:115, innerR:80 },
    { iv:"w", label:"주", outerR:165, innerR:120 },
    { iv:"m", label:"월", outerR:295, innerR:175, lanes:[197, 258] },
  ];

  function arcPath(i, R, r) {
    const sa = (Math.PI*2*i/total) - Math.PI/2 + 0.04;
    const ea = (Math.PI*2*(i+1)/total) - Math.PI/2 - 0.04;
    const x1=cx+R*Math.cos(sa),y1=cy+R*Math.sin(sa);
    const x2=cx+R*Math.cos(ea),y2=cy+R*Math.sin(ea);
    const x3=cx+r*Math.cos(ea),y3=cy+r*Math.sin(ea);
    const x4=cx+r*Math.cos(sa),y4=cy+r*Math.sin(sa);
    return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 0 0 ${x4} ${y4} Z`;
  }

  const hasAny = data.d.length > 0 || data.w.length > 0 || data.m.length > 0;
  if (loading && !hasAny) return (
    <div style={{ textAlign:"center", padding:80, color:"#555" }}>
      {progress || "RSI 계산 중..."}
    </div>
  );
  if (!loading && !hasAny) return (
    <div style={{ textAlign:"center", padding:80, color:"#555", fontSize:13 }}>찾기에서 종목을 모니터링에 추가하면 여기에 표시됩니다</div>
  );

  const selD = selected ? data.d.find(i => i.ticker === selected) : null;
  const selW = selected ? data.w.find(i => i.ticker === selected) : null;
  const selM = selected ? data.m.find(i => i.ticker === selected) : null;

  return (
    <div style={{ display:"flex", gap:0, height:"calc(100vh - 112px)", overflow:"hidden" }}>
      {/* 왼쪽: 원형 휠 */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 12px", flexShrink:0 }}>
      <svg width={620} height={620} viewBox="0 0 620 620" style={{ maxWidth:"100%", overflow:"visible" }}
        onClick={() => setSelected(null)}>
        {/* 3개 링 세그먼트 */}
        {rings.map(({ iv, outerR, innerR }) =>
          Array.from({length:10},(_,i) => {
            const level = i+1;
            return <path key={`${iv}-${level}`} d={arcPath(i, outerR, innerR)} fill={levelColor(level)} opacity={selected ? 0.25 : 0.75} />;
          })
        )}
        {/* 레벨 숫자 (바깥 링 기준) */}
        {Array.from({length:10},(_,i) => {
          const angle = (Math.PI*2*(i+0.5)/total) - Math.PI/2;
          const labelR = rings[2].outerR + 20;
          return <text key={i} x={cx+labelR*Math.cos(angle)} y={cy+labelR*Math.sin(angle)} fill="#666" fontSize="11" textAnchor="middle" dominantBaseline="middle">{i+1}</text>;
        })}
        {/* 링 라벨 */}
        {rings.map(({label, outerR, innerR}) => {
          const mid = (outerR+innerR)/2;
          return <text key={label} x={cx} y={cy - mid} fill="#555" fontSize="10" textAnchor="middle" dominantBaseline="middle">{label}</text>;
        })}
        {/* 중앙: 선택된 종목 정보 or RSI MAP */}
        {selected ? (
          <>
            <text x={cx} y={cy-34} fill="#fff" fontSize="13" textAnchor="middle" dominantBaseline="middle" fontWeight="700" fontFamily="'Noto Sans KR',sans-serif">{selected}</text>
            <text x={cx} y={cy-16} fill="#ffcc44" fontSize="14" textAnchor="middle" dominantBaseline="middle" fontWeight="700">{calcScore(selected, data)}점 / 10점</text>
            {[{label:"일", val:selD},{label:"주", val:selW},{label:"월", val:selM}].map(({label,val},i) => (
              <g key={label}>
                <text x={cx} y={cy+6+i*16} fill={val ? levelColor(val.level) : "#444"} fontSize="10" textAnchor="middle" dominantBaseline="middle" fontFamily="'Noto Sans KR',sans-serif">
                  {label} {val ? `Lv${val.level}` : "—"}
                </text>
              </g>
            ))}
          </>
        ) : (
          <text x={cx} y={cy} fill="#444" fontSize="12" textAnchor="middle" dominantBaseline="middle" fontFamily="'Noto Sans KR',sans-serif">RSI MAP</text>
        )}
        {/* 종목 버블 */}
        {rings.map(({ iv, outerR, innerR, lanes }) => {
          const mid = (outerR+innerR)/2;
          const grouped = {};
          for (let i=1;i<=10;i++) grouped[i]=[];
          data[iv].forEach(item => grouped[item.level].push(item));
          return Array.from({length:10},(_,i) => {
            const level = i+1;
            return grouped[level].map((item, idx) => {
              const isSelected = item.ticker === selected;
              const dimmed = selected && !isSelected;
              const score = calcScore(item.ticker, data);
              const tg = goldenMap?.get(item.ticker);
              const isGolden = tg != null && score >= tg.th && (tg.next == null || score < tg.next);
              if(item.ticker === "RGLD") console.log("[RGLD]", {score, tg, isGolden});
              const bubbleColor = isGolden ? "#f5c518" : levelColor(level);
              const baseAngle = (Math.PI*2*(level-0.5)/10) - Math.PI/2;
              // 월봉: 짝수 인덱스는 안쪽 레인, 홀수는 바깥 레인
              const r = lanes ? lanes[idx % 2] : mid;
              const laneCount = lanes ? Math.ceil(grouped[level].length / 2) : grouped[level].length;
              const laneIdx = lanes ? Math.floor(idx / 2) : idx;
              const spread = (laneIdx - (laneCount-1)/2) * 0.18;
              const angle = baseAngle + spread;
              const x = cx + r*Math.cos(angle), y = cy + r*Math.sin(angle);
              return (
                <g key={`${iv}-${item.ticker}`} style={{ cursor:"pointer" }}
                  onClick={e => { e.stopPropagation(); setSelected(isSelected ? null : item.ticker); }}>
                  {isGolden && <circle cx={x} cy={y} r={20} fill="#f5c518" opacity={0.2} />}
                  {isSelected && <circle cx={x} cy={y} r={18} fill={bubbleColor} opacity={0.3} />}
                  <circle cx={x} cy={y} r={isSelected ? 16 : 14} fill={bubbleColor} stroke={isSelected ? "#fff" : isGolden ? "#ffee88" : "#0a0a0a"} strokeWidth={isSelected ? 2 : isGolden ? 2 : 1.5} opacity={dimmed ? 0.2 : 1} />
                  <text x={x} y={y-2} fill={isGolden ? "#000" : "#fff"} fontSize="7" textAnchor="middle" fontWeight="700" opacity={dimmed ? 0.2 : 1}>{item.ticker.slice(0,4)}</text>
                  <text x={x} y={y+7} fill={isGolden ? "#000" : "#fff"} fontSize="6" textAnchor="middle" opacity={dimmed ? 0.2 : 0.8}>{score}점</text>
                </g>
              );
            });
          });
        })}
      </svg>
      </div>
      {/* 오른쪽: 차트/백테스팅 */}
      <div style={{ flex:1, padding:"16px 16px 16px 0", minWidth:0, display:"flex", flexDirection:"column" }}>
        {selected ? (
          <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
            <div style={{ display:"flex", gap:0, borderBottom:"1px solid #1a1a1a", marginBottom:8 }}>
              {[{id:"chart",label:"차트"},{id:"backtest",label:"백테스팅"}].map(t => (
                <button key={t.id} onClick={() => setRightTab(t.id)} style={{
                  background:"none", border:"none",
                  borderBottom: rightTab===t.id ? "2px solid #888" : "2px solid transparent",
                  color: rightTab===t.id ? "#ddd" : "#555",
                  fontSize:"0.82rem", fontWeight: rightTab===t.id ? 600 : 400,
                  padding:"6px 18px", cursor:"pointer",
                }}>
                  {t.label}
                </button>
              ))}
            </div>
            {rightTab === "chart" ? (
              <div style={{ flex:1, background:"#11141c", borderRadius:10, border:"1px solid #1e2130", overflow:"hidden" }}>
                <RSITVChart symbol={selected} />
              </div>
            ) : (
              <div style={{ flex:1, overflow:"hidden" }}>
                <BacktestPanel symbol={selected} currentScore={calcScore(selected, data)} />
              </div>
            )}
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#333", fontSize:13 }}>
            종목을 클릭하면 차트가 표시됩니다
          </div>
        )}
      </div>
    </div>
  );
}

function StockPageWrapper() {
  const [subTab, setSubTab] = useState("search");
  return (
    <div>
      <SubTabs items={stockSubs} active={subTab} setActive={setSubTab} />
      {subTab === "search" && <StockPage />}
      {subTab === "rsimap" && <RSIMap />}
    </div>
  );
}

function Home({ onLogout }) {
  const [activeTab, setActiveTab] = useState("medical");
  const [showChangePw, setShowChangePw] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e0e0e0",
      fontFamily: "'Noto Sans KR', sans-serif",
    }}>
      {showChangePw && <ChangePasswordModal onClose={() => setShowChangePw(false)} />}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} onChangePassword={() => setShowChangePw(true)} />
      <div style={{ paddingTop: 56 }}>
        {activeTab === "home" && <HomePage />}
        {activeTab === "medical" && <MedicalPage />}
        {activeTab === "stock" && <StockPageWrapper />}
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
