/**
 * Raw WordPress REST API types (v2). Kept close to the API shape so mappers
 * can be verified against the WP handbook. NEVER export these from services.
 *
 * Reference: https://developer.wordpress.org/rest-api/reference/
 */

export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPMediaSizeDetail {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  type: "attachment";
  link: string;
  title: WPRendered;
  author: number;
  caption: WPRendered;
  alt_text: string;
  media_type: "image" | "file";
  mime_type: string;
  source_url: string;
  media_details: {
    width?: number;
    height?: number;
    file?: string;
    sizes?: Record<string, WPMediaSizeDetail>;
  };
}

export interface WPTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent?: number;
  meta?: unknown;
}

export interface WPUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<"24" | "48" | "96", string>;
  meta?: unknown;
}

/** Common Yoast SEO payload (present when the plugin exposes REST fields). */
export interface YoastHeadJSON {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: Record<string, string>;
  og_title?: string;
  og_description?: string;
  og_image?: { url: string; width?: number; height?: number }[];
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema?: unknown;
}

/** RankMath alternative (kept optional; mapper prefers whichever is present). */
export interface RankMathHead {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string[];
  og?: { title?: string; description?: string; image?: string };
}

export interface WPEmbedded {
  author?: WPUser[];
  "wp:featuredmedia"?: WPMedia[];
  "wp:term"?: WPTerm[][];
}

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  author: number;
  featured_media: number;
  sticky?: boolean;
  categories: number[];
  tags: number[];
  meta?: Record<string, unknown>;
  yoast_head_json?: YoastHeadJSON;
  rank_math_head?: RankMathHead;
  _embedded?: WPEmbedded;
}

export interface WPPage extends Omit<WPPost, "categories" | "tags" | "sticky"> {
  parent: number;
  menu_order: number;
  template: string;
}

/** Menu payload from the WP-REST-API V2 Menus plugin (`/menus/v1/menus/<slug>`). */
export interface WPMenu {
  ID: number;
  name: string;
  slug: string;
  items: WPMenuItem[];
}

export interface WPMenuItem {
  ID: number;
  order: number;
  parent: number;
  title: string;
  url: string;
  attr: string;
  target: string;
  classes: string;
  xfn: string;
  description: string;
  object_id: number;
  object: string;
  object_slug: string;
  type: string;
  type_label: string;
  child_items?: WPMenuItem[];
}

/** Response of `/` root endpoint — site name, description, home url, namespaces. */
export interface WPSiteInfo {
  name: string;
  description: string;
  url: string;
  home: string;
  gmt_offset: string;
  timezone_string: string;
  site_logo?: number;
  site_icon_url?: string;
  namespaces: string[];
}

/** LearnPress raw shapes — kept minimal, extend as CPTs are wired in. */
export interface WPLPCourse extends Omit<WPPost, "categories" | "tags"> {
  course_categories?: number[];
  course_tags?: number[];
}

export interface WPLPLesson extends WPPost {
  parent?: number;
}

export interface WPLPInstructor extends WPUser {
  courses?: number[];
}