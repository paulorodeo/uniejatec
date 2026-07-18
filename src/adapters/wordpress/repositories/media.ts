import type { Media } from "@/types";
import type { WordPressClient } from "../client";
import type { WPMedia } from "../types";
import { mapMedia } from "../mappers";

export interface MediaRepository {
  byId(id: number): Promise<Media | null>;
  byIds(ids: number[]): Promise<Media[]>;
}

export function createMediaRepository(client: WordPressClient): MediaRepository {
  return {
    async byId(id) {
      try { return mapMedia(await client.get<WPMedia>(`media/${id}`)); } catch { return null; }
    },
    async byIds(ids) {
      if (!ids.length) return [];
      const { items } = await client.list<WPMedia>("media", { include: ids, per_page: ids.length });
      return items.map((m) => mapMedia(m));
    },
  };
}