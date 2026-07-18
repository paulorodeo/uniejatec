import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { EmptyState } from "@/components/states/EmptyState";
import { ArticleGridSkeleton } from "@/components/states/Skeleton";
import { searchService } from "@/services";
import { qk } from "@/config/queryKeys";
import { buildSeo } from "@/components/seo/buildSeo";

const searchSchema = z.object({ q: z.string().catch("") });

export const Route = createFileRoute("/busca")({
  validateSearch: zodValidator(searchSchema),
  head: ({ match }) =>
    buildSeo({
      title: `Busca — Blog UniEjatec`,
      description: "Encontre artigos, categorias e temas no blog UniEjatec.",
      path: "/busca",
    }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: qk.search(q),
    queryFn: () => searchService.query(q),
    enabled: q.length > 0,
  });

  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Busca" }]} />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-4xl font-extrabold">Busca</h1>
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            const v = (new FormData(e.currentTarget).get("q") as string) ?? "";
            navigate({ to: ".", search: { q: v } });
          }}
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="O que você está buscando?"
            aria-label="Buscar"
            className="w-full rounded-full border border-border bg-background px-6 py-4 text-lg outline-none focus:border-brand"
          />
        </form>

        <div className="mt-10">
          {!q ? (
            <EmptyState title="Digite algo para buscar" description="Tente por temas como EJA, técnico ou graduação." />
          ) : isLoading ? (
            <ArticleGridSkeleton />
          ) : !data || data.length === 0 ? (
            <EmptyState title={`Nenhum resultado para "${q}"`} />
          ) : (
            <>
              <p className="mb-6 text-sm text-ink-muted">{data.length} resultado(s) para "{q}"</p>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((p) => <ArticleCard key={p.id} post={p} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}