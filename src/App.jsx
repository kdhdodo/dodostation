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
  { id: "trade", label: "Trade" },
  { id: "radar", label: "레이더" },
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

  let json;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=max`);
      if (!res.ok) { await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); continue; }
      json = await res.json();
      break;
    } catch { await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); }
  }
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

function BacktestPanel({ symbol, currentScore, goldenRange, onGoldenFound }) {
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
      const ret = Math.max(-99, Math.min(100, ((avgClose - parseFloat(buyPrice)) / parseFloat(buyPrice)) * 100));
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
        const threeYearsAgo = Date.now() / 1000 - 3 * 365 * 86400;
        const daily = timestamps.map((ts,i)=>({ts,close:closes[i],rsi:dRsi[i]})).filter(d=>d.close!=null&&d.rsi!=null&&d.ts>=threeYearsAgo);
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
        // goldenRange가 없으면 자체 계산 후 부모에 알림
        let gTh = goldenRange?.th ?? null;
        let gNext = goldenRange?.next ?? null;
        if (gTh == null) {
          const best = rows180.filter(r=>r.ss > -Infinity).reduce((a,b)=>b.ss>a.ss?b:a,{ss:-Infinity});
          if (best.ss > -Infinity) {
            gTh = best.th;
            gNext = THRESHOLDS[THRESHOLDS.indexOf(best.th)+1] ?? null;
            onGoldenFound?.(symbol, { th: gTh, next: gNext });
          }
        }
        setGoldenTh(gTh);
        setRows(calcRows(daily, scoredBase, holdDays));
        // 현재 상태 요약
        const goldenRow = gTh != null ? rows180.find(r => r.th === gTh) : null;
        const currentPrice = daily.length ? daily[daily.length - 1].close : null;
        setPriceInfo({ goldenTh: gTh, goldenNext: gNext, goldenAvgRet: goldenRow?.avgRet ?? null, goldenWinRate: goldenRow?.winRate ?? null, goldenCount: goldenRow?.trades.length ?? 0, currentPrice });
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
        const { goldenTh: gTh, goldenNext: gNext, goldenAvgRet, goldenWinRate, goldenCount, currentPrice } = priceInfo;
        const targetPrice = currentPrice != null && goldenAvgRet != null ? (currentPrice * (1 + parseFloat(goldenAvgRet) / 100)).toFixed(2) : null;
        const isGolden = gTh != null && currentScore != null && currentScore >= gTh && (gNext == null || currentScore <= gNext);
        const gap = gTh != null && currentScore != null ? Math.round((gTh - currentScore) * 10) / 10 : null;
        return (
          <div style={{ flex:1, padding:"16px 0", display:"flex", flexDirection:"column", gap:12 }}>
            {/* 현재가 / 목표가 */}
            <div style={{ display:"flex", gap:12 }}>
              <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:"16px", display:"flex", flexDirection:"column", gap:4 }}>
                <span style={{ color:"#555", fontSize:11 }}>현재가</span>
                <span style={{ color:"#fff", fontSize:26, fontWeight:700 }}>${currentPrice != null ? Number(currentPrice).toFixed(2) : "-"}</span>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:"16px", display:"flex", flexDirection:"column", gap:4 }}>
                <span style={{ color:"#555", fontSize:11 }}>목표가 <span style={{ color:"#333" }}>(골든존 평균수익률)</span></span>
                <span style={{ color: targetPrice != null ? "#4caf50" : "#555", fontSize:26, fontWeight:700 }}>{targetPrice != null ? `$${targetPrice}` : "-"}</span>
                {goldenAvgRet != null && <span style={{ color:"#555", fontSize:11 }}>+{goldenAvgRet}% 기대 (180일)</span>}
              </div>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {/* 현재 점수 */}
              <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:"16px", display:"flex", flexDirection:"column", gap:6 }}>
                <span style={{ color:"#555", fontSize:11 }}>현재 점수</span>
                <span style={{ color: isGolden ? "#f5c518" : "#fff", fontSize:24, fontWeight:700 }}>{currentScore ?? "-"}점</span>
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
              <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:"16px", display:"flex", flexDirection:"column", gap:8 }}>
                <span style={{ color:"#555", fontSize:11 }}>골든 진입 시 성과 <span style={{ color:"#333" }}>(180일)</span></span>
                {goldenCount > 0 ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                      <span style={{ color:"#555", fontSize:11 }}>평균 수익률</span>
                      <span style={{ color: parseFloat(goldenAvgRet) >= 0 ? "#4caf50" : "#f44336", fontSize:18, fontWeight:700 }}>{goldenAvgRet}%</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                      <span style={{ color:"#555", fontSize:11 }}>승률</span>
                      <span style={{ color: parseFloat(goldenWinRate) >= 50 ? "#4caf50" : "#f44336", fontSize:16, fontWeight:600 }}>{goldenWinRate}%</span>
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

// ── 환율 (USD→KRW) ──
let _usdkrw = null;
async function getUSDKRW() {
  if (_usdkrw) return _usdkrw;
  try {
    const cached = localStorage.getItem("usdkrw_cache");
    if (cached) { const c = JSON.parse(cached); if (Date.now() - c._ts < 3600000) { _usdkrw = c.rate; return _usdkrw; } }
    const res = await fetch("/api/yahoo/v8/finance/chart/USDKRW=X?interval=1d&range=5d");
    if (res.ok) {
      const json = await res.json();
      const closes = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.filter(v => v != null) || [];
      if (closes.length) { _usdkrw = closes[closes.length - 1]; try { localStorage.setItem("usdkrw_cache", JSON.stringify({ _ts: Date.now(), rate: _usdkrw })); } catch {} }
    }
  } catch {}
  return _usdkrw || 1350; // fallback
}

// ── Yahoo quoteSummary (crumb은 프록시가 자동 주입) ──
async function fetchQuoteSummary(symbol, modules = "financialData,defaultKeyStatistics") {
  const cacheKey = `qs_${symbol}_${modules}`;
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey));
    if (cached && Date.now() - cached._ts < 3600000) return cached.data;
  } catch {}
  try {
    const res = await fetch(`/api/yqs/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${modules}`);
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.quoteSummary?.result?.[0] || null;
    if (result) try { localStorage.setItem(cacheKey, JSON.stringify({ _ts: Date.now(), data: result })); } catch {}
    return result;
  } catch { return null; }
}

// ── RadarPanel ──
const CROSS_ASSETS = [
  { ticker: "GC=F", label: "금" },
  { ticker: "CL=F", label: "유가" },
  { ticker: "^VIX", label: "VIX" },
  { ticker: "^TNX", label: "국채10Y" },
];

function pearson(xs, ys) {
  const n = Math.min(xs.length, ys.length);
  if (n < 5) return null;
  const x = xs.slice(-n), y = ys.slice(-n);
  const mx = x.reduce((s,v)=>s+v,0)/n, my = y.reduce((s,v)=>s+v,0)/n;
  let num=0, dx=0, dy=0;
  for(let i=0;i<n;i++){ const a=x[i]-mx, b=y[i]-my; num+=a*b; dx+=a*a; dy+=b*b; }
  return dx&&dy ? num/Math.sqrt(dx*dy) : null;
}

function detectDivergences(daily) {
  if (!daily || daily.length < 60) return [];
  const results = [];
  const len = daily.length;
  const win = 20;
  for (let i = win*2; i < len - 5; i++) {
    const pSlice1 = daily.slice(i-win*2, i-win);
    const pSlice2 = daily.slice(i-win, i);
    const pMin1 = Math.min(...pSlice1.map(d=>d.close));
    const pMin2 = Math.min(...pSlice2.map(d=>d.close));
    const rMin1 = Math.min(...pSlice1.map(d=>d.rsi));
    const rMin2 = Math.min(...pSlice2.map(d=>d.rsi));
    const pMax1 = Math.max(...pSlice1.map(d=>d.close));
    const pMax2 = Math.max(...pSlice2.map(d=>d.close));
    const rMax1 = Math.max(...pSlice1.map(d=>d.rsi));
    const rMax2 = Math.max(...pSlice2.map(d=>d.rsi));
    if (pMin2 < pMin1 * 0.98 && rMin2 > rMin1 * 1.02) {
      const last = results[results.length-1];
      if (!last || last.idx < i - win) results.push({ idx:i, type:"bullish", date:new Date(daily[i].ts*1000).toISOString().slice(0,10), price:daily[i].close.toFixed(2), rsi:daily[i].rsi.toFixed(1) });
    }
    if (pMax2 > pMax1 * 1.02 && rMax2 < rMax1 * 0.98) {
      const last = results[results.length-1];
      if (!last || last.idx < i - win) results.push({ idx:i, type:"bearish", date:new Date(daily[i].ts*1000).toISOString().slice(0,10), price:daily[i].close.toFixed(2), rsi:daily[i].rsi.toFixed(1) });
    }
  }
  return results;
}

function RadarPanel({ symbol }) {
  const [subTab, setSubTab] = useState("insider");
  const tabs = [
    { id:"insider", label:"내부자" },
    { id:"institution", label:"기관" },
    { id:"cross", label:"크로스" },
    { id:"divergence", label:"다이버전스" },
    { id:"scenario", label:"시나리오" },
    { id:"finance", label:"파이낸스" },
    { id:"netincome", label:"순이익" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ display:"flex", borderBottom:"1px solid #1a1a1a", marginBottom:8, flexWrap:"wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            background:"none", border:"none",
            borderBottom: subTab===t.id ? "2px solid #f5c518" : "2px solid transparent",
            color: subTab===t.id ? "#fff" : "#555",
            fontSize:11, fontWeight: subTab===t.id ? 600 : 400,
            padding:"5px 10px", cursor:"pointer",
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ flex:1, overflow:"auto" }}>
        {subTab==="insider" && <InsiderTab symbol={symbol} />}
        {subTab==="institution" && <InstitutionTab symbol={symbol} />}
        {subTab==="cross" && <CrossAssetTab symbol={symbol} />}
        {subTab==="divergence" && <DivergenceTab symbol={symbol} />}
        {subTab==="scenario" && <ScenarioTab symbol={symbol} />}
        {subTab==="finance" && <FinanceTab symbol={symbol} />}
        {subTab==="netincome" && <NetIncomeTab symbol={symbol} />}
      </div>
    </div>
  );
}

// CIK 캐시
const cikCache = {};
let tickerMapCache = null;
async function getCIK(ticker) {
  const clean = ticker.replace(/[=^]/g, "").toUpperCase();
  if (cikCache[clean]) return cikCache[clean];
  if (!tickerMapCache) {
    const cached = localStorage.getItem("sec_tickers");
    if (cached) { tickerMapCache = JSON.parse(cached); }
    else {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch("/api/secwww/files/company_tickers.json", { signal: ctrl.signal });
      if (!res.ok) return null;
      const json = await res.json();
      const map = {};
      for (const v of Object.values(json)) map[v.ticker] = String(v.cik_str).padStart(10, "0");
      tickerMapCache = map;
      try { localStorage.setItem("sec_tickers", JSON.stringify(map)); } catch {}
    }
  }
  cikCache[clean] = tickerMapCache[clean] || null;
  return cikCache[clean];
}

function parseForm4XML(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const owner = doc.querySelector("reportingOwnerId rptOwnerName")?.textContent || "-";
  const title = doc.querySelector("officerTitle")?.textContent || (doc.querySelector("isDirector")?.textContent === "1" ? "Director" : "");
  const txns = [];
  doc.querySelectorAll("nonDerivativeTransaction").forEach(tx => {
    const code = tx.querySelector("transactionCode")?.textContent || "";
    const shares = tx.querySelector("transactionShares value")?.textContent || "0";
    const price = tx.querySelector("transactionPricePerShare value")?.textContent || "0";
    const acq = tx.querySelector("transactionAcquiredDisposedCode value")?.textContent || "";
    const date = tx.querySelector("transactionDate value")?.textContent || "";
    const isBuy = code === "P" || (code === "A" && acq === "A");
    txns.push({ owner, title, code, isBuy, shares: parseInt(shares), price: parseFloat(price), date, acq });
  });
  return txns;
}

function InsiderTab({ symbol }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const cik = await getCIK(symbol);
        if (!cik) { setData([]); setLoading(false); return; }
        // 1. 제출 목록 가져오기
        const subRes = await fetch(`/api/secdata/submissions/CIK${cik}.json`);
        if (!subRes.ok) throw new Error(subRes.status);
        const subJson = await subRes.json();
        const recent = subJson?.filings?.recent;
        if (!recent) { setData([]); setLoading(false); return; }
        // 2. Form 4만 필터 (최근 5건)
        const form4s = [];
        for (let i = 0; i < recent.form.length && form4s.length < 5; i++) {
          if (recent.form[i] === "4") {
            form4s.push({
              accession: recent.accessionNumber[i].replace(/-/g, ""),
              accessionDash: recent.accessionNumber[i],
              date: recent.filingDate[i],
              doc: recent.primaryDocument[i],
            });
          }
        }
        // 3. 각 Form 4 XML 파싱 (순차적으로, SEC 제한 준수)
        const rawCik = cik.replace(/^0+/, "");
        const allTxns = [];
        for (const f4 of form4s) {
          try {
            await new Promise(r => setTimeout(r, 200));
            const ctrl = new AbortController();
            setTimeout(() => ctrl.abort(), 5000);
            const rawDoc = f4.doc.includes("/") ? f4.doc.split("/").pop() : f4.doc;
            const xmlRes = await fetch(`/api/secwww/Archives/edgar/data/${rawCik}/${f4.accession}/${rawDoc}`, { signal: ctrl.signal });
            if (!xmlRes.ok) continue;
            const text = await xmlRes.text();
            const txns = parseForm4XML(text);
            txns.forEach(t => { if (!t.date) t.date = f4.date; });
            allTxns.push(...txns);
          } catch {}
        }
        setData(allTxns);
      } catch(e) {
        console.warn("[InsiderTab] error:", e);
        setData([]);
      }
      setLoading(false);
    })();
  }, [symbol]);
  if (loading) return <div style={{ color:"#333", fontSize:12, padding:16 }}>로딩 중...</div>;
  if (!data || !data.length) return <div style={{ color:"#555", fontSize:12, padding:16 }}>내부자 거래 데이터가 없습니다 (선물/ETF는 미지원)</div>;
  const buys = data.filter(t => t.isBuy);
  const sells = data.filter(t => !t.isBuy);
  return (
    <div style={{ padding:"8px 0" }}>
      <div style={{ display:"flex", gap:12, marginBottom:12 }}>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#4caf50", fontSize:22, fontWeight:700 }}>{buys.length}</div>
          <div style={{ color:"#555", fontSize:11 }}>매수</div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#f44336", fontSize:22, fontWeight:700 }}>{sells.length}</div>
          <div style={{ color:"#555", fontSize:11 }}>매도</div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color: buys.length >= sells.length ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>
            {data.length > 0 ? Math.round(buys.length / data.length * 100) : 0}%
          </div>
          <div style={{ color:"#555", fontSize:11 }}>매수 비율</div>
        </div>
      </div>
      <div style={{ fontSize:11, color:"#555", marginBottom:6 }}>최근 내부자 거래 (SEC Form 4)</div>
      {data.map((t, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", padding:"6px 4px", borderBottom:"1px solid #111", fontSize:11, gap:6 }}>
          <span style={{ color: t.isBuy ? "#4caf50" : "#f44336", width:28, fontWeight:700, flexShrink:0 }}>{t.isBuy ? "BUY" : "SELL"}</span>
          <span style={{ color:"#aaa", flex:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.owner}{t.title ? ` (${t.title})` : ""}</span>
          <span style={{ color:"#fff", flex:1, textAlign:"right" }}>{t.shares.toLocaleString()}주</span>
          <span style={{ color:"#888", flex:0.8, textAlign:"right" }}>${t.price > 0 ? t.price.toFixed(2) : "-"}</span>
          <span style={{ color:"#555", flex:0.8, textAlign:"right" }}>{t.date}</span>
        </div>
      ))}
    </div>
  );
}

function parse13GD(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const name = doc.querySelector("reportingPersonName")?.textContent
    || doc.querySelector("nameOfReportingPerson")?.textContent || null;
  const shares = doc.querySelector("reportingPersonBeneficiallyOwnedAggregateNumberOfShares")?.textContent
    || doc.querySelector("aggregateAmountBeneficiallyOwned")?.textContent || null;
  const pct = doc.querySelector("classPercent")?.textContent
    || doc.querySelector("percentOfClass")?.textContent || null;
  return { name, shares: shares ? parseInt(parseFloat(shares)) : null, pct: pct ? parseFloat(pct) : null };
}

function InstitutionTab({ symbol }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // 캐시 확인 (1시간)
    const cacheKey = `inst_cache_${symbol}`;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      if (cached && Date.now() - cached._ts < 3600000) { setData(cached.data); setLoading(false); return; }
    } catch {}
    (async () => {
      setLoading(true);
      try {
        const cik = await getCIK(symbol);
        if (!cik) { setData([]); setLoading(false); return; }
        const subRes = await fetch(`/api/secdata/submissions/CIK${cik}.json`);
        if (!subRes.ok) throw new Error(subRes.status);
        const subJson = await subRes.json();
        const recent = subJson?.filings?.recent;
        if (!recent) { setData([]); setLoading(false); return; }
        const targetForms = ["SCHEDULE 13G", "SCHEDULE 13G/A", "SCHEDULE 13D", "SCHEDULE 13D/A", "SC 13D", "SC 13D/A", "SC 13G", "SC 13G/A"];
        const filings = [];
        for (let i = 0; i < recent.form.length && filings.length < 15; i++) {
          if (targetForms.includes(recent.form[i])) {
            filings.push({
              form: recent.form[i],
              date: recent.filingDate[i],
              accession: recent.accessionNumber[i].replace(/-/g, ""),
              doc: recent.primaryDocument[i],
              filerCik: recent.accessionNumber[i].split("-")[0],
            });
          }
        }
        // 각 파일링의 XML 파싱하여 기관명, 보유주수, 지분율 추출
        const rawCik = cik.replace(/^0+/, "");
        const results = [];
        for (const f of filings) {
          try {
            await new Promise(r => setTimeout(r, 200));
            const rawDoc = f.doc.includes("/") ? f.doc.split("/").pop() : f.doc;
            const ctrl = new AbortController();
            setTimeout(() => ctrl.abort(), 5000);
            const xmlRes = await fetch(`/api/secwww/Archives/edgar/data/${rawCik}/${f.accession}/${rawDoc}`, { signal: ctrl.signal });
            if (!xmlRes.ok) { results.push({ form: f.form, date: f.date, name: null, shares: null, pct: null }); continue; }
            const text = await xmlRes.text();
            const parsed = parse13GD(text);
            results.push({ form: f.form, date: f.date, filerCik: f.filerCik, ...parsed });
          } catch {
            results.push({ form: f.form, date: f.date, filerCik: f.filerCik, name: null, shares: null, pct: null });
          }
        }
        // 이름이 없는 경우 filer CIK로 조회
        for (let i = 0; i < results.length; i++) {
          if (!results[i].name && filings[i].filerCik) {
            try {
              const padded = filings[i].filerCik.padStart(10, "0");
              const ctrl = new AbortController();
              setTimeout(() => ctrl.abort(), 3000);
              const r = await fetch(`/api/secdata/submissions/CIK${padded}.json`, { signal: ctrl.signal });
              if (r.ok) { const j = await r.json(); results[i].name = j.name || null; }
            } catch {}
          }
        }
        // 공시일 기준 주가 매칭
        try {
          const daily = await fetchMaxDaily(symbol);
          if (daily) {
            const priceMap = {};
            for (let i = 0; i < daily.timestamps.length; i++) {
              if (daily.closes[i] != null) priceMap[new Date(daily.timestamps[i]*1000).toISOString().slice(0,10)] = daily.closes[i];
            }
            const dates = Object.keys(priceMap).sort();
            for (const r of results) {
              if (!r.date) continue;
              // 정확한 날짜 또는 가장 가까운 이전 날짜
              let price = priceMap[r.date];
              if (!price) {
                for (let d = dates.length - 1; d >= 0; d--) {
                  if (dates[d] <= r.date) { price = priceMap[dates[d]]; break; }
                }
              }
              r.price = price ? parseFloat(price.toFixed(2)) : null;
            }
          }
        } catch {}
        setData(results);
        try { localStorage.setItem(cacheKey, JSON.stringify({ _ts: Date.now(), data: results })); } catch {}
      } catch(e) {
        console.warn("[InstitutionTab] error:", e);
        setData([]);
      }
      setLoading(false);
    })();
  }, [symbol]);
  if (loading) return <div style={{ color:"#333", fontSize:12, padding:16 }}>로딩 중...</div>;
  if (!data || !data.length) return <div style={{ color:"#555", fontSize:12, padding:16 }}>기관 공시 데이터가 없습니다 (선물/ETF는 미지원)</div>;
  // 기관별 그룹핑 (이름 기준, 최신순 정렬되어 있음)
  const grouped = {};
  for (const f of data) {
    const key = (f.name || "Unknown").toUpperCase();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(f);
  }
  const institutions = Object.entries(grouped).map(([key, filings]) => {
    const latest = filings[0];
    const prev = filings.length > 1 ? filings[1] : null;
    const delta = latest.shares != null && prev?.shares != null ? latest.shares - prev.shares : null;
    const deltaPct = latest.pct != null && prev?.pct != null ? (latest.pct - prev.pct) : null;
    const filerCik = filings.find(f => f.filerCik)?.filerCik || null;
    return { name: latest.name || key, filerCik, latest, prev, delta, deltaPct, filings };
  }).sort((a, b) => (b.latest.pct ?? 0) - (a.latest.pct ?? 0));
  return (
    <div style={{ padding:"8px 0" }}>
      <div style={{ fontSize:11, color:"#555", marginBottom:8 }}>기관 지분 변동 (SEC 13D/13G)</div>
      {institutions.map((inst, i) => {
        const is13D = inst.latest.form.includes("13D");
        const typeColor = is13D ? "#f5c518" : "#4caf50";
        const typeTag = is13D ? "행동주의" : "소극적";
        const deltaColor = inst.delta == null ? "#555" : inst.delta > 0 ? "#4caf50" : inst.delta < 0 ? "#f44336" : "#888";
        const deltaSign = inst.delta > 0 ? "+" : "";
        return (
          <div key={i} style={{ background:"#11141c", borderRadius:8, padding:10, marginBottom:6 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ color:"#fff", fontSize:12, fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{inst.name}</span>
              <button onClick={(e) => { e.stopPropagation(); const tracked = JSON.parse(localStorage.getItem("radar_institutions") || "[]"); if (!tracked.find(t => t.cik === inst.filerCik)) { tracked.push({ cik: inst.filerCik, name: inst.name }); localStorage.setItem("radar_institutions", JSON.stringify(tracked)); } alert(`${inst.name} 레이더에 추가됨`); }} style={{ background:"none", border:"1px solid #333", borderRadius:4, color:"#f5c518", fontSize:11, padding:"1px 6px", cursor:"pointer", flexShrink:0, marginLeft:6 }}>+</button>
              <span style={{ color:typeColor, fontSize:10, fontWeight:600, flexShrink:0, marginLeft:8 }}>{typeTag}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4 }}>
              {inst.latest.shares != null && <span style={{ color:"#aaa", fontSize:12 }}>{inst.latest.shares.toLocaleString()}주</span>}
              {inst.latest.pct != null && <span style={{ color:"#f5c518", fontSize:14, fontWeight:700 }}>{inst.latest.pct}%</span>}
            </div>
            {inst.delta != null ? (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11 }}>
                <span style={{ color:deltaColor, fontWeight:600 }}>
                  {deltaSign}{inst.delta.toLocaleString()}주 {inst.delta > 0 ? "▲ 증가" : inst.delta < 0 ? "▼ 감소" : "변동없음"}
                </span>
                {inst.deltaPct != null && <span style={{ color:deltaColor, fontSize:10 }}>{inst.deltaPct > 0 ? "+" : ""}{inst.deltaPct.toFixed(1)}%p</span>}
                <span style={{ color:"#333", fontSize:10 }}>vs {inst.prev.date}</span>
              </div>
            ) : (
              <div style={{ fontSize:10, color:"#333" }}>이전 공시 없음 (신규 진입)</div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#555", marginTop:4 }}>
              <span>최신: {inst.latest.date}</span>
              {inst.latest.price != null && <span>공시일 주가: <span style={{ color:"#fff", fontWeight:600 }}>${inst.latest.price}</span></span>}
            </div>
          </div>
        );
      })}
      <div style={{ fontSize:10, color:"#333", marginTop:8 }}>
        행동주의: 경영 참여 목적 5%+ | 소극적: 투자 목적 5%+
      </div>
    </div>
  );
}

function CrossAssetTab({ symbol }) {
  const [corrs, setCorrs] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const base = await fetchMaxDaily(symbol);
        if (!base) { setCorrs([]); setLoading(false); return; }
        const baseRets = base.closes.slice(-61).reduce((arr,c,i,a) => { if(i>0&&c&&a[i-1]) arr.push((c-a[i-1])/a[i-1]); return arr; }, []);
        const results = await Promise.all(CROSS_ASSETS.map(async ca => {
          try {
            const d = await fetchMaxDaily(ca.ticker);
            if (!d) return { ...ca, corr: null };
            const rets = d.closes.slice(-61).reduce((arr,c,i,a) => { if(i>0&&c&&a[i-1]) arr.push((c-a[i-1])/a[i-1]); return arr; }, []);
            return { ...ca, corr: pearson(baseRets, rets) };
          } catch { return { ...ca, corr: null }; }
        }));
        setCorrs(results);
      } catch { setCorrs([]); }
      setLoading(false);
    })();
  }, [symbol]);
  if (loading) return <div style={{ color:"#333", fontSize:12, padding:16 }}>로딩 중...</div>;
  if (!corrs || !corrs.length) return <div style={{ color:"#555", fontSize:12, padding:16 }}>데이터 없음</div>;
  return (
    <div style={{ padding:"8px 0" }}>
      <div style={{ fontSize:11, color:"#555", marginBottom:10 }}>최근 60일 일일수익률 상관계수</div>
      {corrs.map(c => {
        const v = c.corr;
        const pct = v != null ? Math.round(Math.abs(v) * 100) : 0;
        const color = v == null ? "#333" : v > 0.3 ? "#4caf50" : v < -0.3 ? "#f44336" : "#888";
        const label = v == null ? "-" : v > 0.5 ? "강한 양" : v > 0.3 ? "양" : v < -0.5 ? "강한 음" : v < -0.3 ? "음" : "약함";
        return (
          <div key={c.ticker} style={{ background:"#11141c", borderRadius:8, padding:12, marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:"#aaa", fontSize:12 }}>{c.label} ({c.ticker})</span>
              <span style={{ color, fontSize:14, fontWeight:700 }}>{v != null ? v.toFixed(2) : "-"} <span style={{ fontSize:10, fontWeight:400 }}>{label}</span></span>
            </div>
            <div style={{ height:6, background:"#1a1a1a", borderRadius:3, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:3 }} />
            </div>
          </div>
        );
      })}
      <div style={{ fontSize:10, color:"#333", marginTop:8 }}>양(+): 같이 움직임 | 음(-): 반대로 움직임</div>
    </div>
  );
}

function DivergenceTab({ symbol }) {
  const [divs, setDivs] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const av = await fetchMaxDaily(symbol);
        if (!av) { setDivs([]); setLoading(false); return; }
        const daily = av.timestamps.map((ts,i) => ({ ts, close:av.closes[i], rsi:rsiCalc(av.closes)[i] })).filter(d => d.close!=null && d.rsi!=null);
        setDivs(detectDivergences(daily));
      } catch { setDivs([]); }
      setLoading(false);
    })();
  }, [symbol]);
  if (loading) return <div style={{ color:"#333", fontSize:12, padding:16 }}>로딩 중...</div>;
  if (!divs) return <div style={{ color:"#555", fontSize:12, padding:16 }}>데이터 없음</div>;
  const recent = divs.slice(-15).reverse();
  const lastDiv = recent[0];
  return (
    <div style={{ padding:"8px 0" }}>
      {lastDiv && (
        <div style={{ background:"#11141c", borderRadius:8, padding:14, marginBottom:12, textAlign:"center" }}>
          <div style={{ color: lastDiv.type==="bullish"?"#4caf50":"#f44336", fontSize:18, fontWeight:700 }}>
            {lastDiv.type==="bullish" ? "▲ 상승 다이버전스" : "▼ 하락 다이버전스"}
          </div>
          <div style={{ color:"#888", fontSize:11, marginTop:4 }}>최근 감지: {lastDiv.date} | 가격 ${lastDiv.price} | RSI {lastDiv.rsi}</div>
        </div>
      )}
      <div style={{ fontSize:11, color:"#555", marginBottom:6 }}>다이버전스 이력 (최근 15건)</div>
      {recent.length === 0 && <div style={{ color:"#333", fontSize:12, padding:8 }}>감지된 다이버전스가 없습니다</div>}
      {recent.map((d, i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 4px", borderBottom:"1px solid #111", fontSize:11 }}>
          <span style={{ color: d.type==="bullish"?"#4caf50":"#f44336", width:60 }}>{d.type==="bullish"?"▲ 상승":"▼ 하락"}</span>
          <span style={{ color:"#aaa" }}>{d.date}</span>
          <span style={{ color:"#888" }}>${d.price}</span>
          <span style={{ color:"#555" }}>RSI {d.rsi}</span>
        </div>
      ))}
    </div>
  );
}


function ScenarioTab({ symbol }) {
  const [scenarios, setScenarios] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const av = await fetchMaxDaily(symbol);
        if (!av) { setScenarios([]); setLoading(false); return; }
        const { timestamps, closes } = av;
        const rsiAll = rsiCalc(closes);
        const daily = timestamps.map((ts,i) => ({ ts, close:closes[i], rsi:rsiAll[i] })).filter(d => d.close!=null && d.rsi!=null);
        if (daily.length < 90) { setScenarios([]); setLoading(false); return; }
        const cur = daily[daily.length-1];
        const curRsi = cur.rsi;
        // 과거에서 현재 RSI ±5 범위 찾기
        const matches = [];
        for (let i = 30; i < daily.length - 60; i++) {
          if (Math.abs(daily[i].rsi - curRsi) < 5) {
            const after30 = daily[i+30] ? ((daily[i+30].close - daily[i].close)/daily[i].close*100).toFixed(1) : null;
            const after60 = daily[i+60] ? ((daily[i+60].close - daily[i].close)/daily[i].close*100).toFixed(1) : null;
            if (after30 != null) {
              const prev = matches[matches.length-1];
              if (!prev || i - prev.idx > 20) {
                matches.push({ idx:i, date:new Date(daily[i].ts*1000).toISOString().slice(0,10), rsi:daily[i].rsi.toFixed(1), price:daily[i].close.toFixed(2), after30, after60 });
              }
            }
          }
        }
        // 최근 10개만
        const recent = matches.slice(-10).reverse();
        const avg30 = recent.filter(m=>m.after30!=null).reduce((s,m)=>s+parseFloat(m.after30),0) / (recent.filter(m=>m.after30!=null).length||1);
        const avg60 = recent.filter(m=>m.after60!=null).reduce((s,m)=>s+parseFloat(m.after60),0) / (recent.filter(m=>m.after60!=null).length||1);
        const win30 = recent.filter(m=>parseFloat(m.after30)>0).length;
        setScenarios({ matches: recent, curRsi: curRsi.toFixed(1), avg30: avg30.toFixed(1), avg60: avg60.toFixed(1), win30, total: recent.length });
      } catch { setScenarios(null); }
      setLoading(false);
    })();
  }, [symbol]);
  if (loading) return <div style={{ color:"#333", fontSize:12, padding:16 }}>로딩 중...</div>;
  if (!scenarios || !scenarios.matches?.length) return <div style={{ color:"#555", fontSize:12, padding:16 }}>유사 패턴을 찾을 수 없습니다</div>;
  const { matches, curRsi, avg30, avg60, win30, total } = scenarios;
  return (
    <div style={{ padding:"8px 0" }}>
      <div style={{ background:"#11141c", borderRadius:8, padding:14, marginBottom:12, textAlign:"center" }}>
        <div style={{ color:"#555", fontSize:11 }}>현재 RSI {curRsi}과 유사했던 과거 {total}개 시점</div>
        <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:8 }}>
          <div>
            <div style={{ color: parseFloat(avg30)>=0?"#4caf50":"#f44336", fontSize:20, fontWeight:700 }}>{avg30}%</div>
            <div style={{ color:"#555", fontSize:10 }}>30일 후 평균</div>
          </div>
          <div>
            <div style={{ color: parseFloat(avg60)>=0?"#4caf50":"#f44336", fontSize:20, fontWeight:700 }}>{avg60}%</div>
            <div style={{ color:"#555", fontSize:10 }}>60일 후 평균</div>
          </div>
          <div>
            <div style={{ color:"#f5c518", fontSize:20, fontWeight:700 }}>{total>0?Math.round(win30/total*100):0}%</div>
            <div style={{ color:"#555", fontSize:10 }}>30일 승률</div>
          </div>
        </div>
      </div>
      <div style={{ fontSize:11, color:"#555", marginBottom:6 }}>유사 시나리오 ({total}건)</div>
      {matches.map((m, i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 4px", borderBottom:"1px solid #111", fontSize:11 }}>
          <span style={{ color:"#aaa" }}>{m.date}</span>
          <span style={{ color:"#888" }}>RSI {m.rsi}</span>
          <span style={{ color:"#888" }}>${m.price}</span>
          <span style={{ color: parseFloat(m.after30)>=0?"#4caf50":"#f44336" }}>30d {m.after30}%</span>
          <span style={{ color: m.after60&&parseFloat(m.after60)>=0?"#4caf50":"#f44336" }}>60d {m.after60??"-"}%</span>
        </div>
      ))}
    </div>
  );
}

function FinanceTab({ symbol }) {
  const [data, setData] = useState(null);
  const [krw, setKrw] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [result, rate] = await Promise.all([
          fetchQuoteSummary(symbol, "financialData,defaultKeyStatistics,summaryDetail,earningsTrend"),
          getUSDKRW()
        ]);
        setData(result);
        setKrw(rate);
      } catch { setData(null); }
      setLoading(false);
    })();
  }, [symbol]);
  if (loading) return <div style={{ color:"#333", fontSize:12, padding:16 }}>로딩 중...</div>;
  if (!data) return <div style={{ color:"#555", fontSize:12, padding:16 }}>재무 데이터를 가져올 수 없습니다 (선물/ETF는 미지원)</div>;
  const fd = data.financialData || {};
  const ks = data.defaultKeyStatistics || {};
  const sd = data.summaryDetail || {};
  const v = (obj) => obj?.raw != null ? obj.raw : null;
  const fmt = (val, dec=2) => val != null ? Number(val).toFixed(dec) : "-";
  const pct = (val) => val != null ? (val * 100).toFixed(1) + "%" : "-";
  const r = krw || 1350;
  const bigKrw = (val) => { if (val == null) return "-"; const w = val * r; const abs = Math.abs(w); const sign = w < 0 ? "-" : ""; if (abs >= 1e12) return `${sign}₩${(abs/1e12).toFixed(1)}조`; if (abs >= 1e8) return `${sign}₩${(abs/1e8).toFixed(0)}억`; if (abs >= 1e4) return `${sign}₩${(abs/1e4).toFixed(0)}만`; return `₩${Math.round(w).toLocaleString()}`; };

  const sections = [
    { title: "밸류에이션", items: [
      { label: "시가총액", value: bigKrw(v(sd.marketCap)) },
      { label: "Trailing P/E", value: fmt(v(ks.trailingPE) || v(sd.trailingPE)), good: v(ks.trailingPE) < 20 },
      { label: "Forward P/E", value: fmt(v(ks.forwardPE)), good: v(ks.forwardPE) < 15 },
      { label: "P/B", value: fmt(v(ks.priceToBook)), good: v(ks.priceToBook) < 3 },
      { label: "EV/EBITDA", value: fmt(v(ks.enterpriseToEbitda)), good: v(ks.enterpriseToEbitda) < 12 },
      { label: "PEG", value: fmt(v(ks.pegRatio)), good: v(ks.pegRatio) != null && v(ks.pegRatio) < 1.5 },
    ]},
    { title: "수익성", items: [
      { label: "영업이익률", value: pct(v(fd.operatingMargins)), good: v(fd.operatingMargins) > 0.15 },
      { label: "순이익률", value: pct(v(fd.profitMargins)), good: v(fd.profitMargins) > 0.1 },
      { label: "ROE", value: pct(v(fd.returnOnEquity)), good: v(fd.returnOnEquity) > 0.15 },
      { label: "ROA", value: pct(v(fd.returnOnAssets)), good: v(fd.returnOnAssets) > 0.05 },
    ]},
    { title: "성장성", items: [
      { label: "매출 성장률", value: pct(v(fd.revenueGrowth)), good: v(fd.revenueGrowth) > 0.05 },
      { label: "이익 성장률", value: pct(v(fd.earningsGrowth)), good: v(fd.earningsGrowth) > 0.1 },
      { label: "EPS (TTM)", value: `₩${v(ks.trailingEps) != null ? Math.round(v(ks.trailingEps) * r).toLocaleString() : "-"}` },
      { label: "EPS (Forward)", value: `₩${v(ks.forwardEps) != null ? Math.round(v(ks.forwardEps) * r).toLocaleString() : "-"}` },
    ]},
    { title: "배당 & 재무건전성", items: [
      { label: "배당수익률", value: v(sd.dividendYield) != null ? pct(v(sd.dividendYield)) : v(ks.dividendYield) != null ? pct(v(ks.dividendYield)) : "-" },
      { label: "배당성향", value: pct(v(sd.payoutRatio)) },
      { label: "부채/자본", value: v(fd.debtToEquity) != null ? fmt(v(fd.debtToEquity), 1) + "%" : "-", good: v(fd.debtToEquity) < 100 },
      { label: "유동비율", value: fmt(v(fd.currentRatio)), good: v(fd.currentRatio) > 1.5 },
      { label: "매출액", value: bigKrw(v(fd.totalRevenue)) },
      { label: "현금", value: bigKrw(v(fd.totalCash)) },
      { label: "부채", value: bigKrw(v(fd.totalDebt)) },
    ]},
  ];

  return (
    <div style={{ padding:"8px 0" }}>
      {sections.map((sec, si) => (
        <div key={si} style={{ marginBottom:12 }}>
          <div style={{ color:"#f5c518", fontSize:11, fontWeight:600, marginBottom:6 }}>{sec.title}</div>
          {sec.items.map((item, ii) => (
            <div key={ii} style={{ display:"flex", justifyContent:"space-between", padding:"4px 4px", borderBottom:"1px solid #111", fontSize:11 }}>
              <span style={{ color:"#888" }}>{item.label}</span>
              <span style={{ color: item.value === "-" ? "#333" : item.good === true ? "#4caf50" : item.good === false ? "#f44336" : "#fff", fontWeight:600 }}>{item.value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function NetIncomeTab({ symbol }) {
  const [data, setData] = useState(null);
  const [krw, setKrw] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [result, rate] = await Promise.all([
          fetchQuoteSummary(symbol, "incomeStatementHistory,incomeStatementHistoryQuarterly,assetProfile"),
          getUSDKRW()
        ]);
        setData(result);
        setKrw(rate);
      } catch { setData(null); }
      setLoading(false);
    })();
  }, [symbol]);
  if (loading) return <div style={{ color:"#333", fontSize:12, padding:16 }}>로딩 중...</div>;
  if (!data) return <div style={{ color:"#555", fontSize:12, padding:16 }}>순이익 데이터를 가져올 수 없습니다</div>;
  const employees = data.assetProfile?.fullTimeEmployees || null;
  const annual = data.incomeStatementHistory?.incomeStatementHistory || [];
  const quarterly = data.incomeStatementHistoryQuarterly?.incomeStatementHistory || [];
  // 연간 데이터 (오래된 것 먼저)
  const annualData = [...annual].reverse().map(s => ({
    date: s.endDate?.fmt?.slice(0, 7) || "-",
    netIncome: s.netIncome?.raw || 0,
    revenue: s.totalRevenue?.raw || 0,
  }));
  // 분기별 데이터 (오래된 것 먼저)
  const quarterlyData = [...quarterly].reverse().map(s => ({
    date: s.endDate?.fmt?.slice(0, 7) || "-",
    netIncome: s.netIncome?.raw || 0,
    revenue: s.totalRevenue?.raw || 0,
  }));
  const r = krw || 1350;
  const big = (val) => { if (val == null) return "-"; const w = val * r; const abs = Math.abs(w); const sign = w < 0 ? "-" : ""; if (abs >= 1e12) return `${sign}₩${(abs/1e12).toFixed(1)}조`; if (abs >= 1e8) return `${sign}₩${(abs/1e8).toFixed(0)}억`; if (abs >= 1e4) return `${sign}₩${(abs/1e4).toFixed(0)}만`; return `₩${Math.round(w).toLocaleString()}`; };
  const latestAnnual = annualData[annualData.length - 1];
  const perEmployee = employees && latestAnnual ? latestAnnual.netIncome / employees : null;

  const renderChart = (items, label) => {
    if (!items.length) return null;
    const maxVal = Math.max(...items.map(d => Math.abs(d.netIncome)), 1);
    return (
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, color:"#555", marginBottom:8 }}>{label}</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:120, padding:"0 4px" }}>
          {items.map((d, i) => {
            const h = Math.abs(d.netIncome) / maxVal * 100;
            const isPos = d.netIncome >= 0;
            const perEmp = employees ? d.netIncome / employees : null;
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", height:"100%" }}>
                <div style={{ fontSize:9, color: isPos ? "#4caf50" : "#f44336", marginBottom:2 }}>{big(d.netIncome)}</div>
                <div style={{ width:"100%", height:`${Math.max(h, 3)}%`, background: isPos ? "#4caf50" : "#f44336", borderRadius:"3px 3px 0 0", opacity:0.8 }} />
                <div style={{ fontSize:8, color:"#555", marginTop:2 }}>{d.date}</div>
                {perEmp != null && <div style={{ fontSize:8, color:"#888" }}>{big(perEmp)}/인</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding:"8px 0" }}>
      {/* 요약 카드 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:10, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>직원수</div>
          <div style={{ color:"#fff", fontSize:16, fontWeight:700 }}>{employees ? employees.toLocaleString() : "-"}명</div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:10, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>인당 순이익 (연간)</div>
          <div style={{ color: perEmployee > 0 ? "#4caf50" : "#f44336", fontSize:16, fontWeight:700 }}>{perEmployee != null ? big(Math.round(perEmployee)) : "-"}</div>
        </div>
        {latestAnnual && <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:10, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>최근 연간 순이익</div>
          <div style={{ color: latestAnnual.netIncome >= 0 ? "#4caf50" : "#f44336", fontSize:16, fontWeight:700 }}>{big(latestAnnual.netIncome)}</div>
        </div>}
      </div>
      {renderChart(annualData, "연간 순이익 (인당순이익)")}
      {renderChart(quarterlyData, "분기별 순이익 (인당순이익)")}
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
      if (!av) { console.warn(`[calcGoldenMap] ${item.ticker}: fetchMaxDaily returned null`); return; }
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
      if(!scored.length) { if(item.ticker==="RGLD") console.log("[RGLD] scored empty, daily:", daily.length); return; }
      const best = BT_THRESHOLDS.reduce((bestRow, th, idx) => {
        const next = BT_THRESHOLDS[idx+1];
        const group = next ? scored.filter(t=>t.score>=th&&t.score<next) : scored.filter(t=>t.score>=th);
        const ss = sortinoScore(group.map(t=>t.ret));
        return ss > bestRow.ss ? { th, next: next??null, ss } : bestRow;
      }, { ss: -Infinity });
      if(item.ticker==="RGLD") console.log("[RGLD] calcGoldenMap:", {scored: scored.length, best});
      if(best.ss > -Infinity) map.set(item.ticker, { th: best.th, next: best.next });
    } catch(e) { console.error(`[calcGoldenMap] ${item.ticker} error:`, e); }
  }));
  console.log("[calcGoldenMap] result:", Object.fromEntries(map));
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
    // RSI 캐시 확인 (1시간)
    try {
      const cached = JSON.parse(localStorage.getItem("rsimap_cache"));
      if (cached && Date.now() - cached._ts < 3600000) {
        setData(cached.data);
        if (cached.goldenMap) setGoldenMap(new Map(Object.entries(cached.goldenMap)));
        setLoading(false);
        // 백그라운드 갱신
        (async () => {
          const { data: wl } = await supabase.from("stock_watchlist").select("*");
          if (!wl || wl.length === 0) return;
          const [daily, weekly, monthly] = await Promise.all([
            fetchRSIForInterval(wl, "d"), fetchRSIForInterval(wl, "w"), fetchRSIForInterval(wl, "m")
          ]);
          const newData = { d: daily, w: weekly, m: monthly };
          setData(newData);
          const gr = await calcGoldenMap(wl);
          setGoldenMap(gr);
          try { localStorage.setItem("rsimap_cache", JSON.stringify({ _ts: Date.now(), data: newData, goldenMap: Object.fromEntries(gr) })); } catch {}
        })();
        return;
      }
    } catch {}
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
      // 캐시 저장
      try { localStorage.setItem("rsimap_cache", JSON.stringify({ _ts: Date.now(), data: { d: daily, w: weekly, m: monthly }, goldenMap: Object.fromEntries(gr) })); } catch {}
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
              const isGolden = tg != null && score >= tg.th && (tg.next == null || score <= tg.next);
              if(item.ticker === "RGLD" || item.ticker === "GC=F") console.log(`[${item.ticker}]`, {score, tg, isGolden});
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
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:4 }}>
          <button onClick={() => { localStorage.removeItem("rsimap_cache"); window.location.reload(); }} style={{ background:"none", border:"1px solid #333", borderRadius:4, color:"#888", fontSize:11, padding:"3px 8px", cursor:"pointer" }}>↻ 새로고침</button>
        </div>
        {selected ? (
          <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
            <div style={{ display:"flex", gap:0, borderBottom:"1px solid #1a1a1a", marginBottom:8 }}>
              {[{id:"chart",label:"차트"},{id:"backtest",label:"백테스팅"},{id:"radar",label:"More"}].map(t => (
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
            ) : rightTab === "backtest" ? (
              <div style={{ flex:1, overflow:"hidden" }}>
                <BacktestPanel symbol={selected} currentScore={calcScore(selected, data)} goldenRange={goldenMap?.get(selected)} onGoldenFound={(ticker, range) => setGoldenMap(prev => { const m = new Map(prev); m.set(ticker, range); return m; })} />
              </div>
            ) : rightTab === "radar" ? (
              <div style={{ flex:1, overflow:"hidden" }}>
                <RadarPanel symbol={selected} />
              </div>
            ) : (
              <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:13 }}>
                준비중
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

// ── KIS API (키는 서버사이드에서 관리) ──
async function kisAPI(path, params = {}, trId = "", postBody = null) {
  const url = new URL(`/api/kis${path}`, window.location.origin);
  if (!postBody) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    const res = await fetch(url, {
      method: postBody ? "POST" : "GET",
      headers: { tr_id: trId, ...(postBody ? { "Content-Type": "application/json" } : {}) },
      ...(postBody ? { body: JSON.stringify(postBody) } : {}),
    });
    const json = await res.json();
    if (json.rt_cd === "1") console.warn(`[KIS] ${trId} error:`, json.msg1);
    return json;
  } catch(e) { console.warn("[KIS] fetch error:", e); return null; }
}

async function detectExchange(ticker) {
  try {
    const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`);
    if (!res.ok) return "NASD";
    const json = await res.json();
    const ex = json?.chart?.result?.[0]?.meta?.exchangeName || "";
    return EXCHANGE_MAP[ex] || "NASD";
  } catch { return "NASD"; }
}

