import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { postsService, categoriesService } from "@/services";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [posts, cats] = await Promise.all([
          postsService.list({ page: 1, pageSize: 500 }),
          categoriesService.list(),
        ]);

        const entries: { path: string; lastmod?: string }[] = [
          { path: "/" },
          { path: "/blog" },
          { path: "/busca" },
          ...cats.map((c) => ({ path: `/categoria/${c.slug}` })),
          ...posts.items.map((p) => ({ path: `/blog/${p.slug}`, lastmod: p.publishedAt })),
        ];

        const urls = entries.map((e) =>
          [
            "  <url>",
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            "  </url>",
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});