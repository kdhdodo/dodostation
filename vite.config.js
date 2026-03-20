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
