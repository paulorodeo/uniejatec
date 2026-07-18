// Domain models — internal, decoupled from any CMS.

export interface Media {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: { url: string; width: number; label?: string }[];
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  bio?: string;
  avatar?: Media;
  role?: string;
  social?: { twitter?: string; linkedin?: string; instagram?: string; site?: string };
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  color?: string;
  postCount?: number;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface SEO {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

/* -------- Content blocks (discriminated union) -------- */

export type Block =
  | { type: "richText"; html: string }
  | { type: "heading"; level: 2 | 3 | 4; text: string; id?: string }
  | { type: "image"; media: Media; caption?: string }
  | { type: "gallery"; images: Media[] }
  | { type: "video"; provider: "youtube" | "vimeo" | "mp4"; src: string; poster?: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "callout"; tone: "info" | "success" | "warning" | "danger"; title?: string; text: string }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "code"; language?: string; code: string }
  | { type: "cta"; title: string; description?: string; label: string; href: string }
  | { type: "downloads"; items: { label: string; href: string; size?: string }[] }
  | { type: "banner"; media: Media; title: string; description?: string; href?: string }
  | { type: "statistics"; items: { value: string; label: string }[] }
  | { type: "testimonials"; items: { name: string; role?: string; text: string; avatar?: Media }[] }
  | { type: "divider" };

export type BlockType = Block["type"];

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: Media;
  author: Author;
  categories: Category[];
  tags: Tag[];
  publishedAt: string; // ISO
  readingTimeMinutes: number;
  content: Block[];
  seo?: SEO;
  featured?: boolean;
  views?: number;
}

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: Media;
  author: Pick<Author, "name" | "slug" | "avatar">;
  categories: Category[];
  publishedAt: string;
  readingTimeMinutes: number;
  featured?: boolean;
  views?: number;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: Block[];
  seo?: SEO;
}

export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface GlobalSettings {
  institutionName: string;
  tagline?: string;
  logoUrl?: string;
  phones: string[];
  whatsapp?: string;
  address?: string;
  social: { label: string; href: string; icon: "instagram" | "facebook" | "youtube" | "linkedin" | "twitter" }[];
  menus: { header: MenuItem[]; footer: { title: string; items: MenuItem[] }[] };
  seo: Required<Pick<SEO, "title" | "description">> & { ogImage?: string };
  scripts?: { googleAnalyticsId?: string; googleTagManagerId?: string; metaPixelId?: string; chatWidgetSrc?: string };
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FeatureFlags {
  newsletter: boolean;
  comments: boolean;
  chatAI: boolean;
  login: boolean;
  studentArea: boolean;
  landingPages: boolean;
  banner: boolean;
  cta: boolean;
  darkMode: boolean;
}