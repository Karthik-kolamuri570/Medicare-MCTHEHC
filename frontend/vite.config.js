import { defineConfig } from "vite";
import path from "path"

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),        // React plugin (JSX, fast refresh, auto runtime)
    tailwindcss() ,
      // Tailwind plugin
  ],resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
