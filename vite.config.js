import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: "/admin"  // 👈 abre directamente localhost:5173/admin
  }
});
