import { Link } from "@tanstack/react-router";
import type { Category } from "@/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to="/categoria/$slug"
      params={{ slug: category.slug }}
      className="group flex flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-lg"
    >
      <span className="mb-3 inline-block h-2 w-10 rounded-full" style={{ backgroundColor: category.color ?? "var(--color-brand)" }} />
      <h3 className="font-display text-xl font-bold text-ink group-hover:text-brand">{category.name}</h3>
      <p className="mt-1 text-sm text-ink-muted">{category.postCount ?? 0} artigos</p>
    </Link>
  );
}