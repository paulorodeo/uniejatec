import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { newsletterService } from "@/services";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: newsletterService.subscribe,
    onSuccess: () => {
      toast.success("Inscrição confirmada — obrigado!");
      setEmail("");
    },
  });

  return (
    <div className={compact ? "rounded-2xl border border-border bg-brand-softer p-6" : "rounded-3xl bg-brand p-10 text-brand-foreground"}>
      <div className="mb-2 flex items-center gap-2">
        <Mail className="h-5 w-5" />
        <p className="text-sm font-semibold uppercase tracking-wide opacity-90">Newsletter</p>
      </div>
      <h3 className={`font-display font-bold ${compact ? "text-lg text-ink" : "text-2xl"}`}>
        Receba os melhores conteúdos sobre educação
      </h3>
      <p className={`mt-2 text-sm ${compact ? "text-ink-muted" : "opacity-90"}`}>
        Toda semana no seu e-mail. Sem spam, prometido.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email) mutate(email);
        }}
        className="mt-4 flex flex-col gap-2 sm:flex-row"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm outline-none ${compact ? "border border-border bg-background" : "bg-background text-ink"}`}
        />
        <Button type="submit" variant={compact ? "hero" : "default"} disabled={isPending} className={compact ? "" : "bg-ink text-background hover:bg-ink/90"}>
          {isPending ? "Enviando…" : "Inscrever"}
        </Button>
      </form>
    </div>
  );
}