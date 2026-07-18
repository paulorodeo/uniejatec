/**
 * Categories & Tags repositories.
 * Includes a slug→id cache — filtering /posts requires numeric term ids.
 */
import type { Category, Tag } from "@/types";
import type { WordPressClient } from "../client";
import type { WPTerm } from "../types";
import { mapCategory, mapTag } from "../mappers";

export interface CategoriesRepository {
  list(): Promise<Category[]>;
  bySlug(slug: string): Promise<Category | null>;
  idBySlug(slug: string): Promise<number | null>;
}

export interface TagsRepository {
  bySlug(slug: string): Promise<Tag | null>;
  idBySlug(slug: string): Promise<number | null>;
}

export function createCategoriesRepository(client: WordPressClient): CategoriesRepository {
  const cache = new Map<string, WPTerm>();
  async function fetchBySlug(slug: string) {
    const cached = cache.get(slug);
    if (cached) return cached;
    const { items } = await client.list<WPTerm>("categories", { slug, per_page: 1 });
    const term = items[0];
    if (term) cache.set(slug, term);
    return term ?? null;
  }
  return {
    async list() {
      const { items } = await client.list<WPTerm>("categories", { per_page: 100, hide_empty: true });
      items.forEach((t) => cache.set(t.slug, t));
      return items.map(mapCategory);
    },
    async bySlug(slug) { const t = await fetchBySlug(slug); return t ? mapCategory(t) : null; },
    async idBySlug(slug) { const t = await fetchBySlug(slug); return t ? t.id : null; },
  };
}

export function createTagsRepository(client: WordPressClient): TagsRepository {
  const cache = new Map<string, WPTerm>();
  async function fetchBySlug(slug: string) {
    const cached = cache.get(slug);
    if (cached) return cached;
    const { items } = await client.list<WPTerm>("tags", { slug, per_page: 1 });
    const term = items[0];
    if (term) cache.set(slug, term);
    return term ?? null;
  }
  return {
    async bySlug(slug) { const t = await fetchBySlug(slug); return t ? mapTag(t) : null; },
    async idBySlug(slug) { const t = await fetchBySlug(slug); return t ? t.id : null; },
  };
}