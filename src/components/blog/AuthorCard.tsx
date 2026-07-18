import type { Author } from "@/types";
import { Link } from "@tanstack/react-router";

export function AuthorCard({ author }: { author: Author }) {
  return (
    <Link to="/autor/$slug" params={{ slug: author.slug }} className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-brand">
      {author.avatar && (
        <img src={author.avatar.url} alt={author.name} className="h-14 w-14 rounded-full object-cover" />
      )}
      <div>
        <p className="font-semibold text-ink">{author.name}</p>
        {author.role && <p className="text-xs text-ink-muted">{author.role}</p>}
      </div>
    </Link>
  );
}