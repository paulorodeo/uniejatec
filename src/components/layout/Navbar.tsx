import { Menu, User, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/providers/SettingsProvider";
import { Logo } from "./Logo";
import { SearchAutocomplete } from "@/components/blog/SearchAutocomplete";
import { whatsappUrl } from "@/lib/contact";

export function Navbar() {
  const s = useSettings();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        <Logo name={s.institutionName} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {s.menus.header.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-softer hover:text-brand"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden max-w-md flex-1 md:block">
          <SearchAutocomplete />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline-primary" size="sm" className="hidden md:inline-flex">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              Matricule-se
            </a>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Conta" className="hidden md:inline-flex">
            <User className="h-5 w-5" />
          </Button>
          <button
            className="rounded-md p-2 lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-4">
            <SearchAutocomplete />
            <nav className="grid gap-1">
              {s.menus.header.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-brand-softer"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <Button asChild variant="outline-primary" className="w-full">
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                Matricule-se
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}