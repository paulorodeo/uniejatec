import type { Page } from "@/types";
import type { WordPressClient } from "../client";
import type { WPPage } from "../types";
import { mapPage } from "../mappers";

export interface PagesRepository {
  bySlug(slug: string): Promise<Page | null>;
}

export function createPagesRepository(client: WordPressClient): PagesRepository {
  return {
    async bySlug(slug) {
      const { items } = await client.list<WPPage>("pages", { slug, per_page: 1 });
      return items[0] ? mapPage(items[0]) : null;
    },
  };
}