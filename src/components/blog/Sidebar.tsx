import { useQuery } from "@tanstack/react-query";
import { categoriesService, postsService } from "@/services";
import { qk } from "@/config/queryKeys";
import { Link } from "@tanstack/react-router";
import { ArticleCard } from "./ArticleCard";
import { Newsletter } from "./Newsletter";
import { Skeleton } from "@/components/states/Skeleton";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const cats = useQuery({ queryKey: qk.categories, queryFn: categoriesService.list });
  const popular = useQuery({ queryKey: qk.popular, queryFn: postsService.popular });

  return (
    <aside className="space-y-8">
      <section className="rounded-2xl border border-border bg-background p-6">
        <h3 className="mb-4 font-display text-lg font-bold">Categorias</h3>
        {cats.isLoading ? (
          <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8" />)}</div>
        ) : (
          <ul className="space-y-1">
            {cats.data?.map((c) => (
              <li key={c.id}>
                <Link to="/categoria/$slug" params={{ slug: c.slug }} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-brand-softer hover:text-brand">
                  <span>{c.name}</span>
                  <span className="text-xs text-ink-muted">{c.postCount}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-background p-6">
        <h3 className="mb-4 font-display text-lg font-bold">Mais lidos</h3>
        {popular.isLoading ? (
          <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : (
          <div className="space-y-4">
            {popular.data?.map((p) => <ArticleCard key={p.id} post={p} variant="compact" />)}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-brand p-6 text-brand-foreground">
        <h3 className="font-display text-xl font-bold">Peça sua Bolsa</h3>
        <p className="mt-2 text-sm opacity-90">Descubra em 2 minutos quanto você pode economizar na sua formação.</p>
        <Button asChild variant="hero" className="mt-4 w-full bg-background text-brand hover:bg-background">
          <Link to="/pagina/$slug" params={{ slug: "bolsa" }}>Peça sua Bolsa</Link>
        </Button>
      </section>

      <Newsletter compact />
    </aside>
  );
}