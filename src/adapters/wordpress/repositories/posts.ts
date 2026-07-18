/**
 * PostsRepository — encapsulates every `/wp/v2/posts` interaction.
 * Services depend on the interface, not on the WordPressClient directly, so
 * a future Payload repository replaces this file 1:1.
 */
import type { Paginated, Post, PostSummary } from "@/types";
import type { WordPressClient } from "../client";
import type { WPPost } from "../types";
import { mapPost, mapPostSummary } from "../mappers";

export interface PostListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  categoryIds?: number[];
  tagIds?: number[];
  authorIds?: number[];
  orderby?: "date" | "modified" | "title" | "menu_order" | "id" | "relevance";
  order?: "asc" | "desc";
  sticky?: boolean;
  include?: number[];
  exclude?: number[];
}

export interface PostsRepository {
  list(params?: PostListParams): Promise<Paginated<PostSummary>>;
  bySlug(slug: string): Promise<Post | null>;
  byId(id: number): Promise<Post | null>;
  featured(limit?: number): Promise<PostSummary[]>;
  popular(limit?: number): Promise<PostSummary[]>;
  related(postId: number, categoryIds: number[], limit?: number): Promise<PostSummary[]>;
  search(query: string, limit?: number): Promise<PostSummary[]>;
}

const EMBED = { _embed: 1 };

export function createPostsRepository(
  client: WordPressClient,
  deps: {
    resolveCategoryIdBySlug: (slug: string) => Promise<number | null>;
    resolveTagIdBySlug: (slug: string) => Promise<number | null>;
    resolveAuthorIdBySlug: (slug: string) => Promise<number | null>;
  },
): PostsRepository {
  async function list(params: PostListParams = {}): Promise<Paginated<PostSummary>> {
    const page = params.page ?? 1;
    const per_page = params.pageSize ?? 9;

    const [catId, tagId, authorId] = await Promise.all([
      params.categorySlug ? deps.resolveCategoryIdBySlug(params.categorySlug) : Promise.resolve(null),
      params.tagSlug ? deps.resolveTagIdBySlug(params.tagSlug) : Promise.resolve(null),
      params.authorSlug ? deps.resolveAuthorIdBySlug(params.authorSlug) : Promise.resolve(null),
    ]);

    const categories = [...(params.categoryIds ?? []), ...(catId != null ? [catId] : [])];
    const tags = [...(params.tagIds ?? []), ...(tagId != null ? [tagId] : [])];
    const author = [...(params.authorIds ?? []), ...(authorId != null ? [authorId] : [])];

    const { items, total, totalPages } = await client.list<WPPost>("posts", {
      ...EMBED,
      page,
      per_page,
      search: params.search,
      orderby: params.orderby ?? (params.search ? "relevance" : "date"),
      order: params.order ?? "desc",
      sticky: params.sticky,
      categories: categories.length ? categories : undefined,
      tags: tags.length ? tags : undefined,
      author: author.length ? author : undefined,
      include: params.include?.length ? params.include : undefined,
      exclude: params.exclude?.length ? params.exclude : undefined,
    });

    return {
      items: items.map(mapPostSummary),
      page,
      pageSize: per_page,
      total,
      totalPages: Math.max(1, totalPages),
    };
  }

  async function bySlug(slug: string): Promise<Post | null> {
    const { items } = await client.list<WPPost>("posts", { slug, ...EMBED });
    return items[0] ? mapPost(items[0]) : null;
  }

  async function byId(id: number): Promise<Post | null> {
    try {
      const post = await client.get<WPPost>(`posts/${id}`, EMBED);
      return mapPost(post);
    } catch {
      return null;
    }
  }

  async function featured(limit = 4): Promise<PostSummary[]> {
    const { items } = await client.list<WPPost>("posts", { ...EMBED, sticky: true, per_page: limit });
    if (items.length) return items.map(mapPostSummary);
    const fallback = await client.list<WPPost>("posts", { ...EMBED, per_page: limit });
    return fallback.items.map(mapPostSummary);
  }

  async function popular(limit = 5): Promise<PostSummary[]> {
    // WP core has no view counter — placeholder = latest by date.
    // Swap here once a stats plugin (WPP etc.) exposes an endpoint.
    const { items } = await client.list<WPPost>("posts", {
      ...EMBED, per_page: limit, orderby: "date", order: "desc",
    });
    return items.map(mapPostSummary);
  }

  async function related(postId: number, categoryIds: number[], limit = 3): Promise<PostSummary[]> {
    if (!categoryIds.length) return [];
    const { items } = await client.list<WPPost>("posts", {
      ...EMBED, per_page: limit, categories: categoryIds, exclude: [postId],
    });
    return items.map(mapPostSummary);
  }

  async function search(query: string, limit = 8): Promise<PostSummary[]> {
    if (!query.trim()) return [];
    const { items } = await client.list<WPPost>("posts", {
      ...EMBED, search: query, per_page: limit, orderby: "relevance",
    });
    return items.map(mapPostSummary);
  }

  return { list, bySlug, byId, featured, popular, related, search };
}