async function kisOrder(side, ticker, qty, price = "0", exchange = "NASD") {
  const trId = side === "buy" ? "TTTT1002U" : "TTTT1006U";
  return kisAPI("/uapi/overseas-stock/v1/trading/order", {}, trId, {
    CANO: "", ACNT_PRDT_CD: "",
    OVRS_EXCG_CD: exchange,
    PDNO: ticker,
    ORD_QTY: String(qty),
    OVRS_ORD_UNPR: String(price),
    CTAC_TLNO: "", MGCO_APTM_ODNO: "",
    SLL_TYPE: side === "sell" ? "00" : "",
    ORD_SVR_DVSN_CD: "0",
    ORD_DVSN: "00",
  });
}

async function fetchOverseasBalance() {
  // NASD(나스닥), NYSE, AMEX 각각 조회 후 합치기
  const exchanges = [
    { code: "NASD", trId: "TTTS3012R" },
    { code: "NYSE", trId: "TTTS3012R" },
    { code: "AMEX", trId: "TTTS3012R" },
  ];
  const all = [];
  for (const ex of exchanges) {
    const data = await kisAPI("/uapi/overseas-stock/v1/trading/inquire-balance", {
      
      OVRS_EXCG_CD: ex.code, TR_CRCY_CD: "USD",
      CTX_AREA_FK200: "", CTX_AREA_NK200: ""
    }, ex.trId);
    if (data?.output1) {
      data.output1.filter(item => parseFloat(item.ovrs_cblc_qty) > 0).forEach(item => {
        all.push({
          ticker: item.ovrs_pdno,
          name: item.ovrs_item_name,
          qty: parseInt(item.ovrs_cblc_qty),
          avgPrice: parseFloat(item.pchs_avg_pric),
          currentPrice: parseFloat(item.now_pric2 || item.ovrs_now_pric1 || "0"),
          pnl: parseFloat(item.frcr_evlu_pfls_amt || "0"),
          pnlRate: parseFloat(item.evlu_pfls_rt || "0"),
          exchange: ex.code,
        });
      });
    }
  }
  // 중복 제거 (같은 ticker는 첫번째만)
  const seen = new Set();
  const unique = all.filter(item => { if (seen.has(item.ticker)) return false; seen.add(item.ticker); return true; });
  return unique;
}

function TradePage() {
  const [tradeTab, setTradeTab] = useState("balance");
  return (
    <div>
      <div style={{ display:"flex", gap:0, borderBottom:"1px solid #1a1a1a", marginBottom:0 }}>
        {[{id:"balance",label:"잔고"},{id:"bot1",label:"BOT1"},{id:"bot2",label:"BOT2"},{id:"bot3",label:"BOT3"},{id:"bot4",label:"BOT4"},{id:"bot5",label:"BOT5"}].map(t => (
          <button key={t.id} onClick={() => setTradeTab(t.id)} style={{
            background:"none", border:"none",
            borderBottom: tradeTab===t.id ? "2px solid #888" : "2px solid transparent",
            color: tradeTab===t.id ? "#ddd" : "#555",
            fontSize:"0.82rem", fontWeight: tradeTab===t.id ? 600 : 400,
            padding:"6px 18px", cursor:"pointer",
          }}>{t.label}</button>
        ))}
      </div>
      {tradeTab === "balance" && <BalanceTab />}
      {tradeTab.startsWith("bot") && <BotTab botId={tradeTab} />}
    </div>
  );
}

async function fetchAccountBalance() {
  let krwCash = 0, usdCash = 0;
  // 1. 국내 계좌잔고 조회 (원화 예수금)
  try {
    const data = await kisAPI("/uapi/domestic-stock/v1/trading/inquire-account-balance", {
      
      INQR_DVSN_1: "", BSPR_BF_DT_APLY_YN: ""
    }, "CTRP6548R");
    const o2 = data?.output2;
    if (o2) {
      const items = Array.isArray(o2) ? o2 : [o2];
      for (const item of items) {
        const amt = parseFloat(item.dncl_amt || item.tot_dncl_amt || "0");
        if (amt > 0) krwCash = amt;
      }
    }
  } catch {}
  // 2. 해외증거금 통화별조회 (달러 예수금)
  try {
    const margin = await kisAPI("/uapi/overseas-stock/v1/trading/foreign-margin", {
      
    }, "TTTC2101R");
    if (margin?.output) {
      const items = Array.isArray(margin.output) ? margin.output : [margin.output];
      for (const item of items) {
        if (item.crcy_cd === "USD") {
          const amt = parseFloat(item.frcr_dncl_amt1 || "0");
          if (amt > 0) usdCash = amt;
        }
      }
    }
  } catch {}
  return { krwCash, usdCash };
}

