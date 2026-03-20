export default async function handler(req, res) {
  const path = req.query.path?.join("/") || "";
  const qs = new URLSearchParams(req.query);
  qs.delete("path");
  // query1과 query2 둘 다 시도
  const urls = [
    `https://query1.finance.yahoo.com/${path}${qs.toString() ? "?" + qs : ""}`,
    `https://query2.finance.yahoo.com/${path}${qs.toString() ? "?" + qs : ""}`,
  ];
  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Origin: "https://finance.yahoo.com",
    Referer: "https://finance.yahoo.com/",
  };
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers });
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
