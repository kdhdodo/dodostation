export default async function handler(req, res) {
  const path = req.query.path?.join("/") || "";
  const qs = new URLSearchParams(req.query);
  qs.delete("path");
  const url = `https://openapi.koreainvestment.com:9443/${path}${qs.toString() ? "?" + qs : ""}`;
  try {
    const headers = { "Content-Type": "application/json; charset=utf-8" };
    // Forward auth headers
    ["authorization", "appkey", "appsecret", "tr_id", "custtype"].forEach(h => {
      if (req.headers[h]) headers[h] = req.headers[h];
    });
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
