import type { Page } from "@/types";
import { WordPressApiError, type WordPressClient } from "../client";
import type { WPPage } from "../types";
import { mapPage } from "../mappers";

export interface PagesRepository {
  bySlug(slug: string): Promise<Page | null>;
}

export function createPagesRepository(client: WordPressClient): PagesRepository {
  return {
    async bySlug(slug) {
      try {
        const { items } = await client.list<WPPage>("pages", { slug, per_page: 1 });
        return items[0] ? mapPage(items[0]) : null;
      } catch (err) {
        // The site may restrict /wp/v2/pages (401/403) or the slug may not exist (404).
        // Treat any of those as "no page" so the route can render a friendly 404.
        if (err instanceof WordPressApiError && [401, 403, 404].includes(err.status)) {
          return null;
        }
        throw err;
      }
    },
  };
}