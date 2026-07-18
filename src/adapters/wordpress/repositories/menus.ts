/**
 * MenusRepository — targets the WP-REST-API V2 Menus plugin
 * (`/menus/v1/menus/<slug>`). Returns null when unavailable; callers fall
 * back to the mock/configured menu structure.
 */
import type { MenuItem } from "@/types";
import type { WordPressClient } from "../client";
import type { WPMenu, WPMenuItem } from "../types";

export interface MenusRepository {
  bySlug(slug: string): Promise<MenuItem[] | null>;
}

function toMenuItem(i: WPMenuItem): MenuItem {
  return {
    label: i.title,
    href: i.url,
    children: i.child_items?.length ? i.child_items.map(toMenuItem) : undefined,
  };
}

export function createMenusRepository(client: WordPressClient): MenusRepository {
  return {
    async bySlug(slug) {
      try {
        const menu = await client.get<WPMenu>(`menus/v1/menus/${slug}`);
        return menu.items.map(toMenuItem);
      } catch { return null; }
    },
  };
}