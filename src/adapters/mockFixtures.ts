import type { Author, Category, GlobalSettings, Media, Page, Post, Tag } from "@/types";

const img = (id: string, seed: string, alt: string): Media => ({
  id,
  url: `https://images.unsplash.com/${seed}?w=1600&q=80&auto=format&fit=crop`,
  alt,
  width: 1600,
  height: 900,
  sizes: [
    { url: `https://images.unsplash.com/${seed}?w=640&q=75&auto=format&fit=crop`, width: 640, label: "sm" },
    { url: `https://images.unsplash.com/${seed}?w=1024&q=80&auto=format&fit=crop`, width: 1024, label: "md" },
    { url: `https://images.unsplash.com/${seed}?w=1600&q=80&auto=format&fit=crop`, width: 1600, label: "lg" },
  ],
});

const avatar = (id: string, seed: string, alt: string): Media => ({
  id,
  url: `https://i.pravatar.cc/160?img=${seed}`,
  alt,
  width: 160,
  height: 160,
});

const categories: Category[] = [
  { id: "c1", slug: "educacao-publica", name: "Educação Pública", color: "#2458FF" },
  { id: "c2", slug: "eja", name: "EJA", color: "#0EA5E9" },
  { id: "c3", slug: "graduacao", name: "Graduação", color: "#7C3AED" },
  { id: "c4", slug: "cursos-tecnicos", name: "Cursos Técnicos", color: "#059669" },
  { id: "c5", slug: "carreira", name: "Carreira", color: "#DC2626" },
  { id: "c6", slug: "bolsa-de-estudos", name: "Bolsa de Estudos", color: "#F59E0B" },
  { id: "c7", slug: "tecnologia", name: "Tecnologia", color: "#0891B2" },
];

const tags: Tag[] = [
  { id: "t1", slug: "mec", name: "MEC" },
  { id: "t2", slug: "ead", name: "EAD" },
  { id: "t3", slug: "enem", name: "ENEM" },
  { id: "t4", slug: "mercado-de-trabalho", name: "Mercado de Trabalho" },
  { id: "t5", slug: "certificacao", name: "Certificação" },
  { id: "t6", slug: "dicas-de-estudo", name: "Dicas de Estudo" },
];

