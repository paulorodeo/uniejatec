import type { WPPost } from "../types";
import type { CPTDefinition } from "./generic";
import type { CPTRegistry } from "./registry";

export interface DownloadItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileSize?: string;
  mimeType?: string;
  cover?: string;
}

export const downloadDefinition: CPTDefinition<WPPost, DownloadItem> = {
  key: "downloads",
  restBase: "downloads",
  embed: true,
  mapSummary: (raw) => ({
    id: String(raw.id),
    slug: raw.slug,
    title: raw.title.rendered.replace(/<[^>]*>/g, ""),
    description: raw.excerpt.rendered.replace(/<[^>]*>/g, ""),
    fileUrl: raw.meta?.["_file_url"] as string | undefined,
    fileSize: raw.meta?.["_file_size"] as string | undefined,
    mimeType: raw.meta?.["_file_mime"] as string | undefined,
    cover: raw._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  }),
};

export const registerDownloads = (r: CPTRegistry) => r.register(downloadDefinition);