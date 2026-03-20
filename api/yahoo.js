export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api\/yahoo\//, "");
  const qs = url.search || "";
  const targets = [
    `https://query1.finance.yahoo.com/${path}${qs}`,
    `https://query2.finance.yahoo.com/${path}${qs}`,
  ];
  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    Origin: "https://finance.yahoo.com",
    Referer: "https://finance.yahoo.com/",
  };
  for (const t of targets) {
    try {
      const r = await fetch(t, { headers });
      if (r.ok) {
        const data = await r.text();
        res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.status(200).send(data);
      }
    } catch {}
  }
  res.status(502).json({ error: "Yahoo API unavailable" });
}
