import type { Author } from "@/types";
import type { WordPressClient } from "../client";
import type { WPUser } from "../types";
import { mapAuthor } from "../mappers";

export interface AuthorsRepository {
  bySlug(slug: string): Promise<Author | null>;
  byId(id: number): Promise<Author | null>;
  idBySlug(slug: string): Promise<number | null>;
  list(): Promise<Author[]>;
}

export function createAuthorsRepository(client: WordPressClient): AuthorsRepository {
  const cache = new Map<string, WPUser>();
  async function fetchBySlug(slug: string) {
    const cached = cache.get(slug);
    if (cached) return cached;
    const { items } = await client.list<WPUser>("users", { slug, per_page: 1 });
    const user = items[0];
    if (user) cache.set(slug, user);
    return user ?? null;
  }
  return {
    async list() {
      const { items } = await client.list<WPUser>("users", { per_page: 100, who: "authors" });
      items.forEach((u) => cache.set(u.slug, u));
      return items.map(mapAuthor);
    },
    async bySlug(slug) { const u = await fetchBySlug(slug); return u ? mapAuthor(u) : null; },
    async byId(id) {
      try { return mapAuthor(await client.get<WPUser>(`users/${id}`)); } catch { return null; }
    },
    async idBySlug(slug) { const u = await fetchBySlug(slug); return u ? u.id : null; },
  };
}