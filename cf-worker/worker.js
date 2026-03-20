export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\//, "");
    const qs = url.search || "";
    
    const targets = [
      `https://query1.finance.yahoo.com/${path}${qs}`,
      `https://query2.finance.yahoo.com/${path}${qs}`,
    ];
    
    const headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Origin": "https://finance.yahoo.com",
      "Referer": "https://finance.yahoo.com/",
    };
    
    for (const t of targets) {
      try {
        const r = await fetch(t, { headers });
        if (r.ok) {
          const data = await r.text();
          return new Response(data, {
            headers: {
              "Content-Type": r.headers.get("content-type") || "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      } catch {}
    }
    
    return new Response(JSON.stringify({ error: "Yahoo unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  },
};
