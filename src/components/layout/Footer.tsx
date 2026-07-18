import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Linkedin, Twitter } from "lucide-react";
import { useSettings } from "@/providers/SettingsProvider";
import { Logo } from "./Logo";

const iconMap = { instagram: Instagram, facebook: Facebook, youtube: Youtube, linkedin: Linkedin, twitter: Twitter };

export function Footer() {
  const s = useSettings();
  return (
    <footer className="mt-24 border-t border-border bg-brand-softer/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo name={s.institutionName} />
          <p className="mt-4 max-w-sm text-sm text-ink-muted">{s.tagline}</p>
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
                  <Link to={item.href} className="hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 py-6 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {s.institutionName}. Todos os direitos reservados.</span>
          <span>{s.address}</span>
        </div>
      </div>
    </footer>
  );
}