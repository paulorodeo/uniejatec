import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { pagesService } from "@/services";
import { qk } from "@/config/queryKeys";
import { buildSeo, mergeSeo } from "@/components/seo/buildSeo";

export const Route = createFileRoute("/pagina/$slug")({
  loader: async ({ params, context }) => {
    const page = await context.queryClient.ensureQueryData({
      queryKey: qk.page(params.slug),
      queryFn: () => pagesService.bySlug(params.slug),
    });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Página não encontrada" }, { name: "robots", content: "noindex" }] };
    const seo = mergeSeo(loaderData.seo, { title: loaderData.title, description: loaderData.title });
    return buildSeo({ title: seo.title, description: seo.description, path: `/pagina/${params.slug}` });
  },
  component: PagePage,
});

function PagePage() {
  const { slug } = Route.useParams();
  const { data: page } = useSuspenseQuery({ queryKey: qk.page(slug), queryFn: () => pagesService.bySlug(slug) });
  if (!page) return null;
  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: page.title }]} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl font-extrabold">{page.title}</h1>
        <div className="mt-8">
          <ContentRenderer blocks={page.content} />
        </div>
      </article>
    </SiteLayout>
  );
}