import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Não foi possível carregar",
  description = "Ocorreu um erro. Tente novamente em instantes.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 py-16 text-center">
      <AlertTriangle className="mb-4 h-8 w-8 text-destructive" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && <Button onClick={onRetry} className="mt-6" variant="outline">Tentar novamente</Button>}
    </div>
  );
}