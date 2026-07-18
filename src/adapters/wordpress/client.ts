/**
 * WordPress REST API client.
 *
 * Responsibilities:
 *  - Build absolute URLs from a configurable base
 *  - Attach auth headers (public today, Application Password / JWT tomorrow)
 *  - Parse pagination headers (`X-WP-Total`, `X-WP-TotalPages`)
 *  - Normalize errors into a single `WordPressApiError`
 *
 * Purposefully framework-agnostic — no React, no TanStack Query.
 */

export interface WordPressAuth {
  /** HTTP Basic (Application Password): `user:app-password` — base64-encoded here. */
  basic?: { username: string; applicationPassword: string };
  /** Bearer token (JWT Auth plugin) — sent as `Authorization: Bearer <token>`. */
  bearer?: string;
  /** Nonce (only useful inside wp-admin same-origin contexts). */
  nonce?: string;
}

export interface WordPressClientConfig {
  /** Base URL WITHOUT trailing slash, e.g. `https://ejatec.com.br/wp-json`. */
  baseUrl: string;
  /** Default namespace prepended to `path` (e.g. `wp/v2`). */
  defaultNamespace?: string;
  auth?: WordPressAuth;
  /** Extra headers merged into every request. */
  headers?: Record<string, string>;
  /** Aborts requests after this many ms (default 15s). */
  timeoutMs?: number;
  /** Optional fetch impl (SSR / tests). Defaults to global fetch. */
  fetchImpl?: typeof fetch;
}

export interface WordPressQuery {
  [key: string]: string | number | boolean | Array<string | number> | undefined | null;
}

export interface WordPressListResult<T> {
  items: T[];
  total: number;
  totalPages: number;
}

export class WordPressApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly data?: unknown,
  ) {
    super(message);
    this.name = "WordPressApiError";
  }
}

export class WordPressClient {
  constructor(private readonly config: WordPressClientConfig) {
    if (!config.baseUrl) throw new Error("WordPressClient: baseUrl is required");
  }

  /** Update auth at runtime (e.g. after login). */
  setAuth(auth: WordPressAuth | undefined) {
    this.config.auth = auth;
  }

  private buildUrl(path: string, query?: WordPressQuery): string {
    const ns = this.config.defaultNamespace ?? "wp/v2";
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const withNs = /^([a-z0-9-]+\/v\d+)\//i.test(cleanPath) || cleanPath.startsWith("menus/")
      ? cleanPath
      : `${ns}/${cleanPath}`;
    const url = new URL(`${this.config.baseUrl.replace(/\/$/, "")}/${withNs}`);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null || v === "") continue;
        if (Array.isArray(v)) url.searchParams.set(k, v.join(","));
        else url.searchParams.set(k, String(v));
      }
    }
    return url.toString();
  }

  private buildHeaders(extra?: HeadersInit): Headers {
    const h = new Headers(this.config.headers);
    if (extra) new Headers(extra).forEach((v, k) => h.set(k, v));
    const auth = this.config.auth;
    if (auth?.basic) {
      const encoded = typeof btoa === "function"
        ? btoa(`${auth.basic.username}:${auth.basic.applicationPassword}`)
        : Buffer.from(`${auth.basic.username}:${auth.basic.applicationPassword}`).toString("base64");
      h.set("Authorization", `Basic ${encoded}`);
    } else if (auth?.bearer) {
      h.set("Authorization", `Bearer ${auth.bearer}`);
    }
    if (auth?.nonce) h.set("X-WP-Nonce", auth.nonce);
    if (!h.has("Accept")) h.set("Accept", "application/json");
    return h;
  }

  private async request(url: string, init?: RequestInit): Promise<Response> {
    const fetchImpl = this.config.fetchImpl ?? fetch;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs ?? 15_000);
    try {
      const res = await fetchImpl(url, {
        ...init,
        headers: this.buildHeaders(init?.headers),
        signal: controller.signal,
      });
      if (!res.ok) {
        let payload: unknown;
        try { payload = await res.json(); } catch { /* ignore */ }
        const p = payload as { message?: string; code?: string } | undefined;
        throw new WordPressApiError(
          p?.message ?? `WordPress request failed (${res.status})`,
          res.status,
          p?.code,
          payload,
        );
      }
      return res;
    } catch (err) {
      if (err instanceof WordPressApiError) throw err;
      if ((err as Error).name === "AbortError") {
        throw new WordPressApiError("WordPress request timed out", 408);
      }
      throw new WordPressApiError((err as Error).message, 0);
    } finally {
      clearTimeout(timeout);
    }
  }

  /** GET a single resource. */
  async get<T>(path: string, query?: WordPressQuery): Promise<T> {
    const res = await this.request(this.buildUrl(path, query));
    return res.json() as Promise<T>;
  }

  /** GET a paginated list, returning items + totals. */
  async list<T>(path: string, query?: WordPressQuery): Promise<WordPressListResult<T>> {
    const res = await this.request(this.buildUrl(path, query));
    const items = (await res.json()) as T[];
    return {
      items,
      total: Number(res.headers.get("X-WP-Total") ?? items.length),
      totalPages: Number(res.headers.get("X-WP-TotalPages") ?? 1),
    };
  }

  /** POST/PUT/DELETE — placeholder for authenticated mutations. */
  async mutate<T>(path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
    const res = await this.request(this.buildUrl(path), {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return res.json() as Promise<T>;
  }
}