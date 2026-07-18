import { FileSearch } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title = "Nada por aqui ainda",
  description = "Assim que houver conteúdo novo, ele aparece nesta seção.",
  icon,
  action,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-brand-softer py-16 text-center">
      <div className="mb-4 rounded-full bg-brand-soft p-4 text-brand">
        {icon ?? <FileSearch className="h-6 w-6" />}
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}