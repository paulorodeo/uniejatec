/**
 * WordPress adapter — composes repositories into the DataAdapter contract.
 *
 * Settings/menus fall back to the mock provider until the site exposes them
 * (WP core has no first-class Global Settings; a menus plugin or ACF Options
 * page is the usual bridge). That keeps the UI shell live while backend
 * pieces are enabled one at a time.
 */
import type { DataAdapter, PostQuery } from "../types";
import type { GlobalSettings, MenuItem } from "@/types";
import { mockAdapter } from "../mockAdapter";
import { WordPressClient, type WordPressAuth } from "./client";
import { createPostsRepository } from "./repositories/posts";
import { createCategoriesRepository, createTagsRepository } from "./repositories/taxonomies";
import { createAuthorsRepository } from "./repositories/authors";
import { createMediaRepository } from "./repositories/media";
import { createPagesRepository } from "./repositories/pages";
import { createMenusRepository } from "./repositories/menus";
import { createSettingsRepository } from "./repositories/settings";
import { createCPTRegistry, type CPTRegistry } from "./cpts/registry";
import { registerLearnPress } from "./cpts/learnpress";
import { registerEvents } from "./cpts/events";
import { registerTestimonials } from "./cpts/testimonials";
import { registerDownloads } from "./cpts/downloads";

export interface WordPressAdapterOptions {
  baseUrl: string;
  auth?: WordPressAuth;
  /** Optional slugs of WP menus to hydrate for header/footer. */
  menuSlugs?: { header?: string; footer?: string };
  /**
   * Hook to register additional Custom Post Types on the shared registry.
   * Kept optional so the core adapter has zero knowledge of specific CPTs.
   */
  registerCPTs?: (registry: CPTRegistry) => void;
}

export function createWordPressAdapter(opts: WordPressAdapterOptions) {
  const client = new WordPressClient({
    baseUrl: opts.baseUrl,
    defaultNamespace: "wp/v2",
    auth: opts.auth,
  });

  const categoriesRepo = createCategoriesRepository(client);
  const tagsRepo = createTagsRepository(client);
  const authorsRepo = createAuthorsRepository(client);
  const mediaRepo = createMediaRepository(client);
  const pagesRepo = createPagesRepository(client);
  const menusRepo = createMenusRepository(client);
  const settingsRepo = createSettingsRepository(client);

  // Generic CPT registry — the only place plugins/CPTs plug into the adapter.
  const cpts = createCPTRegistry(client);
  const learnpress = registerLearnPress(cpts);
  const events = registerEvents(cpts);
  const testimonials = registerTestimonials(cpts);
  const downloads = registerDownloads(cpts);
  opts.registerCPTs?.(cpts);

  const postsRepo = createPostsRepository(client, {
    resolveCategoryIdBySlug: (slug) => categoriesRepo.idBySlug(slug),
    resolveTagIdBySlug: (slug) => tagsRepo.idBySlug(slug),
    resolveAuthorIdBySlug: (slug) => authorsRepo.idBySlug(slug),
  });

  const adapter: DataAdapter = {
    async getSettings(): Promise<GlobalSettings> {
      const mock = await mockAdapter.getSettings();
      const [info, headerMenu] = await Promise.all([
        settingsRepo.info(),
        opts.menuSlugs?.header
          ? menusRepo.bySlug(opts.menuSlugs.header)
          : Promise.resolve<MenuItem[] | null>(null),
      ]);
      return {
        ...mock,
        // Force short brand name — WP returns "UniEjatec EAD - EJATEC Faculdades"
        // which is too long for the header/logo.
        institutionName: "UniEjatec",
        tagline: info?.description ?? mock.tagline,
        logoUrl: info?.logoUrl ?? mock.logoUrl,
        menus: {
          header: headerMenu ?? mock.menus.header,
          footer: mock.menus.footer, // grouped-column footer stays configured locally
        },
        seo: {
          title: mock.seo.title,
          description: info?.description ?? mock.seo.description,
          ogImage: mock.seo.ogImage,
        },
      };
    },

    listPosts: (q: PostQuery = {}) =>
      postsRepo.list({
        page: q.page,
        pageSize: q.pageSize,
        search: q.search,
        categorySlug: q.category,
        tagSlug: q.tag,
        authorSlug: q.author,
        orderby: "date",
        order: "desc",
      }),

    getPost: (slug) => postsRepo.bySlug(slug),
    getFeatured: () => postsRepo.featured(4),
    getPopular: () => postsRepo.popular(5),
    listCategories: () => categoriesRepo.list(),
    getCategory: (slug) => categoriesRepo.bySlug(slug),
    getTag: (slug) => tagsRepo.bySlug(slug),
    getAuthor: (slug) => authorsRepo.bySlug(slug),
    search: (q) => postsRepo.search(q, 8),
    getPage: (slug) => pagesRepo.bySlug(slug),

    async relatedPosts(postId) {
      const numericId = Number(postId);
      if (Number.isNaN(numericId)) return [];
      const post = await postsRepo.byId(numericId);
      if (!post) return [];
      const catIds = post.categories.map((c) => Number(c.id)).filter((n) => !Number.isNaN(n));
      return postsRepo.related(numericId, catIds, 3);
    },
  };

  return {
    adapter,
    client,
    repositories: {
      posts: postsRepo,
      categories: categoriesRepo,
      tags: tagsRepo,
      authors: authorsRepo,
      media: mediaRepo,
      pages: pagesRepo,
      menus: menusRepo,
      settings: settingsRepo,
      cpts,
      learnpress,
      events,
      testimonials,
      downloads,
    },
  };
}

export { WordPressClient, WordPressApiError } from "./client";
export type { WordPressAuth, WordPressClientConfig } from "./client";