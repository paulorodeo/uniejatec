/**
 * Generic CPT infrastructure.
 *
 * Any WordPress Custom Post Type — first-party or third-party plugin — can be
 * consumed through this file. Each CPT is described by a `CPTDefinition`
 * (namespace, REST base, mappers to internal DTOs) and turned into a fully
 * typed `CPTRepository` by `createCPTRepository`. The rest of the app depends
 * only on the repository interface, so swapping WordPress for Payload later
 * means providing another repository with the same shape.
 */
import type { Paginated } from "@/types";
import type { WordPressClient, WordPressQuery } from "../client";

export interface CPTDefinition<TRaw, TSummary, TDetail = TSummary> {
  /** Stable key used to look the CPT up from the registry (e.g. "events"). */
  key: string;
  /** REST namespace, defaults to `wp/v2`. Use `lp/v1`, `tribe/events/v1`, etc. */
  namespace?: string;
  /** Route segment relative to the namespace, e.g. `lp_course`, `events`. */
  restBase: string;
  /** Enable `_embed` in list/detail queries. Most WP CPTs benefit from it. */
  embed?: boolean;
  /** Extra query params merged into every list/detail request. */
  defaultQuery?: WordPressQuery;
  /** Map a raw REST object to the summary shape used in listings. */
  mapSummary: (raw: TRaw) => TSummary;
  /** Map a raw REST object to the full-detail shape. Falls back to summary. */
  mapDetail?: (raw: TRaw) => TDetail;
}

export interface CPTListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  include?: number[];
  exclude?: number[];
  orderby?: string;
  order?: "asc" | "desc";
  /** Free-form filters (taxonomy IDs, meta_query, plugin-specific keys). */
  extra?: WordPressQuery;
}

export interface CPTRepository<TSummary, TDetail = TSummary> {
  readonly key: string;
  readonly restBase: string;
  list(params?: CPTListParams): Promise<Paginated<TSummary>>;
  bySlug(slug: string): Promise<TDetail | null>;
  byId(id: number | string): Promise<TDetail | null>;
}

/** Build a repository for any CPT. All CPT-specific code lives in the definition. */
export function createCPTRepository<TRaw, TSummary, TDetail = TSummary>(
  client: WordPressClient,
  def: CPTDefinition<TRaw, TSummary, TDetail>,
): CPTRepository<TSummary, TDetail> {
  const path = def.namespace ? `${def.namespace}/${def.restBase}` : def.restBase;
  const embedQuery = def.embed ? { _embed: 1 } : {};
  const mapDetail = def.mapDetail ?? ((raw: TRaw) => def.mapSummary(raw) as unknown as TDetail);

  return {
    key: def.key,
    restBase: def.restBase,

    async list(params: CPTListParams = {}) {
      const page = params.page ?? 1;
      const per_page = params.pageSize ?? 12;
      const { items, total, totalPages } = await client.list<TRaw>(path, {
        ...def.defaultQuery,
        ...embedQuery,
        page,
        per_page,
        search: params.search,
        orderby: params.orderby,
        order: params.order,
        include: params.include?.length ? params.include : undefined,
        exclude: params.exclude?.length ? params.exclude : undefined,
        ...params.extra,
      });
      return {
        items: items.map(def.mapSummary),
        page,
        pageSize: per_page,
        total,
        totalPages: Math.max(1, totalPages),
      };
    },

    async bySlug(slug) {
      const { items } = await client.list<TRaw>(path, {
        ...def.defaultQuery,
        ...embedQuery,
        slug,
        per_page: 1,
      });
      return items[0] ? mapDetail(items[0]) : null;
    },

    async byId(id) {
      try {
        const raw = await client.get<TRaw>(`${path}/${id}`, {
          ...def.defaultQuery,
          ...embedQuery,
        });
        return mapDetail(raw);
      } catch {
        return null;
      }
    },
  };
}