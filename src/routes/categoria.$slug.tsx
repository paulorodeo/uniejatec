import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { EmptyState } from "@/components/states/EmptyState";
import { categoriesService, postsService } from "@/services";
import { qk } from "@/config/queryKeys";
import { buildSeo } from "@/components/seo/buildSeo";

export const Route = createFileRoute("/categoria/$slug")({
  loader: async ({ params, context }) => {
    const cat = await context.queryClient.ensureQueryData({
      queryKey: qk.category(params.slug),
      queryFn: () => categoriesService.bySlug(params.slug),
    });
    if (!cat) throw notFound();
    await context.queryClient.ensureQueryData({
      queryKey: qk.posts({ category: params.slug, pageSize: 24 }),
      queryFn: () => postsService.list({ category: params.slug, pageSize: 24 }),
    });
    return cat;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Categoria não encontrada" }, { name: "robots", content: "noindex" }] };
    return buildSeo({
      title: `${loaderData.name} — Blog UniEjatec`,
      description: loaderData.description ?? `Artigos sobre ${loaderData.name}.`,
      path: `/categoria/${params.slug}`,
    });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: cat } = useSuspenseQuery({ queryKey: qk.category(slug), queryFn: () => categoriesService.bySlug(slug) });
  const { data } = useSuspenseQuery({
    queryKey: qk.posts({ category: slug, pageSize: 24 }),
    queryFn: () => postsService.list({ category: slug, pageSize: 24 }),
  });
  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: cat!.name }]} />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-4xl font-extrabold">{cat!.name}</h1>
        {cat!.description && <p className="mt-2 text-ink-muted">{cat!.description}</p>}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.length === 0 ? (
            <div className="col-span-full"><EmptyState /></div>
          ) : (
            data.items.map((p) => <ArticleCard key={p.id} post={p} />)
          )}
        </div>
      </section>
    </SiteLayout>
  );
}