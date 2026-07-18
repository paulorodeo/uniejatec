/**
 * WordPress → internal domain model mappers.
 *
 * Rules:
 *  - Never return raw WP objects to services/components.
 *  - Every field defaults to a safe empty value so the UI never crashes on missing data.
 *  - HTML fields (title/excerpt/content) are already sanitized by WP; consumers still
 *    render them via ContentRenderer which handles the final escaping.
 */
import type {
  Author, Block, Category, Media, Page, Post, PostSummary, SEO, Tag,
} from "@/types";
import type {
  WPMedia, WPPage, WPPost, WPTerm, WPUser, YoastHeadJSON, RankMathHead,
} from "./types";

const stripTags = (html: string) =>
  html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const decodeEntities = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#039;|&#39;/g, "'");

const readingTime = (html: string) => {
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/* ----------------------------- Media --------------------------------- */

export function mapMedia(m: WPMedia | undefined | null, fallbackAlt = ""): Media {
  if (!m) {
    return { id: "0", url: "", alt: fallbackAlt };
  }
  const sizes = m.media_details?.sizes ?? {};
  return {
    id: String(m.id),
    url: m.source_url,
    alt: m.alt_text || decodeEntities(stripTags(m.title?.rendered ?? "")) || fallbackAlt,
    width: m.media_details?.width,
    height: m.media_details?.height,
    sizes: Object.entries(sizes).map(([label, s]) => ({
      url: s.source_url,
      width: s.width,
      label,
    })),
  };
}

/* ----------------------------- Taxonomies ---------------------------- */

export function mapCategory(t: WPTerm): Category {
  return {
    id: String(t.id),
    slug: t.slug,
    name: decodeEntities(t.name),
    description: t.description || undefined,
    postCount: t.count,
  };
}

export function mapTag(t: WPTerm): Tag {
  return { id: String(t.id), slug: t.slug, name: decodeEntities(t.name) };
}

/* ----------------------------- Author -------------------------------- */

export function mapAuthor(u: WPUser): Author {
  const avatarUrl = u.avatar_urls?.["96"] ?? u.avatar_urls?.["48"] ?? u.avatar_urls?.["24"];
  return {
    id: String(u.id),
    slug: u.slug,
    name: decodeEntities(u.name),
    bio: u.description || undefined,
    role: undefined,
    avatar: avatarUrl
      ? { id: `avatar-${u.id}`, url: avatarUrl, alt: u.name, width: 96, height: 96 }
      : undefined,
    social: u.url ? { site: u.url } : undefined,
  };
}

/* ----------------------------- SEO ----------------------------------- */

export function mapSeo(
  yoast?: YoastHeadJSON,
  rankMath?: RankMathHead,
  fallback?: { title?: string; description?: string },
): SEO | undefined {
  if (yoast) {
    return {
      title: yoast.title ?? yoast.og_title ?? fallback?.title,
      description: yoast.description ?? yoast.og_description ?? fallback?.description,
      canonical: yoast.canonical,
      ogImage: yoast.og_image?.[0]?.url,
      noindex: yoast.robots?.index === "noindex",
    };
  }
  if (rankMath) {
    return {
      title: rankMath.title ?? rankMath.og?.title ?? fallback?.title,
      description: rankMath.description ?? rankMath.og?.description ?? fallback?.description,
      canonical: rankMath.canonical,
      ogImage: rankMath.og?.image,
      noindex: rankMath.robots?.includes("noindex"),
    };
  }
  if (!fallback) return undefined;
  return { title: fallback.title, description: fallback.description };
}

/* ----------------------------- Content Blocks ------------------------ */

/**
 * Minimal WP → Block mapper. WordPress delivers already-rendered HTML by
 * default; we wrap the whole document in a single `richText` block. When the
 * CMS starts exposing Gutenberg block JSON (via `?context=edit` or a plugin),
 * we can extend this to emit typed blocks (`heading`, `image`, `gallery`,
 * `quote`, etc.) without touching consumers.
 */
export function mapContentToBlocks(rawHtml: string): Block[] {
  if (!rawHtml?.trim()) return [];
  return [{ type: "richText", html: rawHtml }];
}

/* ----------------------------- Post ---------------------------------- */

function pickEmbedded(post: WPPost) {
  const embedded = post._embedded ?? {};
  const author = embedded.author?.[0];
  const featured = embedded["wp:featuredmedia"]?.[0];
  const termsGroups = embedded["wp:term"] ?? [];
  const categories: WPTerm[] = [];
  const tags: WPTerm[] = [];
  for (const group of termsGroups) {
    for (const term of group) {
      if (term.taxonomy === "category") categories.push(term);
      else if (term.taxonomy === "post_tag") tags.push(term);
    }
  }
  return { author, featured, categories, tags };
}

export function mapPost(post: WPPost): Post {
  const { author, featured, categories, tags } = pickEmbedded(post);
  const title = decodeEntities(stripTags(post.title.rendered));
  const excerpt = decodeEntities(stripTags(post.excerpt.rendered)).slice(0, 280);
  return {
    id: String(post.id),
    slug: post.slug,
    title,
    excerpt,
    coverImage: mapMedia(featured, title),
    author: author ? mapAuthor(author) : {
      id: String(post.author), slug: `user-${post.author}`, name: "Autor",
    },
    categories: categories.map(mapCategory),
    tags: tags.map(mapTag),
    publishedAt: post.date_gmt ? `${post.date_gmt}Z` : post.date,
    readingTimeMinutes: readingTime(post.content.rendered),
    content: mapContentToBlocks(post.content.rendered),
    seo: mapSeo(post.yoast_head_json, post.rank_math_head, { title, description: excerpt }),
    featured: post.sticky,
  };
}

export function mapPostSummary(post: WPPost): PostSummary {
  const { author, featured, categories } = pickEmbedded(post);
  const title = decodeEntities(stripTags(post.title.rendered));
  const excerpt = decodeEntities(stripTags(post.excerpt.rendered)).slice(0, 220);
  return {
    id: String(post.id),
    slug: post.slug,
    title,
    excerpt,
    coverImage: mapMedia(featured, title),
    author: author
      ? { name: decodeEntities(author.name), slug: author.slug, avatar: mapAuthor(author).avatar }
      : { name: "Autor", slug: `user-${post.author}` },
    categories: categories.map(mapCategory),
    publishedAt: post.date_gmt ? `${post.date_gmt}Z` : post.date,
    readingTimeMinutes: readingTime(post.content?.rendered ?? ""),
    featured: post.sticky,
  };
}

/* ----------------------------- Page ---------------------------------- */

export function mapPage(page: WPPage): Page {
  const title = decodeEntities(stripTags(page.title.rendered));
  const excerpt = decodeEntities(stripTags(page.excerpt?.rendered ?? ""));
  return {
    id: String(page.id),
    slug: page.slug,
    title,
    content: mapContentToBlocks(page.content.rendered),
    seo: mapSeo(page.yoast_head_json, page.rank_math_head, { title, description: excerpt }),
  };
}