const authors: Author[] = [
  {
    id: "a1", slug: "ana-ribeiro", name: "Ana Ribeiro", role: "Coordenadora Pedagógica",
    bio: "Especialista em educação a distância com mais de 12 anos de experiência em EJA e cursos técnicos.",
    avatar: avatar("av1", "47", "Ana Ribeiro"),
    social: { linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
  },
  {
    id: "a2", slug: "carlos-mendes", name: "Carlos Mendes", role: "Editor",
    bio: "Jornalista e educador. Escreve sobre políticas públicas de educação.",
    avatar: avatar("av2", "12", "Carlos Mendes"),
  },
  {
    id: "a3", slug: "juliana-souza", name: "Juliana Souza", role: "Consultora de Carreira",
    bio: "Ajuda estudantes a planejarem a transição para o mercado de trabalho.",
    avatar: avatar("av3", "32", "Juliana Souza"),
  },
  {
    id: "a4", slug: "pedro-alves", name: "Pedro Alves", role: "Professor",
    bio: "Professor de matemática e conteudista de cursos técnicos.",
    avatar: avatar("av4", "58", "Pedro Alves"),
  },
];

const seeds = [
  "photo-1523240795612-9a054b0db644",
  "photo-1503676260728-1c00da094a0b",
  "photo-1509062522246-3755977927d7",
  "photo-1513258496099-48168024aec0",
  "photo-1427504494785-3a9ca7044f45",
  "photo-1434030216411-0b793f4b4173",
  "photo-1546410531-bb4caa6b424d",
  "photo-1571260899304-425eee4c7efc",
  "photo-1481627834876-b7833e8f5570",
  "photo-1524995997946-a1c2e315a42f",
  "photo-1497633762265-9d179a990aa6",
  "photo-1516321318423-f06f85e504b3",
  "photo-1522202176988-66273c2fd55f",
  "photo-1552664730-d307ca884978",
  "photo-1531482615713-2afd69097998",
  "photo-1521737604893-d14cc237f11d",
  "photo-1519389950473-47ba0277781c",
  "photo-1521790797524-b2497295b8a0",
  "photo-1571260899304-425eee4c7efc",
  "photo-1454165804606-c3d57bc86b40",
  "photo-1517048676732-d65bc937f952",
  "photo-1552581234-26160f608093",
  "photo-1531403009284-440f080d1e12",
  "photo-1600880292203-757bb62b4baf",
  "photo-1573497491765-dccce02b29df",
  "photo-1521791136064-7986c2920216",
  "photo-1531266752426-aef4aa67f930",
  "photo-1497215728101-856f4ea42174",
  "photo-1520607162513-77705c0f0d4a",
  "photo-1497486751825-1233686f5d54",
];

const titles = [
  "Como funciona a EJA em EAD reconhecida pelo MEC",
  "5 motivos para investir em um curso técnico agora",
  "Bolsa de Estudos: como se candidatar e conquistar a sua",
  "Graduação EAD: mitos e verdades sobre a modalidade",
  "Pós-graduação: quando vale a pena e como escolher",
  "Ensino médio para adultos: retomando os estudos com segurança",
  "Certificação digital: como o MEC valida seu diploma",
  "Carreira em tecnologia: por onde começar em 2025",
  "Educação híbrida: o melhor dos dois mundos",
  "Como estudar em casa sem perder o foco",
  "Guia prático para o ENEM aplicado à EJA",
  "Formação Agro: oportunidades no campo brasileiro",
  "Rotinas de estudo para quem trabalha o dia todo",
  "As profissões que mais crescem para técnicos",
  "Financiamento estudantil e alternativas em 2025",
  "Como escolher entre graduação e tecnólogo",
  "Educação inclusiva: recursos e legislação",
  "Currículo por competências: o que muda para o aluno",
  "Metodologias ativas na educação a distância",
  "Networking para estudantes EAD: dicas práticas",
  "Marketing digital: um caminho para novos empreendedores",
  "Enfermagem técnica: mercado, salário e formação",
  "Segurança do trabalho: por que essa carreira está em alta",
  "Administração: fundamentos e trilhas de estudo",
  "Contabilidade moderna: da planilha à IA",
  "Design gráfico: portfólio que abre portas",
  "Logística 4.0: o novo perfil do profissional",
  "Recursos humanos: gestão de pessoas em transformação",
  "Estética e cosmética: o boom de um setor lucrativo",
  "Gastronomia técnica: mercado, tendências e oportunidades",
];

const excerpt = (t: string) =>
  `${t}. Entenda os principais pontos, requisitos, prazos e como aproveitar ao máximo esta oportunidade de formação com reconhecimento nacional.`;

const richHtml = `<p>A educação a distância deixou de ser tendência e passou a ser realidade em todo o Brasil. Com o reconhecimento do MEC, milhares de alunos concluem suas formações sem sair de casa.</p><p>Neste artigo você vai entender como a modalidade funciona na prática, quais são os requisitos, prazos e o que esperar durante os estudos.</p>`;

const posts: Post[] = titles.map((title, i) => {
  const cat = categories[i % categories.length];
  const secondCat = categories[(i + 2) % categories.length];
  const author = authors[i % authors.length];
  const seed = seeds[i % seeds.length];
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const date = new Date(2026, 6 - Math.floor(i / 6), 28 - (i % 28));
  return {
    id: `p${i + 1}`,
    slug,
    title,
    excerpt: excerpt(title),
    coverImage: img(`m${i}`, seed, title),
    author,
    categories: [cat, secondCat],
    tags: [tags[i % tags.length], tags[(i + 3) % tags.length]],
    publishedAt: date.toISOString(),
    readingTimeMinutes: 4 + (i % 8),
    featured: i < 4,
    views: 500 + ((i * 137) % 4000),
    seo: { title, description: excerpt(title) },
    content: [
      { type: "richText", html: richHtml },
      { type: "heading", level: 2, text: "O que muda para o aluno" },
      { type: "richText", html: `<p>Ao ingressar em um curso ${cat.name.toLowerCase()}, o aluno tem acesso a uma plataforma completa de estudos, com aulas gravadas, materiais complementares e tutoria online.</p>` },
      { type: "callout", tone: "info", title: "Fique atento", text: "As matrículas para o próximo semestre encerram em 30 dias. Garanta sua vaga com bolsa de estudos." },
      { type: "image", media: img(`mm${i}`, seeds[(i + 5) % seeds.length], "Estudante"), caption: "Plataforma de estudos UniEjatec." },
      { type: "heading", level: 2, text: "Perguntas frequentes" },
      {
        type: "faq",
        items: [
          { question: "O diploma é reconhecido pelo MEC?", answer: "Sim, todos os cursos possuem reconhecimento oficial e são válidos em todo o território nacional." },
          { question: "Existe polo presencial?", answer: "Sim. Você faz atividades avaliativas em polos parceiros próximos à sua região." },
          { question: "Como funciona a bolsa de estudos?", answer: "Você responde a um questionário e recebe uma proposta personalizada de acordo com o seu perfil." },
        ],
      },
      { type: "statistics", items: [
        { value: "+50 mil", label: "alunos ativos" },
        { value: "97%", label: "aprovação" },
        { value: "24/7", label: "acesso à plataforma" },
      ] },
      { type: "quote", text: "Estudar transformou minha vida — em dois anos consegui uma promoção no trabalho.", author: "Egresso UniEjatec" },
      { type: "cta", title: "Peça sua Bolsa de Estudos", description: "Responda em 2 minutos e descubra quanto você pode economizar.", label: "Peça sua Bolsa", href: "/pagina/bolsa" },
    ],
  };
});

const pages: Page[] = [
  {
    id: "pg1",
    slug: "bolsa",
    title: "Bolsa de Estudos UniEjatec",
    seo: { title: "Bolsa de Estudos — UniEjatec", description: "Descubra como conquistar sua bolsa em cursos EJA, técnicos e de graduação." },
    content: [
      { type: "richText", html: "<p>A UniEjatec oferece bolsas de estudo para EJA, cursos técnicos, graduação e pós-graduação. Responda ao questionário e receba sua proposta personalizada.</p>" },
      { type: "cta", title: "Peça sua Bolsa", description: "Leva menos de 2 minutos.", label: "Começar agora", href: "/busca" },
    ],
  },
  {
    id: "pg2",
    slug: "institucional",
    title: "Sobre a UniEjatec",
    content: [{ type: "richText", html: "<p>Somos uma instituição comprometida com educação acessível e de qualidade em todo o Brasil.</p>" }],
  },
];

const settings: GlobalSettings = {
  institutionName: "UniEjatec",
  logoUrl: "https://ejatec.com.br/wp-content/uploads/2026/03/logo-site-uniejatec-ead.png",
  tagline:
    "A UniEjatec é referência nacional em educação a distância reconhecida pelo MEC. Oferecemos EJA, Ensino Médio, Cursos Técnicos, Graduação, Tecnólogos e Pós-Graduação com Bolsa de Estudos. Nossa missão é transformar vidas através do conhecimento, com uma metodologia flexível que se adapta à rotina de quem trabalha e estuda. Conte com polos em todo o Brasil, professores especialistas e diplomas válidos em todo o território nacional.",
  phones: ["0800 123 4567"],
  whatsapp: "+55 11 99999-0000",
  address: "São Paulo — SP",
  social: [
    { label: "LinkedIn", href: "https://linkedin.com/company/ejatec", icon: "linkedin" },
    { label: "Instagram", href: "https://www.instagram.com/uniejatec", icon: "instagram" },
    { label: "YouTube", href: "https://www.youtube.com/@UniEjatec", icon: "youtube" },
    { label: "Facebook", href: "https://www.facebook.com/ejatec", icon: "facebook" },
  ],
  menus: {
    header: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Cursos", href: "/cursos" },
      { label: "Sobre", href: "/sobre" },
    ],
    footer: [
      {
        title: "EJA EAD",
        items: [
          { label: "EJA + Técnicos", href: "https://ejatec.com.br/go/eja/" },
          { label: "Supletivo", href: "https://ejatec.com.br/supletivo-online/" },
          { label: "Ensino Médio", href: "https://ejatec.com.br/go/ensino-medio" },
          { label: "Fundamental", href: "https://ejatec.com.br/go/fundamental" },
        ],
      },
      {
        title: "Cursos",
        items: [
          { label: "Cursos Técnicos", href: "https://www.ejatec.com.br/go/tecnico" },
          { label: "Tecnólogos", href: "https://www.ejatec.com.br/go/tecnologo" },
          { label: "Graduação", href: "https://www.ejatec.com.br/go/graduacao" },
          { label: "Por Competência", href: "https://ejatec.com.br/profissoes/tecnico-por-competencia/" },
        ],
      },
      {
        title: "Institucionais",
        items: [
          { label: "Bolsa de Estudos", href: "https://www.ejatec.com.br/go/curso-popular" },
          { label: "Carreiras", href: "https://ejatec.com.br/carreiras-profissionais/" },
          { label: "Polos", href: "https://ejatec.com.br/polos/" },
          { label: "Professores", href: "https://ejatec.com.br/go/professor" },
        ],
      },
      {
        title: "Ajuda",
        items: [
          { label: "Termos", href: "https://ejatec.com.br/lp-term-conditions/" },
          { label: "Privacidade", href: "https://ejatec.com.br/lp-term-conditions/" },
          { label: "FAQs", href: "https://ejatec.com.br/faqs/" },
          { label: "Elucidário", href: "https://www.ejatec.com.br/elucidario/" },
        ],
      },
    ],
  },
  seo: {
    title: "UniEjatec — EJA, Graduação, Pós e Cursos Técnicos EAD",
    description: "Formação reconhecida pelo MEC com bolsa de estudos. Estude no seu ritmo e conquiste novas oportunidades.",
  },
};

export const fixtures = { posts, categories, tags, authors, settings, pages };