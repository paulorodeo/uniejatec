import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CategoryCard } from "@/components/blog/CategoryCard";
import { Newsletter } from "@/components/blog/Newsletter";
import { Button } from "@/components/ui/button";
import { categoriesService, postsService } from "@/services";
import { qk } from "@/config/queryKeys";
import { buildSeo } from "@/components/seo/buildSeo";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData({ queryKey: qk.featured, queryFn: postsService.featured }),
      context.queryClient.ensureQueryData({
        queryKey: qk.posts({ page: 1, pageSize: 6 }),
        queryFn: () => postsService.list({ page: 1, pageSize: 6 }),
      }),
      context.queryClient.ensureQueryData({ queryKey: qk.categories, queryFn: categoriesService.list }),
      context.queryClient.ensureQueryData({ queryKey: qk.popular, queryFn: postsService.popular }),
    ]);
  },
  head: () =>
    buildSeo({
      title: "Blog UniEjatec — Educação, Carreira e Bolsa de Estudos",
      description:
        "Artigos sobre EJA, graduação, cursos técnicos, pós-graduação e como conquistar sua bolsa de estudos com a UniEjatec.",
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  const featured = useSuspenseQuery({ queryKey: qk.featured, queryFn: postsService.featured });
  const latest = useSuspenseQuery({
    queryKey: qk.posts({ page: 1, pageSize: 6 }),
    queryFn: () => postsService.list({ page: 1, pageSize: 6 }),
  });
  const categories = useSuspenseQuery({ queryKey: qk.categories, queryFn: categoriesService.list });
  const popular = useSuspenseQuery({ queryKey: qk.popular, queryFn: postsService.popular });

  const hero = featured.data[0];
  const secondary = featured.data.slice(1, 4);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pt-10 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            <Sparkles className="h-3 w-3" /> Blog UniEjatec
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-ink md:text-6xl">
            Educação que <span className="text-brand">transforma</span> sua carreira.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted">
            Conteúdo prático sobre EJA, cursos técnicos, graduação e pós — com bolsa de estudos e certificação reconhecida pelo MEC.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/pagina/$slug" params={{ slug: "bolsa" }}>
                Peça sua Bolsa <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline-primary" size="xl">
              <Link to="/blog">Ver artigos</Link>
            </Button>
          </div>
        </motion.div>

        {hero && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ArticleCard post={hero} variant="featured" />
            </div>
            <div className="grid gap-6">
              {secondary.map((p) => (
                <ArticleCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold">Explore por tema</h2>
            <p className="mt-2 text-ink-muted">Encontre conteúdo relevante para a sua etapa de formação.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.data.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold">Últimos artigos</h2>
            <p className="mt-2 text-ink-muted">Publicações recentes do blog.</p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/blog">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latest.data.items.map((p) => (
            <ArticleCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-8 font-display text-3xl font-bold">Mais lidos</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {popular.data.slice(0, 3).map((p) => (
            <ArticleCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <Newsletter />
      </section>
    </SiteLayout>
  );
}