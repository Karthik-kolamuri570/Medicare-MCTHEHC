import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),        // React plugin (JSX, fast refresh, auto runtime)
    tailwindcss()   // Tailwind plugin
  ]
});
