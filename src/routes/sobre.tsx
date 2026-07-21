import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Monitor,
  Users,
  Target,
  Eye,
  Heart,
  BookOpen,
  Award,
  Layers,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/button";
import { buildSeo } from "@/components/seo/buildSeo";

export const Route = createFileRoute("/sobre")({
  head: () =>
    buildSeo({
      title: "Sobre a UniEjatec — Quem Somos e Nossa Missão",
      description:
        "Conheça a UniEjatec: ecossistema educacional que conecta você às melhores universidades do Brasil com EAD, certificação MEC e tecnologia de ponta.",
      path: "/sobre",
    }),
  component: SobrePage,
});

const ROTATING_PHRASES = [
  "UniEjatec: Oportunidade com o Futuro",
  "UniEjatec: Sua Conexão com o Futuro",
  "UniEjatec: Educação que Transforma",
];

function Typewriter({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[index];
    const done = !deleting && text === current;
    const cleared = deleting && text === "";

    if (done) {
      const t = setTimeout(() => setDeleting(true), 1600);
      return () => clearTimeout(t);
    }
    if (cleared) {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }

    const delay = deleting ? 30 : 55;
    const t = setTimeout(() => {
      setText((prev) =>
        deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
      );
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, phrases]);

  return (
    <span className="inline-flex items-center">
      <span>{text}</span>
      <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-brand" aria-hidden />
    </span>
  );
}

function SobrePage() {
  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Sobre" }]} />

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
                <Sparkles className="h-3.5 w-3.5" /> Quem Somos
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-6xl">
                Capacitação EAD para <span className="text-brand">impulsionar seu futuro.</span>
              </h1>
              <p
                className="mt-6 font-display text-xl font-semibold text-ink md:text-2xl"
                aria-live="polite"
              >
                <Typewriter phrases={ROTATING_PHRASES} />
              </p>
              <p className="mt-6 max-w-2xl text-lg text-ink-muted">
                Somos o ecossistema educacional que conecta você às melhores universidades do
                Brasil, com toda a flexibilidade da educação a distância e a segurança de
                certificação MEC.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <a href="#matricula">
                    Quero minha Bolsa <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline-primary" size="xl">
                  <Link to="/blog">Ler nosso blog</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BEM-VINDO */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
          Bem-vindo à UniEjatec
        </span>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">
          Graduação, pós, técnicos, EJA e capacitações — tudo pensado para transformar sua
          trajetória.
        </h2>
        <p className="mt-6 text-lg text-ink-muted">
          Aqui, você estuda no seu ritmo, com tecnologia moderna e suporte próximo. Sua
          oportunidade de crescer começa agora — com uma plataforma multimarcas que seleciona
          rigorosamente parceiros certificadores para garantir que seu esforço seja recompensado
          com um diploma respeitado pelo MEC.
        </p>
      </section>

      {/* TRANSFORMANDO EDUCAÇÃO */}
      <section className="bg-brand-softer/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
              Transformando Educação em <span className="text-brand">Oportunidade Real</span>
            </h2>
            <p className="mt-4 text-lg text-ink-muted">
              Capacitamos jovens e adultos para conquistar espaço no mercado de trabalho através
              de formação especializada.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                title: "Conteúdo aplicado",
                text: "Formação estruturada, atualizada e com foco na aplicação prática do conhecimento.",
              },
              {
                icon: Target,
                title: "Foco no mercado",
                text: "Nosso compromisso é preparar alunos para oportunidades reais de emprego.",
              },
              {
                icon: Monitor,
                title: "No seu ritmo",
                text: "Estude de onde estiver, conciliando aprendizado com trabalho e família.",
              },
              {
                icon: Heart,
                title: "Impacto real",
                text: "Acreditamos que qualificação muda histórias e fortalece famílias.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl bg-white p-6 ring-1 ring-border/60 transition-shadow hover:shadow-lg"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUE É ESPECIAL */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
            Por que a UniEjatec é <span className="text-brand">especial?</span>
          </h2>
          <p className="mt-4 text-sm text-ink-muted">
            A UniEjatec atua como polo de captação e plataforma de apoio tecnológico. A
            certificação acadêmica é de responsabilidade das instituições parceiras devidamente
            credenciadas ao MEC.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {[
            {
              icon: Sparkles,
              title: "Ambiente Virtual & UX",
              text: "Desde a chegada, o aluno é recebido por uma experiência digital que propõe UX Design e Inteligência Artificial, com aprendizado dinâmico e prático.",
            },
            {
              icon: Monitor,
              title: "Tecnologia e foco no digital",
              text: "Recursos tecnológicos que garantem uma experiência moderna, com qualidade de ensino acessível, flexível e eficiente.",
            },
            {
              icon: Target,
              title: "Metodologia focada em resultados",
              text: "Aplicação prática de resultados: convertemos informações em conhecimento e competências valorizadas no mercado.",
            },
            {
              icon: GraduationCap,
              title: "Compromisso com a educação",
              text: "Democratizamos o acesso ao ensino de qualidade através da tecnologia, conectando alunos às maiores universidades do Brasil.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="flex gap-5 rounded-2xl border border-border/70 bg-white p-6"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
                <p className="mt-2 text-ink-muted">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MVV */}
      <section className="bg-gradient-to-br from-brand to-brand-strong py-20 text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Nossa Tríade
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
              Missão, Visão e Valores
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Target,
                label: "Missão",
                text: "Transformar vidas por meio de uma plataforma educacional acessível, tecnológica e de alta qualidade.",
              },
              {
                icon: Eye,
                label: "Visão",
                text: "Ser o maior hub de educação à distância do país, reconhecido pela agilidade tecnológica e parcerias de renome.",
              },
              {
                icon: Heart,
                label: "Valores",
                text: "Inovação, Transparência, Respeito ao Aluno e Compromisso com a Certificação Oficial.",
              },
            ].map(({ icon: Icon, label, text }) => (
              <div
                key={label}
                className="rounded-2xl bg-white/10 p-8 ring-1 ring-white/20 backdrop-blur"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-extrabold">{label}</h3>
                <p className="mt-3 text-white/90">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODALIDADES / CURSOS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">
            Nosso Portfólio
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">
            Da base ao topo — a formação certa para cada etapa
          </h2>
          <p className="mt-4 text-ink-muted">
            Cursos ideais para quem busca qualificação rápida, trilhas de carreira integradas ou
            retorno aos estudos em qualquer fase da vida. Tudo reconhecido pelo MEC.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Cursos Técnicos",
              text: "Formações profissionalizantes de nível médio em Administração, RH, Logística, Redes, Eletrotécnica, Marketing e mais. A partir de R$ 59,00 com bolsa.",
            },
            {
              title: "Faculdade / Graduação",
              text: "Bacharelados, tecnólogos e licenciaturas em Administração, Pedagogia, Gestão Hospitalar, ADS, Agronegócio, Contabilidade e Design.",
            },
            {
              title: "Graduação EAD",
              text: "Graduações 100% online com plataforma 24h, ideal para quem precisa de flexibilidade total.",
            },
            {
              title: "Pós-graduação",
              text: "Especializações e MBAs lato sensu em diversas áreas, 100% EAD ou semipresencial.",
            },
            {
              title: "EJA / ENCCEJA",
              text: "Educação de Jovens e Adultos para concluir Ensino Fundamental ou Médio, com preparatório ENCCEJA/ENEM.",
            },
            {
              title: "EJATEC",
              text: "Modalidade integrada que combina EJA com formação técnica — conclua o Médio já com uma profissão.",
            },
            {
              title: "Segunda graduação",
              text: "Para quem já tem um diploma e deseja outra formação, com aproveitamento de disciplinas.",
            },
            {
              title: "Formação Pedagógica (R2)",
              text: "Habilitação em docência para graduados não licenciados.",
            },
            {
              title: "Extensão & Cursos Livres",
              text: "Cuidador de Idosos, Mídias Sociais, Inglês, Libras, NRs, Web Master e mais.",
            },
          ].map((c) => (
            <article
              key={c.title}
              className="rounded-2xl border border-border/70 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-soft text-brand">
                <Layers className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{c.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SELOS */}
      <section className="bg-brand-softer/50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, label: "Reconhecimento MEC", sub: "Instituições parceiras credenciadas" },
              { icon: Award, label: "Bolsa Garantida", sub: "Até 50% de desconto" },
              { icon: Users, label: "+15 mil alunos", sub: "Transformando futuros" },
              { icon: GraduationCap, label: "Trilhas integradas", sub: "Da EJA à Pós-graduação" },
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

      {/* CTA final */}
      <section id="matricula" className="mx-auto max-w-7xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-softer via-white to-brand-soft p-10 text-center ring-1 ring-brand/10 md:p-16">
          <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
            Pronto para conhecer todos os detalhes e realizar sua matrícula?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-muted">
            A matrícula acontece na página oficial da UniEjatec, com suporte completo do início ao
            fim da sua jornada.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="xl">
              <a href="https://ejatec.com.br/" target="_blank" rel="noopener noreferrer">
                Ver Página Oficial de Matrícula <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline-primary" size="xl">
              <Link to="/blog">Explorar conteúdos</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}