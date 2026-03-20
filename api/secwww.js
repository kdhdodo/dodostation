export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api\/secwww\//, "");
  const qs = url.search || "";
  try {
    const r = await fetch(`https://www.sec.gov/${path}${qs}`, {
      headers: { "User-Agent": "DodoStation contact@menuit.io" },
    });
    const data = await r.text();
    res.setHeader("Content-Type", r.headers.get("content-type") || "text/html");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(r.status).send(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
}
