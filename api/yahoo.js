const CF_WORKER = "https://yahoo-proxy.kdh-dc6.workers.dev";

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api\/yahoo\//, "");
  const qs = url.search || "";
  try {
    const r = await fetch(`${CF_WORKER}/${path}${qs}`);
    const data = await r.text();
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(r.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
