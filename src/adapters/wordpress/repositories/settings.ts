import type { WordPressClient } from "../client";
import type { WPSiteInfo } from "../types";

export interface SiteInfo {
  name: string;
  description: string;
  url: string;
  home: string;
  logoUrl?: string;
  namespaces: string[];
}

export interface SettingsRepository {
  info(): Promise<SiteInfo | null>;
}

export function createSettingsRepository(client: WordPressClient): SettingsRepository {
  return {
    async info() {
      try {
        // Root discovery endpoint — lives OUTSIDE any namespace.
        const raw = await client.get<WPSiteInfo>("/");
        return {
          name: raw.name,
          description: raw.description,
          url: raw.url,
          home: raw.home,
          logoUrl: raw.site_icon_url,
          namespaces: raw.namespaces ?? [],
        };
      } catch { return null; }
    },
  };
}