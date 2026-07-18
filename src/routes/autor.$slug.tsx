import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { EmptyState } from "@/components/states/EmptyState";
import { authorsService, postsService } from "@/services";
import { qk } from "@/config/queryKeys";
import { buildSeo } from "@/components/seo/buildSeo";
import { Linkedin, Instagram, Globe } from "lucide-react";

export const Route = createFileRoute("/autor/$slug")({
  loader: async ({ params, context }) => {
    const author = await context.queryClient.ensureQueryData({
      queryKey: qk.author(params.slug),
      queryFn: () => authorsService.bySlug(params.slug),
    });
    if (!author) throw notFound();
    await context.queryClient.ensureQueryData({
      queryKey: qk.posts({ author: params.slug, pageSize: 24 }),
      queryFn: () => postsService.list({ author: params.slug, pageSize: 24 }),
    });
    return author;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Autor não encontrado" }, { name: "robots", content: "noindex" }] };
    return buildSeo({
      title: `${loaderData.name} — Autor no Blog UniEjatec`,
      description: loaderData.bio ?? `Artigos de ${loaderData.name}.`,
      path: `/autor/${params.slug}`,
      ogImage: loaderData.avatar?.url,
    });
  },
  component: AuthorPage,
});

function AuthorPage() {
  const { slug } = Route.useParams();
  const { data: author } = useSuspenseQuery({ queryKey: qk.author(slug), queryFn: () => authorsService.bySlug(slug) });
  const { data } = useSuspenseQuery({
    queryKey: qk.posts({ author: slug, pageSize: 24 }),
    queryFn: () => postsService.list({ author: slug, pageSize: 24 }),
  });
  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: author!.name }]} />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-brand-softer p-8 md:flex-row md:items-center">
          {author!.avatar && <img src={author!.avatar.url} alt={author!.name} className="h-24 w-24 rounded-full object-cover" />}
          <div className="flex-1">
            <h1 className="font-display text-3xl font-extrabold">{author!.name}</h1>
            {author!.role && <p className="text-sm text-brand">{author!.role}</p>}
            {author!.bio && <p className="mt-3 max-w-2xl text-ink-muted">{author!.bio}</p>}
            {author!.social && (
              <div className="mt-4 flex gap-2">
                {author!.social.linkedin && <a href={author!.social.linkedin} className="rounded-full border border-border p-2 hover:border-brand"><Linkedin className="h-4 w-4" /></a>}
                {author!.social.instagram && <a href={author!.social.instagram} className="rounded-full border border-border p-2 hover:border-brand"><Instagram className="h-4 w-4" /></a>}
                {author!.social.site && <a href={author!.social.site} className="rounded-full border border-border p-2 hover:border-brand"><Globe className="h-4 w-4" /></a>}
              </div>
            )}
          </div>
        </div>
        <h2 className="mt-12 mb-6 font-display text-2xl font-bold">Artigos de {author!.name}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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