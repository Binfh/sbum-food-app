import path from "path";
import tailwindcss from "@tailwindcss/vite";
import reactSWC from "@vitejs/plugin-react-swc"; // Thay đổi import này
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [reactSWC(), tailwindcss()], // Sửa tên function
  resolve: {
    alias: {
      '@': path.resolve(fileURLToPath(import.meta.url), 'src'),
    },
  },
});