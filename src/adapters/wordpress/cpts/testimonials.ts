import type { WPPost } from "../types";
import type { CPTDefinition } from "./generic";
import type { CPTRegistry } from "./registry";

export interface Testimonial {
  id: string;
  slug: string;
  author: string;
  role?: string;
  text: string;
  avatarUrl?: string;
  rating?: number;
}

export const testimonialDefinition: CPTDefinition<WPPost, Testimonial> = {
  key: "testimonials",
  restBase: "testimonials",
  embed: true,
  mapSummary: (raw) => ({
    id: String(raw.id),
    slug: raw.slug,
    author: raw.title.rendered.replace(/<[^>]*>/g, ""),
    role: raw.meta?.["_role"] as string | undefined,
    text: raw.content.rendered.replace(/<[^>]*>/g, ""),
    avatarUrl: raw._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    rating: raw.meta?.["_rating"] as number | undefined,
  }),
};

export const registerTestimonials = (r: CPTRegistry) => r.register(testimonialDefinition);