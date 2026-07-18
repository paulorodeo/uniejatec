import type { Block, BlockType } from "@/types";
import type { ComponentType } from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/** Each block gets its own component. Renderer looks them up in the registry. */

export function RichTextBlock({ b }: { b: Extract<Block, { type: "richText" }> }) {
  return <div className="prose-article" dangerouslySetInnerHTML={{ __html: b.html }} />;
}

export function HeadingBlock({ b }: { b: Extract<Block, { type: "heading" }> }) {
  const Tag = (`h${b.level}` as unknown) as "h2";
  return <Tag id={b.id}>{b.text}</Tag>;
}

export function ImageBlock({ b }: { b: Extract<Block, { type: "image" }> }) {
  return (
    <figure className="my-8">
      <img src={b.media.url} alt={b.media.alt} loading="lazy" className="w-full rounded-2xl" />
      {b.caption && <figcaption className="mt-2 text-center text-sm text-ink-muted">{b.caption}</figcaption>}
    </figure>
  );
}

export function GalleryBlock({ b }: { b: Extract<Block, { type: "gallery" }> }) {
  return (
    <div className="my-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {b.images.map((m) => (
        <img key={m.id} src={m.url} alt={m.alt} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
      ))}
    </div>
  );
}

export function VideoBlock({ b }: { b: Extract<Block, { type: "video" }> }) {
  if (b.provider === "mp4") return <video src={b.src} controls poster={b.poster} className="my-6 w-full rounded-2xl" />;
  const embed = b.provider === "youtube" ? `https://www.youtube.com/embed/${b.src}` : `https://player.vimeo.com/video/${b.src}`;
  return (
    <div className="my-6 aspect-video overflow-hidden rounded-2xl">
      <iframe src={embed} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" />
    </div>
  );
}

export function QuoteBlock({ b }: { b: Extract<Block, { type: "quote" }> }) {
  return (
    <blockquote className="my-8 border-l-4 border-brand bg-brand-softer p-6 text-lg italic text-ink">
      "{b.text}"{b.author && <footer className="mt-2 text-sm not-italic text-ink-muted">— {b.author}</footer>}
    </blockquote>
  );
}

const calloutTone = {
  info: { bg: "bg-brand-softer", border: "border-brand", text: "text-brand", Icon: Info },
  success: { bg: "bg-emerald-50", border: "border-emerald-500", text: "text-emerald-700", Icon: CheckCircle2 },
  warning: { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-700", Icon: AlertTriangle },
  danger: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700", Icon: XCircle },
};
export function CalloutBlock({ b }: { b: Extract<Block, { type: "callout" }> }) {
  const t = calloutTone[b.tone];
  return (
    <div className={`my-6 flex gap-3 rounded-xl border-l-4 ${t.border} ${t.bg} p-5`}>
      <t.Icon className={`h-5 w-5 shrink-0 ${t.text}`} />
      <div>
        {b.title && <p className="font-semibold text-ink">{b.title}</p>}
        <p className="text-sm text-ink">{b.text}</p>
      </div>
    </div>
  );
}

export function FAQBlock({ b }: { b: Extract<Block, { type: "faq" }> }) {
  return (
    <Accordion type="single" collapsible className="my-8">
      {b.items.map((it, i) => (
        <AccordionItem key={i} value={`i-${i}`}>
          <AccordionTrigger className="text-left font-semibold">{it.question}</AccordionTrigger>
          <AccordionContent className="text-ink-muted">{it.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function TableBlock({ b }: { b: Extract<Block, { type: "table" }> }) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-brand-softer">
          <tr>{b.head.map((h) => <th key={h} className="p-3 text-left font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {b.rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {r.map((c, j) => <td key={j} className="p-3">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodeBlock({ b }: { b: Extract<Block, { type: "code" }> }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-xl bg-ink p-4 text-sm text-background">
      <code>{b.code}</code>
    </pre>
  );
}

export function CTABlock({ b }: { b: Extract<Block, { type: "cta" }> }) {
  return (
    <div className="my-10 flex flex-col items-start gap-4 rounded-3xl bg-gradient-to-br from-brand to-brand/70 p-8 text-brand-foreground md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-display text-2xl font-bold">{b.title}</h3>
        {b.description && <p className="mt-1 opacity-90">{b.description}</p>}
      </div>
      <Button asChild size="xl" className="bg-background text-brand hover:bg-background/90">
        <a href={b.href}>{b.label}</a>
      </Button>
    </div>
  );
}

export function DownloadsBlock({ b }: { b: Extract<Block, { type: "downloads" }> }) {
  return (
    <ul className="my-6 space-y-2">
      {b.items.map((it, i) => (
        <li key={i}>
          <a href={it.href} className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-brand hover:text-brand">
            <span className="flex items-center gap-3"><Download className="h-4 w-4" />{it.label}</span>
            {it.size && <span className="text-xs text-ink-muted">{it.size}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function BannerBlock({ b }: { b: Extract<Block, { type: "banner" }> }) {
  const Content = (
    <div className="relative my-8 overflow-hidden rounded-3xl">
      <img src={b.media.url} alt={b.media.alt} className="aspect-[21/9] w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent p-8 text-background">
        <h3 className="font-display text-2xl font-bold md:text-3xl">{b.title}</h3>
        {b.description && <p className="mt-2 max-w-md text-sm opacity-90">{b.description}</p>}
      </div>
    </div>
  );
  return b.href ? <a href={b.href}>{Content}</a> : Content;
}

export function StatisticsBlock({ b }: { b: Extract<Block, { type: "statistics" }> }) {
  return (
    <div className="my-10 grid gap-4 rounded-2xl border border-border bg-brand-softer p-8 sm:grid-cols-3">
      {b.items.map((it, i) => (
        <div key={i} className="text-center">
          <p className="font-display text-3xl font-extrabold text-brand">{it.value}</p>
          <p className="mt-1 text-sm text-ink-muted">{it.label}</p>
        </div>
      ))}
    </div>
  );
}

export function TestimonialsBlock({ b }: { b: Extract<Block, { type: "testimonials" }> }) {
  return (
    <div className="my-10 grid gap-6 md:grid-cols-2">
      {b.items.map((it, i) => (
        <figure key={i} className="rounded-2xl border border-border bg-background p-6">
          <blockquote className="text-ink">"{it.text}"</blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            {it.avatar && <img src={it.avatar.url} alt={it.name} className="h-10 w-10 rounded-full object-cover" />}
            <div>
              <p className="font-semibold">{it.name}</p>
              {it.role && <p className="text-xs text-ink-muted">{it.role}</p>}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function DividerBlock() {
  return <hr className="my-10 border-border" />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const blockRegistry: Record<BlockType, ComponentType<{ b: any }>> = {
  richText: RichTextBlock,
  heading: HeadingBlock,
  image: ImageBlock,
  gallery: GalleryBlock,
  video: VideoBlock,
  quote: QuoteBlock,
  callout: CalloutBlock,
  faq: FAQBlock,
  table: TableBlock,
  code: CodeBlock,
  cta: CTABlock,
  downloads: DownloadsBlock,
  banner: BannerBlock,
  statistics: StatisticsBlock,
  testimonials: TestimonialsBlock,
  divider: DividerBlock,
};