import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
const isUserOrOrgPage = repositoryName.endsWith(".github.io");
const githubPagesBase =
  process.env.GITHUB_PAGES_BASE ||
  (repositoryName && !isUserOrOrgPage ? `/${repositoryName}/` : "/");

export default defineConfig({
  base: githubPagesBase,
  root: "github-pages",
  publicDir: "../public",
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  build: {
    outDir: "../dist-github",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./github-pages/index.html", import.meta.url)),
        admin: fileURLToPath(
          new URL("./github-pages/admin/index.html", import.meta.url),
        ),
      },
    },
  },
});
