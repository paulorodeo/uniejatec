import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { EmptyState } from "@/components/states/EmptyState";
import { postsService, tagsService } from "@/services";
import { qk } from "@/config/queryKeys";
import { buildSeo } from "@/components/seo/buildSeo";

export const Route = createFileRoute("/tag/$slug")({
  loader: async ({ params, context }) => {
    const tag = await context.queryClient.ensureQueryData({ queryKey: qk.tag(params.slug), queryFn: () => tagsService.bySlug(params.slug) });
    if (!tag) throw notFound();
    await context.queryClient.ensureQueryData({
      queryKey: qk.posts({ tag: params.slug, pageSize: 24 }),
      queryFn: () => postsService.list({ tag: params.slug, pageSize: 24 }),
    });
    return tag;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Tag não encontrada" }, { name: "robots", content: "noindex" }] };
    return buildSeo({
      title: `#${loaderData.name} — Blog UniEjatec`,
      description: `Artigos marcados com #${loaderData.name}.`,
      path: `/tag/${params.slug}`,
    });
  },
  component: TagPage,
});

function TagPage() {
  const { slug } = Route.useParams();
  const { data: tag } = useSuspenseQuery({ queryKey: qk.tag(slug), queryFn: () => tagsService.bySlug(slug) });
  const { data } = useSuspenseQuery({
    queryKey: qk.posts({ tag: slug, pageSize: 24 }),
    queryFn: () => postsService.list({ tag: slug, pageSize: 24 }),
  });
  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: `#${tag!.name}` }]} />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-4xl font-extrabold">#{tag!.name}</h1>
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