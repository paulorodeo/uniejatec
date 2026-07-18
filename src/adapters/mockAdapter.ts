import type { DataAdapter, PostQuery } from "./types";
import type { Post, PostSummary } from "@/types";
import { fixtures } from "./mockFixtures";

const toSummary = (p: Post): PostSummary => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  coverImage: p.coverImage,
  author: { name: p.author.name, slug: p.author.slug, avatar: p.author.avatar },
  categories: p.categories,
  publishedAt: p.publishedAt,
  readingTimeMinutes: p.readingTimeMinutes,
  featured: p.featured,
  views: p.views,
});

const delay = <T,>(v: T, ms = 40) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export const mockAdapter: DataAdapter = {
  async getSettings() {
    return delay(fixtures.settings);
  },
  async listPosts(q: PostQuery = {}) {
    const { page = 1, pageSize = 9, category, tag, author, search, sort = "recent" } = q;
    let items = [...fixtures.posts];
    if (category) items = items.filter((p) => p.categories.some((c) => c.slug === category));
    if (tag) items = items.filter((p) => p.tags.some((t) => t.slug === tag));
    if (author) items = items.filter((p) => p.author.slug === author);
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (p) => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s),
      );
    }
    items.sort((a, b) =>
      sort === "popular"
        ? (b.views ?? 0) - (a.views ?? 0)
        : +new Date(b.publishedAt) - +new Date(a.publishedAt),
    );
    const total = items.length;
    const start = (page - 1) * pageSize;
    return delay({
      items: items.slice(start, start + pageSize).map(toSummary),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  },
  async getPost(slug) {
    return delay(fixtures.posts.find((p) => p.slug === slug) ?? null);
  },
  async getFeatured() {
    return delay(fixtures.posts.filter((p) => p.featured).slice(0, 4).map(toSummary));
  },
  async getPopular() {
    return delay(
      [...fixtures.posts].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5).map(toSummary),
    );
  },
  async listCategories() {
    return delay(
      fixtures.categories.map((c) => ({
        ...c,
        postCount: fixtures.posts.filter((p) => p.categories.some((x) => x.slug === c.slug)).length,
      })),
    );
  },
  async getCategory(slug) {
    return delay(fixtures.categories.find((c) => c.slug === slug) ?? null);
  },
  async getTag(slug) {
    return delay(fixtures.tags.find((t) => t.slug === slug) ?? null);
  },
  async getAuthor(slug) {
    return delay(fixtures.authors.find((a) => a.slug === slug) ?? null);
  },
  async search(query) {
    const s = query.trim().toLowerCase();
    if (!s) return delay([]);
    return delay(
      fixtures.posts
        .filter((p) => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s))
        .slice(0, 8)
        .map(toSummary),
    );
  },
  async getPage(slug) {
    return delay(fixtures.pages.find((p) => p.slug === slug) ?? null);
  },
  async relatedPosts(postId) {
    const src = fixtures.posts.find((p) => p.id === postId);
    if (!src) return delay([]);
    const cats = new Set(src.categories.map((c) => c.slug));
    return delay(
      fixtures.posts
        .filter((p) => p.id !== postId && p.categories.some((c) => cats.has(c.slug)))
        .slice(0, 3)
        .map(toSummary),
    );
  },
};