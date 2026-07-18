import { Facebook, Linkedin, Twitter, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export function ShareButtons({ title, url }: { title: string; url?: string }) {
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const links = [
    { label: "Twitter", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-ink-muted">Compartilhar:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Compartilhar no ${l.label}`}
          className="rounded-full border border-border p-2 text-ink-muted transition-colors hover:border-brand hover:text-brand"
        >
          <l.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={() => {
          navigator.clipboard?.writeText(shareUrl);
          toast.success("Link copiado!");
        }}
        aria-label="Copiar link"
        className="rounded-full border border-border p-2 text-ink-muted transition-colors hover:border-brand hover:text-brand"
      >
        <LinkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}