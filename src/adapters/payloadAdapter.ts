/**
 * STUB — implement when Payload CMS is available.
 * Wire in via `src/config/api.ts`: export const adapter = payloadAdapter;
 */
import type { DataAdapter } from "./types";

const notImpl = () => {
  throw new Error("payloadAdapter not implemented yet");
};

export const payloadAdapter: DataAdapter = {
  getSettings: notImpl as never,
  listPosts: notImpl as never,
  getPost: notImpl as never,
  getFeatured: notImpl as never,
  getPopular: notImpl as never,
  listCategories: notImpl as never,
  getCategory: notImpl as never,
  getTag: notImpl as never,
  getAuthor: notImpl as never,
  search: notImpl as never,
  getPage: notImpl as never,
  relatedPosts: notImpl as never,
};