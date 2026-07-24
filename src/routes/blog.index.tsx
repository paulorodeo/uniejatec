import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArticleGridSkeleton } from "@/components/states/Skeleton";
import { EmptyState } from "@/components/states/EmptyState";
import { Pagination } from "@/components/blog/Pagination";
import { postsService } from "@/services";
import { qk } from "@/config/queryKeys";
import { buildSeo } from "@/components/seo/buildSeo";

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1).optional(),
  sort: z.enum(["recent", "popular"]).catch("recent").optional(),
});

export const Route = createFileRoute("/blog/")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({ page: search.page, sort: search.sort }),
  loader: async ({ context, deps }) => {
    void context.queryClient.prefetchQuery({
      queryKey: qk.posts({ page: deps.page, sort: deps.sort, pageSize: 9 }),
      queryFn: () => postsService.list({ page: deps.page, sort: deps.sort, pageSize: 9 }),
    });
  },
  head: () =>
    buildSeo({
      title: "Todos os artigos — Blog UniEjatec",
      description: "Explore todos os artigos do blog UniEjatec sobre educação, carreira e bolsas de estudos.",
      path: "/blog",
    }),
  component: BlogListPage,
});

function BlogListPage() {
  const search = Route.useSearch();
  const page = search.page ?? 1;
  const sort = search.sort ?? "recent";
  const navigate = Route.useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: qk.posts({ page, sort, pageSize: 9 }),
    queryFn: () => postsService.list({ page, sort, pageSize: 9 }),
  });

  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-extrabold">Todos os artigos</h1>
            <p className="mt-2 text-ink-muted">Conteúdo novo toda semana.</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-ink-muted">Ordenar:</span>
            <select
              value={sort}
              onChange={(e) => {
                const value = e.target.value as "recent" | "popular";
                navigate({ to: ".", search: { page: 1, sort: value } });
              }}
              className="rounded-md border border-border bg-background px-3 py-2"
            >
              <option value="recent">Mais recentes</option>
              <option value="popular">Mais lidos</option>
            </select>
          </div>
        </header>

        {isLoading ? (
          <ArticleGridSkeleton />
        ) : !data || data.items.length === 0 ? (
          <EmptyState title="Nenhum artigo encontrado" />
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p) => <ArticleCard key={p.id} post={p} />)}
            </div>
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onChange={(p: number) => navigate({ to: ".", search: { page: p, sort } })}
            />
          </>
        )}
      </section>
    </SiteLayout>
  );
}