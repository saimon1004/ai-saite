import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://sai-mon.co.jp",
  base: "/",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap(), mdx()],
  i18n: {
    defaultLocale: "ja",
    locales: ["ja"],
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
});