function BalanceTab() {
  const [cash, setCash] = useState(null);
  const [holdings, setHoldings] = useState(null);
  const [krwRate, setKrwRate] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const [cashData, bal, rate] = await Promise.all([fetchAccountBalance(), fetchOverseasBalance(), getUSDKRW()]);
    setCash(cashData);
    setHoldings(bal);
    setKrwRate(rate);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const r = krwRate || 1350;
  const totalHoldingValue = holdings?.reduce((s, b) => s + b.currentPrice * b.qty, 0) || 0;
  const totalPnl = holdings?.reduce((s, b) => s + b.pnl, 0) || 0;

  return (
    <div style={{ padding:16 }}>
      {loading && <div style={{ color:"#333", fontSize:12 }}>로딩 중...</div>}

      {!loading && cash && (
        <>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:16, textAlign:"center" }}>
            <div style={{ color:"#555", fontSize:10, marginBottom:4 }}>원화 예수금</div>
            <div style={{ color:"#fff", fontSize:20, fontWeight:700 }}>₩{Math.round(cash.krwCash).toLocaleString()}</div>
          </div>
          <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:16, textAlign:"center" }}>
            <div style={{ color:"#555", fontSize:10, marginBottom:4 }}>달러 예수금</div>
            <div style={{ color:"#fff", fontSize:20, fontWeight:700 }}>${cash.usdCash.toFixed(2)}</div>
          </div>
          <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:16, textAlign:"center" }}>
            <div style={{ color:"#555", fontSize:10, marginBottom:4 }}>보유 평가</div>
            <div style={{ color:"#fff", fontSize:20, fontWeight:700 }}>${totalHoldingValue.toFixed(2)}</div>
          </div>
          <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:16, textAlign:"center" }}>
            <div style={{ color:"#555", fontSize:10, marginBottom:4 }}>총 손익</div>
            <div style={{ color: totalPnl >= 0 ? "#4caf50" : "#f44336", fontSize:20, fontWeight:700 }}>{totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}</div>
          </div>
        </div>

        {/* 보유 주식 */}
        {holdings && holdings.length > 0 && (
          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:12, color:"#555" }}>보유 주식</span>
              <button onClick={refresh} style={{ background:"none", border:"1px solid #333", borderRadius:4, color:"#888", fontSize:10, padding:"2px 8px", cursor:"pointer" }}>↻ 새로고침</button>
            </div>
            {holdings.map((b, i) => (
              <div key={i} style={{ background:"#11141c", borderRadius:8, padding:10, marginBottom:4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div>
                    <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>{b.ticker}</span>
                    <span style={{ color:"#555", fontSize:10, marginLeft:6 }}>{b.name}</span>
                  </div>
                  <span style={{ color: b.pnlRate >= 0 ? "#4caf50" : "#f44336", fontSize:15, fontWeight:700 }}>
                    {b.pnlRate >= 0 ? "+" : ""}{b.pnlRate.toFixed(2)}%
                  </span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#888" }}>
                  <span>{b.qty}주</span>
                  <span>평단 ${b.avgPrice.toFixed(2)}</span>
                  <span>현재 ${b.currentPrice.toFixed(2)}</span>
                  <span style={{ color: b.pnl >= 0 ? "#4caf50" : "#f44336" }}>{b.pnl >= 0 ? "+" : ""}${b.pnl.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {holdings && holdings.length === 0 && (
          <div style={{ color:"#333", fontSize:12, textAlign:"center", padding:16, marginBottom:12 }}>보유 주식 없음</div>
        )}
        </>
      )}

      {!loading && !cash && (
        <div style={{ color:"#f44336", fontSize:12 }}>KIS API 연결 실패. APP Key를 확인해주세요.</div>
      )}

      {/* 바로구매 테스트 */}
      <QuickOrderTest />
    </div>
  );
}

const EXCHANGE_MAP = { NMS: "NASD", NGM: "NASD", NCM: "NASD", NYQ: "NYSE", ASE: "AMEX", PCX: "AMEX", BTS: "AMEX" };
function QuickOrderTest() {
  const [ticker, setTicker] = useState("AAPL");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [exchange, setExchange] = useState("NASD");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 현재가 + 거래소 조회
  const fetchPrice = async () => {
    if (!ticker) return;
    setFetching(true);
    try {
      const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1m&range=1d`);
      if (res.ok) {
        const json = await res.json();
        const r = json?.chart?.result?.[0];
        const closes = r?.indicators?.quote?.[0]?.close?.filter(v => v != null) || [];
        if (closes.length) {
          const p = closes[closes.length - 1];
          setCurrentPrice(p);
          setPrice(p.toFixed(2));
        }
        // 거래소 자동 판별
        const exName = r?.meta?.exchangeName || "";
        const mapped = EXCHANGE_MAP[exName] || "NASD";
        setExchange(mapped);
      }
    } catch {}
    setFetching(false);
  };

  // 종목 바뀌면 자동 조회
  useEffect(() => { if (ticker.length >= 1) fetchPrice(); }, [ticker]);

  const placeOrder = async (side) => {
    if (!ticker || qty <= 0 || !price) { alert("가격을 입력하세요"); return; }
    const confirmed = confirm(`${side === "buy" ? "매수" : "매도"} 주문\n종목: ${ticker}\n수량: ${qty}주\n가격: $${price}\n\n실제 주문입니다. 진행할까요?`);
    if (!confirmed) return;
    setLoading(true);
    setResult(null);
    const json = await kisOrder(side, ticker, qty, price, exchange);
    setResult(json);
    setLoading(false);
  };

  return (
    <div style={{ marginTop:20, background:"#11141c", borderRadius:10, padding:16 }}>
      <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:12 }}>주문 테스트</div>
      <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap", alignItems:"flex-end" }}>
        <div>
          <div style={{ color:"#555", fontSize:10, marginBottom:4 }}>종목</div>
          <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} style={{ width:80, background:"#0d0f14", border:"1px solid #333", borderRadius:4, color:"#fff", fontSize:12, padding:"6px 8px" }} />
        </div>
        <div>
          <div style={{ color:"#555", fontSize:10, marginBottom:4 }}>수량</div>
          <input type="number" value={qty} onChange={e => setQty(parseInt(e.target.value)||1)} min={1} style={{ width:50, background:"#0d0f14", border:"1px solid #333", borderRadius:4, color:"#fff", fontSize:12, padding:"6px 8px" }} />
        </div>
        <div>
          <div style={{ color:"#555", fontSize:10, marginBottom:4 }}>가격 {currentPrice ? `(현재 $${currentPrice.toFixed(2)} | ${exchange})` : ""}</div>
          <div style={{ display:"flex", gap:4 }}>
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="가격" style={{ width:80, background:"#0d0f14", border:"1px solid #333", borderRadius:4, color:"#fff", fontSize:12, padding:"6px 8px" }} />
            <button onClick={fetchPrice} disabled={fetching} style={{ background:"#1e2130", border:"1px solid #333", borderRadius:4, color:"#f5c518", fontSize:10, padding:"4px 8px", cursor:"pointer" }}>{fetching ? "..." : "현재가"}</button>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={() => placeOrder("buy")} disabled={loading || !price} style={{ flex:1, background: price ? "#4caf50" : "#333", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor: price ? "pointer" : "default" }}>{loading ? "주문 중..." : "매수"}</button>
        <button onClick={() => placeOrder("sell")} disabled={loading || !price} style={{ flex:1, background: price ? "#f44336" : "#333", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor: price ? "pointer" : "default" }}>{loading ? "주문 중..." : "매도"}</button>
      </div>
      {result && (
        <div style={{ marginTop:10, background:"#0d0f14", borderRadius:6, padding:10, fontSize:11 }}>
          <div style={{ color: result.rt_cd === "0" ? "#4caf50" : "#f44336", fontWeight:600, marginBottom:4 }}>
            {result.rt_cd === "0" ? "✅ 주문 성공!" : `❌ ${result.msg1 || result.error || "주문 실패"}`}
          </div>
          <pre style={{ color:"#888", fontSize:9, whiteSpace:"pre-wrap", margin:0 }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function LiveMonitor({ tickers }) {
  const intervals = [
    { id: "1m", label: "1분", range: "1d" },
    { id: "5m", label: "5분", range: "5d" },
    { id: "15m", label: "15분", range: "5d" },
  ];
  const [iv, setIv] = useState("1m");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const calcRSI9 = (closes) => {
    if (closes.length < 10) return null;
    let ag = 0, al = 0;
    for (let i = 1; i <= 9; i++) { const d = closes[i] - closes[i-1]; if (d > 0) ag += d; else al -= d; }
    ag /= 9; al /= 9;
    for (let i = 10; i < closes.length; i++) { const d = closes[i] - closes[i-1]; ag = (ag*8+(d>0?d:0))/9; al = (al*8+(d<0?-d:0))/9; }
    return al === 0 ? 100 : 100 - 100 / (1 + ag / al);
  };

  useEffect(() => {
    if (!tickers.length) return;
    let cancelled = false;
    const ivConfig = intervals.find(i => i.id === iv);
    const fetchAll = async () => {
      setLoading(true);
      const result = {};
      for (const t of tickers.slice(0, 10)) {
        try {
          const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(t)}?interval=${ivConfig.id}&range=${ivConfig.range}`);
          if (!res.ok) continue;
          const json = await res.json();
          const closes = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.filter(v => v != null) || [];
          if (closes.length < 2) continue;
          const price = closes[closes.length - 1];
          const change = (price - closes[0]) / closes[0] * 100;
          const rsi = calcRSI9(closes);
          result[t] = { price, rsi, change };
        } catch {}
      }
      if (!cancelled) { setData(result); setLoading(false); }
    };
    fetchAll();
    const timer = setInterval(fetchAll, 60000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [tickers.join(","), iv]);

  if (!tickers.length) return null;

  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontSize:11, color:"#555" }}>실시간 모니터링 (1분 갱신)</span>
        <div style={{ display:"flex", background:"#11141c", borderRadius:4, overflow:"hidden" }}>
          {intervals.map(i => (
            <button key={i.id} onClick={() => setIv(i.id)} style={{ background: iv === i.id ? "#1e2130" : "transparent", border:"none", color: iv === i.id ? "#f5c518" : "#555", fontSize:10, fontWeight:600, padding:"3px 8px", cursor:"pointer" }}>{i.label}</button>
          ))}
        </div>
      </div>
      {loading ? <div style={{ color:"#333", fontSize:11, padding:8 }}>로딩...</div> : (
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {tickers.map(t => {
          const d = data[t];
          if (!d) return <div key={t} style={{ background:"#11141c", borderRadius:6, padding:"6px 10px", fontSize:10, color:"#333" }}>{t} -</div>;
          const rsiColor = d.rsi <= 30 ? "#4caf50" : d.rsi >= 70 ? "#f44336" : "#fff";
          const changeColor = d.change >= 0 ? "#4caf50" : "#f44336";
          return (
            <div key={t} style={{ background:"#11141c", borderRadius:6, padding:"8px 10px", minWidth:100 }}>
              <div style={{ color:"#f5c518", fontSize:11, fontWeight:700 }}>{t}</div>
              <div style={{ color:"#fff", fontSize:13, fontWeight:700 }}>${d.price.toFixed(2)}</div>
              <div style={{ display:"flex", gap:6, fontSize:10, marginTop:2 }}>
                <span style={{ color: rsiColor, fontWeight:600 }}>RSI {d.rsi?.toFixed(0) || "-"}</span>
                <span style={{ color: changeColor }}>{d.change >= 0 ? "+" : ""}{d.change.toFixed(2)}%</span>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

function BotTab({ botId }) {
  const isMulti = true;
  const [config, setConfig] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`bot_config_${botId}`)) || null; } catch { return null; }
  });
  const [watchlist, setWatchlist] = useState([]);
  const [maxBudget, setMaxBudget] = useState(0);
  const [budget, setBudget] = useState(config?.budget || 0);
  const [selectedTicker, setSelectedTicker] = useState(config?.ticker || "");
  const [selectedTickers, setSelectedTickers] = useState(config?.tickers || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: wl } = await supabase.from("stock_watchlist").select("*");
      if (wl) setWatchlist(wl);
      const [cashData, rate] = await Promise.all([fetchAccountBalance(), getUSDKRW()]);
      const r = rate || 1350;
      const usd = cashData?.usdCash || 0;
      const krwAsUsd = cashData?.krwCash ? cashData.krwCash / r : 0;
      setMaxBudget(Math.floor((usd + krwAsUsd) * 100) / 100);
      if (config) { setBudget(config.budget); setSelectedTicker(config.ticker || ""); setSelectedTickers(config.tickers || []); }
      setLoading(false);
    })();
  }, [botId]);

  const toggleTicker = (t) => {
    setSelectedTickers(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const save = () => {
    const cfg = { budget, tickers: selectedTickers, ticker: selectedTickers[0] || "", botId, createdAt: new Date().toISOString() };
    localStorage.setItem(`bot_config_${botId}`, JSON.stringify(cfg));
    setConfig(cfg);
    alert(`${botId.toUpperCase()} 설정 저장됨\n종목: ${isMulti ? selectedTickers.join(", ") : selectedTicker}\n예산: $${budget}`);
  };

  const clear = () => {
    localStorage.removeItem(`bot_config_${botId}`);
    setConfig(null);
    setBudget(0);
    setSelectedTicker("");
    setSelectedTickers([]);
  };

  if (loading) return <div style={{ color:"#333", fontSize:12, padding:16 }}>로딩 중...</div>;

  return (
    <div style={{ padding:16 }}>
      <div style={{ fontSize:14, fontWeight:600, color:"#fff", marginBottom:16 }}>{botId.toUpperCase()} 설정</div>

      {/* 종목 선택 */}
      <div style={{ marginBottom:16 }}>
        <div style={{ color:"#555", fontSize:11, marginBottom:6 }}>{isMulti ? "목표 종목 (복수 선택)" : "목표 종목 (RSIMAP)"}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {watchlist.map(w => {
            const active = isMulti ? selectedTickers.includes(w.ticker) : selectedTicker === w.ticker;
            return (
              <button key={w.ticker} onClick={() => isMulti ? toggleTicker(w.ticker) : setSelectedTicker(w.ticker)} style={{
                background: active ? "#1e2130" : "#11141c",
                border: active ? "1px solid #f5c518" : "1px solid #1a1a1a",
                borderRadius:6, padding:"6px 12px", cursor:"pointer",
                color: active ? "#f5c518" : "#888", fontSize:11, fontWeight:600,
              }}>{w.ticker}</button>
            );
          })}
        </div>
        {isMulti && selectedTickers.length > 0 && <div style={{ color:"#f5c518", fontSize:12, marginTop:6 }}>{selectedTickers.length}개 선택: {selectedTickers.join(", ")}</div>}
        {!isMulti && selectedTicker && <div style={{ color:"#f5c518", fontSize:12, marginTop:6 }}>선택: {selectedTicker}</div>}
      </div>

      {/* 예산 설정 */}
      <div style={{ marginBottom:16 }}>
        <div style={{ color:"#555", fontSize:11, marginBottom:6 }}>예산 (최대 ${maxBudget.toFixed(2)})</div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <input type="range" min={0} max={maxBudget} step={10} value={budget}
            onChange={e => setBudget(parseFloat(e.target.value))}
            style={{ flex:1, accentColor:"#f5c518" }} />
          <div style={{ background:"#11141c", borderRadius:6, padding:"6px 12px", minWidth:80, textAlign:"center" }}>
            <span style={{ color:"#fff", fontSize:16, fontWeight:700 }}>${budget.toFixed(0)}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, marginTop:6 }}>
          {[25, 50, 75, 100].map(pct => (
            <button key={pct} onClick={() => setBudget(Math.floor(maxBudget * pct / 100))} style={{
              background:"#11141c", border:"1px solid #1a1a1a", borderRadius:4,
              color:"#888", fontSize:10, padding:"3px 8px", cursor:"pointer",
            }}>{pct}%</button>
          ))}
        </div>
      </div>

      {/* 현재 설정 요약 */}
      {config && (
        <div style={{ background:"#11141c", borderRadius:8, padding:12, marginBottom:16 }}>
          <div style={{ color:"#555", fontSize:10, marginBottom:4 }}>현재 설정</div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
            <span style={{ color:"#fff" }}>종목: <span style={{ color:"#f5c518", fontWeight:600 }}>{config.tickers ? config.tickers.join(", ") : config.ticker}</span></span>
            <span style={{ color:"#fff" }}>예산: <span style={{ color:"#4caf50", fontWeight:600 }}>${config.budget}</span></span>
          </div>
        </div>
      )}

      {/* 저장/초기화 */}
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={save} disabled={isMulti ? (!selectedTickers.length || budget <= 0) : (!selectedTicker || budget <= 0)} style={{
          flex:1, background: (isMulti ? selectedTickers.length : selectedTicker) && budget > 0 ? "#f5c518" : "#333",
          border:"none", borderRadius:6, padding:"10px", cursor: (isMulti ? selectedTickers.length : selectedTicker) && budget > 0 ? "pointer" : "default",
          color:"#000", fontSize:13, fontWeight:700,
        }}>저장</button>
        {config && <button onClick={clear} style={{
          background:"none", border:"1px solid #333", borderRadius:6, padding:"10px 16px",
          color:"#555", fontSize:12, cursor:"pointer",
        }}>초기화</button>}
      </div>

      {/* 실시간 모니터링 */}
      {config && <LiveMonitor tickers={config.tickers || (config.ticker ? [config.ticker] : [])} />}

      {/* BOT 전략 패널 */}
      {config && botId === "bot1" && <Bot1Strategy config={config} />}
      {config && botId === "bot2" && <Bot2Strategy config={config} />}
      {config && botId === "bot3" && <Bot3Strategy config={config} />}
      {config && botId === "bot4" && <Bot4Strategy config={config} />}
      {config && botId === "bot5" && <Bot5Strategy config={config} />}
    </div>
  );
}

