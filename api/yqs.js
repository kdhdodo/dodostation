const CF_WORKER = "https://yahoo-proxy.kdh-dc6.workers.dev";

let _cookie = null, _crumb = null, _ts = 0;
async function ensureCrumb() {
  if (_crumb && Date.now() - _ts < 3600000) return;
  try {
    const fcRes = await fetch("https://fc.yahoo.com", { headers: { "User-Agent": "Mozilla/5.0" } });
    const sc = fcRes.headers.get("set-cookie") || "";
    _cookie = sc.split(";")[0];
    const crumbRes = await fetch(`${CF_WORKER}/v1/test/getcrumb`, {
      headers: { Cookie: _cookie },
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
  try {
    const r = await fetch(`${CF_WORKER}/${path}?${qs}`, {
      headers: _cookie ? { Cookie: _cookie } : {},
    });
    const data = await r.text();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(r.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
