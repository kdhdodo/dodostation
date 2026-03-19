import { useState, useEffect } from "react";
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
        {activeTab === "stock" && <StockPage />}
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
