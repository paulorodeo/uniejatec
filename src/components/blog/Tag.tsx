import { Link } from "@tanstack/react-router";
import type { Tag as TagType } from "@/types";

export function Tag({ tag }: { tag: TagType }) {
  return (
    <Link
      to="/tag/$slug"
      params={{ slug: tag.slug }}
      className="inline-flex items-center rounded-full border border-border bg-brand-softer px-3 py-1 text-xs font-medium text-ink hover:border-brand hover:text-brand"
    >
      #{tag.name}
    </Link>
  );
}