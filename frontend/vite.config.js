import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      proxy: {
        "/api": {
          target: mode === "development"
            ? "http://localhost:3004"
            : "https://e2425-wads-l4acg2-server.csbihub.id",
          changeOrigin: true,
          secure: mode !== "development",
          ws: true,
        },
        "/socket.io": {
          target: mode === "development"
            ? "http://localhost:3004"
            : "https://e2425-wads-l4acg2-server.csbihub.id",
          changeOrigin: true,
          secure: mode !== "development",
          ws: true, // this is crucial for WebSocket proxying
        },
      },
    },
    build: {
      outDir: "dist",
    },
    plugins: [react(), tailwindcss()],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  }
})
