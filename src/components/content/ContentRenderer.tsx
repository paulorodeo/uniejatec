import type { Block } from "@/types";
import { blockRegistry } from "./blocks";

export function ContentRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-article">
      {blocks.map((b, i) => {
        const Comp = blockRegistry[b.type];
        if (!Comp) return null;
        return <Comp key={i} b={b} />;
      })}
    </div>
  );
}