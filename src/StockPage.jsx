import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

function useMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// OpenAI key는 서버사이드에서 관리 (/api/openai)

export default function StockPage() {
  const isMobile = useMobile();
  const [ticker, setTicker] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [gptAnalysis, setGptAnalysis] = useState(null);
  const [claudeAnalysis, setClaudeAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [wlLoading, setWlLoading] = useState(true);
  const [addingMonitor, setAddingMonitor] = useState(false);
  const [mobileTab, setMobileTab] = useState("chart");
  const searchTimeout = useRef(null);

  useEffect(() => { loadWatchlist(); }, []);

  async function loadWatchlist() {
    setWlLoading(true);
    try {
      const { data } = await supabase.from("stock_watchlist").select("*").order("added_at", { ascending: false });
      if (!data || data.length === 0) { setWatchlist([]); setWlLoading(false); return; }
      // 먼저 목록을 즉시 표시
      setWatchlist(data.map(item => ({ ...item, currentPrice: null, change: 0 })));
      setWlLoading(false);
      // 가격은 백그라운드에서 업데이트
      const updated = await Promise.all(data.map(async (item) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          const res = await fetch(`/api/yahoo1/v8/finance/chart/${encodeURIComponent(item.ticker)}?range=5d&interval=1d`, { signal: controller.signal });
          clearTimeout(timeout);
          const json = await res.json();
          const closes = (json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || []).filter(c => c != null);
          const cur = closes[closes.length - 1];
          const prev = closes.length >= 2 ? closes[closes.length - 2] : cur;
          return { ...item, currentPrice: cur, change: cur && prev ? ((cur - prev) / prev * 100) : 0 };
        } catch { return { ...item, currentPrice: null, change: 0 }; }
      }));
      setWatchlist(updated);
    } catch { setWatchlist([]); setWlLoading(false); }
  }

  // 검색 자동완성
  function handleTickerChange(val) {
    setTicker(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (val.trim().length < 1) { setSuggestions([]); setShowSuggestions(false); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        const q = val.trim();
        let data;
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const searchUrl = isLocal
          ? `/api/yahoo/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0`
          : `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query2.finance.yahoo.com/v1/finance/search?q=${q}&quotesCount=8&newsCount=0`)}`;
        const res = await fetch(searchUrl);
        data = await res.json();
        const quotes = (data.quotes || []).map(q => ({ symbol: q.symbol, name: q.shortname || q.longname || "", type: q.quoteType || "", exchange: q.exchDisp || "" }));
        setSuggestions(quotes);
        setShowSuggestions(quotes.length > 0);
      } catch { setSuggestions([]); }
    }, 200);
  }

  function selectTicker(symbol) {
    setTicker(symbol);
    setShowSuggestions(false);
    loadChart(symbol);
  }

  async function loadChart(overrideTicker) {
    const t = (overrideTicker || ticker).trim().toUpperCase();
    if (!t) return;
    setLoading(true);
    setError("");
    setStockData(null);
    setGptAnalysis(null);
    setClaudeAnalysis(null);
    setShowSuggestions(false);
    try {
      setStockData(await fetchStockData(t));
    } catch (e) { setError(e.message); }
    setLoading(false);
  }

  async function handleAnalyze() {
    if (!stockData) return;
    setAnalyzing(true);
    const d = buildAnalysisData(stockData);
    await Promise.all([fetchGPTAnalysis(d, setGptAnalysis), fetchClaudeAnalysis(d, setClaudeAnalysis)]);
    setAnalyzing(false);
  }

  async function handleAddMonitor() {
    if (!stockData) return;
    setAddingMonitor(true);
    await supabase.from("stock_watchlist").upsert({ ticker: stockData.ticker, last_price: stockData.lastPrice, added_at: new Date().toISOString() }, { onConflict: "ticker" });
    setAddingMonitor(false);
    loadWatchlist();
  }

  async function handleRemove(e, t) {
    e.stopPropagation();
    await supabase.from("stock_watchlist").delete().eq("ticker", t);
    loadWatchlist();
  }

  function handleKey(e) { if (e.key === "Enter") loadChart(); }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 56px)" }}>
      {/* 모바일 탭 */}
      {isMobile && (
        <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", background: "#0a0a0a" }}>
          {[{ id: "chart", label: "차트" }, { id: "monitor", label: "모니터링" }].map(t => (
            <button key={t.id} onClick={() => setMobileTab(t.id)} style={{
              flex: 1, padding: "10px 0", background: "none", border: "none",
              borderBottom: mobileTab === t.id ? "2px solid #fff" : "2px solid transparent",
              color: mobileTab === t.id ? "#fff" : "#555",
              fontSize: "0.85rem", fontWeight: mobileTab === t.id ? 600 : 400, cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>
      )}
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 16, padding: isMobile ? "12px 12px" : "16px 24px", flex: 1 }}>
      {/* 왼쪽: 검색 + 차트 + 분석 */}
      <div style={{ flex: 1, minWidth: 0, display: isMobile && mobileTab === "monitor" ? "none" : "block" }}>
        {/* 검색 */}
        <div style={{ position: "relative", display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input value={ticker} onChange={e => handleTickerChange(e.target.value)} onKeyDown={handleKey}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="종목 검색 (예: apple, tesla, gold, bitcoin)"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #333", background: "#111", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            {showSuggestions && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#111", border: "1px solid #333", borderRadius: 8, marginTop: 4, maxHeight: 280, overflowY: "auto" }}>
                {suggestions.map(s => (
                  <div key={s.symbol} onClick={() => selectTicker(s.symbol)} style={{ padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.symbol}</span>
                      <span style={{ fontSize: 11, color: "#555", marginLeft: 8 }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: 9, color: "#444" }}>{s.exchange}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => loadChart()} disabled={loading} style={{
            padding: "10px 20px", borderRadius: 8, border: "none", background: "#2a2d3a",
            color: "#aaa", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0,
          }}>{loading ? "..." : "차트"}</button>
        </div>

        {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 12 }}>{error}</div>}

        {/* 차트 */}
        {stockData && (
          <>
            <TradingViewChart symbol={stockData.ticker} />
            {stockData.prices.length === 0 && (
              <div style={{ color: "#555", fontSize: 12, marginBottom: 12, textAlign: "center" }}>지표 데이터 미지원 종목 (차트만 표시)</div>
            )}
            {stockData.prices.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                <Indicator label="RSI (14)" value={stockData.rsi[stockData.rsi.length - 1]?.toFixed(1)}
                  color={stockData.rsi[stockData.rsi.length - 1] > 70 ? "#ff6b6b" : stockData.rsi[stockData.rsi.length - 1] < 30 ? "#4ecdc4" : "#8890a4"}
                  note={stockData.rsi[stockData.rsi.length - 1] > 70 ? "과매수" : stockData.rsi[stockData.rsi.length - 1] < 30 ? "과매도" : "중립"} />
                <Indicator label="MACD" value={stockData.macd.macdLine[stockData.macd.macdLine.length - 1]?.toFixed(2)}
                  color={stockData.macd.macdLine[stockData.macd.macdLine.length - 1] > stockData.macd.signal[stockData.macd.signal.length - 1] ? "#4ecdc4" : "#ff6b6b"}
                  note={stockData.macd.macdLine[stockData.macd.macdLine.length - 1] > stockData.macd.signal[stockData.macd.signal.length - 1] ? "매수 신호" : "매도 신호"} />
                <Indicator label="MA5/MA20"
                  value={stockData.ma5[stockData.ma5.length - 1] > stockData.ma20[stockData.ma20.length - 1] ? "골든크로스" : "데드크로스"}
                  color={stockData.ma5[stockData.ma5.length - 1] > stockData.ma20[stockData.ma20.length - 1] ? "#4ecdc4" : "#ff6b6b"}
                  note={`${formatPrice(stockData.ma5[stockData.ma5.length - 1], stockData.ticker)} / ${formatPrice(stockData.ma20[stockData.ma20.length - 1], stockData.ticker)}`} />
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={handleAnalyze} disabled={analyzing} style={{
                background: analyzing ? "#333" : "linear-gradient(135deg,#7c5cfc,#4a9eff)",
                border: "none", borderRadius: 8, padding: "8px 24px",
                color: analyzing ? "#666" : "#fff", fontSize: 13, fontWeight: 700, cursor: analyzing ? "default" : "pointer",
              }}>{analyzing ? "AI 분석 중..." : "AI 분석"}</button>
              <button onClick={handleAddMonitor} disabled={addingMonitor} style={{
                background: "rgba(0,208,132,0.1)", border: "1px solid rgba(0,208,132,0.3)",
                borderRadius: 8, padding: "8px 16px", color: "#00d084", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>{addingMonitor ? "..." : "+ 모니터링"}</button>
            </div>
          </>
        )}

        {/* AI 분석 */}
        {(gptAnalysis || claudeAnalysis) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <AnalysisCard title="GPT-4o" subtitle="기술적 분석" color="#4a9eff" content={gptAnalysis} />
            <AnalysisCard title="Claude" subtitle="리스크 관점" color="#b09eff" content={claudeAnalysis} />
          </div>
        )}

        {!stockData && !loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#444" }}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>📈</div>
            <div style={{ fontSize: 13 }}>종목을 검색하세요</div>
          </div>
        )}
      </div>

      {/* 오른쪽: 모니터링 */}
      <div style={{ width: isMobile ? "100%" : 260, flexShrink: 0, display: isMobile && mobileTab === "chart" ? "none" : "block" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#ccc" }}>모니터링</div>
          <button onClick={loadWatchlist} disabled={wlLoading} style={{
            background: "none", border: "none", color: "#555", fontSize: 11, cursor: "pointer",
          }}>{wlLoading ? "..." : "새로고침"}</button>
        </div>

        {wlLoading && <div style={{ textAlign: "center", padding: 20, color: "#555", fontSize: 12 }}>로딩...</div>}

        {!wlLoading && watchlist.length === 0 && (
          <div style={{ textAlign: "center", padding: "30px 10px", color: "#444", fontSize: 12 }}>
            종목을 추가해주세요
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {watchlist.map(item => (
            <div key={item.ticker} onClick={() => { setTicker(item.ticker); loadChart(item.ticker); }}
              style={{
                background: stockData?.ticker === item.ticker ? "#1a1d2a" : "#111",
                border: `1px solid ${stockData?.ticker === item.ticker ? "#4a9eff33" : "#222"}`,
                borderRadius: 8, padding: "10px 12px", cursor: "pointer",
              }}
              onMouseEnter={e => { if (stockData?.ticker !== item.ticker) e.currentTarget.style.background = "#1a1a1a"; }}
              onMouseLeave={e => { if (stockData?.ticker !== item.ticker) e.currentTarget.style.background = "#111"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{item.ticker}</span>
                <button onClick={(e) => handleRemove(e, item.ticker)} style={{
                  background: "none", border: "none", color: "#444", fontSize: 10, cursor: "pointer",
                }}>✕</button>
              </div>
              {item.currentPrice != null && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <span style={{ fontSize: 13, color: "#aaa" }}>{getPricePrefix(item.ticker)}{formatPrice(item.currentPrice, item.ticker)}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: item.change >= 0 ? "#4ecdc4" : "#ff6b6b" }}>
                    {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

// ════════════════════════════════════
// 공통 컴포넌트
// ════════════════════════════════════
function toTVSymbol(sym) {
  const map = {
    "GC=F": "XAUUSD", "SI=F": "XAGUSD", "CL=F": "USOIL",
    "NG=F": "NATURALGAS", "DX-Y.NYB": "DXY",
    "BTC-USD": "BTCUSD", "ETH-USD": "ETHUSD",
  };
  return map[sym.toUpperCase()] || sym;
}

function TradingViewChart({ symbol }) {
  const isMobile = useMobile();
  const containerRef = useRef(null);
  const tvSymbol = toTVSymbol(symbol);
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true, symbol: tvSymbol, interval: "D", timezone: "Asia/Seoul", theme: "dark", style: "1", locale: "kr",
      backgroundColor: "rgba(17, 20, 28, 1)", gridColor: "rgba(30, 33, 48, 0.6)",
      allow_symbol_change: false, calendar: false, hide_top_toolbar: false,
      studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
    });
    containerRef.current.appendChild(script);
  }, [tvSymbol]);

  return (
    <div style={{ background: "#11141c", borderRadius: 10, border: "1px solid #1e2130", overflow: "hidden", marginBottom: 12, height: isMobile ? 500 : 1100 }}>
      <div ref={containerRef} style={{ height: "100%" }} />
    </div>
  );
}

function Indicator({ label, value, color, note }) {
  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
      <div style={{ fontSize: 10, color: "#555", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 9, color: "#555", marginTop: 3 }}>{note}</div>
    </div>
  );
}

function AnalysisCard({ title, subtitle, color, content }) {
  return (
    <div style={{ background: "#111", border: `1px solid ${color}33`, borderRadius: 10, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <div style={{ width: 20, height: 20, borderRadius: 5, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff" }}>AI</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{title}</div>
          <div style={{ fontSize: 9, color: "#555" }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#c8cad0", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{content || "분석 중..."}</div>
    </div>
  );
}

// ════════════════════════════════════
// 유틸
// ════════════════════════════════════
function formatPrice(price, ticker) {
  if (price == null) return "—";
  return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getPricePrefix(ticker) {
  return (ticker || "").toUpperCase().includes("KRW") ? "₩" : "$";
}

async function fetchStockData(t) {
  const res = await fetch(`/api/yahoo/v8/finance/chart/${encodeURIComponent(t)}?interval=1d&range=3mo`);
  if (!res.ok) throw new Error("티커를 찾을 수 없습니다.\n예: AAPL, TSLA, GC=F, BTC-USD");
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error("티커를 찾을 수 없습니다.\n예: AAPL, TSLA, GC=F, BTC-USD");
  const timestamps = result.timestamp || [];
  const rawCloses = result.indicators?.quote?.[0]?.close || [];
  const prices = timestamps.map((ts, i) => ({
    date: new Date(ts * 1000).toISOString().slice(0, 10),
    close: rawCloses[i],
  })).filter(p => p.close != null && !isNaN(p.close)).slice(-60);
  if (prices.length < 5) throw new Error("티커를 찾을 수 없습니다.\n예: AAPL, TSLA, GC=F, BTC-USD");
  const closes = prices.map(p => p.close);
  const lastPrice = result.meta?.regularMarketPrice || closes[closes.length - 1];
  return { ticker: t, prices, lastPrice, prefix: getPricePrefix(t), ma5: movingAvg(closes, 5), ma20: movingAvg(closes, 20), rsi: calcRSI(closes, 14), macd: calcMACD(closes) };
}

function buildAnalysisData(data) {
  const c = data.prices.map(p => p.close);
  return { ticker: data.ticker, lastPrice: data.lastPrice, priceChange5d: ((c[c.length-1]-c[c.length-6])/c[c.length-6]*100).toFixed(2), priceChange20d: c.length>=21?((c[c.length-1]-c[c.length-21])/c[c.length-21]*100).toFixed(2):"N/A", rsi: data.rsi[data.rsi.length-1]?.toFixed(1), macdLine: data.macd.macdLine[data.macd.macdLine.length-1]?.toFixed(2), signal: data.macd.signal[data.macd.signal.length-1]?.toFixed(2), ma5: data.ma5[data.ma5.length-1]?.toFixed(2), ma20: data.ma20[data.ma20.length-1]?.toFixed(2) };
}

async function fetchGPTAnalysis(data, setter) {
  try {
    const res = await fetch("/api/openai", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "system", content: "주식 기술적 분석 전문가. 한국어 3~5줄. 매수/매도/관망 의견." }, { role: "user", content: `${data.ticker}: $${data.lastPrice}, 5일${data.priceChange5d}%, 20일${data.priceChange20d}%, RSI${data.rsi}, MACD${data.macdLine}/Sig${data.signal}, MA5$${data.ma5}/MA20$${data.ma20}` }], max_tokens: 300, temperature: 0.3 }) });
    setter((await res.json()).choices?.[0]?.message?.content || "분석 실패");
  } catch { setter("오류"); }
}

async function fetchClaudeAnalysis(data, setter) {
  try {
    const res = await fetch("/api/openai", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "system", content: "보수적 리스크 분석가. 한국어 3~5줄. 리스크/주의사항 위주." }, { role: "user", content: `${data.ticker} 리스크: $${data.lastPrice}, 5일${data.priceChange5d}%, 20일${data.priceChange20d}%, RSI${data.rsi}, MACD${data.macdLine}/Sig${data.signal}, MA5$${data.ma5}/MA20$${data.ma20}` }], max_tokens: 300, temperature: 0.3 }) });
    setter((await res.json()).choices?.[0]?.message?.content || "분석 실패");
  } catch { setter("오류"); }
}

function movingAvg(a, p) { return a.map((_, i) => i < p-1 ? null : a.slice(i-p+1,i+1).reduce((s,v)=>s+v,0)/p); }
function calcRSI(c, p=14) { return c.map((_,i)=>{ if(i<p) return null; let g=0,l=0; for(let j=i-p+1;j<=i;j++){const d=c[j]-c[j-1];d>0?g+=d:l-=d;} const rs=l===0?100:(g/p)/(l/p); return 100-100/(1+rs); }); }
function calcMACD(c) { const e12=calcEMA(c,12),e26=calcEMA(c,26); const ml=e12.map((v,i)=>v!=null&&e26[i]!=null?v-e26[i]:null); const s=calcEMA(ml.filter(v=>v!=null),9); return{macdLine:ml,signal:new Array(ml.length-s.length).fill(null).concat(s)}; }
function calcEMA(a,p) { const k=2/(p+1),e=[]; a.forEach(v=>{if(v==null)e.push(null);else e.push(!e.length||e[e.length-1]==null?v:v*k+e[e.length-1]*(1-k));}); return e; }
