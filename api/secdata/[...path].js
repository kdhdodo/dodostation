export default async function handler(req, res) {
  const path = req.query.path?.join("/") || "";
  const qs = new URLSearchParams(req.query);
  qs.delete("path");
  const url = `https://data.sec.gov/${path}${qs.toString() ? "?" + qs : ""}`;
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "DodoStation contact@menuit.io", Accept: "application/json" },
    });
    const data = await r.text();
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.status(r.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
