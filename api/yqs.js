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
  const url = new URL(req.url, `https://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api\/yqs\//, "");
  const qs = new URLSearchParams(url.search);
  if (_crumb) qs.set("crumb", _crumb);
  const targets = [
    `https://query1.finance.yahoo.com/${path}?${qs}`,
    `https://query2.finance.yahoo.com/${path}?${qs}`,
  ];
  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    Accept: "application/json",
    Origin: "https://finance.yahoo.com",
    Referer: "https://finance.yahoo.com/",
    ...(_cookie ? { Cookie: _cookie } : {}),
  };
  for (const t of targets) {
    try {
      const r = await fetch(t, { headers });
      if (r.ok) { const data = await r.text(); res.setHeader("Content-Type", "application/json"); res.setHeader("Access-Control-Allow-Origin", "*"); return res.status(200).send(data); }
    } catch {}
  }
  res.status(502).json({ error: "Yahoo API unavailable" });
}
