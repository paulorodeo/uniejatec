/**
 * CPT registry — central place to plug new Custom Post Types.
 *
 * Adding a CPT requires only:
 *   1. Declare a `CPTDefinition` in a dedicated file (see `events.ts`).
 *   2. Register it here via `registerCPT(client, definition)`.
 *   3. Consume the returned repository from services/components.
 *
 * No changes to the DataAdapter, client, or core wiring are required.
 */
import type { WordPressClient } from "../client";
import { createCPTRepository, type CPTDefinition, type CPTRepository } from "./generic";

export class CPTRegistry {
  private readonly repos = new Map<string, CPTRepository<unknown, unknown>>();

  constructor(private readonly client: WordPressClient) {}

  /** Register a CPT and return its typed repository. */
  register<TRaw, TSummary, TDetail = TSummary>(
    def: CPTDefinition<TRaw, TSummary, TDetail>,
  ): CPTRepository<TSummary, TDetail> {
    const repo = createCPTRepository(this.client, def);
    this.repos.set(def.key, repo as unknown as CPTRepository<unknown, unknown>);
    return repo;
  }

  /** Look up a previously-registered CPT by key. */
  get<TSummary, TDetail = TSummary>(key: string): CPTRepository<TSummary, TDetail> | undefined {
    return this.repos.get(key) as CPTRepository<TSummary, TDetail> | undefined;
  }

  keys(): string[] {
    return Array.from(this.repos.keys());
  }
}

export function createCPTRegistry(client: WordPressClient): CPTRegistry {
  return new CPTRegistry(client);
}