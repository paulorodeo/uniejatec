import { createContext, useContext, type ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { settingsService } from "@/services";
import { qk } from "@/config/queryKeys";
import type { GlobalSettings } from "@/types";

const SettingsContext = createContext<GlobalSettings | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useSuspenseQuery({ queryKey: qk.settings, queryFn: settingsService.get });
  return <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>;
}

export function useSettings(): GlobalSettings {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}