import { GraduationCap } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-brand text-brand-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-sm">
        <span aria-hidden>👋</span>
        <span>
          Pegue sua Bolsa de Estudos!{" "}
          <a
            href="https://ejatec.com.br/programa-bolsa-de-estudos/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4"
          >
            Saiba mais
          </a>
        </span>
        <GraduationCap className="h-4 w-4" aria-hidden />
      </div>
    </div>
  );
}