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
  integrations: [
    sitemap({
      // noindex を付けたページはサイトマップからも外す。
      // 載せたままだと「索引に入れろ（sitemap）」と「入れるな（meta）」の
      // 矛盾したシグナルになり、クロールも無駄になる。
      filter: (page) =>
        ![
          "/insta-auto/terms/",
          "/insta-auto/tokushoho/",
          "/insta-auto/apply/",
          "/subsc-design/terms/",
        ].includes(new URL(page).pathname),
    }),
    mdx(),
  ],
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
