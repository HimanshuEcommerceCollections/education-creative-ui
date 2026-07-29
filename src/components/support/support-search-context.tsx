"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SupportSearchValue {
  query: string;
  setQuery: (query: string) => void;
}

const SupportSearchContext = createContext<SupportSearchValue | null>(null);

/**
 * Holds the help-center query. The search field sits in the hero while the
 * cards it filters live in the next section, so the state is shared here —
 * letting both sections stay server-rendered around two small client leaves.
 */
export function SupportSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const value = useMemo(() => ({ query, setQuery }), [query]);

  return (
    <SupportSearchContext.Provider value={value}>
      {children}
    </SupportSearchContext.Provider>
  );
}

export function useSupportSearch(): SupportSearchValue {
  const context = useContext(SupportSearchContext);
  if (!context) {
    throw new Error("useSupportSearch must be used within a SupportSearchProvider");
  }
  return context;
}
