/**
 * Central API configuration.
 *
 * Data source is picked at build time by `VITE_DATA_SOURCE`:
 *   - `wordpress` (default): real WordPress REST API
 *   - `mock`:               local fixtures (offline / demo)
 *   - `payload`:            reserved for the future Payload CMS migration
 *
 * Swapping backends is a one-line change here — no component ever imports
 * an adapter directly; they call services which delegate to `adapter`.
 */
import { mockAdapter } from "@/adapters/mockAdapter";
import { payloadAdapter } from "@/adapters/payloadAdapter";
import { createWordPressAdapter } from "@/adapters/wordpress";
import type { DataAdapter } from "@/adapters/types";

type DataSource = "mock" | "wordpress" | "payload";

const DEFAULT_WP_BASE_URL = "https://ejatec.com.br/wp-json";

export const API_URL: string =
  (import.meta.env.VITE_WP_API_URL as string | undefined) ??
  (import.meta.env.VITE_API_URL as string | undefined) ??
  DEFAULT_WP_BASE_URL;

const SOURCE: DataSource =
  (import.meta.env.VITE_DATA_SOURCE as DataSource | undefined) ?? "wordpress";

function pickAdapter(source: DataSource): DataAdapter {
  switch (source) {
    case "mock":
      return mockAdapter;
    case "payload":
      return payloadAdapter;
    case "wordpress":
    default:
      return createWordPressAdapter({
        baseUrl: API_URL,
        menuSlugs: {
          header: import.meta.env.VITE_WP_HEADER_MENU as string | undefined,
          footer: import.meta.env.VITE_WP_FOOTER_MENU as string | undefined,
        },
      }).adapter;
  }
}

export const adapter: DataAdapter = pickAdapter(SOURCE);