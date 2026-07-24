import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Monitor, GraduationCap, Award, Users } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CategoryCard } from "@/components/blog/CategoryCard";
import { Newsletter } from "@/components/blog/Newsletter";
import { Button } from "@/components/ui/button";
import { categoriesService, postsService } from "@/services";
import { qk } from "@/config/queryKeys";
import { buildSeo } from "@/components/seo/buildSeo";
import { whatsappUrl } from "@/lib/contact";
import heroStudent from "@/assets/hero-student.jpg";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // Only block on hero-critical data. Everything else prefetches without blocking navigation.
    void context.queryClient.prefetchQuery({ queryKey: qk.categories, queryFn: categoriesService.list });
    void context.queryClient.prefetchQuery({ queryKey: qk.popular, queryFn: postsService.popular });
    void context.queryClient.prefetchQuery({
      queryKey: qk.posts({ page: 1, pageSize: 6 }),
      queryFn: () => postsService.list({ page: 1, pageSize: 6 }),
    });
    await context.queryClient.ensureQueryData({ queryKey: qk.featured, queryFn: postsService.featured });
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
  const latest = useQuery({
    queryKey: qk.posts({ page: 1, pageSize: 6 }),
    queryFn: () => postsService.list({ page: 1, pageSize: 6 }),
  });
  const categories = useQuery({ queryKey: qk.categories, queryFn: categoriesService.list, placeholderData: [] });
  const popular = useQuery({ queryKey: qk.popular, queryFn: postsService.popular, placeholderData: [] });

  const hero = featured.data[0];

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-8 md:pt-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-softer via-white to-brand-soft ring-1 ring-brand/10">
            <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-6 lg:p-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center"
              >
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/15">
                  <Sparkles className="h-3.5 w-3.5" /> Blog UniEjatec
                </span>
                <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-5xl lg:text-6xl">
                  Educação que
                  <br />
                  <span className="text-brand">transforma</span> sua carreira.
                </h1>
                <p className="mt-5 max-w-xl text-lg text-ink-muted">
                  Conteúdo prático sobre EJA, cursos técnicos, graduação e pós — com bolsa de estudos e certificação reconhecida pelo MEC.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild variant="hero" size="xl">
                    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                      Peça sua Bolsa de Estudos <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline-primary" size="xl">
                    <Link to="/blog">Ver todos os artigos</Link>
                  </Button>
                </div>
                <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
                  {[
                    { icon: ShieldCheck, label: "Reconhecido", sub: "pelo MEC" },
                    { icon: Monitor, label: "EAD", sub: "Flexível" },
                    { icon: GraduationCap, label: "Bolsa de", sub: "Estudos" },
                    { icon: Award, label: "Certificação", sub: "Garantida" },
                  ].map(({ icon: Icon, label, sub }) => (
                    <li key={label} className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-brand ring-1 ring-brand/15">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="leading-tight text-ink">
                        <span className="block font-semibold">{label}</span>
                        <span className="block text-ink-muted">{sub}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-brand/10 shadow-2xl shadow-brand/20 lg:aspect-[5/6]">
                  <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand/30 via-transparent to-transparent" aria-hidden />
                  <img
                    src={heroStudent}
                    alt="Estudante da UniEjatec estudando em um laptop"
                    width={1280}
                    height={1024}
                    className="relative h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -left-4 top-8 hidden h-32 w-32 rounded-full bg-brand/20 blur-2xl lg:block" aria-hidden />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute right-4 top-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand">
                    <Users className="h-5 w-5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-display text-lg font-bold text-ink">+15 mil</span>
                    <span className="block text-xs text-ink-muted">alunos transformando<br />seus futuros</span>
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {hero && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">Destaques</span>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold">Artigos em destaque</h2>
                <p className="mt-2 text-ink-muted">Conteúdos selecionados para impulsionar seus estudos e carreira.</p>
              </div>
              <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                Ver todos os artigos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
            <div className="lg:col-span-2 lg:row-span-2">
              <ArticleCard post={hero} variant="featured" />
            </div>
            {featured.data.slice(1, 3).map((p) => (
              <div key={p.id} className="lg:col-span-1">
                <ArticleCard post={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold">Explore por tema</h2>
            <p className="mt-2 text-ink-muted">Encontre conteúdo relevante para a sua etapa de formação.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories.data ?? []).slice(0, 6).map((c) => (
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
          {(latest.data?.items ?? []).map((p) => (
            <ArticleCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-8 font-display text-3xl font-bold">Mais lidos</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(popular.data ?? []).slice(0, 3).map((p) => (
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