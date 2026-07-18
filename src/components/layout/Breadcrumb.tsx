import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Breadcrumb as Crumb } from "@/types";

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <div className="bg-brand-softer">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-3 text-sm text-ink-muted"
      >
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <span key={i} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link to={c.href} className="hover:text-brand">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? "font-medium text-ink" : ""}>{c.label}</span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5" />}
            </span>
          );
        })}
      </nav>
    </div>
  );
}