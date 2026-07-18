## Blog UniEjatec — Frontend Headless (v2, com ajustes)

Frontend 100% desacoplado, sobre **TanStack Start** (mantido). Payload será apenas uma origem de dados futura; nada no código o conhece diretamente.

---

### 1. Identidade visual

- **Poppins** (700/800) para H1–H6, **Inter** para todo o resto — carregadas via `<link>` no `__root.tsx` (nunca `@import` remoto no CSS).
- Azul institucional **#2458FF** como `--primary` (em `oklch`), azul-claro para fundos, quase-preto para títulos, cinzas para corpo.
- Tokens em `src/styles.css` cobrindo cores, gradientes, sombras, radius e tipografia. **Dark mode preparado** (classe `.dark` com paleta correspondente, toggle desativado por feature flag).
- Variantes shadcn: botão `hero` ("Peça sua Bolsa"), `outline-primary` ("Matricule-se"), badge de categoria, card do artigo.

### 2. CTAs

- **Primário do blog:** "Peça sua Bolsa" (footer de artigo, home, sidebar, banners inline).
- **Secundário na navbar:** "Matricule-se".

### 3. Arquitetura em camadas

```
API (fetcher) → Adapter → Repository → Service → TanStack Query → Componente → UI
```

```
src/
  routes/               # páginas (TanStack Router file-based)
  features/             # blog, search, newsletter, author, category
  components/
    ui/                 # shadcn base
    layout/             # TopBar, Navbar, Breadcrumb, Footer
    blog/               # ArticleCard, AuthorCard, CategoryCard, Sidebar, Newsletter, ShareButtons, Pagination, SearchAutocomplete, Tag
    content/            # ContentRenderer + registry
    content/blocks/     # HeroBlock, RichTextBlock, ImageBlock, GalleryBlock, VideoBlock, QuoteBlock, FAQBlock, CTASection, TableBlock, DownloadsBlock, BannerBlock, StatisticsBlock, TestimonialsBlock, CodeBlock, CalloutBlock, DividerBlock
    seo/                # <SEO />, JSON-LD helpers
    states/             # Skeleton, EmptyState, ErrorState, LoadingState
  providers/            # ThemeProvider, QueryProvider, SettingsProvider, FeatureFlagProvider, AnalyticsProvider, AuthProvider
  services/             # posts, pages, categories, tags, authors, media, search, navigation, settings, forms
  repositories/         # PostRepository, CategoryRepository, ... (interfaces + implementações)
  adapters/             # payloadAdapter (stub), mockAdapter (ativo agora) — normalizam para modelos internos
  hooks/                # useSettings, useFeatureFlag, useAnalytics, useAuth, useDebounce, useHydrated
  types/                # Post, Category, Tag, Author, Media, SEO, Menu, Page, FAQ, Banner, CTA, Newsletter, Breadcrumb, GlobalSettings, Block (union), FeatureFlags
  config/               # api.ts (base URL via env), queryKeys.ts, featureFlags.ts, seo.ts
  utils/                # formatDate, readingTime, slugify, cn, buildJsonLd
  lib/
  test/                 # setup Vitest + Testing Library
docs/                   # arquitetura, pastas, dados, Payload, convenções, DS, SEO, performance, onboarding
.storybook/             # config Storybook (scaffold)
tests/e2e/              # Playwright (scaffold)
```

Regras invioláveis:
- Nenhum componente faz fetch.
- Nenhuma página conhece a API; só chama services.
- Nenhum service devolve tipo do Payload — sempre modelo interno via Adapter.
- Trocar mock → Payload = trocar 1 arquivo (`config/api.ts` + `adapters/payloadAdapter.ts`).

### 4. Providers globais

Compostos em `__root.tsx` na ordem: `QueryProvider` → `SettingsProvider` → `FeatureFlagProvider` → `ThemeProvider` → `AuthProvider` → `AnalyticsProvider`. Cada um com hook próprio (`useSettings()`, `useFeatureFlag('newsletter')`, etc.).

### 5. Global Settings

`SettingsService.getGlobal()` retorna `GlobalSettings` (logo, nome, telefones, WhatsApp, redes sociais, menus header/footer, SEO global, scripts GA/GTM/Meta Pixel, chat, dados institucionais). Carregado uma vez pelo `SettingsProvider` e injetado onde for necessário (Navbar, Footer, `<SEO />`, `AnalyticsProvider`).

### 6. Feature Flags

`featureFlags.ts` com defaults: `newsletter: true`, `comments: false`, `chatAI: false`, `login: false`, `studentArea: false`, `landingPages: true`, `banner: true`, `cta: true`. Toda funcionalidade que ainda não existe fica atrás de `useFeatureFlag`.

### 7. ContentRenderer extensível

`blockRegistry` (Record<BlockType, Component>) — cada bloco é um arquivo próprio em `components/content/blocks/`. Adicionar bloco novo = registrar no mapa; nenhum switch para editar.

### 8. Estados de componente

Todo componente de lista/detalhe implementa: `LoadingState`, `Skeleton`, `EmptyState`, `ErrorState`, tipagem completa, variantes via `cva`, ARIA + foco visível.

### 9. Rotas

- `/` — Home do blog (hero, destaques, últimos, categorias, mais lidos, newsletter, CTA final)
- `/blog` — Lista com filtros, ordenação, paginação
- `/blog/$slug` — Artigo (breadcrumb, hero image, 2 colunas `max-w-[70ch] leading-[1.8]` + sidebar, share, relacionados, comentários placeholder)
- `/categoria/$slug`, `/tag/$slug`, `/autor/$slug`
- `/busca` — Autocomplete + resultados instantâneos
- `/pagina/$slug` — Institucional via ContentRenderer

### 10. SEO & performance

- `head()` por rota com title, description, canonical, OG, Twitter, JSON-LD (Article, BreadcrumbList, FAQPage, Organization, Author).
- `sitemap.xml` server route + `robots.txt`.
- `ensureQueryData` no loader + `useSuspenseQuery` no componente; prefetch em hover; skeletons; imagens `loading="lazy"` com `srcset` a partir de `media.sizes`.
- Framer Motion apenas para fade/slide discretos.
- Mobile-first, breakpoints 320–1536, WCAG AA.

### 11. Testes & Storybook (scaffold)

- Vitest + Testing Library configurados (`test/setup.ts`, script `test`), 1 teste smoke.
- Playwright configurado (`playwright.config.ts`, 1 teste smoke da home).
- Storybook 8 scaffold com 1 story de Button para provar o pipeline.

Não vou implementar cobertura completa de testes/stories nesta iteração — só o esqueleto pronto para expandir.

### 12. Documentação `/docs`

Arquivos: `architecture.md`, `folder-structure.md`, `data-flow.md`, `payload-integration.md`, `conventions.md`, `design-system.md`, `seo.md`, `performance.md`, `onboarding.md`.

---

### Escopo desta entrega

Base sólida e navegável **em uma iteração**: design system + providers + camadas + services com mock adapter rico (30+ posts, 6 categorias, 4 autores) + todas as rotas funcionais + ContentRenderer com blocos principais + layout global + SEO + skeletons + scaffolds de testes/Storybook/docs.

Comentários reais, chat IA, login, integração Payload de verdade ficam por trás de feature flags e interfaces já preparadas.

Confirma que sigo?
