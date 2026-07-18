import { useEffect, type ReactNode } from "react";
import { useSettings } from "./SettingsProvider";

// Placeholder: reads settings.scripts and would inject GA/GTM/Pixel tags.
// Kept as a no-op stub until real IDs exist.
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const s = useSettings();
  useEffect(() => {
    if (!s.scripts) return;
    // TODO: inject GA/GTM/Pixel when IDs are provided by the CMS.
  }, [s.scripts]);
  return <>{children}</>;
}