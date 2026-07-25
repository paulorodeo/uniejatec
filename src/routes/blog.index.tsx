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
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import heroStudent from "@/assets/hero-student.jpg";
import { whatsappUrl } from "@/lib/contact";

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

      {/* HERO — instantâneo, independente da REST API */}
      <section className="relative flex min-h-[calc(100vh-8rem)] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 pt-6 md:pt-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-softer via-white to-brand-soft p-8 ring-1 ring-brand/10 md:p-14">
            <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/15">
                  <Sparkles className="h-3.5 w-3.5" /> Blog UniEjatec
                </span>
                <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-6xl">
                  Conteúdo que <span className="text-brand">acelera</span> sua jornada.
                </h1>
                <p className="mt-5 max-w-xl text-lg text-ink-muted">
                  Artigos práticos sobre EJA, cursos técnicos, graduação e pós — atualizados toda semana.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild variant="hero" size="xl">
                    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                      Peça sua Bolsa <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline-primary" size="xl">
                    <Link to="/cursos">Ver cursos</Link>
                  </Button>
                </div>
              </div>
              <div className="relative hidden aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-brand/10 shadow-2xl shadow-brand/20 lg:block">
                <img
                  src={heroStudent}
                  alt="Estudante UniEjatec"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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