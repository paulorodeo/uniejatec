/**
 * LearnPress CPT stubs.
 *
 * When the site enables the LearnPress REST endpoints (namespace `lp/v1`),
 * replace `notImpl` with real client calls. The DataAdapter interface stays
 * intact — only these repositories change.
 *
 * Endpoint reference (LearnPress ≥ 4):
 *   GET /wp-json/wp/v2/lp_course
 *   GET /wp-json/wp/v2/lp_lesson
 *   GET /wp-json/lp/v1/courses
 *   GET /wp-json/lp/v1/courses/{id}
 *   GET /wp-json/lp/v1/courses/{id}/curriculum
 *   GET /wp-json/lp/v1/instructors
 *   GET /wp-json/lp/v1/users/{id}/course
 */
import type { Paginated } from "@/types";
import type { WordPressClient } from "../client";

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

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: "enrolled" | "in-progress" | "completed" | "cancelled";
  progressPercent: number;
  enrolledAt: string;
}

export interface LearnPressRepository {
  listCourses(params?: { page?: number; pageSize?: number; search?: string }): Promise<Paginated<CourseSummary>>;
  courseBySlug(slug: string): Promise<CourseSummary | null>;
  courseCurriculum(courseId: string): Promise<Lesson[]>;
  listInstructors(): Promise<Instructor[]>;
  userEnrollments(userId: string): Promise<Enrollment[]>;
}

/** Not implemented yet — enable when LearnPress REST endpoints are live. */
export function createLearnPressRepository(_client: WordPressClient): LearnPressRepository {
  const notImpl = (name: string) => async (): Promise<never> => {
    throw new Error(`LearnPressRepository.${name} not implemented yet`);
  };
  return {
    listCourses: notImpl("listCourses") as never,
    courseBySlug: notImpl("courseBySlug") as never,
    courseCurriculum: notImpl("courseCurriculum") as never,
    listInstructors: notImpl("listInstructors") as never,
    userEnrollments: notImpl("userEnrollments") as never,
  };
}