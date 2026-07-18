/**
 * Services layer: the only surface pages/components use to reach data.
 * Each function delegates to the active adapter and returns internal models.
 */
import { adapter } from "@/config/api";
import type { PostQuery } from "@/adapters/types";

export const postsService = {
  list: (q?: PostQuery) => adapter.listPosts(q),
  bySlug: (slug: string) => adapter.getPost(slug),
  featured: () => adapter.getFeatured(),
  popular: () => adapter.getPopular(),
  related: (id: string) => adapter.relatedPosts(id),
};

export const categoriesService = {
  list: () => adapter.listCategories(),
  bySlug: (slug: string) => adapter.getCategory(slug),
};

export const tagsService = {
  bySlug: (slug: string) => adapter.getTag(slug),
};

export const authorsService = {
  bySlug: (slug: string) => adapter.getAuthor(slug),
};

export const searchService = {
  query: (q: string) => adapter.search(q),
};

export const settingsService = {
  get: () => adapter.getSettings(),
};

export const pagesService = {
  bySlug: (slug: string) => adapter.getPage(slug),
};

export const newsletterService = {
  subscribe: async (email: string) => {
    // Placeholder: swap with real endpoint when CMS/forms provider is ready.
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true, email };
  },
};