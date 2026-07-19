/**
 * LearnPress CPT — declared as ordinary CPT definitions.
 *
 * Endpoints (LearnPress ≥ 4):
 *   /wp/v2/lp_course, /wp/v2/lp_lesson
 *   /lp/v1/courses, /lp/v1/courses/{id}/curriculum, /lp/v1/instructors
 *
 * The repositories are produced by the generic CPT factory; only mappers and
 * type shapes live here. Enable them by calling `registerLearnPress(registry)`.
 */
import type { WPPost, WPUser } from "../types";
import type { CPTDefinition } from "./generic";
import type { CPTRegistry } from "./registry";

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  instructorName?: string;
  durationMinutes?: number;
  lessonsCount?: number;
  studentsCount?: number;
  price?: { amount: number; currency: string; free: boolean };
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  courseId: string;
  durationMinutes?: number;
  order: number;
}

export interface Instructor {
  id: string;
  slug: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  coursesCount?: number;
}

/* ---------------------------- Definitions ---------------------------- */

export const courseDefinition: CPTDefinition<WPPost, CourseSummary> = {
  key: "lp_course",
  restBase: "lp_course",
  embed: true,
  mapSummary: (raw) => ({
    id: String(raw.id),
    slug: raw.slug,
    title: raw.title.rendered.replace(/<[^>]*>/g, ""),
    excerpt: raw.excerpt.rendered.replace(/<[^>]*>/g, ""),
    cover: raw._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  }),
};

export const lessonDefinition: CPTDefinition<WPPost, Lesson> = {
  key: "lp_lesson",
  restBase: "lp_lesson",
  mapSummary: (raw) => ({
    id: String(raw.id),
    slug: raw.slug,
    title: raw.title.rendered.replace(/<[^>]*>/g, ""),
    courseId: String(raw.meta?.["_lp_course"] ?? ""),
    order: Number(raw.meta?.["_order"] ?? 0),
  }),
};

export const instructorDefinition: CPTDefinition<WPUser, Instructor> = {
  key: "lp_instructor",
  namespace: "lp/v1",
  restBase: "instructors",
  mapSummary: (raw) => ({
    id: String(raw.id),
    slug: raw.slug,
    name: raw.name,
    bio: raw.description,
    avatarUrl: raw.avatar_urls?.["96"],
  }),
};

/** Register every LearnPress CPT at once and return the typed repositories. */
export function registerLearnPress(registry: CPTRegistry) {
  return {
    courses: registry.register(courseDefinition),
    lessons: registry.register(lessonDefinition),
    instructors: registry.register(instructorDefinition),
  };
}