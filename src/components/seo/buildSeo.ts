import type { SEO } from "@/types";

export interface HeadData {
  meta: Array<Record<string, string>>;
  links?: Array<Record<string, string>>;
  scripts?: Array<Record<string, string>>;
}

export function buildSeo({
  title,
  description,
  path,
  ogImage,
  type = "website",
  jsonLd,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}): HeadData {
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: path },
    { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (ogImage) {
    meta.push({ property: "og:image", content: ogImage });
    meta.push({ name: "twitter:image", content: ogImage });
  }
  const head: HeadData = { meta, links: [{ rel: "canonical", href: path }] };
  if (jsonLd) {
    const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    head.scripts = arr.map((data) => ({
      type: "application/ld+json",
      children: JSON.stringify(data),
    }));
  }
  return head;
}

export function mergeSeo(base: SEO | undefined, fallback: { title: string; description: string }) {
  return {
    title: base?.title ?? fallback.title,
    description: base?.description ?? fallback.description,
    ogImage: base?.ogImage,
  };
}