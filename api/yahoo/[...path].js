export default async function handler(req, res) {
  const path = req.query.path?.join("/") || "";
  const qs = new URLSearchParams(req.query);
  qs.delete("path");
  const url = `https://query2.finance.yahoo.com/${path}${qs.toString() ? "?" + qs : ""}`;
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const data = await r.text();
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.status(r.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
