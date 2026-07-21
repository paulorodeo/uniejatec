import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { PostSummary } from "@/types";
import { formatDate, formatReadingTime } from "@/utils/format";
import { Clock } from "lucide-react";

export function ArticleCard({ post, variant = "default" }: { post: PostSummary; variant?: "default" | "featured" | "compact" | "side" }) {
  if (variant === "compact") {
    return (
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="group flex items-start gap-3">
        <img src={post.coverImage.url} alt="" loading="lazy" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
        <div>
          <p className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-brand">{post.title}</p>
          <p className="mt-1 text-xs text-ink-muted">{formatDate(post.publishedAt)}</p>
        </div>
      </Link>
    );
  }

  if (variant === "side") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35 }}
        className="group h-full"
      >
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className="flex h-full gap-4 rounded-2xl p-2 transition-colors hover:bg-brand-softer/60"
        >
          <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-32">
            <img
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            {post.categories[0] && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                {post.categories[0].name}
              </span>
            )}
            <h3 className="mt-1 line-clamp-3 font-display text-base font-bold leading-snug text-ink group-hover:text-brand">
              {post.title}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-muted">
              <span>{formatDate(post.publishedAt)}</span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatReadingTime(post.readingTimeMinutes)}
              </span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="group h-full"
      >
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className="flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-border/60 transition-shadow hover:shadow-xl"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted lg:aspect-auto lg:flex-1">
            <img
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {post.categories[0] && (
              <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">
                {post.categories[0].name}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 p-6 lg:p-7">
            <h3 className="font-display text-2xl font-extrabold leading-tight text-ink group-hover:text-brand md:text-3xl">
              {post.title}
            </h3>
            <p className="line-clamp-2 text-sm text-ink-muted md:text-base">{post.excerpt}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-ink-muted">
              {post.author.avatar && (
                <img src={post.author.avatar.url} alt={post.author.name} className="h-7 w-7 rounded-full object-cover" />
              )}
              <span className="font-medium text-ink">{post.author.name}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(post.publishedAt)}</span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatReadingTime(post.readingTimeMinutes)}
              </span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
          <img
            src={post.coverImage.url}
            alt={post.coverImage.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {post.categories[0] && (
            <span
              className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-medium text-brand-foreground"
            >
              {post.categories[0].name}
            </span>
          )}
        </div>
        <h3 className="mt-4 font-display text-lg font-bold leading-tight text-ink group-hover:text-brand">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-ink-muted">
          {post.author.avatar && (
            <img src={post.author.avatar.url} alt={post.author.name} className="h-6 w-6 rounded-full object-cover" />
          )}
          <span className="font-medium text-ink">{post.author.name}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{formatReadingTime(post.readingTimeMinutes)}</span>
        </div>
      </Link>
    </motion.article>
  );
}