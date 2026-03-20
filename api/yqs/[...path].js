// Yahoo quoteSummary with auto crumb injection
let _cookie = null, _crumb = null, _ts = 0;

async function ensureCrumb() {
  if (_crumb && Date.now() - _ts < 3600000) return;
  try {
    const fcRes = await fetch("https://fc.yahoo.com", { headers: { "User-Agent": "Mozilla/5.0" } });
    const sc = fcRes.headers.get("set-cookie") || "";
    _cookie = sc.split(";")[0];
    const crumbRes = await fetch("https://query2.finance.yahoo.com/v1/test/getcrumb", {
      headers: { "User-Agent": "Mozilla/5.0", Cookie: _cookie },
    });
    if (crumbRes.ok) { _crumb = await crumbRes.text(); _ts = Date.now(); }
  } catch {}
}

export default async function handler(req, res) {
  await ensureCrumb();
  const path = req.query.path?.join("/") || "";
  const qs = new URLSearchParams(req.query);
  qs.delete("path");
  if (_crumb) qs.set("crumb", _crumb);
  const url = `https://query2.finance.yahoo.com/${path}${qs.toString() ? "?" + qs : ""}`;
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        ..._cookie ? { Cookie: _cookie } : {},
      },
    });
    const data = await r.text();
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.status(r.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
