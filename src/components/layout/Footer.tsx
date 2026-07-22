import { Instagram, Facebook, Youtube, Linkedin, Twitter } from "lucide-react";
import { useSettings } from "@/providers/SettingsProvider";

const iconMap = { instagram: Instagram, facebook: Facebook, youtube: Youtube, linkedin: Linkedin, twitter: Twitter };

export function Footer() {
  const s = useSettings();
  return (
    <footer className="mt-24 border-t border-border bg-brand-softer/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-6">
        <div className="md:col-span-2">
          <a href="/" aria-label={s.institutionName} className="inline-block">
            {s.logoUrl ? (
              <img
                src={s.logoUrl}
                alt={s.institutionName}
                className="h-12 w-auto"
                loading="lazy"
              />
            ) : (
              <span className="font-display text-xl font-extrabold text-brand">{s.institutionName}</span>
            )}
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">{s.tagline}</p>
          <div className="mt-6 flex gap-2">
            {s.social.map((soc) => {
              const Icon = iconMap[soc.icon];
              return (
                <a
                  key={soc.label}
                  href={soc.href}
                  aria-label={soc.label}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border p-2 text-ink-muted transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {s.menus.footer.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-semibold text-ink">{col.title}</h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              {col.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="hover:text-brand"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 py-6 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {s.institutionName}. Todos os direitos reservados.</span>
          <a
            href="https://topleo.com.br"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
          >
            <span>Desenvolvido por</span>
            <img
              src="https://www.ejatec.com.br/wp-content/uploads/2026/02/topleo-seo-2.png"
              alt="Agência de Desenvolvimento do Website"
              className="h-4 w-auto"
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}