// ── BOT1: 1분봉 RSI 단타 전략 ──
function Bot1Strategy({ config }) {
  const defaultParams = { buyTrigger: 35, buyEntry: 45, sellTrigger: 70, sellEntry: 65, minProfit: 1.0, stopLossPct: -3.0 };
  const [params, setParams] = useState(() => { try { return { ...defaultParams, ...JSON.parse(localStorage.getItem("bot1_params")) }; } catch { return defaultParams; } });
  const paramsRef = useRef(params);
  const updateParam = (key, val) => { const next = { ...paramsRef.current, [key]: val }; setParams(next); paramsRef.current = next; localStorage.setItem("bot1_params", JSON.stringify(next)); };
  const setAllParams = (obj) => { const next = { ...paramsRef.current, ...obj }; setParams(next); paramsRef.current = next; localStorage.setItem("bot1_params", JSON.stringify(next)); };
  const [running, setRunning] = useState(() => localStorage.getItem("bot1_running") === "true");
  const [simMode, setSimMode] = useState(false);
  const [logs, setLogs] = useState(() => { try { return JSON.parse(localStorage.getItem("bot1_logs") || "[]"); } catch { return []; } });
  const [position, setPosition] = useState(() => { try { return JSON.parse(localStorage.getItem("bot1_position")); } catch { return null; } });
  const [rsiData, setRsiData] = useState(null);
  const intervalRef = useRef(null);
  const simModeRef = useRef(false);

  const addLog = (msg) => {
    const entry = { time: new Date().toLocaleTimeString(), msg };
    setLogs(prev => {
      const next = [entry, ...prev].slice(0, 50);
      localStorage.setItem("bot1_logs", JSON.stringify(next));
      return next;
    });
  };

  // 미국 정규장 체크 (ET 9:30~16:00)
  const isMarketOpen = () => {
    const now = new Date();
    const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const h = et.getHours(), m = et.getMinutes();
    const mins = h * 60 + m;
    return mins >= 570 && mins <= 960; // 9:30 ~ 16:00
  };

  // 1분봉 RSI(9) 계산
  const RSI_PERIOD = 9;
  const calcBotRSI = (closes) => {
    if (closes.length < RSI_PERIOD + 1) return [];
    const rsi = [];
    let avgGain = 0, avgLoss = 0;
    for (let i = 1; i <= RSI_PERIOD; i++) {
      const d = closes[i] - closes[i - 1];
      if (d > 0) avgGain += d; else avgLoss -= d;
    }
    avgGain /= RSI_PERIOD; avgLoss /= RSI_PERIOD;
    rsi.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
    for (let i = RSI_PERIOD + 1; i < closes.length; i++) {
      const d = closes[i] - closes[i - 1];
      avgGain = (avgGain * (RSI_PERIOD-1) + (d > 0 ? d : 0)) / RSI_PERIOD;
      avgLoss = (avgLoss * (RSI_PERIOD-1) + (d < 0 ? -d : 0)) / RSI_PERIOD;
      rsi.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
    }
    return rsi;
  };

  // 1분봉 가져오기
  const fetch1mCandles = async (ticker) => {
    const excd = "NAS"; // TODO: 거래소 자동 판별
    const data = await kisAPI("/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice", {
      AUTH: "", EXCD: excd, SYMB: ticker, NMIN: "1", PINC: "1", NEXT: "", NREC: "30", FILL: "", KEYB: ""
    }, "HHDFS76950200");
    if (!data?.output2) return null;
    return data.output2.filter(c => parseFloat(c.clos) > 0).reverse().map(c => ({
      time: c.xhms,
      close: parseFloat(c.clos),
      vol: parseInt(c.tvol || "0"),
    }));
  };

  // 시뮬용: Yahoo 1분봉 가져오기
  const fetchYahoo1m = async (ticker) => {
    try {
      const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1m&range=1d`);
      if (!res.ok) return null;
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) return null;
      const ts = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];
      return ts.map((t, i) => ({ time: t, close: closes[i] })).filter(c => c.close != null);
    } catch { return null; }
  };

  // 봇 틱 (1분마다 실행)
  const tick = async () => {
    if (!config?.ticker) return;
    const isSim = simModeRef.current;
    if (!isSim && !isMarketOpen()) { setRsiData({ rsi: null, status: "장 마감" }); return; }

    try {
      // KIS API 데이터 사용 (시뮬/실전 동일)
      const candles = await fetch1mCandles(config.ticker);
      if (!candles || candles.length < 16) { setRsiData({ rsi: null, status: "데이터 부족" }); return; }

      const closes = candles.map(c => c.close);
      const rsiArr = calcBotRSI(closes);
      const currentRsi = rsiArr[rsiArr.length - 1];
      const prevRsi = rsiArr[rsiArr.length - 2];
      const currentPrice = closes[closes.length - 1];

      // 최근 RSI 히스토리 (매수/매도 조건 체크용)
      const recentRsi = rsiArr.slice(-10);
      const p = paramsRef.current;
      const hitBelow35 = recentRsi.some(r => r <= p.buyTrigger);
      const hitAbove70 = recentRsi.some(r => r >= p.sellTrigger);

      setRsiData({ rsi: currentRsi.toFixed(1), price: currentPrice, status: simModeRef.current ? "시뮬레이션" : "실행 중", hitBelow35, hitAbove70 });

      // 조건 감지 로그
      if (hitBelow35 && !hitAbove70) addLog(`👀 RSI ${currentRsi.toFixed(1)} | buyTrigger ${p.buyTrigger} 감지 | $${currentPrice.toFixed(2)}`);
      if (hitAbove70) addLog(`👀 RSI ${currentRsi.toFixed(1)} | sellTrigger ${p.sellTrigger} 감지 | $${currentPrice.toFixed(2)}`);

      const pos = JSON.parse(localStorage.getItem("bot1_position"));

      // 매수 로직
      if (!pos && hitBelow35 && currentRsi >= p.buyEntry && prevRsi < p.buyEntry) {
        const qty = Math.floor(config.budget / currentPrice);
        if (qty <= 0) { addLog(`매수 불가: 예산($${config.budget}) < 주가($${currentPrice})`); return; }
        addLog(`🔵 매수 신호! RSI ${currentRsi.toFixed(1)} | $${currentPrice} × ${qty}주`);
        const ex = await detectExchange(config.ticker);
        const orderResult = await kisOrder("buy", config.ticker, qty, currentPrice.toFixed(2), ex);
        if (orderResult?.rt_cd === "0") {
          addLog(`✅ 매수 체결! ${config.ticker} ${qty}주 $${currentPrice.toFixed(2)}`);
          const newPos = { ticker: config.ticker, price: currentPrice, qty, time: new Date().toISOString() };
          localStorage.setItem("bot1_position", JSON.stringify(newPos));
          setPosition(newPos);
        } else { addLog(`❌ 매수 실패: ${orderResult?.msg1 || "알 수 없는 오류"}`); }
      }

      // 매도
      if (pos && hitAbove70 && currentRsi <= p.sellEntry && prevRsi > p.sellEntry) {
        const pnlPct = (currentPrice - pos.price) / pos.price * 100;
        if (pnlPct >= p.minProfit) {
          addLog(`🔴 매도 신호! +${pnlPct.toFixed(2)}% | $${currentPrice}`);
          const ex = await detectExchange(pos.ticker);
          const orderResult = await kisOrder("sell", pos.ticker, pos.qty, currentPrice.toFixed(2), ex);
          if (orderResult?.rt_cd === "0") {
            addLog(`✅ 매도 체결! ${pos.ticker} +${pnlPct.toFixed(2)}%`);
            localStorage.removeItem("bot1_position"); setPosition(null);
          } else { addLog(`❌ 매도 실패: ${orderResult?.msg1 || ""}`); }
        } else {
          addLog(`⏳ 수익 ${pnlPct.toFixed(2)}% < ${p.minProfit}%. 존버.`);
        }
      }
      // 손절
      if (pos) {
        const pnlPct2 = (currentPrice - pos.price) / pos.price * 100;
        if (pnlPct2 <= p.stopLossPct) {
          addLog(`🔻 손절! ${pnlPct2.toFixed(2)}% | $${currentPrice}`);
          const ex = await detectExchange(pos.ticker);
          const orderResult = await kisOrder("sell", pos.ticker, pos.qty, currentPrice.toFixed(2), ex);
          if (orderResult?.rt_cd === "0") { addLog(`✅ 손절 체결!`); }
          else { addLog(`❌ 손절 주문 실패: ${orderResult?.msg1 || ""}`); }
          localStorage.removeItem("bot1_position"); setPosition(null);
        }
      }
    } catch (e) {
      addLog(`❌ 에러: ${e.message}`);
    }
  };

  // 최적화
  const [optimizing, setOptimizing] = useState(false);
  const runOptimize = async () => {
    if (!config?.ticker) return;
    setOptimizing(true);
    addLog("🔍 BOT1 최적화 시작...");
    try {
      const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(config.ticker)}?interval=1m&range=7d`);
      if (!res.ok) { addLog("❌ 데이터 실패"); setOptimizing(false); return; }
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) { addLog("❌ 데이터 없음"); setOptimizing(false); return; }
      const ts = result.timestamp || [];
      const closesRaw = result.indicators?.quote?.[0]?.close || [];
      const candles = ts.map((t, i) => ({ time: t, close: closesRaw[i] })).filter(c => c.close != null);
      const allCloses = candles.map(c => c.close);
      const rsiArr = calcBotRSI(allCloses);
      if (rsiArr.length < 20) { addLog("❌ 데이터 부족"); setOptimizing(false); return; }

      const buyTriggers = [25, 30, 35, 38, 40, 42];
      const buyEntries = [38, 42, 45, 48, 50];
      const sellTriggers = [60, 64, 68, 70];
      const sellEntries = [55, 58, 60, 63, 65];
      const minProfits = [0.5, 0.8, 1.0, 1.5];
      const stops = [-1.5, -2.0, -3.0, -5.0];

      let best = { profit: -Infinity, p: null, trades: 0, winRate: 0 };
      let tested = 0;

      for (const bt of buyTriggers) for (const be of buyEntries) {
        if (be <= bt) continue;
        for (const st of sellTriggers) for (const se of sellEntries) {
          if (se >= st) continue;
          for (const mp of minProfits) for (const sl of stops) {
            let pos = null, hitB = false, hitS = false;
            let totalProfit = 0, wins = 0, total = 0;
            for (let i = 1; i < rsiArr.length; i++) {
              const rsi = rsiArr[i], prev = rsiArr[i-1], price = allCloses[i + RSI_PERIOD];
              if (rsi <= bt) hitB = true;
              if (rsi >= st) hitS = true;
              if (!pos && hitB && rsi >= be && prev < be) {
                const qty = Math.floor(config.budget / price);
                if (qty > 0) { pos = { price, qty }; hitB = false; hitS = false; }
              }
              if (pos && hitS && rsi <= se && prev > se) {
                const pnl = (price - pos.price) / pos.price * 100;
                if (pnl >= mp) {
                  const fee = pos.price*pos.qty*0.0025 + price*pos.qty*0.0025;
                  totalProfit += (price-pos.price)*pos.qty - fee;
                  total++; if ((price-pos.price)*pos.qty - fee > 0) wins++;
                  pos = null; hitB = false; hitS = false;
                }
              }
              if (pos) {
                const pnl = (price - pos.price) / pos.price * 100;
                if (pnl <= sl) {
                  const fee = pos.price*pos.qty*0.0025 + price*pos.qty*0.0025;
                  totalProfit += (price-pos.price)*pos.qty - fee;
                  total++; pos = null; hitB = false; hitS = false;
                }
              }
            }
            tested++;
            if (totalProfit > best.profit && total >= 1) {
              best = { profit: totalProfit, p: { buyTrigger:bt, buyEntry:be, sellTrigger:st, sellEntry:se, minProfit:mp, stopLossPct:sl }, trades: total, winRate: total ? Math.round(wins/total*100) : 0 };
            }
          }
        }
      }

      if (best.p) {
        addLog(`✅ 완료 (${tested}개 조합)`);
        addLog(`🏆 RSI ${best.p.buyTrigger}↓→${best.p.buyEntry}↑ | ${best.p.sellTrigger}↑→${best.p.sellEntry}↓ | +${best.p.minProfit}% | 손절${best.p.stopLossPct}%`);
        addLog(`📊 ${best.trades}회 | 승률 ${best.winRate}% | $${best.profit.toFixed(2)}`);
        setAllParams(best.p);
      } else { addLog("⚠️ 매매 신호가 없는 구간입니다"); }
    } catch(e) { addLog(`❌ ${e.message}`); }
    setOptimizing(false);
  };

  // 백테스트 (시뮬레이션)
  const [btResults, setBtResults] = useState(null);
  const runBacktest = async () => {
    if (!config?.ticker) return;
    setSimMode(true); setRunning(true);
    addLog("🧪 백테스트 시작 — Yahoo 1분봉 최근 7일");
    try {
      const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(config.ticker)}?interval=1m&range=7d`);
      if (!res.ok) { addLog("❌ Yahoo 데이터 가져오기 실패"); setSimMode(false); setRunning(false); return; }
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) { addLog("❌ 데이터 없음"); setSimMode(false); setRunning(false); return; }
      const ts = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];
      const candles = ts.map((t, i) => ({ time: t, close: closes[i] })).filter(c => c.close != null);
      if (candles.length < 20) { addLog("❌ 데이터 부족 " + candles.length + "개"); setSimMode(false); setRunning(false); return; }

      addLog(`📊 데이터 ${candles.length}개 로드 완료`);

      const allCloses = candles.map(c => c.close);
      const rsiArr = calcBotRSI(allCloses);

      let btPos = null;
      const trades = [];
      let hitBuyTrigger = false, hitSellTrigger = false;
      const p = paramsRef.current;

      for (let i = 0; i < rsiArr.length; i++) {
        const rsi = rsiArr[i];
        const price = allCloses[i + RSI_PERIOD];
        const prevRsi = i > 0 ? rsiArr[i - 1] : null;
        const time = new Date(candles[i + RSI_PERIOD].time * 1000).toLocaleString("ko-KR", { month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" });

        if (rsi <= p.buyTrigger) hitBuyTrigger = true;
        if (rsi >= p.sellTrigger) hitSellTrigger = true;

        // 매수
        if (!btPos && hitBuyTrigger && rsi >= p.buyEntry && prevRsi != null && prevRsi < p.buyEntry) {
          const qty = Math.floor(config.budget / price);
          if (qty > 0) {
            btPos = { price, qty, time };
            addLog(`🔵 [${time}] 매수 RSI ${rsi.toFixed(1)} | $${price.toFixed(2)} × ${qty}주`);
            hitBuyTrigger = false;
            hitSellTrigger = false; // 매수 후 매도 트리거도 리셋
          }
        }

        // 매도
        if (btPos && hitSellTrigger && rsi <= p.sellEntry && prevRsi != null && prevRsi > p.sellEntry) {
          const pnl = (price - btPos.price) / btPos.price * 100;
          if (pnl >= p.minProfit) {
            const fee = btPos.price * btPos.qty * 0.0025 + price * btPos.qty * 0.0025;
            const profit = (price - btPos.price) * btPos.qty - fee;
            const netPnl = profit / (btPos.price * btPos.qty) * 100;
            addLog(`🔴 [${time}] 매도 RSI ${rsi.toFixed(1)} | $${price.toFixed(2)} | +${pnl.toFixed(2)}% (수수료후 ${netPnl >= 0 ? "+" : ""}${netPnl.toFixed(2)}%) | $${profit.toFixed(2)}`);
            trades.push({ buy: btPos.price, sell: price, qty: btPos.qty, pnl: netPnl, profit, buyTime: btPos.time, sellTime: time });
            btPos = null;
            hitBuyTrigger = false; // 매도 후 매수 트리거도 리셋
            hitSellTrigger = false;
          } else {
            addLog(`⏳ [${time}] 매도조건 but ${pnl.toFixed(2)}% < ${p.minProfit}%. 존버`);
          }
        }
        // 손절
        if (btPos) {
          const pnl = (price - btPos.price) / btPos.price * 100;
          if (pnl <= p.stopLossPct) {
            const fee = btPos.price * btPos.qty * 0.0025 + price * btPos.qty * 0.0025;
            const profit = (price - btPos.price) * btPos.qty - fee;
            const netPnl = profit / (btPos.price * btPos.qty) * 100;
            addLog(`🔻 [${time}] 손절 ${pnl.toFixed(2)}% (수수료후 ${netPnl.toFixed(2)}%) | $${price.toFixed(2)} | $${profit.toFixed(2)}`);
            trades.push({ buy: btPos.price, sell: price, qty: btPos.qty, pnl: netPnl, profit, buyTime: btPos.time, sellTime: time });
            btPos = null; hitBuyTrigger = false; hitSellTrigger = false;
          }
        }
      }

      // 미청산 포지션
      if (btPos) {
        const lastPrice = allCloses[allCloses.length - 1];
        const pnl = (lastPrice - btPos.price) / btPos.price * 100;
        addLog(`📌 미청산 포지션: 매수 $${btPos.price.toFixed(2)} → 현재 $${lastPrice.toFixed(2)} (${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}%)`);
      }

      const totalProfit = trades.reduce((s, t) => s + t.profit, 0);
      const winCount = trades.filter(t => t.pnl > 0).length;
      addLog(`📈 백테스트 완료: ${trades.length}회 매매 | 승률 ${trades.length ? Math.round(winCount / trades.length * 100) : 0}% | 총수익 $${totalProfit.toFixed(2)}`);

      setBtResults({
        trades,
        totalProfit,
        winRate: trades.length ? Math.round(winCount / trades.length * 100) : 0,
        tradeCount: trades.length,
        openPosition: btPos ? { ...btPos, currentPrice: allCloses[allCloses.length - 1], pnl: (allCloses[allCloses.length - 1] - btPos.price) / btPos.price * 100 } : null,
        lastRsi: rsiArr[rsiArr.length - 1],
        lastPrice: allCloses[allCloses.length - 1],
      });

      setRsiData({ rsi: rsiArr[rsiArr.length - 1].toFixed(1), price: allCloses[allCloses.length - 1], status: "백테스트 완료", hitBelow35: hitBuyTrigger, hitAbove70: hitSellTrigger });
      if (btPos) setPosition({ ticker: config.ticker, price: btPos.price, qty: btPos.qty, time: btPos.time });
      else { setPosition(null); localStorage.removeItem("bot1_position"); }

    } catch(e) { addLog(`❌ 에러: ${e.message}`); }
    setSimMode(false); setRunning(false);
  };

  // 봇 시작/정지
  const toggleBot = () => {
    if (running) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      localStorage.setItem("bot1_running", "false");
      setRunning(false);
      addLog("⏹ 봇 정지");
    } else {
      localStorage.setItem("bot1_running", "true");
      setRunning(true);
      addLog("▶ 봇 시작");
      tick(); // 즉시 1회 실행
      intervalRef.current = setInterval(tick, 60000); // 1분마다
    }
  };

  useEffect(() => {
    if (running) {
      tick();
      intervalRef.current = setInterval(tick, 60000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const pos = position;
  const pnlPct = pos && rsiData?.price ? ((rsiData.price - pos.price) / pos.price * 100) : null;

  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:12 }}>BOT1 전략: 1분봉 RSI 단타</div>

      {/* 전략 파라미터 */}
      <div style={{ background:"#11141c", borderRadius:8, padding:10, marginBottom:12, fontSize:11, color:"#888", display:"flex", flexWrap:"wrap", alignItems:"center", gap:4 }}>
        <span>매수: RSI(9)</span>
        <input type="number" value={params.buyTrigger} onChange={e => updateParam("buyTrigger", parseFloat(e.target.value)||0)} style={{ width:36, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#4caf50", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>↓ 찍은 후</span>
        <input type="number" value={params.buyEntry} onChange={e => updateParam("buyEntry", parseFloat(e.target.value)||0)} style={{ width:36, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#4caf50", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>↑ 매수 | 매도: RSI</span>
        <input type="number" value={params.sellTrigger} onChange={e => updateParam("sellTrigger", parseFloat(e.target.value)||0)} style={{ width:36, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#f44336", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>↑ 찍은 후</span>
        <input type="number" value={params.sellEntry} onChange={e => updateParam("sellEntry", parseFloat(e.target.value)||0)} style={{ width:36, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#f44336", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>↓ AND +</span>
        <input type="number" value={params.minProfit} step={0.1} onChange={e => updateParam("minProfit", parseFloat(e.target.value)||0)} style={{ width:40, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#f5c518", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>% 이상 | 손절:</span>
        <input type="number" value={params.stopLossPct} step={0.5} onChange={e => updateParam("stopLossPct", parseFloat(e.target.value)||0)} style={{ width:40, background:"#0d0f14", border:"1px solid #f44336", borderRadius:3, color:"#f44336", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>% | 정규장만</span>
      </div>

      {/* 시작/시뮬 버튼 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <button onClick={toggleBot} style={{
          flex:1, background: running && !simMode ? "#f44336" : "#4caf50", border:"none", borderRadius:6,
          padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer",
          opacity: simMode ? 0.4 : 1,
        }} disabled={simMode}>{running && !simMode ? "⏹ 정지" : "▶ 실전"}</button>
        <button onClick={runBacktest} style={{
          flex:1, background: simMode ? "#555" : "#ff9800", border:"none", borderRadius:6,
          padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer",
          opacity: running && !simMode || optimizing ? 0.4 : 1,
        }} disabled={running || simMode || optimizing}>{simMode ? "백테스트 중..." : "🧪 백테스트"}</button>
        <button onClick={runOptimize} style={{
          flex:1, background: optimizing ? "#555" : "#9c27b0", border:"none", borderRadius:6,
          padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer",
          opacity: running || simMode ? 0.4 : 1,
        }} disabled={running || simMode || optimizing}>{optimizing ? "최적화 중..." : "🔍 최적화"}</button>
      </div>

      {/* 현재가 + RSI + 상태 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>현재가</div>
          <div style={{ color:"#fff", fontSize:22, fontWeight:700 }}>{rsiData?.price ? `$${rsiData.price.toFixed(2)}` : "-"}</div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>RSI(9)</div>
          <div style={{ color: rsiData?.rsi ? (parseFloat(rsiData.rsi) <= 35 ? "#4caf50" : parseFloat(rsiData.rsi) >= 70 ? "#f44336" : "#fff") : "#333", fontSize:22, fontWeight:700 }}>
            {rsiData?.rsi || "-"}
          </div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>상태</div>
          <div style={{ color: running ? (simMode ? "#ff9800" : "#4caf50") : "#555", fontSize:13, fontWeight:600 }}>{rsiData?.status || (running ? "대기" : "정지")}</div>
        </div>
      </div>

      {/* 매수/매도 시그널 카드 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        {/* 매수 카드 */}
        <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:14, border: rsiData?.hitBelow35 && parseFloat(rsiData?.rsi||0) >= params.buyEntry ? "1px solid #4caf50" : "1px solid #1a1a1a" }}>
          <div style={{ color:"#4caf50", fontSize:12, fontWeight:700, marginBottom:8 }}>매수</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background: rsiData?.hitBelow35 ? "#4caf50" : "#333" }} />
            <span style={{ color: rsiData?.hitBelow35 ? "#4caf50" : "#555", fontSize:11 }}>RSI {params.buyTrigger}↓ {rsiData?.hitBelow35 ? "✓ 준비" : "대기"}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background: rsiData?.hitBelow35 && parseFloat(rsiData?.rsi||0) >= params.buyEntry ? "#4caf50" : "#333" }} />
            <span style={{ color: rsiData?.hitBelow35 && parseFloat(rsiData?.rsi||0) >= params.buyEntry ? "#4caf50" : "#555", fontSize:11 }}>RSI {params.buyEntry}↑ {rsiData?.hitBelow35 && parseFloat(rsiData?.rsi||0) >= params.buyEntry ? "✓ 매수!" : "대기"}</span>
          </div>
        </div>
        {/* 매도 카드 */}
        <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:14, border: pos && rsiData?.hitAbove70 && parseFloat(rsiData?.rsi||100) <= params.sellEntry && pnlPct >= params.minProfit ? "1px solid #f44336" : "1px solid #1a1a1a" }}>
          <div style={{ color:"#f44336", fontSize:12, fontWeight:700, marginBottom:8 }}>매도</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background: rsiData?.hitAbove70 ? "#f44336" : "#333" }} />
            <span style={{ color: rsiData?.hitAbove70 ? "#f44336" : "#555", fontSize:11 }}>RSI {params.sellTrigger}↑ {rsiData?.hitAbove70 ? "✓ 준비" : "대기"}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background: rsiData?.hitAbove70 && parseFloat(rsiData?.rsi||100) <= params.sellEntry ? "#f44336" : "#333" }} />
            <span style={{ color: rsiData?.hitAbove70 && parseFloat(rsiData?.rsi||100) <= params.sellEntry ? "#f44336" : "#555", fontSize:11 }}>RSI {params.sellEntry}↓ {rsiData?.hitAbove70 && parseFloat(rsiData?.rsi||100) <= params.sellEntry ? "✓" : "대기"}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background: pnlPct != null && pnlPct >= params.minProfit ? "#f44336" : "#333" }} />
            <span style={{ color: pnlPct != null && pnlPct >= params.minProfit ? "#f44336" : "#555", fontSize:11 }}>수익 +{params.minProfit}%↑ {pnlPct != null ? `(${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}%)` : "미보유"}</span>
          </div>
        </div>
      </div>

      {/* 포지션 카드 */}
      {pos ? (
        <div style={{ background: pnlPct >= 1 ? "#1a2e1a" : pnlPct < 0 ? "#2e1a1a" : "#11141c", borderRadius:10, padding:14, marginBottom:12, border: pnlPct >= 1 ? "1px solid #4caf50" : pnlPct < 0 ? "1px solid #f44336" : "1px solid #1a1a1a" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div>
              <span style={{ color:"#fff", fontSize:14, fontWeight:700 }}>{pos.ticker}</span>
              <span style={{ color:"#555", fontSize:11, marginLeft:8 }}>{pos.qty}주</span>
            </div>
            <div style={{ color: pnlPct >= 0 ? "#4caf50" : "#f44336", fontSize:24, fontWeight:700 }}>
              {pnlPct != null ? `${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}%` : "-"}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
            <div><span style={{ color:"#555" }}>매수가</span> <span style={{ color:"#fff", fontWeight:600 }}>${pos.price.toFixed(2)}</span></div>
            <div><span style={{ color:"#555" }}>현재가</span> <span style={{ color:"#fff", fontWeight:600 }}>{rsiData?.price ? `$${rsiData.price.toFixed(2)}` : "-"}</span></div>
            <div><span style={{ color:"#555" }}>수익(수수료제외)</span> <span style={{ color: pnlPct >= 0 ? "#4caf50" : "#f44336", fontWeight:600 }}>{pnlPct != null && rsiData?.price ? `$${((rsiData.price - pos.price) * pos.qty).toFixed(2)}` : "-"}</span></div>
          </div>
        </div>
      ) : (
        <div style={{ background:"#11141c", borderRadius:10, padding:14, marginBottom:12, textAlign:"center" }}>
          <div style={{ color:"#333", fontSize:12 }}>포지션 없음 — 매수 대기 중</div>
        </div>
      )}

      {/* 백테스트 결과 팝업 */}
      {btResults && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }} onClick={() => setBtResults(null)}>
          <div style={{ background:"#0d0f14", borderRadius:12, padding:20, maxWidth:500, width:"90%", maxHeight:"80vh", overflow:"auto", border:"1px solid #1a1a1a" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#ff9800" }}>백테스트 결과 (7일)</div>
              <button onClick={() => setBtResults(null)} style={{ background:"none", border:"none", color:"#555", fontSize:18, cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>매매 횟수</div>
                <div style={{ color:"#fff", fontSize:22, fontWeight:700 }}>{btResults.tradeCount}회</div>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>승률</div>
                <div style={{ color: btResults.winRate >= 50 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>{btResults.winRate}%</div>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>총 수익</div>
                <div style={{ color: btResults.totalProfit >= 0 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>${btResults.totalProfit.toFixed(2)}</div>
              </div>
            </div>
            {btResults.trades.length > 0 ? (
              <>
                <div style={{ fontSize:11, color:"#555", marginBottom:6 }}>매매 내역</div>
                {btResults.trades.map((t, i) => (
                  <div key={i} style={{ background:"#11141c", borderRadius:6, padding:8, marginBottom:4 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <span style={{ color:"#888", fontSize:11 }}>#{i+1}</span>
                      <span style={{ color: t.pnl >= 0 ? "#4caf50" : "#f44336", fontSize:14, fontWeight:700 }}>{t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}%</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#888" }}>
                      <span>매수 <span style={{ color:"#4caf50" }}>${t.buy.toFixed(2)}</span> {t.buyTime}</span>
                      <span>매도 <span style={{ color:"#f44336" }}>${t.sell.toFixed(2)}</span> {t.sellTime}</span>
                      <span style={{ color: t.profit >= 0 ? "#4caf50" : "#f44336" }}>{t.profit >= 0 ? "+" : ""}${t.profit.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color:"#555", fontSize:12, textAlign:"center", padding:20 }}>7일간 매매 신호가 없었습니다</div>
            )}
            {btResults.openPosition && (
              <div style={{ background:"#1a2e1a", borderRadius:6, padding:10, marginTop:8, fontSize:11, color:"#4caf50" }}>
                📌 미청산: 매수 ${btResults.openPosition.price.toFixed(2)} → 현재 ${btResults.openPosition.currentPrice.toFixed(2)} ({btResults.openPosition.pnl >= 0 ? "+" : ""}{btResults.openPosition.pnl.toFixed(2)}%)
              </div>
            )}
            <button onClick={() => setBtResults(null)} style={{ marginTop:12, width:"100%", background:"#1a1a1a", border:"1px solid #333", borderRadius:6, padding:10, color:"#888", fontSize:12, cursor:"pointer" }}>닫기</button>
          </div>
        </div>
      )}

      {/* 로그 */}
      <div style={{ fontSize:11, color:"#555", marginBottom:4 }}>매매 로그</div>
      <div style={{ background:"#0d0f14", borderRadius:6, padding:8, maxHeight:200, overflow:"auto" }}>
        {logs.length === 0 && <div style={{ color:"#333", fontSize:10 }}>로그가 없습니다</div>}
        {logs.map((l, i) => (
          <div key={i} style={{ fontSize:10, color:"#888", padding:"2px 0", borderBottom:"1px solid #111" }}>
            <span style={{ color:"#555" }}>{l.time}</span> {l.msg}
          </div>
        ))}
      </div>

      {/* 로그 초기화 */}
      <button onClick={() => { setLogs([]); localStorage.setItem("bot1_logs", "[]"); }} style={{
        marginTop:6, background:"none", border:"1px solid #222", borderRadius:4,
        color:"#333", fontSize:10, padding:"3px 8px", cursor:"pointer",
      }}>로그 초기화</button>
    </div>
  );
}

// ── BOT3: RSI 터치 매수 → %익절 전략 ──
function Bot3Strategy({ config }) {
  const defaultParams = { rsiBuy: 30, targetPct: 1.0, stopLossPct: -3.0 };
  const [params, setParams] = useState(() => { try { return { ...defaultParams, ...JSON.parse(localStorage.getItem("bot3_params")) }; } catch { return defaultParams; } });
  const paramsRef = useRef(params);
  const updateParam = (key, val) => { const next = { ...paramsRef.current, [key]: val }; setParams(next); paramsRef.current = next; localStorage.setItem("bot3_params", JSON.stringify(next)); };
  const setAllParams = (obj) => { const next = { ...paramsRef.current, ...obj }; setParams(next); paramsRef.current = next; localStorage.setItem("bot3_params", JSON.stringify(next)); };
  const [running, setRunning] = useState(false);
  const [simMode, setSimMode] = useState(false);
  const [logs, setLogs] = useState(() => { try { return JSON.parse(localStorage.getItem("bot3_logs") || "[]"); } catch { return []; } });
  const [position, setPosition] = useState(() => { try { return JSON.parse(localStorage.getItem("bot3_position")); } catch { return null; } });
  const [liveData, setLiveData] = useState(null);
  const [btResults, setBtResults] = useState(null);
  const intervalRef = useRef(null);

  const RSI_PERIOD = 9;
  const calcRSI = (closes) => {
    if (closes.length < RSI_PERIOD + 1) return [];
    const rsi = [];
    let ag = 0, al = 0;
    for (let i = 1; i <= RSI_PERIOD; i++) { const d = closes[i] - closes[i-1]; if (d > 0) ag += d; else al -= d; }
    ag /= RSI_PERIOD; al /= RSI_PERIOD;
    rsi.push(al === 0 ? 100 : 100 - 100 / (1 + ag / al));
    for (let i = RSI_PERIOD + 1; i < closes.length; i++) { const d = closes[i] - closes[i-1]; ag = (ag*(RSI_PERIOD-1)+(d>0?d:0))/RSI_PERIOD; al = (al*(RSI_PERIOD-1)+(d<0?-d:0))/RSI_PERIOD; rsi.push(al===0?100:100-100/(1+ag/al)); }
    return rsi;
  };

  const addLog = (msg) => {
    const entry = { time: new Date().toLocaleTimeString(), msg };
    setLogs(prev => { const next = [entry, ...prev].slice(0, 50); localStorage.setItem("bot3_logs", JSON.stringify(next)); return next; });
  };

  const isMarketOpen = () => {
    const now = new Date();
    const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const mins = et.getHours() * 60 + et.getMinutes();
    return mins >= 570 && mins <= 960;
  };

  // 실시간 틱
  const tick = async () => {
    if (!config?.ticker) return;
    if (!isMarketOpen()) { setLiveData({ status: "장 마감" }); return; }
    try {
      const data = await kisAPI("/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice", {
        AUTH: "", EXCD: "NAS", SYMB: config.ticker, NMIN: "1", PINC: "1", NEXT: "", NREC: "30", FILL: "", KEYB: ""
      }, "HHDFS76950200");
      if (!data?.output2) return;
      const candles = data.output2.filter(c => parseFloat(c.clos) > 0).reverse();
      const closes = candles.map(c => parseFloat(c.clos));
      if (closes.length < RSI_PERIOD + 2) { setLiveData({ status: "데이터 부족" }); return; }
      const rsiArr = calcRSI(closes);
      const currentRsi = rsiArr[rsiArr.length - 1];
      const currentPrice = closes[closes.length - 1];
      const p = paramsRef.current;
      const pos = JSON.parse(localStorage.getItem("bot3_position"));
      const pnlPct = pos ? (currentPrice - pos.price) / pos.price * 100 : null;

      setLiveData({ rsi: currentRsi, price: currentPrice, status: "실행 중", pnlPct });

      // 조건 감지 로그
      if (currentRsi <= p.rsiBuy) addLog(`👀 RSI ${currentRsi.toFixed(1)} ≤ ${p.rsiBuy} 감지! $${currentPrice.toFixed(2)}`);
      if (pos && pnlPct >= p.targetPct) addLog(`👀 목표수익 ${pnlPct.toFixed(2)}% ≥ ${p.targetPct}% 도달!`);
      if (pos && pnlPct <= p.stopLossPct) addLog(`👀 손절라인 ${pnlPct.toFixed(2)}% ≤ ${p.stopLossPct}% 도달!`);

      // 매수: RSI가 rsiBuy 이하 터치
      if (!pos && currentRsi <= p.rsiBuy) {
        const qty = Math.floor(config.budget / currentPrice);
        if (qty > 0) {
          addLog(`🔵 매수! RSI ${currentRsi.toFixed(1)} ≤ ${p.rsiBuy} | $${currentPrice.toFixed(2)} × ${qty}주`);
          const ex = await detectExchange(config.ticker);
          const r = await kisOrder("buy", config.ticker, qty, currentPrice.toFixed(2), ex);
          if (r?.rt_cd === "0") {
            addLog(`✅ 매수 체결! ${config.ticker} ${qty}주`);
            const newPos = { ticker: config.ticker, price: currentPrice, qty, time: new Date().toISOString() };
            localStorage.setItem("bot3_position", JSON.stringify(newPos));
            setPosition(newPos);
          } else { addLog(`❌ 매수 실패: ${r?.msg1 || ""}`); }
        }
      }

      // 매도
      if (pos && pnlPct >= p.targetPct) {
        addLog(`🔴 매도! +${pnlPct.toFixed(2)}% | $${currentPrice.toFixed(2)}`);
        const ex = await detectExchange(pos.ticker);
        const r = await kisOrder("sell", pos.ticker, pos.qty, currentPrice.toFixed(2), ex);
        if (r?.rt_cd === "0") { addLog(`✅ 매도 체결!`); }
        else { addLog(`❌ 매도 실패: ${r?.msg1 || ""}`); }
        localStorage.removeItem("bot3_position"); setPosition(null);
      }
      // 손절
      if (pos && pnlPct <= p.stopLossPct) {
        addLog(`🔻 손절! ${pnlPct.toFixed(2)}% | $${currentPrice.toFixed(2)}`);
        const ex = await detectExchange(pos.ticker);
        const r = await kisOrder("sell", pos.ticker, pos.qty, currentPrice.toFixed(2), ex);
        if (r?.rt_cd === "0") { addLog(`✅ 손절 체결!`); }
        else { addLog(`❌ 손절 실패: ${r?.msg1 || ""}`); }
        localStorage.removeItem("bot3_position"); setPosition(null);
      }
    } catch(e) { addLog(`❌ ${e.message}`); }
  };

  const [optimizing, setOptimizing] = useState(false);

  // 브루트포스 최적화
  const runOptimize = async () => {
    const symList = config?.tickers?.length ? config.tickers : config?.ticker ? [config.ticker] : [];
    if (!symList.length) return;
    setOptimizing(true);
    addLog(`🔍 최적화 시작 — ${symList.length}개 종목`);
    try {
      // 전체 종목 데이터 합치기
      let allCloses = [];
      for (const sym of symList) {
        try {
          const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(sym)}?interval=1m&range=7d`);
          if (!res.ok) continue;
          const json = await res.json();
          const result = json?.chart?.result?.[0];
          if (!result) continue;
          const cls = result.indicators?.quote?.[0]?.close?.filter(v => v != null) || [];
          if (cls.length > 20) allCloses.push(...cls);
        } catch {}
      }
      if (allCloses.length < 20) { addLog("❌ 데이터 부족"); setOptimizing(false); return; }
      const rsiArr = calcRSI(allCloses);

      // 조합 탐색
      const rsiRange = [20, 25, 28, 30, 32, 35, 38, 40, 42, 45];
      const targetRange = [0.5, 0.7, 0.8, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0];
      const stopRange = [-1.0, -1.5, -2.0, -2.5, -3.0, -4.0, -5.0];

      let bestResult = { profit: -Infinity, params: null, trades: 0, winRate: 0 };
      let tested = 0;

      for (const rsiBuy of rsiRange) {
        for (const targetPct of targetRange) {
          for (const stopLossPct of stopRange) {
            let btPos = null;
            let totalProfit = 0;
            let wins = 0, total = 0;

            for (let i = 0; i < rsiArr.length; i++) {
              const rsi = rsiArr[i];
              const price = allCloses[i + RSI_PERIOD];

              if (!btPos && rsi <= rsiBuy) {
                const qty = Math.floor(config.budget / price);
                if (qty > 0) btPos = { price, qty };
              }

              if (btPos) {
                const pnl = (price - btPos.price) / btPos.price * 100;
                if (pnl >= targetPct || pnl <= stopLossPct) {
                  const fee = btPos.price * btPos.qty * 0.0025 + price * btPos.qty * 0.0025;
                  const profit = (price - btPos.price) * btPos.qty - fee;
                  totalProfit += profit;
                  total++;
                  if (profit > 0) wins++;
                  btPos = null;
                }
              }
            }
            tested++;
            const winRate = total > 0 ? Math.round(wins / total * 100) : 0;
            if (totalProfit > bestResult.profit && total >= 1) {
              bestResult = { profit: totalProfit, params: { rsiBuy, targetPct, stopLossPct }, trades: total, winRate };
            }
          }
        }
      }

      if (bestResult.params) {
        addLog(`✅ 최적화 완료 (${tested}개 조합 탐색)`);
        addLog(`🏆 최적: RSI≤${bestResult.params.rsiBuy} | +${bestResult.params.targetPct}% 매도 | ${bestResult.params.stopLossPct}% 손절`);
        addLog(`📊 ${bestResult.trades}회 매매 | 승률 ${bestResult.winRate}% | 총 $${bestResult.profit.toFixed(2)}`);
        // 파라미터 자동 적용
        setAllParams(bestResult.params);
      } else {
        addLog("⚠️ 매매 신호가 없는 구간입니다");
      }
    } catch(e) { addLog(`❌ ${e.message}`); }
    setOptimizing(false);
  };

  const toggleBot = () => {
    if (running) { clearInterval(intervalRef.current); intervalRef.current = null; setRunning(false); addLog("⏹ 정지"); }
    else { setRunning(true); addLog("▶ 시작"); tick(); intervalRef.current = setInterval(tick, 60000); }
  };

  // 백테스트
  const runBacktest = async () => {
    const symList = config?.tickers?.length ? config.tickers : config?.ticker ? [config.ticker] : [];
    if (!symList.length) return;
    setSimMode(true);
    addLog(`🧪 백테스트 — ${symList.length}개 종목 7일`);
    try {
      let allCandles = [];
      for (const sym of symList) {
        try {
          const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(sym)}?interval=1m&range=7d`);
          if (!res.ok) continue;
          const json = await res.json();
          const result = json?.chart?.result?.[0];
          if (!result) continue;
          const ts = result.timestamp || [];
          const closesRaw = result.indicators?.quote?.[0]?.close || [];
          const c = ts.map((t, i) => ({ time: t, close: closesRaw[i] })).filter(x => x.close != null);
          if (c.length > 20) allCandles.push(...c);
        } catch {}
      }
      allCandles.sort((a, b) => a.time - b.time);
      const candles = allCandles;
      if (candles.length < 20) { addLog("❌ 데이터 부족"); setSimMode(false); return; }
      addLog(`📊 ${candles.length}개 캔들`);

      const allCloses = candles.map(c => c.close);
      const rsiArr = calcRSI(allCloses);
      const p = paramsRef.current;
      let btPos = null;
      const trades = [];

      for (let i = 0; i < rsiArr.length; i++) {
        const rsi = rsiArr[i];
        const price = allCloses[i + RSI_PERIOD];
        const time = new Date(candles[i + RSI_PERIOD].time * 1000).toLocaleString("ko-KR", { month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" });

        // 매수: RSI 터치
        if (!btPos && rsi <= p.rsiBuy) {
          const qty = Math.floor(config.budget / price);
          if (qty > 0) {
            btPos = { price, qty, time };
            addLog(`🔵 [${time}] 매수 RSI ${rsi.toFixed(1)} | $${price.toFixed(2)} × ${qty}주`);
          }
        }

        // 매도/손절
        if (btPos) {
          const pnl = (price - btPos.price) / btPos.price * 100;
          if (pnl >= p.targetPct) {
            const fee = btPos.price * btPos.qty * 0.0025 + price * btPos.qty * 0.0025;
            const profit = (price - btPos.price) * btPos.qty - fee;
            const netPnl = profit / (btPos.price * btPos.qty) * 100;
            addLog(`🔴 [${time}] 매도 +${pnl.toFixed(2)}% (수수료후 ${netPnl >= 0 ? "+" : ""}${netPnl.toFixed(2)}%) | $${price.toFixed(2)} | $${profit.toFixed(2)}`);
            trades.push({ buy: btPos.price, sell: price, qty: btPos.qty, pnl: netPnl, profit, buyTime: btPos.time, sellTime: time });
            btPos = null;
          } else if (pnl <= p.stopLossPct) {
            const fee = btPos.price * btPos.qty * 0.0025 + price * btPos.qty * 0.0025;
            const profit = (price - btPos.price) * btPos.qty - fee;
            const netPnl = profit / (btPos.price * btPos.qty) * 100;
            addLog(`🔻 [${time}] 손절 ${pnl.toFixed(2)}% (수수료후 ${netPnl.toFixed(2)}%) | $${price.toFixed(2)} | $${profit.toFixed(2)}`);
            trades.push({ buy: btPos.price, sell: price, qty: btPos.qty, pnl: netPnl, profit, buyTime: btPos.time, sellTime: time });
            btPos = null;
          }
        }
      }

      if (btPos) {
        const lastPrice = allCloses[allCloses.length - 1];
        const pnl = (lastPrice - btPos.price) / btPos.price * 100;
        addLog(`📌 미청산: $${btPos.price.toFixed(2)} → $${lastPrice.toFixed(2)} (${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}%)`);
      }

      const totalProfit = trades.reduce((s, t) => s + t.profit, 0);
      const winCount = trades.filter(t => t.pnl > 0).length;
      addLog(`📈 완료: ${trades.length}회 | 승률 ${trades.length ? Math.round(winCount / trades.length * 100) : 0}% | $${totalProfit.toFixed(2)}`);

      setBtResults({
        trades, totalProfit, tradeCount: trades.length,
        winRate: trades.length ? Math.round(winCount / trades.length * 100) : 0,
        openPosition: btPos ? { ...btPos, currentPrice: allCloses[allCloses.length - 1], pnl: (allCloses[allCloses.length - 1] - btPos.price) / btPos.price * 100 } : null,
      });

      setLiveData({ rsi: rsiArr[rsiArr.length - 1], price: allCloses[allCloses.length - 1], status: "백테스트 완료" });
    } catch(e) { addLog(`❌ ${e.message}`); }
    setSimMode(false);
  };

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, []);

  const pos = position;
  const pnlPct = pos && liveData?.price ? ((liveData.price - pos.price) / pos.price * 100) : null;

  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:12 }}>BOT3 전략: RSI 터치 매수 → %익절</div>

      {/* 파라미터 */}
      <div style={{ background:"#11141c", borderRadius:8, padding:10, marginBottom:12, fontSize:11, color:"#888", display:"flex", flexWrap:"wrap", alignItems:"center", gap:4 }}>
        <span>매수: RSI(9) ≤</span>
        <input type="number" value={params.rsiBuy} onChange={e => updateParam("rsiBuy", parseFloat(e.target.value)||0)} style={{ width:36, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#4caf50", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>터치 시 즉시 매수 | 매도: +</span>
        <input type="number" value={params.targetPct} step={0.1} onChange={e => updateParam("targetPct", parseFloat(e.target.value)||0)} style={{ width:40, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#f44336", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>% 이상 | 손절:</span>
        <input type="number" value={params.stopLossPct} step={0.5} onChange={e => updateParam("stopLossPct", parseFloat(e.target.value)||0)} style={{ width:40, background:"#0d0f14", border:"1px solid #f44336", borderRadius:3, color:"#f44336", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>%</span>
      </div>

      {/* 버튼 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <button onClick={toggleBot} style={{ flex:1, background: running ? "#f44336" : "#4caf50", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: simMode || optimizing ? 0.4 : 1 }} disabled={simMode || optimizing}>{running ? "⏹ 정지" : "▶ 실전"}</button>
        <button onClick={runBacktest} style={{ flex:1, background: simMode ? "#555" : "#ff9800", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: running || optimizing ? 0.4 : 1 }} disabled={running || simMode || optimizing}>{simMode ? "백테스트 중..." : "🧪 백테스트"}</button>
        <button onClick={runOptimize} style={{ flex:1, background: optimizing ? "#555" : "#9c27b0", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: running || simMode ? 0.4 : 1 }} disabled={running || simMode || optimizing}>{optimizing ? "최적화 중..." : "🔍 최적화"}</button>
      </div>

      {/* 현재가 + RSI + 상태 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>현재가</div>
          <div style={{ color:"#fff", fontSize:22, fontWeight:700 }}>{liveData?.price ? `$${liveData.price.toFixed(2)}` : "-"}</div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>RSI(9)</div>
          <div style={{ color: liveData?.rsi != null ? (liveData.rsi <= params.rsiBuy ? "#4caf50" : liveData.rsi >= 70 ? "#f44336" : "#fff") : "#333", fontSize:22, fontWeight:700 }}>
            {liveData?.rsi != null ? liveData.rsi.toFixed(1) : "-"}
          </div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>상태</div>
          <div style={{ color: running ? "#4caf50" : "#555", fontSize:13, fontWeight:600 }}>{liveData?.status || (running ? "대기" : "정지")}</div>
        </div>
      </div>

      {/* 매수/매도 카드 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:14, border: liveData?.rsi != null && liveData.rsi <= params.rsiBuy ? "1px solid #4caf50" : "1px solid #1a1a1a" }}>
          <div style={{ color:"#4caf50", fontSize:12, fontWeight:700, marginBottom:8 }}>매수</div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background: liveData?.rsi != null && liveData.rsi <= params.rsiBuy ? "#4caf50" : "#333" }} />
            <span style={{ color: liveData?.rsi != null && liveData.rsi <= params.rsiBuy ? "#4caf50" : "#555", fontSize:11 }}>
              RSI ≤ {params.rsiBuy} {liveData?.rsi != null && liveData.rsi <= params.rsiBuy ? "✓ 매수!" : "대기"}
            </span>
          </div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:14, border: pnlPct != null && pnlPct >= params.targetPct ? "1px solid #f44336" : "1px solid #1a1a1a" }}>
          <div style={{ color:"#f44336", fontSize:12, fontWeight:700, marginBottom:8 }}>매도</div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background: pnlPct != null && pnlPct >= params.targetPct ? "#f44336" : "#333" }} />
            <span style={{ color: pnlPct != null && pnlPct >= params.targetPct ? "#f44336" : "#555", fontSize:11 }}>
              +{params.targetPct}% 이상 {pnlPct != null ? `(${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}%)` : "미보유"}
            </span>
          </div>
        </div>
      </div>

      {/* 포지션 */}
      {pos ? (
        <div style={{ background: pnlPct >= params.targetPct ? "#1a2e1a" : pnlPct < 0 ? "#2e1a1a" : "#11141c", borderRadius:10, padding:14, marginBottom:12, border: pnlPct >= params.targetPct ? "1px solid #4caf50" : pnlPct < 0 ? "1px solid #f44336" : "1px solid #1a1a1a" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div><span style={{ color:"#fff", fontSize:14, fontWeight:700 }}>{pos.ticker}</span><span style={{ color:"#555", fontSize:11, marginLeft:8 }}>{pos.qty}주</span></div>
            <div style={{ color: pnlPct >= 0 ? "#4caf50" : "#f44336", fontSize:24, fontWeight:700 }}>{pnlPct != null ? `${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}%` : "-"}</div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
            <div><span style={{ color:"#555" }}>매수가</span> <span style={{ color:"#fff", fontWeight:600 }}>${pos.price.toFixed(2)}</span></div>
            <div><span style={{ color:"#555" }}>현재가</span> <span style={{ color:"#fff", fontWeight:600 }}>{liveData?.price ? `$${liveData.price.toFixed(2)}` : "-"}</span></div>
            <div><span style={{ color:"#555" }}>수익(수수료제외)</span> <span style={{ color: pnlPct >= 0 ? "#4caf50" : "#f44336", fontWeight:600 }}>{pnlPct != null && liveData?.price ? `$${((liveData.price - pos.price) * pos.qty).toFixed(2)}` : "-"}</span></div>
          </div>
        </div>
      ) : (
        <div style={{ background:"#11141c", borderRadius:10, padding:14, marginBottom:12, textAlign:"center" }}>
          <div style={{ color:"#333", fontSize:12 }}>포지션 없음 — RSI {params.rsiBuy} 대기 중</div>
        </div>
      )}

      {/* 백테스트 팝업 */}
      {btResults && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }} onClick={() => setBtResults(null)}>
          <div style={{ background:"#0d0f14", borderRadius:12, padding:20, maxWidth:500, width:"90%", maxHeight:"80vh", overflow:"auto", border:"1px solid #1a1a1a" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#ff9800" }}>BOT3 백테스트 (7일)</div>
              <button onClick={() => setBtResults(null)} style={{ background:"none", border:"none", color:"#555", fontSize:18, cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>매매 횟수</div>
                <div style={{ color:"#fff", fontSize:22, fontWeight:700 }}>{btResults.tradeCount}회</div>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>승률</div>
                <div style={{ color: btResults.winRate >= 50 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>{btResults.winRate}%</div>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>총 수익</div>
                <div style={{ color: btResults.totalProfit >= 0 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>${btResults.totalProfit.toFixed(2)}</div>
              </div>
            </div>
            {btResults.trades.length > 0 ? btResults.trades.map((t, i) => (
              <div key={i} style={{ background:"#11141c", borderRadius:6, padding:8, marginBottom:4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{ color:"#888", fontSize:11 }}>#{i+1}</span>
                  <span style={{ color: t.pnl >= 0 ? "#4caf50" : "#f44336", fontSize:14, fontWeight:700 }}>{t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}%</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#888" }}>
                  <span>매수 <span style={{ color:"#4caf50" }}>${t.buy.toFixed(2)}</span> {t.buyTime}</span>
                  <span>매도 <span style={{ color:"#f44336" }}>${t.sell.toFixed(2)}</span> {t.sellTime}</span>
                  <span style={{ color:"#fff" }}>{t.profit >= 0 ? "+" : ""}${t.profit.toFixed(2)}</span>
                </div>
              </div>
            )) : <div style={{ color:"#555", fontSize:12, textAlign:"center", padding:20 }}>매매 신호 없음</div>}
            {btResults.openPosition && (
              <div style={{ background:"#1a2e1a", borderRadius:6, padding:10, marginTop:8, fontSize:11, color:"#4caf50" }}>
                📌 미청산: ${btResults.openPosition.price.toFixed(2)} → ${btResults.openPosition.currentPrice.toFixed(2)} ({btResults.openPosition.pnl >= 0 ? "+" : ""}{btResults.openPosition.pnl.toFixed(2)}%)
              </div>
            )}
            <button onClick={() => setBtResults(null)} style={{ marginTop:12, width:"100%", background:"#1a1a1a", border:"1px solid #333", borderRadius:6, padding:10, color:"#888", fontSize:12, cursor:"pointer" }}>닫기</button>
          </div>
        </div>
      )}

      {/* 로그 */}
      <div style={{ fontSize:11, color:"#555", marginBottom:4 }}>매매 로그</div>
      <div style={{ background:"#0d0f14", borderRadius:6, padding:8, maxHeight:200, overflow:"auto" }}>
        {logs.length === 0 && <div style={{ color:"#333", fontSize:10 }}>로그가 없습니다</div>}
        {logs.map((l, i) => (
          <div key={i} style={{ fontSize:10, color:"#888", padding:"2px 0", borderBottom:"1px solid #111" }}>
            <span style={{ color:"#555" }}>{l.time}</span> {l.msg}
          </div>
        ))}
      </div>
      <button onClick={() => { setLogs([]); localStorage.setItem("bot3_logs", "[]"); }} style={{ marginTop:6, background:"none", border:"1px solid #222", borderRadius:4, color:"#333", fontSize:10, padding:"3px 8px", cursor:"pointer" }}>로그 초기화</button>
    </div>
  );
}

// ── BOT4: 전체 워치리스트 모니터링 단타 ──
function Bot4Strategy({ config }) {
  const budget = config?.budget || 0;
  const tickers = config?.tickers || [];
  const defaultParams = { lookbackMin: 5, dropPct: 0.5, targetPct: 1.0, minTargetPct: 0.6, cooldownMin: 10, stopLossPct: -3.0 };
  const [params, setParams] = useState(() => { try { return { ...defaultParams, ...JSON.parse(localStorage.getItem("bot4_params")) }; } catch { return defaultParams; } });
  const paramsRef = useRef(params);
  const updateParam = (key, val) => { const next = { ...paramsRef.current, [key]: val }; setParams(next); paramsRef.current = next; localStorage.setItem("bot4_params", JSON.stringify(next)); };
  const setAllParams = (obj) => { const next = { ...paramsRef.current, ...obj }; setParams(next); paramsRef.current = next; localStorage.setItem("bot4_params", JSON.stringify(next)); };
  const [running, setRunning] = useState(false);
  const [simMode, setSimMode] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [logs, setLogs] = useState(() => { try { return JSON.parse(localStorage.getItem("bot4_logs") || "[]"); } catch { return []; } });
  const [position, setPosition] = useState(() => { try { return JSON.parse(localStorage.getItem("bot4_position")); } catch { return null; } });
  const [watchlist, setWatchlist] = useState([]);
  const [scanStatus, setScanStatus] = useState(null);
  const [btResults, setBtResults] = useState(null);
  const intervalRef = useRef(null);

  const addLog = (msg) => {
    const entry = { time: new Date().toLocaleTimeString(), msg };
    setLogs(prev => { const next = [entry, ...prev].slice(0, 80); localStorage.setItem("bot4_logs", JSON.stringify(next)); return next; });
  };

  const isMarketOpen = () => {
    const et = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
    const mins = et.getHours() * 60 + et.getMinutes();
    return mins >= 570 && mins <= 960;
  };

  // 실시간 틱 — 전체 워치리스트 스캔
  const tick = async () => {
    if (!isMarketOpen()) { setScanStatus("장 마감"); return; }
    const pos = JSON.parse(localStorage.getItem("bot4_position"));
    const p = paramsRef.current;

    // 보유 중이면 매도 체크만
    if (pos) {
      try {
        const data = await kisAPI("/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice", {
          AUTH:"", EXCD:"NAS", SYMB:pos.ticker, NMIN:"1", PINC:"1", NEXT:"", NREC:"10", FILL:"", KEYB:""
        }, "HHDFS76950200");
        const candles = data?.output2?.filter(c => parseFloat(c.clos) > 0) || [];
        if (candles.length) {
          const price = parseFloat(candles[0].clos);
          const pnl = (price - pos.price) / pos.price * 100;
          const elapsed = (Date.now() - new Date(pos.time).getTime()) / 60000;
          let target = p.targetPct;
          if (elapsed > 120) target = Math.max(p.targetPct * 0.5, p.minTargetPct);
          else if (elapsed > 60) target = Math.max(p.targetPct * 0.6, p.minTargetPct);
          else if (elapsed > 30) target = Math.max(p.targetPct * 0.8, p.minTargetPct);
          setScanStatus(`${pos.ticker} 보유 중 ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}%`);
          if (pnl >= target) {
            addLog(`🔴 매도 ${pos.ticker} +${pnl.toFixed(2)}%`);
            const ex = await detectExchange(pos.ticker);
            const r = await kisOrder("sell", pos.ticker, pos.qty, price.toFixed(2), ex);
            if (r?.rt_cd === "0") addLog(`✅ 매도 체결!`); else addLog(`❌ 매도 실패: ${r?.msg1 || ""}`);
            localStorage.removeItem("bot4_position"); setPosition(null);
          } else if (pnl <= p.stopLossPct) {
            addLog(`🔻 손절 ${pos.ticker} ${pnl.toFixed(2)}%`);
            const ex = await detectExchange(pos.ticker);
            const r = await kisOrder("sell", pos.ticker, pos.qty, price.toFixed(2), ex);
            if (r?.rt_cd === "0") addLog(`✅ 손절 체결!`); else addLog(`❌ 손절 실패: ${r?.msg1 || ""}`);
            localStorage.removeItem("bot4_position"); setPosition(null);
          }
        }
      } catch {}
      return;
    }

    // 미보유 — 전체 스캔
    setScanStatus(`${tickers.length}개 종목 스캔 중...`);
    for (const tk of tickers) {
      try {
        const data = await kisAPI("/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice", {
          AUTH:"", EXCD:"NAS", SYMB:tk, NMIN:"1", PINC:"1", NEXT:"", NREC:String(p.lookbackMin + 2), FILL:"", KEYB:""
        }, "HHDFS76950200");
        const candles = data?.output2?.filter(c => parseFloat(c.clos) > 0).reverse() || [];
        if (candles.length < p.lookbackMin + 1) continue;
        const price = parseFloat(candles[candles.length - 1].clos);
        const past = parseFloat(candles[candles.length - 1 - p.lookbackMin].clos);
        const drop = (price - past) / past * 100;
        if (drop <= -p.dropPct) {
          const qty = Math.floor(budget / price);
          if (qty > 0) {
            addLog(`🔵 매수 ${tk} | ${p.lookbackMin}분 ${drop.toFixed(2)}% | $${price.toFixed(2)} × ${qty}주`);
            const ex = await detectExchange(tk);
            const r = await kisOrder("buy", tk, qty, price.toFixed(2), ex);
            if (r?.rt_cd === "0") {
              addLog(`✅ 매수 체결! ${tk}`);
              const newPos = { ticker: tk, price, qty, time: new Date().toISOString() };
              localStorage.setItem("bot4_position", JSON.stringify(newPos));
              setPosition(newPos); setScanStatus(`${tk} 매수!`);
            } else { addLog(`❌ 매수 실패: ${r?.msg1 || ""}`); }
            return;
          }
        }
      } catch {}
    }
    setScanStatus("매수 신호 없음");
  };

  const toggleBot = () => {
    if (running) { clearInterval(intervalRef.current); intervalRef.current = null; setRunning(false); addLog("⏹ 정지"); }
    else { setRunning(true); addLog(`▶ 시작 (${tickers.length}개 모니터링)`); tick(); intervalRef.current = setInterval(tick, 60000); }
  };

  // 백테스트 — 전체 워치리스트
  const runBacktest = async () => {
    if (!tickers.length) return;
    setSimMode(true);
    addLog(`🧪 백테스트 — ${tickers.length}개 종목 7일`);
    try {
      // 전체 종목 데이터 로드
      const allData = {};
      for (const tk of tickers) {
        try {
          const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(tk)}?interval=1m&range=7d`);
          if (!res.ok) continue;
          const json = await res.json();
          const r = json?.chart?.result?.[0];
          if (!r) continue;
          const ts = r.timestamp || [];
          const cls = r.indicators?.quote?.[0]?.close || [];
          const candles = ts.map((t, i) => ({ time: t, close: cls[i] })).filter(c => c.close != null);
          if (candles.length > 20) allData[tk] = candles;
        } catch {}
      }
      addLog(`📊 ${Object.keys(allData).length}개 종목 로드`);

      const p = paramsRef.current;
      // 모든 종목의 캔들을 시간순으로 합치기
      const allEvents = [];
      for (const [ticker, candles] of Object.entries(allData)) {
        for (let i = p.lookbackMin; i < candles.length; i++) {
          const price = candles[i].close;
          const past = candles[i - p.lookbackMin].close;
          const drop = (price - past) / past * 100;
          allEvents.push({ ticker, time: candles[i].time, price, drop, idx: i });
        }
      }
      allEvents.sort((a, b) => a.time - b.time);

      let btPos = null, lastBuyTime = 0;
      const trades = [];

      for (const ev of allEvents) {
        const time = new Date(ev.time * 1000).toLocaleString("ko-KR", { month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" });

        // 매도 체크
        if (btPos && ev.ticker === btPos.ticker) {
          const pnl = (ev.price - btPos.price) / btPos.price * 100;
          const elapsed = (ev.time - btPos.time) / 60;
          let target = p.targetPct;
          if (elapsed > 120) target = Math.max(p.targetPct * 0.5, p.minTargetPct);
          else if (elapsed > 60) target = Math.max(p.targetPct * 0.6, p.minTargetPct);
          else if (elapsed > 30) target = Math.max(p.targetPct * 0.8, p.minTargetPct);
          if (pnl >= target || pnl <= p.stopLossPct) {
            const fee = btPos.price * btPos.qty * 0.0025 + ev.price * btPos.qty * 0.0025;
            const profit = (ev.price - btPos.price) * btPos.qty - fee;
            const netPnl = profit / (btPos.price * btPos.qty) * 100;
            const icon = pnl >= target ? "🔴" : "🔻";
            addLog(`${icon} [${time}] ${ev.ticker} ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}% (수수료후 ${netPnl >= 0 ? "+" : ""}${netPnl.toFixed(2)}%) | $${profit.toFixed(2)}`);
            trades.push({ ticker: ev.ticker, buy: btPos.price, sell: ev.price, qty: btPos.qty, pnl: netPnl, profit, buyTime: btPos.timeStr, sellTime: time });
            btPos = null;
          }
        }

        // 매수 체크
        if (!btPos && ev.drop <= -p.dropPct && (ev.time - lastBuyTime) >= p.cooldownMin * 60) {
          const qty = Math.floor(budget / ev.price);
          if (qty > 0) {
            btPos = { ticker: ev.ticker, price: ev.price, qty, time: ev.time, timeStr: time };
            lastBuyTime = ev.time;
            addLog(`🔵 [${time}] ${ev.ticker} ${ev.drop.toFixed(2)}% | $${ev.price.toFixed(2)} × ${qty}주`);
          }
        }
      }

      if (btPos) addLog(`📌 미청산: ${btPos.ticker} $${btPos.price.toFixed(2)}`);

      const totalProfit = trades.reduce((s, t) => s + t.profit, 0);
      const winCount = trades.filter(t => t.pnl > 0).length;
      addLog(`📈 완료: ${trades.length}회 | 승률 ${trades.length ? Math.round(winCount / trades.length * 100) : 0}% | $${totalProfit.toFixed(2)}`);

      setBtResults({
        trades, totalProfit, tradeCount: trades.length,
        winRate: trades.length ? Math.round(winCount / trades.length * 100) : 0,
        openPosition: btPos ? { ticker: btPos.ticker, price: btPos.price } : null,
      });
    } catch(e) { addLog(`❌ ${e.message}`); }
    setSimMode(false);
  };

  // 최적화
  const runOptimize = async () => {
    if (!tickers.length) return;
    setOptimizing(true);
    addLog(`🔍 BOT4 최적화 — ${tickers.length}개 종목`);
    try {
      const allData = {};
      for (const tk of tickers.slice(0, 10)) { // 상위 10개만 (속도)
        try {
          const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(tk)}?interval=1m&range=7d`);
          if (!res.ok) continue;
          const json = await res.json();
          const r = json?.chart?.result?.[0];
          if (!r) continue;
          const ts = r.timestamp || [];
          const cls = r.indicators?.quote?.[0]?.close || [];
          const candles = ts.map((t, i) => ({ time: t, close: cls[i] })).filter(c => c.close != null);
          if (candles.length > 20) allData[tk] = candles;
        } catch {}
      }

      const lookbacks = [3, 5, 7, 10];
      const drops = [0.3, 0.5, 0.7, 1.0];
      const targets = [0.5, 0.8, 1.0, 1.5];
      const stops = [-1.5, -2.0, -3.0, -5.0];

      let best = { profit: -Infinity, p: null, trades: 0, winRate: 0 };
      let tested = 0;

      for (const lb of lookbacks) for (const dr of drops) for (const tp of targets) for (const sl of stops) {
        // 전체 이벤트 빌드
        const events = [];
        for (const [ticker, candles] of Object.entries(allData)) {
          for (let i = lb; i < candles.length; i++) {
            const price = candles[i].close;
            const past = candles[i - lb].close;
            events.push({ ticker, time: candles[i].time, price, drop: (price - past) / past * 100 });
          }
        }
        events.sort((a, b) => a.time - b.time);

        let pos = null, totalProfit = 0, wins = 0, total = 0, lastBuy = 0;
        for (const ev of events) {
          if (pos && ev.ticker === pos.ticker) {
            const pnl = (ev.price - pos.price) / pos.price * 100;
            if (pnl >= tp || pnl <= sl) {
              const fee = pos.price * pos.qty * 0.0025 + ev.price * pos.qty * 0.0025;
              const profit = (ev.price - pos.price) * pos.qty - fee;
              totalProfit += profit; total++; if (profit > 0) wins++;
              pos = null;
            }
          }
          if (!pos && ev.drop <= -dr && (ev.time - lastBuy) >= 600) {
            const qty = Math.floor(budget / ev.price);
            if (qty > 0) { pos = { ticker: ev.ticker, price: ev.price, qty }; lastBuy = ev.time; }
          }
        }
        tested++;
        if (totalProfit > best.profit && total >= 1) {
          best = { profit: totalProfit, p: { lookbackMin: lb, dropPct: dr, targetPct: tp, minTargetPct: 0.6, cooldownMin: 10, stopLossPct: sl }, trades: total, winRate: total ? Math.round(wins / total * 100) : 0 };
        }
      }

      if (best.p) {
        addLog(`✅ 완료 (${tested}개 조합)`);
        addLog(`🏆 ${best.p.lookbackMin}분 -${best.p.dropPct}% | +${best.p.targetPct}% | 손절${best.p.stopLossPct}%`);
        addLog(`📊 ${best.trades}회 | 승률 ${best.winRate}% | $${best.profit.toFixed(2)}`);
        setAllParams(best.p);
      } else { addLog("⚠️ 매매 신호가 없는 구간입니다"); }
    } catch(e) { addLog(`❌ ${e.message}`); }
    setOptimizing(false);
  };

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, []);

  const pos = position;

  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:4 }}>BOT4 전략: 전체 워치리스트 스캔</div>
      <div style={{ color:"#555", fontSize:11, marginBottom:12 }}>{tickers.length}개 종목 모니터링 → 조건 맞는 1종목 매수 → 매도 후 다시 스캔</div>

      {/* 파라미터 */}
      <div style={{ background:"#11141c", borderRadius:8, padding:10, marginBottom:12, fontSize:11, color:"#888", display:"flex", flexWrap:"wrap", alignItems:"center", gap:4 }}>
        <span>매수:</span>
        <input type="number" value={params.lookbackMin} onChange={e => updateParam("lookbackMin", parseInt(e.target.value)||1)} style={{ width:30, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#4caf50", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>분 -</span>
        <input type="number" value={params.dropPct} step={0.1} onChange={e => updateParam("dropPct", parseFloat(e.target.value)||0)} style={{ width:36, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#4caf50", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>% | 매도: +</span>
        <input type="number" value={params.targetPct} step={0.1} onChange={e => updateParam("targetPct", parseFloat(e.target.value)||0)} style={{ width:36, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#f44336", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>% | 손절:</span>
        <input type="number" value={params.stopLossPct} step={0.5} onChange={e => updateParam("stopLossPct", parseFloat(e.target.value)||0)} style={{ width:40, background:"#0d0f14", border:"1px solid #f44336", borderRadius:3, color:"#f44336", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>% | 쿨다운</span>
        <input type="number" value={params.cooldownMin} onChange={e => updateParam("cooldownMin", parseInt(e.target.value)||1)} style={{ width:30, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#fff", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>분</span>
      </div>

      {/* 버튼 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <button onClick={toggleBot} style={{ flex:1, background: running ? "#f44336" : "#4caf50", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: simMode || optimizing ? 0.4 : 1 }} disabled={simMode || optimizing}>{running ? "⏹ 정지" : "▶ 실전"}</button>
        <button onClick={runBacktest} style={{ flex:1, background: simMode ? "#555" : "#ff9800", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: running || optimizing ? 0.4 : 1 }} disabled={running || simMode || optimizing}>{simMode ? "백테스트 중..." : "🧪 백테스트"}</button>
        <button onClick={runOptimize} style={{ flex:1, background: optimizing ? "#555" : "#9c27b0", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: running || simMode ? 0.4 : 1 }} disabled={running || simMode || optimizing}>{optimizing ? "최적화 중..." : "🔍 최적화"}</button>
      </div>

      {/* 스캔 상태 */}
      <div style={{ background:"#11141c", borderRadius:8, padding:12, marginBottom:12, textAlign:"center" }}>
        <div style={{ color:"#555", fontSize:10 }}>스캔 상태</div>
        <div style={{ color: running ? "#4caf50" : "#555", fontSize:13, fontWeight:600 }}>{scanStatus || (running ? "대기" : "정지")}</div>
      </div>

      {/* 포지션 */}
      {pos ? (
        <div style={{ background:"#11141c", borderRadius:10, padding:14, marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><span style={{ color:"#fff", fontSize:14, fontWeight:700 }}>{pos.ticker}</span><span style={{ color:"#555", fontSize:11, marginLeft:8 }}>{pos.qty}주</span></div>
            <span style={{ color:"#888", fontSize:11 }}>매수가 ${pos.price.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <div style={{ background:"#11141c", borderRadius:10, padding:14, marginBottom:12, textAlign:"center" }}>
          <div style={{ color:"#333", fontSize:12 }}>포지션 없음 — {tickers.length}개 종목 스캔 대기</div>
        </div>
      )}

      {/* 백테스트 팝업 */}
      {btResults && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }} onClick={() => setBtResults(null)}>
          <div style={{ background:"#0d0f14", borderRadius:12, padding:20, maxWidth:520, width:"90%", maxHeight:"80vh", overflow:"auto", border:"1px solid #1a1a1a" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#ff9800" }}>BOT4 백테스트 (7일, {tickers.length}종목)</div>
              <button onClick={() => setBtResults(null)} style={{ background:"none", border:"none", color:"#555", fontSize:18, cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>매매 횟수</div>
                <div style={{ color:"#fff", fontSize:22, fontWeight:700 }}>{btResults.tradeCount}회</div>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>승률</div>
                <div style={{ color: btResults.winRate >= 50 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>{btResults.winRate}%</div>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>총 수익</div>
                <div style={{ color: btResults.totalProfit >= 0 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>${btResults.totalProfit.toFixed(2)}</div>
              </div>
            </div>
            {btResults.trades.length > 0 ? btResults.trades.map((t, i) => (
              <div key={i} style={{ background:"#11141c", borderRadius:6, padding:8, marginBottom:4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{ color:"#f5c518", fontSize:11, fontWeight:700 }}>{t.ticker}</span>
                  <span style={{ color: t.pnl >= 0 ? "#4caf50" : "#f44336", fontSize:14, fontWeight:700 }}>{t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}%</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#888" }}>
                  <span>매수 <span style={{ color:"#4caf50" }}>${t.buy.toFixed(2)}</span> {t.buyTime}</span>
                  <span>매도 <span style={{ color:"#f44336" }}>${t.sell.toFixed(2)}</span> {t.sellTime}</span>
                  <span style={{ color: t.profit >= 0 ? "#4caf50" : "#f44336" }}>{t.profit >= 0 ? "+" : ""}${t.profit.toFixed(2)}</span>
                </div>
              </div>
            )) : <div style={{ color:"#555", fontSize:12, textAlign:"center", padding:20 }}>매매 신호 없음</div>}
            {btResults.openPosition && (
              <div style={{ background:"#1a2e1a", borderRadius:6, padding:10, marginTop:8, fontSize:11, color:"#4caf50" }}>
                📌 미청산: {btResults.openPosition.ticker} ${btResults.openPosition.price.toFixed(2)}
              </div>
            )}
            <button onClick={() => setBtResults(null)} style={{ marginTop:12, width:"100%", background:"#1a1a1a", border:"1px solid #333", borderRadius:6, padding:10, color:"#888", fontSize:12, cursor:"pointer" }}>닫기</button>
          </div>
        </div>
      )}

      {/* 로그 */}
      <div style={{ fontSize:11, color:"#555", marginBottom:4 }}>매매 로그</div>
      <div style={{ background:"#0d0f14", borderRadius:6, padding:8, maxHeight:200, overflow:"auto" }}>
        {logs.length === 0 && <div style={{ color:"#333", fontSize:10 }}>로그가 없습니다</div>}
        {logs.map((l, i) => (
          <div key={i} style={{ fontSize:10, color:"#888", padding:"2px 0", borderBottom:"1px solid #111" }}>
            <span style={{ color:"#555" }}>{l.time}</span> {l.msg}
          </div>
        ))}
      </div>
      <button onClick={() => { setLogs([]); localStorage.setItem("bot4_logs", "[]"); }} style={{ marginTop:6, background:"none", border:"1px solid #222", borderRadius:4, color:"#333", fontSize:10, padding:"3px 8px", cursor:"pointer" }}>로그 초기화</button>
    </div>
  );
}

// ── BOT2: 가격 변동률 단타 전략 ──
function Bot2Strategy({ config }) {
  const defaultParams = { lookbackMin: 5, dropPct: 0.5, targetPct: 1.0, minTargetPct: 0.6, cooldownMin: 10, stopLossPct: -3.0 };
  const [params, setParams] = useState(() => { try { return { ...defaultParams, ...JSON.parse(localStorage.getItem("bot2_params")) }; } catch { return defaultParams; } });
  const paramsRef = useRef(params);
  const updateParam = (key, val) => { const next = { ...paramsRef.current, [key]: val }; setParams(next); paramsRef.current = next; localStorage.setItem("bot2_params", JSON.stringify(next)); };
  const setAllParams = (obj) => { const next = { ...paramsRef.current, ...obj }; setParams(next); paramsRef.current = next; localStorage.setItem("bot2_params", JSON.stringify(next)); };
  const [running, setRunning] = useState(false);
  const [simMode, setSimMode] = useState(false);
  const [logs, setLogs] = useState(() => { try { return JSON.parse(localStorage.getItem("bot2_logs") || "[]"); } catch { return []; } });
  const [position, setPosition] = useState(() => { try { return JSON.parse(localStorage.getItem("bot2_position")); } catch { return null; } });
  const [liveData, setLiveData] = useState(null);
  const [btResults, setBtResults] = useState(null);
  const intervalRef = useRef(null);

  const addLog = (msg) => {
    const entry = { time: new Date().toLocaleTimeString(), msg };
    setLogs(prev => { const next = [entry, ...prev].slice(0, 50); localStorage.setItem("bot2_logs", JSON.stringify(next)); return next; });
  };

  const isMarketOpen = () => {
    const now = new Date();
    const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const mins = et.getHours() * 60 + et.getMinutes();
    return mins >= 570 && mins <= 960; // 9:30~16:00 ET 정규장
  };

  // 실시간 틱
  const tick = async () => {
    if (!config?.ticker) return;
    if (!isMarketOpen()) { setLiveData({ status: "장외" }); return; }
    try {
      const data = await kisAPI("/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice", {
        AUTH: "", EXCD: "NAS", SYMB: config.ticker, NMIN: "1", PINC: "1", NEXT: "", NREC: "30", FILL: "", KEYB: ""
      }, "HHDFS76950200");
      if (!data?.output2) return;
      const candles = data.output2.filter(c => parseFloat(c.clos) > 0).reverse().map(c => ({ close: parseFloat(c.clos) }));
      if (candles.length < paramsRef.current.lookbackMin + 1) { setLiveData({ status: "데이터 부족" }); return; }
      const p = paramsRef.current;
      const currentPrice = candles[candles.length - 1].close;
      const pastPrice = candles[candles.length - 1 - p.lookbackMin].close;
      const dropRate = (currentPrice - pastPrice) / pastPrice * 100;
      const pos = JSON.parse(localStorage.getItem("bot2_position"));
      const pnlPct = pos ? (currentPrice - pos.price) / pos.price * 100 : null;

      setLiveData({ price: currentPrice, dropRate, status: "실행 중", pnlPct });

      // 조건 감지 로그
      if (dropRate <= -p.dropPct) addLog(`👀 ${p.lookbackMin}분 ${dropRate.toFixed(2)}% 하락 감지! $${currentPrice.toFixed(2)}`);
      if (pos && pnlPct >= p.targetPct) addLog(`👀 목표수익 ${pnlPct.toFixed(2)}% 도달!`);
      if (pos && pnlPct <= p.stopLossPct) addLog(`👀 손절라인 ${pnlPct.toFixed(2)}% 도달!`);

      // 매수
      if (!pos && dropRate <= -p.dropPct) {
        const qty = Math.floor(config.budget / currentPrice);
        if (qty > 0) {
          addLog(`🔵 매수! ${p.lookbackMin}분 ${dropRate.toFixed(2)}% | $${currentPrice.toFixed(2)} × ${qty}주`);
          const ex = await detectExchange(config.ticker);
          const r = await kisOrder("buy", config.ticker, qty, currentPrice.toFixed(2), ex);
          if (r?.rt_cd === "0") {
            addLog(`✅ 매수 체결!`);
            const newPos = { ticker: config.ticker, price: currentPrice, qty, time: new Date().toISOString() };
            localStorage.setItem("bot2_position", JSON.stringify(newPos));
            setPosition(newPos);
          } else { addLog(`❌ 매수 실패: ${r?.msg1 || ""}`); }
        }
      }

      // 매도 (시간 체감)
      if (pos) {
        const elapsed = (Date.now() - new Date(pos.time).getTime()) / 60000;
        let target = p.targetPct;
        if (elapsed > 120) target = Math.max(p.targetPct * 0.5, p.minTargetPct);
        else if (elapsed > 60) target = Math.max(p.targetPct * 0.6, p.minTargetPct);
        else if (elapsed > 30) target = Math.max(p.targetPct * 0.8, p.minTargetPct);
        if (pnlPct >= target) {
          addLog(`🔴 매도! +${pnlPct.toFixed(2)}% | $${currentPrice.toFixed(2)}`);
          const ex = await detectExchange(pos.ticker);
          const r = await kisOrder("sell", pos.ticker, pos.qty, currentPrice.toFixed(2), ex);
          if (r?.rt_cd === "0") { addLog(`✅ 매도 체결!`); }
          else { addLog(`❌ 매도 실패: ${r?.msg1 || ""}`); }
          localStorage.removeItem("bot2_position"); setPosition(null);
        } else if (pnlPct <= p.stopLossPct) {
          addLog(`🔻 손절! ${pnlPct.toFixed(2)}% | $${currentPrice.toFixed(2)}`);
          const ex = await detectExchange(pos.ticker);
          const r = await kisOrder("sell", pos.ticker, pos.qty, currentPrice.toFixed(2), ex);
          if (r?.rt_cd === "0") { addLog(`✅ 손절 체결!`); }
          else { addLog(`❌ 손절 실패: ${r?.msg1 || ""}`); }
          localStorage.removeItem("bot2_position"); setPosition(null);
        }
      }
    } catch(e) { addLog(`❌ ${e.message}`); }
  };

  // 최적화
  const [optimizing, setOptimizing] = useState(false);
  const runOptimize = async () => {
    if (!config?.ticker) return;
    setOptimizing(true);
    addLog("🔍 BOT2 최적화 시작...");
    try {
      const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(config.ticker)}?interval=1m&range=7d`);
      if (!res.ok) { addLog("❌ 데이터 실패"); setOptimizing(false); return; }
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) { addLog("❌ 없음"); setOptimizing(false); return; }
      const ts = result.timestamp || [];
      const closesRaw = result.indicators?.quote?.[0]?.close || [];
      const candles = ts.map((t, i) => ({ time: t, close: closesRaw[i] })).filter(c => c.close != null);
      if (candles.length < 20) { addLog("❌ 부족"); setOptimizing(false); return; }
      const allCloses = candles.map(c => c.close);

      const lookbacks = [3, 5, 7, 10];
      const drops = [0.2, 0.3, 0.5, 0.7, 1.0];
      const targets = [0.5, 0.7, 1.0, 1.5, 2.0];
      const stops = [-1.0, -1.5, -2.0, -3.0, -5.0];
      const cooldowns = [5, 10];

      let best = { profit: -Infinity, p: null, trades: 0, winRate: 0 };
      let tested = 0;

      for (const lb of lookbacks) for (const dr of drops) for (const tp of targets) for (const sl of stops) for (const cd of cooldowns) {
        let pos = null, totalProfit = 0, wins = 0, total = 0, lastBuy = -999;
        for (let i = lb; i < allCloses.length; i++) {
          const price = allCloses[i];
          const past = allCloses[i - lb];
          const drop = (price - past) / past * 100;
          if (!pos && drop <= -dr && (i - lastBuy) >= cd) {
            const qty = Math.floor(config.budget / price);
            if (qty > 0) { pos = { price, qty, idx: i }; lastBuy = i; }
          }
          if (pos) {
            const pnl = (price - pos.price) / pos.price * 100;
            const elapsed = i - pos.idx;
            let target = tp;
            if (elapsed > 120) target = Math.max(tp * 0.5, 0.6);
            else if (elapsed > 60) target = Math.max(tp * 0.6, 0.6);
            else if (elapsed > 30) target = Math.max(tp * 0.8, 0.6);
            if (pnl >= target || pnl <= sl) {
              const fee = pos.price*pos.qty*0.0025 + price*pos.qty*0.0025;
              const profit = (price-pos.price)*pos.qty - fee;
              totalProfit += profit; total++;
              if (profit > 0) wins++;
              pos = null;
            }
          }
        }
        tested++;
        if (totalProfit > best.profit && total >= 1) {
          best = { profit: totalProfit, p: { lookbackMin:lb, dropPct:dr, targetPct:tp, minTargetPct:0.6, cooldownMin:cd, stopLossPct:sl }, trades: total, winRate: total ? Math.round(wins/total*100) : 0 };
        }
      }

      if (best.p) {
        addLog(`✅ 완료 (${tested}개 조합)`);
        addLog(`🏆 ${best.p.lookbackMin}분 -${best.p.dropPct}% | +${best.p.targetPct}% | 손절${best.p.stopLossPct}% | 쿨다운${best.p.cooldownMin}분`);
        addLog(`📊 ${best.trades}회 | 승률 ${best.winRate}% | $${best.profit.toFixed(2)}`);
        setAllParams(best.p);
      } else { addLog("⚠️ 매매 신호가 없는 구간입니다"); }
    } catch(e) { addLog(`❌ ${e.message}`); }
    setOptimizing(false);
  };

  const toggleBot = () => {
    if (running) {
      clearInterval(intervalRef.current); intervalRef.current = null;
      setRunning(false); addLog("⏹ 봇 정지");
    } else {
      setRunning(true); addLog("▶ 봇 시작");
      tick(); intervalRef.current = setInterval(tick, 60000);
    }
  };

  // 백테스트
  const runBacktest = async () => {
    if (!config?.ticker) return;
    setSimMode(true);
    addLog("🧪 백테스트 시작 — 1분봉 7일");
    try {
      const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(config.ticker)}?interval=1m&range=7d`);
      if (!res.ok) { addLog("❌ 데이터 실패"); setSimMode(false); return; }
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) { addLog("❌ 데이터 없음"); setSimMode(false); return; }
      const ts = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];
      const candles = ts.map((t, i) => ({ time: t, close: closes[i] })).filter(c => c.close != null);
      if (candles.length < 20) { addLog("❌ 데이터 부족"); setSimMode(false); return; }
      addLog(`📊 ${candles.length}개 캔들 로드`);

      const p = paramsRef.current;
      let btPos = null;
      const trades = [];
      let lastBuyIdx = -999;

      for (let i = p.lookbackMin; i < candles.length; i++) {
        const price = candles[i].close;
        const pastPrice = candles[i - p.lookbackMin].close;
        const drop = (price - pastPrice) / pastPrice * 100;
        const time = new Date(candles[i].time * 1000).toLocaleString("ko-KR", { month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" });

        // 매수
        if (!btPos && drop <= -p.dropPct && (i - lastBuyIdx) >= p.cooldownMin) {
          const qty = Math.floor(config.budget / price);
          if (qty > 0) {
            btPos = { price, qty, time, idx: i };
            lastBuyIdx = i;
            addLog(`🔵 [${time}] 매수 ${drop.toFixed(2)}% 하락 | $${price.toFixed(2)} × ${qty}주`);
          }
        }

        // 매도 (시간 체감)
        if (btPos) {
          const elapsed = i - btPos.idx; // 분
          let target = p.targetPct;
          if (elapsed > 120) target = Math.max(p.targetPct * 0.5, p.minTargetPct);
          else if (elapsed > 60) target = Math.max(p.targetPct * 0.6, p.minTargetPct);
          else if (elapsed > 30) target = Math.max(p.targetPct * 0.8, p.minTargetPct);
          const pnl = (price - btPos.price) / btPos.price * 100;
          if (pnl >= target) {
            const fee = btPos.price * btPos.qty * 0.0025 + price * btPos.qty * 0.0025;
            const profit = (price - btPos.price) * btPos.qty - fee;
            const netPnl = profit / (btPos.price * btPos.qty) * 100;
            addLog(`🔴 [${time}] 매도 +${pnl.toFixed(2)}% (수수료후 ${netPnl >= 0 ? "+" : ""}${netPnl.toFixed(2)}%) | $${price.toFixed(2)} | $${profit.toFixed(2)}`);
            trades.push({ buy: btPos.price, sell: price, qty: btPos.qty, pnl: netPnl, profit, buyTime: btPos.time, sellTime: time });
            btPos = null;
          } else if (pnl <= p.stopLossPct) {
            const fee = btPos.price * btPos.qty * 0.0025 + price * btPos.qty * 0.0025;
            const profit = (price - btPos.price) * btPos.qty - fee;
            const netPnl = profit / (btPos.price * btPos.qty) * 100;
            addLog(`🔻 [${time}] 손절 ${pnl.toFixed(2)}% (수수료후 ${netPnl.toFixed(2)}%) | $${price.toFixed(2)} | $${profit.toFixed(2)}`);
            trades.push({ buy: btPos.price, sell: price, qty: btPos.qty, pnl: netPnl, profit, buyTime: btPos.time, sellTime: time });
            btPos = null;
          }
        }
      }

      if (btPos) {
        const lastPrice = candles[candles.length - 1].close;
        const pnl = (lastPrice - btPos.price) / btPos.price * 100;
        addLog(`📌 미청산: $${btPos.price.toFixed(2)} → $${lastPrice.toFixed(2)} (${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}%)`);
      }

      const totalProfit = trades.reduce((s, t) => s + t.profit, 0);
      const winCount = trades.filter(t => t.pnl > 0).length;
      addLog(`📈 완료: ${trades.length}회 매매 | 승률 ${trades.length ? Math.round(winCount / trades.length * 100) : 0}% | $${totalProfit.toFixed(2)}`);

      setBtResults({
        trades, totalProfit, tradeCount: trades.length,
        winRate: trades.length ? Math.round(winCount / trades.length * 100) : 0,
        openPosition: btPos ? { ...btPos, currentPrice: candles[candles.length - 1].close, pnl: (candles[candles.length - 1].close - btPos.price) / btPos.price * 100 } : null,
      });
    } catch(e) { addLog(`❌ ${e.message}`); }
    setSimMode(false);
  };

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, []);

  const pos = position;
  const pnlPct = pos && liveData?.price ? ((liveData.price - pos.price) / pos.price * 100) : null;

  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:12 }}>BOT2 전략: 가격 변동률 단타</div>

      {/* 파라미터 */}
      <div style={{ background:"#11141c", borderRadius:8, padding:10, marginBottom:12, fontSize:11, color:"#888", display:"flex", flexWrap:"wrap", alignItems:"center", gap:4 }}>
        <span>매수:</span>
        <input type="number" value={params.lookbackMin} onChange={e => updateParam("lookbackMin", parseInt(e.target.value)||1)} style={{ width:30, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#4caf50", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>분간 -</span>
        <input type="number" value={params.dropPct} step={0.1} onChange={e => updateParam("dropPct", parseFloat(e.target.value)||0)} style={{ width:36, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#4caf50", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>% 하락 | 매도: +</span>
        <input type="number" value={params.targetPct} step={0.1} onChange={e => updateParam("targetPct", parseFloat(e.target.value)||0)} style={{ width:36, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#f44336", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>% (최소</span>
        <input type="number" value={params.minTargetPct} step={0.1} onChange={e => updateParam("minTargetPct", parseFloat(e.target.value)||0)} style={{ width:36, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#f5c518", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>%) | 쿨다운</span>
        <input type="number" value={params.cooldownMin} onChange={e => updateParam("cooldownMin", parseInt(e.target.value)||1)} style={{ width:30, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#fff", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>분 | 손절:</span>
        <input type="number" value={params.stopLossPct} step={0.5} onChange={e => updateParam("stopLossPct", parseFloat(e.target.value)||0)} style={{ width:40, background:"#0d0f14", border:"1px solid #f44336", borderRadius:3, color:"#f44336", fontSize:12, fontWeight:700, textAlign:"center", padding:"2px" }} />
        <span>%</span>
      </div>

      {/* 버튼 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <button onClick={toggleBot} style={{ flex:1, background: running ? "#f44336" : "#4caf50", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: simMode || optimizing ? 0.4 : 1 }} disabled={simMode || optimizing}>{running ? "⏹ 정지" : "▶ 실전"}</button>
        <button onClick={runBacktest} style={{ flex:1, background: simMode ? "#555" : "#ff9800", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: running || optimizing ? 0.4 : 1 }} disabled={running || simMode || optimizing}>{simMode ? "백테스트 중..." : "🧪 백테스트"}</button>
        <button onClick={runOptimize} style={{ flex:1, background: optimizing ? "#555" : "#9c27b0", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: running || simMode ? 0.4 : 1 }} disabled={running || simMode || optimizing}>{optimizing ? "최적화 중..." : "🔍 최적화"}</button>
      </div>

      {/* 현재가 + 하락률 + 상태 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>현재가</div>
          <div style={{ color:"#fff", fontSize:22, fontWeight:700 }}>{liveData?.price ? `$${liveData.price.toFixed(2)}` : "-"}</div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>{params.lookbackMin}분 변동</div>
          <div style={{ color: liveData?.dropRate != null ? (liveData.dropRate <= -params.dropPct ? "#4caf50" : liveData.dropRate >= 0 ? "#f44336" : "#fff") : "#333", fontSize:22, fontWeight:700 }}>
            {liveData?.dropRate != null ? `${liveData.dropRate >= 0 ? "+" : ""}${liveData.dropRate.toFixed(2)}%` : "-"}
          </div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
          <div style={{ color:"#555", fontSize:10 }}>상태</div>
          <div style={{ color: running ? "#4caf50" : "#555", fontSize:13, fontWeight:600 }}>{liveData?.status || (running ? "대기" : "정지")}</div>
        </div>
      </div>

      {/* 매수/매도 카드 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:14, border: liveData?.dropRate != null && liveData.dropRate <= -params.dropPct ? "1px solid #4caf50" : "1px solid #1a1a1a" }}>
          <div style={{ color:"#4caf50", fontSize:12, fontWeight:700, marginBottom:8 }}>매수</div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background: liveData?.dropRate != null && liveData.dropRate <= -params.dropPct ? "#4caf50" : "#333" }} />
            <span style={{ color: liveData?.dropRate != null && liveData.dropRate <= -params.dropPct ? "#4caf50" : "#555", fontSize:11 }}>
              {params.lookbackMin}분 -{params.dropPct}%↓ {liveData?.dropRate != null && liveData.dropRate <= -params.dropPct ? "✓ 매수!" : "대기"}
            </span>
          </div>
        </div>
        <div style={{ flex:1, background:"#11141c", borderRadius:10, padding:14, border: pnlPct != null && pnlPct >= params.targetPct ? "1px solid #f44336" : "1px solid #1a1a1a" }}>
          <div style={{ color:"#f44336", fontSize:12, fontWeight:700, marginBottom:8 }}>매도</div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background: pnlPct != null && pnlPct >= params.minTargetPct ? "#f44336" : "#333" }} />
            <span style={{ color: pnlPct != null && pnlPct >= params.minTargetPct ? "#f44336" : "#555", fontSize:11 }}>
              +{params.targetPct}% 이상 {pnlPct != null ? `(현재 ${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}%)` : "미보유"}
            </span>
          </div>
        </div>
      </div>

      {/* 포지션 */}
      {pos ? (
        <div style={{ background: pnlPct >= params.minTargetPct ? "#1a2e1a" : pnlPct < 0 ? "#2e1a1a" : "#11141c", borderRadius:10, padding:14, marginBottom:12, border: pnlPct >= params.minTargetPct ? "1px solid #4caf50" : pnlPct < 0 ? "1px solid #f44336" : "1px solid #1a1a1a" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div><span style={{ color:"#fff", fontSize:14, fontWeight:700 }}>{pos.ticker}</span><span style={{ color:"#555", fontSize:11, marginLeft:8 }}>{pos.qty}주</span></div>
            <div style={{ color: pnlPct >= 0 ? "#4caf50" : "#f44336", fontSize:24, fontWeight:700 }}>{pnlPct != null ? `${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}%` : "-"}</div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
            <div><span style={{ color:"#555" }}>매수가</span> <span style={{ color:"#fff", fontWeight:600 }}>${pos.price.toFixed(2)}</span></div>
            <div><span style={{ color:"#555" }}>현재가</span> <span style={{ color:"#fff", fontWeight:600 }}>{liveData?.price ? `$${liveData.price.toFixed(2)}` : "-"}</span></div>
            <div><span style={{ color:"#555" }}>수익(수수료제외)</span> <span style={{ color: pnlPct >= 0 ? "#4caf50" : "#f44336", fontWeight:600 }}>{pnlPct != null && liveData?.price ? `$${((liveData.price - pos.price) * pos.qty).toFixed(2)}` : "-"}</span></div>
          </div>
        </div>
      ) : (
        <div style={{ background:"#11141c", borderRadius:10, padding:14, marginBottom:12, textAlign:"center" }}>
          <div style={{ color:"#333", fontSize:12 }}>포지션 없음 — 매수 대기 중</div>
        </div>
      )}

      {/* 백테스트 결과 팝업 */}
      {btResults && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }} onClick={() => setBtResults(null)}>
          <div style={{ background:"#0d0f14", borderRadius:12, padding:20, maxWidth:500, width:"90%", maxHeight:"80vh", overflow:"auto", border:"1px solid #1a1a1a" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#ff9800" }}>BOT2 백테스트 (7일)</div>
              <button onClick={() => setBtResults(null)} style={{ background:"none", border:"none", color:"#555", fontSize:18, cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>매매 횟수</div>
                <div style={{ color:"#fff", fontSize:22, fontWeight:700 }}>{btResults.tradeCount}회</div>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>승률</div>
                <div style={{ color: btResults.winRate >= 50 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>{btResults.winRate}%</div>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>총 수익</div>
                <div style={{ color: btResults.totalProfit >= 0 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>${btResults.totalProfit.toFixed(2)}</div>
              </div>
            </div>
            {btResults.trades.length > 0 ? (
              <>
                <div style={{ fontSize:11, color:"#555", marginBottom:6 }}>매매 내역</div>
                {btResults.trades.map((t, i) => (
                  <div key={i} style={{ background:"#11141c", borderRadius:6, padding:8, marginBottom:4 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <span style={{ color:"#888", fontSize:11 }}>#{i+1}</span>
                      <span style={{ color: t.pnl >= 0 ? "#4caf50" : "#f44336", fontSize:14, fontWeight:700 }}>{t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}%</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#888" }}>
                      <span>매수 <span style={{ color:"#4caf50" }}>${t.buy.toFixed(2)}</span> {t.buyTime}</span>
                      <span>매도 <span style={{ color:"#f44336" }}>${t.sell.toFixed(2)}</span> {t.sellTime}</span>
                      <span style={{ color: t.profit >= 0 ? "#4caf50" : "#f44336" }}>{t.profit >= 0 ? "+" : ""}${t.profit.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ color:"#555", fontSize:12, textAlign:"center", padding:20 }}>매매 신호 없음</div>
            )}
            {btResults.openPosition && (
              <div style={{ background:"#1a2e1a", borderRadius:6, padding:10, marginTop:8, fontSize:11, color:"#4caf50" }}>
                📌 미청산: ${btResults.openPosition.price.toFixed(2)} → ${btResults.openPosition.currentPrice.toFixed(2)} ({btResults.openPosition.pnl >= 0 ? "+" : ""}{btResults.openPosition.pnl.toFixed(2)}%)
              </div>
            )}
            <button onClick={() => setBtResults(null)} style={{ marginTop:12, width:"100%", background:"#1a1a1a", border:"1px solid #333", borderRadius:6, padding:10, color:"#888", fontSize:12, cursor:"pointer" }}>닫기</button>
          </div>
        </div>
      )}

      {/* 로그 */}
      <div style={{ fontSize:11, color:"#555", marginBottom:4 }}>매매 로그</div>
      <div style={{ background:"#0d0f14", borderRadius:6, padding:8, maxHeight:200, overflow:"auto" }}>
        {logs.length === 0 && <div style={{ color:"#333", fontSize:10 }}>로그가 없습니다</div>}
        {logs.map((l, i) => (
          <div key={i} style={{ fontSize:10, color:"#888", padding:"2px 0", borderBottom:"1px solid #111" }}>
            <span style={{ color:"#555" }}>{l.time}</span> {l.msg}
          </div>
        ))}
      </div>
      <button onClick={() => { setLogs([]); localStorage.setItem("bot2_logs", "[]"); }} style={{ marginTop:6, background:"none", border:"1px solid #222", borderRadius:4, color:"#333", fontSize:10, padding:"3px 8px", cursor:"pointer" }}>로그 초기화</button>
    </div>
  );
}

// ── BOT5: 15분봉 복합 전략 ──
function Bot5Strategy({ config }) {
  const budget = config?.budget || 0;
  const symList = config?.tickers?.length ? config.tickers : config?.ticker ? [config.ticker] : [];
  const defaultParams = { rsiPeriod: 14, rsiBuy: 30, rsiEntry: 35, bbPeriod: 20, bbStd: 2, volMult: 1.5, dropMin: 1.5, dropMax: 4.0, targetPct: 2.5, stopLossPct: -1.2, maxBars: 25 };
  const [params, setParams] = useState(() => { try { return { ...defaultParams, ...JSON.parse(localStorage.getItem("bot5_params")) }; } catch { return defaultParams; } });
  const paramsRef = useRef(params);
  const updateParam = (key, val) => { const next = { ...paramsRef.current, [key]: val }; setParams(next); paramsRef.current = next; localStorage.setItem("bot5_params", JSON.stringify(next)); };
  const setAllParams = (obj) => { const next = { ...paramsRef.current, ...obj }; setParams(next); paramsRef.current = next; localStorage.setItem("bot5_params", JSON.stringify(next)); };
  const [simMode, setSimMode] = useState(false);
  const [running, setRunning] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [logs, setLogs] = useState(() => { try { return JSON.parse(localStorage.getItem("bot5_logs") || "[]"); } catch { return []; } });
  const [position, setPosition] = useState(() => { try { return JSON.parse(localStorage.getItem("bot5_position")); } catch { return null; } });
  const [btResults, setBtResults] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const intervalRef = useRef(null);

  const addLog = (msg) => {
    const entry = { time: new Date().toLocaleTimeString(), msg };
    setLogs(prev => { const next = [entry, ...prev].slice(0, 80); localStorage.setItem("bot5_logs", JSON.stringify(next)); return next; });
  };

  // RSI 계산
  const calcRSI = (closes, period) => {
    if (closes.length < period + 1) return [];
    const rsi = [];
    let ag = 0, al = 0;
    for (let i = 1; i <= period; i++) { const d = closes[i] - closes[i-1]; if (d > 0) ag += d; else al -= d; }
    ag /= period; al /= period;
    rsi.push(al === 0 ? 100 : 100 - 100 / (1 + ag / al));
    for (let i = period + 1; i < closes.length; i++) { const d = closes[i] - closes[i-1]; ag = (ag*(period-1)+(d>0?d:0))/period; al = (al*(period-1)+(d<0?-d:0))/period; rsi.push(al===0?100:100-100/(1+ag/al)); }
    return rsi;
  };

  // 볼린저밴드 계산
  const calcBB = (closes, period, std) => {
    const bands = [];
    for (let i = period - 1; i < closes.length; i++) {
      const slice = closes.slice(i - period + 1, i + 1);
      const ma = slice.reduce((s, v) => s + v, 0) / period;
      const dev = Math.sqrt(slice.reduce((s, v) => s + (v - ma) ** 2, 0) / period);
      bands.push({ ma, upper: ma + std * dev, lower: ma - std * dev });
    }
    return bands;
  };

  // MACD 계산
  const calcMACD = (closes) => {
    const ema = (data, period) => {
      const k = 2 / (period + 1);
      const result = [data[0]];
      for (let i = 1; i < data.length; i++) result.push(data[i] * k + result[i-1] * (1 - k));
      return result;
    };
    const fast = ema(closes, 12);
    const slow = ema(closes, 26);
    const macdLine = fast.map((f, i) => f - slow[i]);
    const signal = ema(macdLine.slice(25), 9);
    const hist = [];
    for (let i = 0; i < signal.length; i++) hist.push(macdLine[i + 25] - signal[i]);
    return hist; // starts at index 33 of original closes
  };

  const isMarketOpen = () => {
    const et = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
    const mins = et.getHours() * 60 + et.getMinutes();
    return mins >= 570 && mins <= 960;
  };

  // 실시간 틱 (15분마다)
  const tick = async () => {
    if (!isMarketOpen()) { setLiveData({ status: "장 마감" }); return; }
    const pos = JSON.parse(localStorage.getItem("bot5_position"));
    const p = paramsRef.current;

    // 전체 종목 스캔
    for (const sym of symList) {
      try {
        const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(sym)}?interval=15m&range=5d`);
        if (!res.ok) continue;
        const json = await res.json();
        const r = json?.chart?.result?.[0];
        if (!r) continue;
        const q = r.indicators?.quote?.[0] || {};
        const closes = [], volumes = [];
        for (let i = 0; i < (r.timestamp||[]).length; i++) {
          if (q.close?.[i] != null) { closes.push(q.close[i]); volumes.push(q.volume?.[i]||0); }
        }
        if (closes.length < 25) continue;

        const rsiArr = calcRSI(closes, p.rsiPeriod);
        const bbArr = calcBB(closes, p.bbPeriod, p.bbStd);
        const ri = rsiArr.length - 1, bi = bbArr.length - 1;
        if (ri < 1 || bi < 1) continue;
        const rsi = rsiArr[ri], prevRsi = rsiArr[ri - 1];
        const bb = bbArr[bi], prevBB = bbArr[bi - 1];
        const price = closes[closes.length - 1];

        // 보유 중이면 매도 체크
        if (pos && pos.ticker === sym) {
          const pnl = (price - pos.price) / pos.price * 100;
          const elapsed = (Date.now() - new Date(pos.time).getTime()) / 60000;
          let target = p.targetPct;
          if (elapsed > 240) target = Math.max(p.targetPct * 0.6, 1.5);
          else if (elapsed > 120) target = Math.max(p.targetPct * 0.8, 2.0);
          setLiveData({ status: `${sym} 보유 ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}%`, rsi, price });

          if (pnl >= target) {
            addLog(`🔴 매도 ${sym} +${pnl.toFixed(2)}%`);
            const ex = await detectExchange(sym); await kisOrder("sell", sym, pos.qty, price.toFixed(2), ex);
            localStorage.removeItem("bot5_position"); setPosition(null); return;
          }
          if (rsi >= 70 && pnl >= 0.8) {
            addLog(`🔴 RSI70 익절 ${sym} +${pnl.toFixed(2)}%`);
            const ex = await detectExchange(sym); await kisOrder("sell", sym, pos.qty, price.toFixed(2), ex);
            localStorage.removeItem("bot5_position"); setPosition(null); return;
          }
          if (pnl <= p.stopLossPct) {
            addLog(`🔻 손절 ${sym} ${pnl.toFixed(2)}%`);
            const ex = await detectExchange(sym); await kisOrder("sell", sym, pos.qty, price.toFixed(2), ex);
            localStorage.removeItem("bot5_position"); setPosition(null); return;
          }
          return;
        }

        // 매수 체크 (RSI 반등 + BB 복귀)
        if (!pos) {
          const rsiBelow = rsi <= p.rsiBuy;
          const rsiRebounded = prevRsi <= p.rsiBuy && rsi >= p.rsiEntry;
          const bbBelow = price <= bb.lower;
          const bbRecovered = closes[closes.length - 2] <= prevBB?.lower && price > bb.lower;
          const c1 = rsiRebounded;
          const c2 = bbRecovered;
          // 조건 감지 로그
          if (rsiBelow) addLog(`👀 ${sym} RSI ${rsi.toFixed(1)} ≤ ${p.rsiBuy} 감지 | $${price.toFixed(2)}`);
          if (rsiRebounded) addLog(`👀 ${sym} RSI 반등! ${prevRsi.toFixed(1)}→${rsi.toFixed(1)} (${p.rsiBuy}↓→${p.rsiEntry}↑)`);
          if (bbBelow) addLog(`👀 ${sym} BB 하단 이탈 | $${price.toFixed(2)} < $${bb.lower.toFixed(2)}`);
          if (bbRecovered) addLog(`👀 ${sym} BB 하단 복귀! $${price.toFixed(2)} > $${bb.lower.toFixed(2)}`);
          if (c1 && !c2) addLog(`⏳ ${sym} RSI 조건 ✓ BB 조건 ✗ — BB 복귀 대기`);
          if (!c1 && c2) addLog(`⏳ ${sym} RSI 조건 ✗ BB 조건 ✓ — RSI 반등 대기`);
          if (c1 && c2) {
            const qty = Math.floor(budget / price);
            if (qty > 0) {
              addLog(`🔵 매수 ${sym} RSI${rsi.toFixed(0)} BB복귀 | $${price.toFixed(2)} × ${qty}주`);
              const ex = await detectExchange(sym);
              const r = await kisOrder("buy", sym, qty, price.toFixed(2), ex);
              if (r?.rt_cd === "0") {
                addLog(`✅ 매수 체결! ${sym}`);
                const newPos = { ticker: sym, price, qty, time: new Date().toISOString() };
                localStorage.setItem("bot5_position", JSON.stringify(newPos));
                setPosition(newPos); setLiveData({ status: `${sym} 매수!`, rsi, price });
              } else { addLog(`❌ 매수 실패: ${r?.msg1 || ""}`); }
              return;
            }
          }
        }
      } catch {}
    }
    setLiveData({ status: "매수 신호 없음" });
  };

  const toggleBot = () => {
    if (running) { clearInterval(intervalRef.current); intervalRef.current = null; setRunning(false); addLog("⏹ 정지"); }
    else { setRunning(true); addLog(`▶ 시작 (${symList.length}개 종목, 15분 간격)`); tick(); intervalRef.current = setInterval(tick, 900000); }
  };

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, []);

  // 백테스트
  const runBacktest = async () => {
    if (!symList.length) return;
    setSimMode(true);
    addLog(`🧪 백테스트 — ${symList.length}개 종목 15분봉 60일`);
    try {
      // 전체 종목 데이터 수집
      const allTrades = [];
      for (const sym of symList) {
        try {
          const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(sym)}?interval=15m&range=60d`);
          if (!res.ok) continue;
          const json = await res.json();
          const r = json?.chart?.result?.[0];
          if (!r) continue;
          const ts = r.timestamp || [];
          const q = r.indicators?.quote?.[0] || {};
          const closes = [], volumes = [], times = [];
          for (let i = 0; i < ts.length; i++) {
            if (q.close?.[i] != null && q.volume?.[i] != null) {
              closes.push(q.close[i]); volumes.push(q.volume[i]); times.push(ts[i]);
            }
          }
          if (closes.length < 40) continue;

          const p = paramsRef.current;
          const rsiArr = calcRSI(closes, p.rsiPeriod);
          const bbArr = calcBB(closes, p.bbPeriod, p.bbStd);
          const macdHist = calcMACD(closes);
          const offset = Math.max(p.rsiPeriod, p.bbPeriod, 34); // 모든 지표가 유효한 시점부터

          let pos = null;
          for (let i = offset; i < closes.length; i++) {
            const price = closes[i];
            const rsiIdx = i - p.rsiPeriod;
            const bbIdx = i - p.bbPeriod + 1;
            const macdIdx = i - 34;
            if (rsiIdx < 1 || bbIdx < 1 || macdIdx < 1) continue;

            const rsi = rsiArr[rsiIdx];
            const prevRsi = rsiArr[rsiIdx - 1];
            const bb = bbArr[bbIdx];
            const prevBB = bbArr[bbIdx - 1];
            const hist = macdHist[macdIdx];
            const prevHist = macdHist[macdIdx - 1];
            const vol = volumes[i];
            const avgVol = volumes.slice(Math.max(0, i - 20), i).reduce((s, v) => s + v, 0) / Math.min(20, i);
            const pastPrice = closes[Math.max(0, i - 4)];
            const dropPct = (price - pastPrice) / pastPrice * 100;
            const time = new Date(times[i] * 1000).toLocaleString("ko-KR", { month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" });

            // 매도 체크 (보유 중)
            if (pos) {
              const pnl = (price - pos.price) / pos.price * 100;
              const bars = i - pos.idx;
              let target = p.targetPct;
              if (bars > 16) target = Math.max(p.targetPct * 0.6, 1.5);
              else if (bars > 8) target = Math.max(p.targetPct * 0.8, 2.0);
              // 목표 도달
              if (pnl >= target) {
                const fee = pos.price * pos.qty * 0.0025 + price * pos.qty * 0.0025;
                const profit = (price - pos.price) * pos.qty - fee;
                const netPnl = profit / (pos.price * pos.qty) * 100;
                addLog(`🔴 [${time}] ${sym} 매도 +${pnl.toFixed(2)}% (순 ${netPnl >= 0 ? "+" : ""}${netPnl.toFixed(2)}%) $${profit.toFixed(2)}`);
                allTrades.push({ ticker: sym, buy: pos.price, sell: price, qty: pos.qty, pnl: netPnl, profit, buyTime: pos.time, sellTime: time });
                pos = null; continue;
              }
              // RSI 70 조기 익절 (+0.8% 이상)
              if (rsi >= 70 && pnl >= 0.8) {
                const fee = pos.price * pos.qty * 0.0025 + price * pos.qty * 0.0025;
                const profit = (price - pos.price) * pos.qty - fee;
                const netPnl = profit / (pos.price * pos.qty) * 100;
                addLog(`🔴 [${time}] ${sym} RSI70 익절 +${pnl.toFixed(2)}% (순 ${netPnl >= 0 ? "+" : ""}${netPnl.toFixed(2)}%)`);
                allTrades.push({ ticker: sym, buy: pos.price, sell: price, qty: pos.qty, pnl: netPnl, profit, buyTime: pos.time, sellTime: time });
                pos = null; continue;
              }
              // 손절
              if (pnl <= p.stopLossPct) {
                const fee = pos.price * pos.qty * 0.0025 + price * pos.qty * 0.0025;
                const profit = (price - pos.price) * pos.qty - fee;
                const netPnl = profit / (pos.price * pos.qty) * 100;
                addLog(`🔻 [${time}] ${sym} 손절 ${pnl.toFixed(2)}% (순 ${netPnl.toFixed(2)}%)`);
                allTrades.push({ ticker: sym, buy: pos.price, sell: price, qty: pos.qty, pnl: netPnl, profit, buyTime: pos.time, sellTime: time });
                pos = null; continue;
              }
              // 시간 손절 (8봉 후 +0.3% 미만)
              if (bars >= 8 && pnl < 0.3) {
                const fee = pos.price * pos.qty * 0.0025 + price * pos.qty * 0.0025;
                const profit = (price - pos.price) * pos.qty - fee;
                const netPnl = profit / (pos.price * pos.qty) * 100;
                addLog(`⏱ [${time}] ${sym} 시간손절 ${bars}봉 ${pnl.toFixed(2)}%`);
                allTrades.push({ ticker: sym, buy: pos.price, sell: price, qty: pos.qty, pnl: netPnl, profit, buyTime: pos.time, sellTime: time });
                pos = null; continue;
              }
              // 최대 보유
              if (bars >= p.maxBars) {
                const fee = pos.price * pos.qty * 0.0025 + price * pos.qty * 0.0025;
                const profit = (price - pos.price) * pos.qty - fee;
                const netPnl = profit / (pos.price * pos.qty) * 100;
                addLog(`⏱ [${time}] ${sym} 강제청산 ${bars}봉 ${pnl.toFixed(2)}%`);
                allTrades.push({ ticker: sym, buy: pos.price, sell: price, qty: pos.qty, pnl: netPnl, profit, buyTime: pos.time, sellTime: time });
                pos = null; continue;
              }
            }

            // 매수 체크 (5중 필터)
            if (!pos) {
              const c1 = prevRsi <= p.rsiBuy && rsi >= p.rsiEntry; // RSI 반등
              const c2 = closes[i-1] <= prevBB?.lower && price > bb.lower; // BB 하단 복귀
              if (c1 && c2) {
                const qty = Math.floor(budget / price);
                if (qty > 0) {
                  pos = { price, qty, idx: i, time };
                  addLog(`🔵 [${time}] ${sym} 매수 RSI${rsi.toFixed(0)} BB복귀 거래량${(vol/avgVol).toFixed(1)}x 하락${dropPct.toFixed(1)}% | $${price.toFixed(2)} × ${qty}주`);
                }
              }
            }
          }
          // 미청산
          if (pos) {
            const lastP = closes[closes.length - 1];
            const pnl = (lastP - pos.price) / pos.price * 100;
            addLog(`📌 ${sym} 미청산 $${pos.price.toFixed(2)} → $${lastP.toFixed(2)} (${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}%)`);
          }
        } catch {}
      }

      const totalProfit = allTrades.reduce((s, t) => s + t.profit, 0);
      const winCount = allTrades.filter(t => t.pnl > 0).length;
      addLog(`📈 완료: ${allTrades.length}회 | 승률 ${allTrades.length ? Math.round(winCount / allTrades.length * 100) : 0}% | $${totalProfit.toFixed(2)}`);

      setBtResults({
        trades: allTrades, totalProfit, tradeCount: allTrades.length,
        winRate: allTrades.length ? Math.round(winCount / allTrades.length * 100) : 0,
      });
    } catch(e) { addLog(`❌ ${e.message}`); }
    setSimMode(false);
  };

  // 최적화 (주요 파라미터만)
  const runOptimize = async () => {
    if (!symList.length) return;
    setOptimizing(true);
    addLog(`🔍 BOT5 최적화 — ${symList.length}개 종목 15분봉`);
    try {
      const allData = {};
      for (const sym of symList.slice(0, 8)) {
        try {
          const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(sym)}?interval=15m&range=60d`);
          if (!res.ok) continue;
          const json = await res.json();
          const r = json?.chart?.result?.[0];
          if (!r) continue;
          const q = r.indicators?.quote?.[0] || {};
          const ts = r.timestamp || [];
          const closes = [], volumes = [];
          for (let i = 0; i < ts.length; i++) { if (q.close?.[i] != null && q.volume?.[i] != null) { closes.push(q.close[i]); volumes.push(q.volume[i]); } }
          if (closes.length > 40) allData[sym] = { closes, volumes };
        } catch {}
      }
      addLog(`📊 ${Object.keys(allData).length}개 종목 로드`);

      const targets = [1.5, 2.0, 2.5, 3.0];
      const stops = [-0.8, -1.0, -1.2, -1.5, -2.0];
      const rsiBuys = [25, 30, 35];
      const rsiEntries = [32, 35, 40];
      const volMults = [1.0, 1.5, 2.0];
      const dropMins = [1.0, 1.5, 2.0];

      let best = { profit: -Infinity, p: null, trades: 0, winRate: 0 };
      let tested = 0;

      for (const tp of targets) for (const sl of stops) for (const rb of rsiBuys) for (const re of rsiEntries) {
        if (re <= rb) continue;
        {
          let totalProfit = 0, wins = 0, total = 0;
          for (const [sym, { closes, volumes }] of Object.entries(allData)) {
            const rsiArr = calcRSI(closes, 14);
            const bbArr = calcBB(closes, 20, 2);
            const macdHist = calcMACD(closes);
            const offset = 34;
            let pos = null;
            for (let i = offset; i < closes.length; i++) {
              const price = closes[i];
              const ri = i - 14, bi = i - 19, mi = i - 34;
              if (ri < 1 || bi < 1 || mi < 1) continue;
              const rsi = rsiArr[ri], prevRsi = rsiArr[ri-1];
              const bb = bbArr[bi], prevBB = bbArr[bi-1];
              const hist = macdHist[mi], prevH = macdHist[mi-1];
              const vol = volumes[i];
              const avgV = volumes.slice(Math.max(0,i-20),i).reduce((s,v)=>s+v,0)/Math.min(20,i);
              const pastP = closes[Math.max(0,i-4)];
              const drop = (price-pastP)/pastP*100;

              if (pos) {
                const pnl = (price-pos.price)/pos.price*100;
                const bars = i - pos.idx;
                let target = tp;
                if (bars > 16) target = Math.max(tp*0.6, 1.5);
                else if (bars > 8) target = Math.max(tp*0.8, 2.0);
                if (pnl >= target || (rsi >= 70 && pnl >= 0.8) || pnl <= sl || (bars >= 8 && pnl < 0.3) || bars >= 25) {
                  const fee = pos.price*pos.qty*0.0025+price*pos.qty*0.0025;
                  totalProfit += (price-pos.price)*pos.qty-fee;
                  total++; if ((price-pos.price)*pos.qty-fee > 0) wins++;
                  pos = null;
                }
              }
              if (!pos && prevRsi <= rb && rsi >= re && closes[i-1] <= prevBB?.lower && price > bb.lower) {
                const qty = Math.floor(budget/price);
                if (qty > 0) pos = { price, qty, idx: i };
              }
            }
          }
          tested++;
          if (totalProfit > best.profit && total >= 1) {
            best = { profit: totalProfit, p: { ...paramsRef.current, targetPct: tp, stopLossPct: sl, rsiBuy: rb, rsiEntry: re }, trades: total, winRate: total ? Math.round(wins/total*100) : 0 };
          }
        }
      }

      if (best.p) {
        addLog(`✅ 완료 (${tested}개 조합)`);
        addLog(`🏆 RSI${best.p.rsiBuy}→${best.p.rsiEntry} | 목표+${best.p.targetPct}% | 손절${best.p.stopLossPct}% | 거래량${best.p.volMult}x | 하락${best.p.dropMin}%`);
        addLog(`📊 ${best.trades}회 | 승률 ${best.winRate}% | $${best.profit.toFixed(2)}`);
        setAllParams(best.p);
      } else { addLog("⚠️ 매매 신호가 없는 구간입니다"); }
    } catch(e) { addLog(`❌ ${e.message}`); }
    setOptimizing(false);
  };

  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:4 }}>BOT5 전략: 15분봉 RSI+볼린저밴드</div>
      <div style={{ color:"#555", fontSize:10, marginBottom:12 }}>RSI 반등 + BB 하단 복귀 매수 → 시간체감 매도 → 칼손절 | {symList.length}개 종목</div>

      {/* 파라미터 */}
      <div style={{ background:"#11141c", borderRadius:8, padding:10, marginBottom:12, fontSize:10, color:"#888", display:"flex", flexWrap:"wrap", alignItems:"center", gap:3 }}>
        <span>RSI</span>
        <input type="number" value={params.rsiBuy} onChange={e => updateParam("rsiBuy", parseFloat(e.target.value)||0)} style={{ width:30, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#4caf50", fontSize:11, fontWeight:700, textAlign:"center", padding:"1px" }} />
        <span>↓→</span>
        <input type="number" value={params.rsiEntry} onChange={e => updateParam("rsiEntry", parseFloat(e.target.value)||0)} style={{ width:30, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#4caf50", fontSize:11, fontWeight:700, textAlign:"center", padding:"1px" }} />
        <span>↑ | 목표+</span>
        <input type="number" value={params.targetPct} step={0.1} onChange={e => updateParam("targetPct", parseFloat(e.target.value)||0)} style={{ width:32, background:"#0d0f14", border:"1px solid #333", borderRadius:3, color:"#f5c518", fontSize:11, fontWeight:700, textAlign:"center", padding:"1px" }} />
        <span>% | 손절</span>
        <input type="number" value={params.stopLossPct} step={0.1} onChange={e => updateParam("stopLossPct", parseFloat(e.target.value)||0)} style={{ width:35, background:"#0d0f14", border:"1px solid #f44336", borderRadius:3, color:"#f44336", fontSize:11, fontWeight:700, textAlign:"center", padding:"1px" }} />
        <span>%</span>
      </div>

      {/* 버튼 */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <button onClick={toggleBot} style={{ flex:1, background: running ? "#f44336" : "#4caf50", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: simMode || optimizing ? 0.4 : 1 }} disabled={simMode || optimizing}>{running ? "⏹ 정지" : "▶ 실전"}</button>
        <button onClick={runBacktest} style={{ flex:1, background: simMode ? "#555" : "#ff9800", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: running || optimizing ? 0.4 : 1 }} disabled={running || simMode || optimizing}>{simMode ? "백테스트 중..." : "🧪 백테스트"}</button>
        <button onClick={runOptimize} style={{ flex:1, background: optimizing ? "#555" : "#9c27b0", border:"none", borderRadius:6, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", opacity: running || simMode ? 0.4 : 1 }} disabled={running || simMode || optimizing}>{optimizing ? "최적화 중..." : "🔍 최적화"}</button>
      </div>

      {/* 상태 + 포지션 */}
      <div style={{ background:"#11141c", borderRadius:8, padding:12, marginBottom:12, textAlign:"center" }}>
        <div style={{ color:"#555", fontSize:10 }}>상태</div>
        <div style={{ color: running ? "#4caf50" : "#555", fontSize:13, fontWeight:600 }}>{liveData?.status || (running ? "대기" : "정지")}</div>
      </div>
      {position && (
        <div style={{ background:"#11141c", borderRadius:10, padding:14, marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><span style={{ color:"#fff", fontSize:14, fontWeight:700 }}>{position.ticker}</span><span style={{ color:"#555", fontSize:11, marginLeft:8 }}>{position.qty}주</span></div>
            <span style={{ color:"#888", fontSize:11 }}>매수가 ${position.price.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* 백테스트 팝업 */}
      {btResults && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }} onClick={() => setBtResults(null)}>
          <div style={{ background:"#0d0f14", borderRadius:12, padding:20, maxWidth:520, width:"90%", maxHeight:"80vh", overflow:"auto", border:"1px solid #1a1a1a" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#ff9800" }}>BOT5 백테스트 (15분봉 60일)</div>
              <button onClick={() => setBtResults(null)} style={{ background:"none", border:"none", color:"#555", fontSize:18, cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>매매 횟수</div>
                <div style={{ color:"#fff", fontSize:22, fontWeight:700 }}>{btResults.tradeCount}회</div>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>승률</div>
                <div style={{ color: btResults.winRate >= 50 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>{btResults.winRate}%</div>
              </div>
              <div style={{ flex:1, background:"#11141c", borderRadius:8, padding:12, textAlign:"center" }}>
                <div style={{ color:"#555", fontSize:10 }}>총 수익</div>
                <div style={{ color: btResults.totalProfit >= 0 ? "#4caf50" : "#f44336", fontSize:22, fontWeight:700 }}>${btResults.totalProfit.toFixed(2)}</div>
              </div>
            </div>
            {btResults.trades.length > 0 ? btResults.trades.map((t, i) => (
              <div key={i} style={{ background:"#11141c", borderRadius:6, padding:8, marginBottom:4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{ color:"#f5c518", fontSize:11, fontWeight:700 }}>{t.ticker}</span>
                  <span style={{ color: t.pnl >= 0 ? "#4caf50" : "#f44336", fontSize:14, fontWeight:700 }}>{t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}%</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#888" }}>
                  <span>매수 <span style={{ color:"#4caf50" }}>${t.buy.toFixed(2)}</span> {t.buyTime}</span>
                  <span>매도 <span style={{ color:"#f44336" }}>${t.sell.toFixed(2)}</span> {t.sellTime}</span>
                  <span style={{ color: t.profit >= 0 ? "#4caf50" : "#f44336" }}>{t.profit >= 0 ? "+" : ""}${t.profit.toFixed(2)}</span>
                </div>
              </div>
            )) : <div style={{ color:"#555", fontSize:12, textAlign:"center", padding:20 }}>매매 신호 없음</div>}
            <button onClick={() => setBtResults(null)} style={{ marginTop:12, width:"100%", background:"#1a1a1a", border:"1px solid #333", borderRadius:6, padding:10, color:"#888", fontSize:12, cursor:"pointer" }}>닫기</button>
          </div>
        </div>
      )}

      {/* 로그 */}
      <div style={{ fontSize:11, color:"#555", marginBottom:4 }}>매매 로그</div>
      <div style={{ background:"#0d0f14", borderRadius:6, padding:8, maxHeight:200, overflow:"auto" }}>
        {logs.length === 0 && <div style={{ color:"#333", fontSize:10 }}>로그가 없습니다</div>}
        {logs.map((l, i) => (
          <div key={i} style={{ fontSize:10, color:"#888", padding:"2px 0", borderBottom:"1px solid #111" }}>
            <span style={{ color:"#555" }}>{l.time}</span> {l.msg}
          </div>
        ))}
      </div>
      <button onClick={() => { setLogs([]); localStorage.setItem("bot5_logs", "[]"); }} style={{ marginTop:6, background:"none", border:"1px solid #222", borderRadius:4, color:"#333", fontSize:10, padding:"3px 8px", cursor:"pointer" }}>로그 초기화</button>
    </div>
  );
}

function RadarPage() {
  const [tracked, setTracked] = useState(() => JSON.parse(localStorage.getItem("radar_institutions") || "[]"));
  const [selected, setSelected] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);

  const removeInst = (cik) => {
    const next = tracked.filter(t => t.cik !== cik);
    localStorage.setItem("radar_institutions", JSON.stringify(next));
    setTracked(next);
    if (selected === cik) { setSelected(null); setPortfolio(null); }
  };

  useEffect(() => {
    if (!selected) { setPortfolio(null); return; }
    // 캐시 확인 (1시간)
    const cacheKey = `radar_cache_${selected}`;
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      if (cached && Date.now() - cached._ts < 3600000) {
        setPortfolio(cached.data);
        return;
      }
    } catch {}
    (async () => {
      setLoading(true);
      setPortfolio(null);
      try {
        const instName = tracked.find(t => t.cik === selected)?.name || "";

        // 1. CIK submissions에서 13D/13G 검색 (최신순, 가장 빠름)
        const changes = [];
        const padded = selected.padStart(10, "0");
        const rawCik = selected.replace(/^0+/, "") || selected;
        const targetForms13 = ["SCHEDULE 13G", "SCHEDULE 13G/A", "SCHEDULE 13D", "SCHEDULE 13D/A", "SC 13D", "SC 13D/A", "SC 13G", "SC 13G/A"];
        try {
          const subRes = await fetch(`/api/secdata/submissions/CIK${padded}.json`);
          if (subRes.ok) {
            const subJson = await subRes.json();
            const recent = subJson?.filings?.recent;
            if (recent) {
              const oneYearAgo = new Date(Date.now() - 365*86400000).toISOString().slice(0,10);
              const filings13 = [];
              for (let i = 0; i < recent.form.length && filings13.length < 20; i++) {
                if (targetForms13.includes(recent.form[i]) && recent.filingDate[i] >= oneYearAgo) {
                  filings13.push({
                    form: recent.form[i],
                    date: recent.filingDate[i],
                    accession: recent.accessionNumber[i].replace(/-/g, ""),
                    doc: recent.primaryDocument[i],
                  });
                }
              }
              // 각 filing XML 파싱
              for (const f of filings13) {
                try {
                  await new Promise(r => setTimeout(r, 150));
                  const rawDoc = f.doc.includes("/") ? f.doc.split("/").pop() : f.doc;
                  const ctrl = new AbortController();
                  setTimeout(() => ctrl.abort(), 5000);
                  const xmlRes = await fetch(`/api/secwww/Archives/edgar/data/${rawCik}/${f.accession}/${rawDoc}`, { signal: ctrl.signal });
                  if (!xmlRes.ok) continue;
                  const text = await xmlRes.text();
                  if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) continue;
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(text, "text/xml");
                  const issuer = doc.querySelector("issuerName")?.textContent || doc.querySelector("nameOfIssuer")?.textContent || "-";
                  const ticker = doc.querySelector("issuerTradingSymbol")?.textContent || "";
                  const shares = doc.querySelector("reportingPersonBeneficiallyOwnedAggregateNumberOfShares")?.textContent
                    || doc.querySelector("aggregateAmountBeneficiallyOwned")?.textContent || null;
                  const pct = doc.querySelector("classPercent")?.textContent
                    || doc.querySelector("percentOfClass")?.textContent || null;
                  changes.push({ form: f.form, date: f.date, issuer, ticker, shares: shares ? parseInt(parseFloat(shares)) : null, pct: pct ? parseFloat(pct) : null });
                } catch {}
              }
            }
          }
        } catch(e) { console.warn("[RadarPage] CIK submissions error:", e); }

        // 2. CIK에서 못 찾았으면 EFTS fallback
        if (changes.length === 0) {
          try {
            const oneYearAgo = new Date(Date.now() - 365*86400000).toISOString().slice(0,10);
            const eftsRes = await fetch(`/api/secefts/LATEST/search-index?q=%22${encodeURIComponent(instName)}%22&forms=SC+13G,SC+13G/A,SC+13D,SC+13D/A,SCHEDULE+13G,SCHEDULE+13G/A,SCHEDULE+13D,SCHEDULE+13D/A&dateRange=custom&startdt=${oneYearAgo}&enddt=${new Date().toISOString().slice(0,10)}&from=0&size=40`);
            if (eftsRes.ok) {
              const eftsJson = await eftsRes.json();
              const hits = eftsJson?.hits?.hits || [];
              const seen = new Set();
              for (const h of hits.slice(0, 15)) {
                const src = h._source || {};
                const adsh = src.adsh || h._id?.split(":")?.[0];
                const docFile = h._id?.split(":")?.[1] || "";
                if (!adsh || seen.has(adsh)) continue;
                seen.add(adsh);
                const accession = adsh.replace(/-/g, "");
                const fCik = (adsh.split("-")[0]).replace(/^0+/, "");
                try {
                  await new Promise(r => setTimeout(r, 200));
                  const ctrl = new AbortController();
                  setTimeout(() => ctrl.abort(), 5000);
                  const docRes = await fetch(`/api/secwww/Archives/edgar/data/${fCik}/${accession}/${docFile}`, { signal: ctrl.signal });
                  if (!docRes.ok) continue;
                  const text = await docRes.text();
                  let issuer = "-", ticker = "", shares = null, pct = null;
                  if (text.includes("<?xml") && !text.startsWith("<!DOCTYPE")) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, "text/xml");
                    issuer = doc.querySelector("issuerName")?.textContent || doc.querySelector("nameOfIssuer")?.textContent || "-";
                    ticker = doc.querySelector("issuerTradingSymbol")?.textContent || "";
                    shares = doc.querySelector("reportingPersonBeneficiallyOwnedAggregateNumberOfShares")?.textContent
                      || doc.querySelector("aggregateAmountBeneficiallyOwned")?.textContent || null;
                    pct = doc.querySelector("classPercent")?.textContent
                      || doc.querySelector("percentOfClass")?.textContent || null;
                  } else {
                    // TXT 파싱
                    const nameMatch = text.match(/^(.+?)\n\(NAME OF ISSUER\)/m);
                    if (nameMatch) issuer = nameMatch[1].trim();
                    if (issuer === "-" && docFile) issuer = docFile.replace(/\.txt$/i, "").replace(/_/g, " ");
                    const sharesMatch = text.match(/AGGREGAT(?:ED?)? AMOUNT BENEFICIALLY OWNED[^\n]*\n\s*([\d,]+)/i);
                    if (sharesMatch) shares = sharesMatch[1].replace(/,/g, "");
                    const pctMatch = text.match(/PERCENT OF CLASS[^\n]*\n\s*([\d.]+)%?/i);
                    if (pctMatch) pct = pctMatch[1];
                  }
                  if (issuer === "-" && src.display_names?.length) {
                    const dn = src.display_names.find(n => !n.toUpperCase().includes(instName.toUpperCase()));
                    if (dn) issuer = dn.split("(")[0].trim();
                  }
                  changes.push({ form: src.form || "13G", date: src.file_date || "", issuer, ticker, shares: shares ? parseInt(parseFloat(shares)) : null, pct: pct ? parseFloat(pct) : null });
                } catch {}
              }
            }
          } catch(e) { console.warn("[RadarPage] EFTS fallback error:", e); }
        }

        // 13D/13G: ticker 없으면 Yahoo 검색으로 찾기 + 현재가/공시일 주가 조회
        for (const c of changes) {
          try {
            // ticker가 없으면 issuer 이름으로 Yahoo 검색
            if (!c.ticker) {
              const ctrl0 = new AbortController();
              setTimeout(() => ctrl0.abort(), 3000);
              const sRes = await fetch(`/api/yahoo/v1/finance/search?q=${encodeURIComponent(c.issuer)}&quotesCount=1&newsCount=0`, { signal: ctrl0.signal });
              if (sRes.ok) {
                const sJson = await sRes.json();
                const quote = sJson?.quotes?.[0];
                if (quote?.symbol) c.ticker = quote.symbol;
              }
            }
            if (!c.ticker) continue;
            // 현재가
            const ctrl = new AbortController();
            setTimeout(() => ctrl.abort(), 3000);
            const pRes = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(c.ticker)}?interval=1d&range=5d`, { signal: ctrl.signal });
            if (pRes.ok) {
              const pJson = await pRes.json();
              const closes = pJson?.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.filter(v => v != null) || [];
              if (closes.length) c.currentPrice = closes[closes.length - 1];
            }
            // 공시일 주가 (fetchMaxDaily 캐시에서)
            const daily = await fetchMaxDaily(c.ticker);
            if (daily) {
              const priceMap = {};
              for (let i = 0; i < daily.timestamps.length; i++) {
                if (daily.closes[i] != null) priceMap[new Date(daily.timestamps[i]*1000).toISOString().slice(0,10)] = daily.closes[i];
              }
              const dates = Object.keys(priceMap).sort();
              let fp = priceMap[c.date];
              if (!fp) { for (let d = dates.length - 1; d >= 0; d--) { if (dates[d] <= c.date) { fp = priceMap[dates[d]]; break; } } }
              if (fp) c.filingPrice = parseFloat(fp.toFixed(2));
            }
            // 매집가 추정 (공시일 주가 기준)
            if (c.filingPrice && c.shares) c.avgPrice = c.filingPrice;
          } catch {}
        }

        // 같은 issuer끼리 이전 공시 대비 매집량 변동 계산
        const issuerMap = {};
        for (const c of changes) {
          const key = c.issuer.toUpperCase();
          if (!issuerMap[key]) issuerMap[key] = [];
          issuerMap[key].push(c);
        }
        for (const filings of Object.values(issuerMap)) {
          // 날짜순 정렬 (오래된 것 먼저)
          filings.sort((a, b) => a.date.localeCompare(b.date));
          for (let i = 0; i < filings.length; i++) {
            if (i > 0 && filings[i].shares != null && filings[i-1].shares != null) {
              filings[i].delta = filings[i].shares - filings[i-1].shares;
              filings[i].prevDate = filings[i-1].date;
            }
          }
        }
        // 다시 최신순 정렬
        changes.sort((a, b) => b.date.localeCompare(a.date));

        const result = { changes };
        setPortfolio(result);
        try { localStorage.setItem(cacheKey, JSON.stringify({ _ts: Date.now(), data: result })); } catch {}
      } catch(e) {
        console.warn("[RadarPage] error:", e);
        setPortfolio(null);
      }
      setLoading(false);
    })();
  }, [selected]);

  return (
    <div style={{ padding:16 }}>
      <div style={{ fontSize:14, fontWeight:600, color:"#fff", marginBottom:12 }}>기관 추적 레이더</div>
      {tracked.length === 0 ? (
        <div style={{ color:"#555", fontSize:12 }}>추적 중인 기관이 없습니다. RSIMAP → More → 기관 탭에서 + 버튼으로 추가하세요.</div>
      ) : (
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
          {tracked.map(t => (
            <div key={t.cik} style={{ display:"flex", alignItems:"center", gap:4, background: selected===t.cik ? "#1e2130" : "#11141c", borderRadius:6, padding:"6px 10px", cursor:"pointer", border: selected===t.cik ? "1px solid #f5c518" : "1px solid #1a1a1a" }}
              onClick={() => setSelected(selected===t.cik ? null : t.cik)}>
              <span style={{ color: selected===t.cik ? "#f5c518" : "#aaa", fontSize:11, fontWeight:600 }}>{t.name}</span>
              <button onClick={(e) => { e.stopPropagation(); removeInst(t.cik); }} style={{ background:"none", border:"none", color:"#555", fontSize:11, cursor:"pointer", padding:0, marginLeft:4 }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* 기관 겹치는 종목 */}
      {tracked.length >= 2 && (() => {
        const allHoldings = {};
        for (const t of tracked) {
          try {
            const cached = JSON.parse(localStorage.getItem(`radar_cache_${t.cik}`));
            if (!cached?.data?.changes) continue;
            const seen = new Set();
            for (const c of cached.data.changes) {
              const key = c.issuer.toUpperCase();
              if (seen.has(key)) continue;
              seen.add(key);
              if (!allHoldings[key]) allHoldings[key] = [];
              allHoldings[key].push({ inst: t.name, pct: c.pct, shares: c.shares, ticker: c.ticker, date: c.date });
            }
          } catch {}
        }
        const overlap = Object.entries(allHoldings)
          .filter(([, arr]) => arr.length >= 2)
          .sort((a, b) => b[1].length - a[1].length);
        if (!overlap.length) return null;
        return (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, color:"#f5c518", fontWeight:600, marginBottom:8 }}>큰손 겹치는 종목 ({overlap.length}개)</div>
            {overlap.map(([issuer, arr], i) => (
              <div key={i} style={{ background:"#11141c", borderRadius:6, padding:"8px 8px", marginBottom:4 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <span style={{ color:"#f5c518", fontSize:11, fontWeight:700 }}>{arr.length}개 기관</span>
                  <span style={{ color:"#fff", fontSize:11, fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{issuer}</span>
                  {arr[0].ticker && <span style={{ color:"#555", fontSize:10 }}>{arr[0].ticker}</span>}
                </div>
                {arr.map((h, j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:8, fontSize:10, color:"#888" }}>
                    <span style={{ color:"#aaa", flex:1 }}>{h.inst}</span>
                    {h.shares != null && <span>{h.shares.toLocaleString()}주</span>}
                    {h.pct != null && <span style={{ color:"#4caf50", fontWeight:600 }}>{h.pct}%</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })()}

      {loading && <div style={{ color:"#333", fontSize:12 }}>로딩 중...</div>}

      {portfolio && !loading && (
        <div>
          {/* 13D/13G 변동 */}
          {portfolio.changes.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, color:"#f5c518", fontWeight:600, marginBottom:8 }}>13D/13G 지분 변동 (10일 이내 공시)</div>
              {portfolio.changes.map((c, i) => {
                const diffPct = c.filingPrice && c.currentPrice ? ((c.currentPrice - c.filingPrice) / c.filingPrice * 100) : null;
                return (
                  <div key={i} style={{ background:"#11141c", borderRadius:6, padding:"8px 8px", marginBottom:4 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <span style={{ color: c.form.includes("13D") ? "#f5c518" : "#4caf50", fontWeight:700, fontSize:10 }}>{c.form.includes("13D") ? "13D" : "13G"}</span>
                      <span style={{ color:"#fff", fontSize:11, fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.issuer}</span>
                      {c.ticker && <span style={{ color:"#555", fontSize:10 }}>{c.ticker}</span>}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, marginBottom:2, flexWrap:"wrap" }}>
                      {c.shares != null && <span style={{ color:"#aaa" }}>보유 {c.shares.toLocaleString()}주</span>}
                      {c.delta != null && c.delta !== 0 && (
                        <span style={{ color: c.delta > 0 ? "#4caf50" : "#f44336", fontWeight:700 }}>
                          {c.delta > 0 ? "+" : ""}{c.delta.toLocaleString()}주 {c.delta > 0 ? "▲매집" : "▼매도"}
                        </span>
                      )}
                      {c.delta === 0 && <span style={{ color:"#888" }}>변동없음</span>}
                      {c.delta == null && <span style={{ color:"#333", fontSize:10 }}>신규 진입</span>}
                      {c.pct != null && <span style={{ color:"#f5c518", fontWeight:600 }}>지분 {c.pct}%</span>}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:10, marginBottom:2 }}>
                      {c.currentPrice != null && c.shares != null && <span style={{ color:"#888" }}>보유가치 <span style={{ color:"#fff" }}>${(c.currentPrice * c.shares / 1e6).toFixed(1)}M</span></span>}
                      <span style={{ color:"#555" }}>{c.date}</span>
                      {c.prevDate && <span style={{ color:"#333" }}>vs {c.prevDate}</span>}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:10 }}>
                      {c.filingPrice != null && <span style={{ color:"#888" }}>매집가 <span style={{ color:"#fff" }}>${c.filingPrice}</span></span>}
                      {c.currentPrice != null && <span style={{ color:"#888" }}>현재가 <span style={{ color:"#fff" }}>${c.currentPrice.toFixed(2)}</span></span>}
                      {diffPct != null && <span style={{ color: diffPct >= 0 ? "#4caf50" : "#f44336", fontWeight:700, fontSize:11 }}>{diffPct >= 0 ? "+" : ""}{diffPct.toFixed(1)}%</span>}
                      {!c.filingPrice && !c.currentPrice && <span style={{ color:"#333" }}>가격 조회 불가</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {portfolio.changes.length === 0 && (
            <div style={{ color:"#555", fontSize:12 }}>이 기관의 13D/13G 공시 데이터가 없습니다.</div>
          )}
        </div>
      )}
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
      {subTab === "trade" && <TradePage />}
      {subTab === "radar" && <RadarPage />}
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
