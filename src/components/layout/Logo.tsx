import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function Logo({ name }: { name: string }) {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-brand">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-brand-foreground">
        <GraduationCap className="h-5 w-5" />
      </span>
      <span>{name}</span>
    </Link>
  );
}