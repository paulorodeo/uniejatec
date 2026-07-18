import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Sidebar } from "@/components/blog/Sidebar";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Tag } from "@/components/blog/Tag";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { postsService } from "@/services";
import { qk } from "@/config/queryKeys";
import { formatDate, formatReadingTime } from "@/utils/format";
import { Clock } from "lucide-react";
import { buildSeo, mergeSeo } from "@/components/seo/buildSeo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.ensureQueryData({
      queryKey: qk.post(params.slug),
      queryFn: () => postsService.bySlug(params.slug),
    });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Artigo não encontrado" }, { name: "robots", content: "noindex" }] };
    }
    const seo = mergeSeo(loaderData.seo, { title: loaderData.title, description: loaderData.excerpt });
    const path = `/blog/${params.slug}`;
    return buildSeo({
      title: seo.title,
      description: seo.description,
      path,
      ogImage: loaderData.coverImage.url,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: loaderData.title,
          image: [loaderData.coverImage.url],
          datePublished: loaderData.publishedAt,
          author: [{ "@type": "Person", name: loaderData.author.name }],
          publisher: { "@type": "Organization", name: "UniEjatec" },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
            { "@type": "ListItem", position: 3, name: loaderData.title, item: path },
          ],
        },
      ],
    });
  },
  component: ArticlePage,
  notFoundComponent: ArticleNotFound,
});

function ArticleNotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Artigo não encontrado</h1>
        <p className="mt-2 text-ink-muted">O conteúdo que você procura pode ter sido movido ou removido.</p>
        <Link to="/blog" className="mt-6 inline-block text-brand underline">Ver todos os artigos</Link>
      </div>
    </SiteLayout>
  );
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery({
    queryKey: qk.post(slug),
    queryFn: () => postsService.bySlug(slug),
  });
  const related = useQuery({
    queryKey: qk.related(post!.id),
    queryFn: () => postsService.related(post!.id),
  });

  if (!post) return null;

  return (
    <SiteLayout>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.categories[0]?.name ?? "Artigo", href: post.categories[0] ? `/categoria/${post.categories[0].slug}` : undefined },
          { label: post.title },
        ]}
      />

      <article className="mx-auto max-w-7xl px-4 py-10">
        <header className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {post.categories.map((c) => (
              <Link key={c.id} to="/categoria/$slug" params={{ slug: c.slug }} className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                {c.name}
              </Link>
            ))}
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-ink-muted">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
            <Link to="/autor/$slug" params={{ slug: post.author.slug }} className="flex items-center gap-2">
              {post.author.avatar && <img src={post.author.avatar.url} alt={post.author.name} className="h-8 w-8 rounded-full object-cover" />}
              <span className="font-medium text-ink">{post.author.name}</span>
            </Link>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatReadingTime(post.readingTimeMinutes)}</span>
          </div>
        </header>

        <figure className="mx-auto mt-10 max-w-5xl">
          <img src={post.coverImage.url} alt={post.coverImage.alt} loading="lazy" className="aspect-[16/9] w-full rounded-3xl object-cover" />
        </figure>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="mx-auto w-full">
            <ContentRenderer blocks={post.content} />

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              {post.tags.map((t) => <Tag key={t.id} tag={t} />)}
            </div>

            <div className="mt-8">
              <ShareButtons title={post.title} />
            </div>

            <section className="mt-14 rounded-3xl border border-border bg-brand-softer p-6">
              <div className="flex items-start gap-4">
                {post.author.avatar && <img src={post.author.avatar.url} alt={post.author.name} className="h-16 w-16 rounded-full object-cover" />}
                <div>
                  <p className="text-sm uppercase tracking-wide text-ink-muted">Escrito por</p>
                  <h3 className="font-display text-lg font-bold">{post.author.name}</h3>
                  {post.author.bio && <p className="mt-1 text-sm text-ink-muted">{post.author.bio}</p>}
                </div>
              </div>
            </section>

            <section className="mt-14">
              <h2 className="mb-6 font-display text-2xl font-bold">Comentários</h2>
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-ink-muted">
                Comentários em breve.
              </div>
            </section>
          </div>

          <Sidebar />
        </div>

        {related.data && related.data.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-display text-2xl font-bold">Continue lendo</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.data.map((p) => <ArticleCard key={p.id} post={p} />)}
            </div>
          </section>
        )}
      </article>
    </SiteLayout>
  );
}