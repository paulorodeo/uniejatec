import { createContext, useContext, type ReactNode } from "react";
import { defaultFeatureFlags } from "@/config/featureFlags";
import type { FeatureFlags } from "@/types";

const Ctx = createContext<FeatureFlags>(defaultFeatureFlags);

export function FeatureFlagProvider({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides?: Partial<FeatureFlags>;
}) {
  const value = { ...defaultFeatureFlags, ...overrides };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFeatureFlag(key: keyof FeatureFlags): boolean {
  return useContext(Ctx)[key];
}