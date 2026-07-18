import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services";
import { qk } from "@/config/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { Link } from "@tanstack/react-router";

export function SearchAutocomplete({ placeholder = "Busque por artigos, cursos, temas…" }: { placeholder?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(q, 200);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data = [], isFetching } = useQuery({
    queryKey: qk.search(debounced),
    queryFn: () => searchService.query(debounced),
    enabled: debounced.trim().length > 1,
  });

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/busca", search: { q } });
      setOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={ref}>
      <form onSubmit={submit}>
        <div className="flex items-center gap-2 rounded-full border border-border bg-brand-softer px-4 py-2.5 transition focus-within:border-brand focus-within:bg-background">
          <Search className="h-4 w-4 text-ink-muted" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            aria-label="Buscar"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
          />
        </div>
      </form>
      {open && debounced.trim().length > 1 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
          {isFetching && <div className="p-4 text-sm text-ink-muted">Buscando…</div>}
          {!isFetching && data.length === 0 && (
            <div className="p-4 text-sm text-ink-muted">Nenhum resultado para "{debounced}".</div>
          )}
          <ul>
            {data.map((p) => (
              <li key={p.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 p-3 hover:bg-brand-softer"
                >
                  <img
                    src={p.coverImage.url}
                    alt=""
                    loading="lazy"
                    className="h-12 w-16 shrink-0 rounded-md object-cover"
                  />
                  <div>
                    <p className="line-clamp-1 text-sm font-semibold">{p.title}</p>
                    <p className="line-clamp-1 text-xs text-ink-muted">{p.categories[0]?.name}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}