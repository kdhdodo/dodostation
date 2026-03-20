import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/yahoo": {
        target: "https://query2.finance.yahoo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            proxyReq.setHeader("Accept", "application/json, */*");
            proxyReq.setHeader("Accept-Language", "en-US,en;q=0.9");
          });
        },
      },
      "/api/stooq": {
        target: "https://stooq.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stooq/, ""),
      },
      "/api/av": {
        target: "https://www.alphavantage.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/av/, ""),
      },
      "/api/ycrumb": {
        target: "https://query2.finance.yahoo.com",
        changeOrigin: true,
        rewrite: () => "/v1/test/getcrumb",
        configure: (proxy) => {
          let _cookie = null;
          // 서버 시작 시 쿠키 받기
          (async () => {
            try {
              const res = await fetch("https://fc.yahoo.com", { headers: { "User-Agent": "Mozilla/5.0" } });
              const sc = res.headers.get("set-cookie") || "";
              _cookie = sc.split(";")[0];
            } catch {}
          })();
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            if (_cookie) proxyReq.setHeader("Cookie", _cookie);
          });
        },
      },
      "/api/yqs": {
        target: "https://query2.finance.yahoo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yqs/, ""),
        configure: (proxy) => {
          let _cookie = null, _crumb = null;
          (async () => {
            try {
              const fcRes = await fetch("https://fc.yahoo.com", { headers: { "User-Agent": "Mozilla/5.0" } });
              const sc = fcRes.headers.get("set-cookie") || "";
              _cookie = sc.split(";")[0];
              const crumbRes = await fetch("https://query2.finance.yahoo.com/v1/test/getcrumb", {
                headers: { "User-Agent": "Mozilla/5.0", Cookie: _cookie }
              });
              if (crumbRes.ok) _crumb = await crumbRes.text();
              console.log("[Yahoo crumb]", _crumb ? "OK" : "FAILED");
            } catch(e) { console.error("[Yahoo crumb error]", e); }
          })();
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            if (_cookie) proxyReq.setHeader("Cookie", _cookie);
            // crumb을 URL에 자동 주입
            if (_crumb && !proxyReq.path.includes("crumb=")) {
              proxyReq.path += (proxyReq.path.includes("?") ? "&" : "?") + "crumb=" + encodeURIComponent(_crumb);
            }
          });
        },
      },
      "/api/kis": {
        target: "https://openapi.koreainvestment.com:9443",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kis/, ""),
        secure: true,
      },
      "/api/secefts": {
        target: "https://efts.sec.gov",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/secefts/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("User-Agent", "DodoStation contact@menuit.io");
            proxyReq.setHeader("Accept", "application/json");
          });
        },
      },
      "/api/secdata": {
        target: "https://data.sec.gov",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/secdata/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("User-Agent", "DodoStation contact@menuit.io");
            proxyReq.setHeader("Accept", "application/json");
          });
        },
      },
      "/api/secwww": {
        target: "https://www.sec.gov",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/secwww/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("User-Agent", "DodoStation contact@menuit.io");
          });
        },
      },
      "/api/yahoo1": {
        target: "https://query1.finance.yahoo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo1/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            proxyReq.setHeader("Accept", "application/json, */*");
            proxyReq.setHeader("Accept-Language", "en-US,en;q=0.9");
          });
        },
      },
    },
  },
});
