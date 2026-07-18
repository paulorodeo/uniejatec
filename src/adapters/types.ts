import type {
  Author, Category, GlobalSettings, Page, Paginated, Post, PostSummary, Tag,
} from "@/types";

export interface PostQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  sort?: "recent" | "popular";
}

export interface DataAdapter {
  getSettings(): Promise<GlobalSettings>;
  listPosts(q?: PostQuery): Promise<Paginated<PostSummary>>;
  getPost(slug: string): Promise<Post | null>;
  getFeatured(): Promise<PostSummary[]>;
  getPopular(): Promise<PostSummary[]>;
  listCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | null>;
  getTag(slug: string): Promise<Tag | null>;
  getAuthor(slug: string): Promise<Author | null>;
  search(query: string): Promise<PostSummary[]>;
  getPage(slug: string): Promise<Page | null>;
  relatedPosts(postId: string): Promise<PostSummary[]>;
}