import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Briefcase,
  Wrench,
  Layers,
  Award,
  ShieldCheck,
  Monitor,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/button";
import { buildSeo } from "@/components/seo/buildSeo";
import { COURSES_URL, whatsappUrl } from "@/lib/contact";

export const Route = createFileRoute("/cursos")({
  head: () =>
    buildSeo({
      title: "Cursos UniEjatec — Técnicos, Graduação, Pós e EJA EAD",
      description:
        "Conheça os cursos da UniEjatec: técnicos, graduação, pós-graduação, EJA e cursos livres — 100% EAD, com bolsa de estudos e certificação MEC.",
      path: "/cursos",
    }),
  component: CursosPage,
});

const MODALIDADES = [
  {
    icon: Wrench,
    title: "Cursos Técnicos",
    text: "Formação profissionalizante de nível médio em Administração, RH, Logística, Redes, Segurança do Trabalho, Enfermagem e mais.",
    badge: "A partir de R$ 59/mês",
  },
  {
    icon: GraduationCap,
    title: "Graduação EAD",
    text: "Bacharelados, licenciaturas e tecnólogos 100% online com plataforma 24h e polos parceiros em todo o Brasil.",
    badge: "Reconhecida pelo MEC",
  },
  {
    icon: Award,
    title: "Pós-graduação",
    text: "Especializações e MBAs lato sensu em diversas áreas, com metodologia aplicada ao mercado.",
    badge: "MBA & Lato Sensu",
  },
  {
    icon: BookOpen,
    title: "EJA / ENCCEJA",
    text: "Conclua o Ensino Fundamental ou Médio no seu ritmo, com preparatório para ENCCEJA e ENEM.",
    badge: "Certificado oficial",
  },
  {
    icon: Layers,
    title: "EJATEC (EJA + Técnico)",
    text: "Modalidade integrada: conclua o Ensino Médio já saindo com uma profissão técnica.",
    badge: "2 diplomas",
  },
  {
    icon: Briefcase,
    title: "Extensão & Cursos Livres",
    text: "Cuidador de Idosos, Mídias Sociais, Inglês, Libras, NRs, Web Master e outras qualificações rápidas.",
    badge: "Curta duração",
  },
];

function CursosPage() {
  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cursos" }]} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-10 md:pt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-softer via-white to-brand-soft p-8 ring-1 ring-brand/10 md:p-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/15">
                <GraduationCap className="h-3.5 w-3.5" /> Nossos Cursos
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-6xl">
                A formação certa para{" "}
                <span className="text-brand">cada etapa da sua vida.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-ink-muted">
                Da conclusão do Ensino Médio à pós-graduação, oferecemos cursos EAD
                reconhecidos pelo MEC, com bolsa de estudos e suporte próximo do início ao
                fim da sua jornada.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <a href={COURSES_URL} target="_blank" rel="noopener noreferrer">
                    Ver todos os cursos <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline-primary" size="xl">
                  <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                    Falar com um consultor
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MODALIDADES */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Modalidades
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">
              Escolha o formato ideal para você
            </h2>
          </div>
          <Link
            to="/sobre"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            Conheça a UniEjatec <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODALIDADES.map(({ icon: Icon, title, text, badge }) => (
            <article
              key={title}
              className="group flex flex-col rounded-2xl border border-border/70 bg-white p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-brand-softer px-2.5 py-1 text-[11px] font-semibold text-brand">
                  {badge}
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-muted">{text}</p>
              <a
                href={COURSES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
              >
                Ver detalhes <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-brand-softer/50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, label: "Reconhecido pelo MEC", sub: "Diploma válido em todo o Brasil" },
              { icon: Monitor, label: "100% EAD", sub: "Plataforma disponível 24h" },
              { icon: Award, label: "Bolsa de Estudos", sub: "Descontos exclusivos" },
              { icon: GraduationCap, label: "Suporte próximo", sub: "Tutoria e coordenação dedicadas" },
            ].map(({ icon: Icon, label, sub }) => (
              <li
                key={label}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-border/60"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-brand-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="leading-tight">
                  <span className="block font-display font-bold text-ink">{label}</span>
                  <span className="block text-sm text-ink-muted">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-softer via-white to-brand-soft p-10 text-center ring-1 ring-brand/10 md:p-16">
          <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
            Pronto para começar sua matrícula?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-muted">
            Fale com um consultor pelo WhatsApp ou acesse a lista oficial completa de cursos
            no site institucional.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="xl">
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                Quero minha Bolsa <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline-primary" size="xl">
              <a href={COURSES_URL} target="_blank" rel="noopener noreferrer">
                Ver todos os cursos <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}