/**
 * Central API configuration.
 * Today: mock adapter. Tomorrow: swap to payloadAdapter — one line change.
 */
import { mockAdapter } from "@/adapters/mockAdapter";
import type { DataAdapter } from "@/adapters/types";

export const API_URL = import.meta.env.VITE_API_URL ?? "";
export const adapter: DataAdapter = mockAdapter;