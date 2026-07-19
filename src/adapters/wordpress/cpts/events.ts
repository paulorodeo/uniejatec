/**
 * Example: Events CPT (e.g. The Events Calendar or a custom `event` type).
 * Only the definition is needed — the generic factory produces the repository.
 */
import type { WPPost } from "../types";
import type { CPTDefinition } from "./generic";
import type { CPTRegistry } from "./registry";

export interface EventSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
}

export const eventDefinition: CPTDefinition<WPPost, EventSummary> = {
  key: "events",
  restBase: "events",
  embed: true,
  mapSummary: (raw) => ({
    id: String(raw.id),
    slug: raw.slug,
    title: raw.title.rendered.replace(/<[^>]*>/g, ""),
    excerpt: raw.excerpt.rendered.replace(/<[^>]*>/g, ""),
    cover: raw._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    startsAt: raw.meta?.["_event_start"] as string | undefined,
    endsAt: raw.meta?.["_event_end"] as string | undefined,
    location: raw.meta?.["_event_location"] as string | undefined,
  }),
};

export const registerEvents = (r: CPTRegistry) => r.register(eventDefinition);