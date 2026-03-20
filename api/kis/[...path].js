// KIS API 서버사이드 프록시 — 키는 서버 환경변수에서만 읽음
const APPKEY = process.env.KIS_APPKEY;
const APPSECRET = process.env.KIS_APPSECRET;
const ACCOUNT = process.env.KIS_ACCOUNT;
const ACCOUNT_CD = process.env.KIS_ACCOUNT_CD;

let _token = null, _tokenExp = 0;

async function getToken() {
  if (_token && Date.now() < _tokenExp) return _token;
  const res = await fetch("https://openapi.koreainvestment.com:9443/oauth2/tokenP", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", appkey: APPKEY, appsecret: APPSECRET }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.access_token) return null;
  _token = json.access_token;
  _tokenExp = Date.now() + 23 * 3600000;
  return _token;
}

export default async function handler(req, res) {
  const path = req.query.path?.join("/") || "";

  // 토큰 발급 요청이면 서버에서 발급해서 반환
  if (path === "oauth2/tokenP") {
    const token = await getToken();
    if (token) {
      res.status(200).json({ access_token: token, token_type: "Bearer" });
    } else {
      res.status(500).json({ error: "Token issue failed" });
    }
    return;
  }

  // 일반 API 요청
  const token = await getToken();
  if (!token) { res.status(500).json({ error: "No token" }); return; }

  const qs = new URLSearchParams(req.query);
  qs.delete("path");
  // 계좌번호 자동 주입
  if (!qs.has("CANO") && ACCOUNT) { qs.set("CANO", ACCOUNT); qs.set("ACNT_PRDT_CD", ACCOUNT_CD || "01"); }
  const url = `https://openapi.koreainvestment.com:9443/${path}${qs.toString() ? "?" + qs : ""}`;

  try {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      authorization: `Bearer ${token}`,
      appkey: APPKEY,
      appsecret: APPSECRET,
      custtype: "P",
    };
    // tr_id는 프론트에서 전달
    if (req.headers.tr_id) headers.tr_id = req.headers.tr_id;

    const r = await fetch(url, {
      method: req.method,
      headers,
      ...(req.method === "POST" ? { body: JSON.stringify(req.body) } : {}),
    });
    const data = await r.text();
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.status(r.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
