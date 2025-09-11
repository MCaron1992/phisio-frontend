import { useCallback, useEffect, useMemo, useState } from 'react';

type StorageKey = string;

export function useExpandedFolders(
  initial: string[] = [], // fallback
  options?: { storageKey?: StorageKey }
) {
  const storageKey = options?.storageKey ?? 'sidebar:expandedFolders';

  // stato hydrated per evitare mismatch SSR/CSR
  const [hydrated, setHydrated] = useState(false);

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') {
      return new Set(); // lato server → tutto chiuso
    }
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) return new Set<string>(JSON.parse(raw));
    } catch {}
    return new Set(); // default: tutto chiuso
  });

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(Array.from(expanded))
      );
    } catch {}
  }, [expanded, storageKey, hydrated]);

  const isExpanded = useCallback((id: string) => expanded.has(id), [expanded]);

  const toggle = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expand = useCallback((id: string) => {
    setExpanded(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const collapse = useCallback((id: string) => {
    setExpanded(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const list = useMemo(() => Array.from(expanded), [expanded]);

  return { isExpanded, toggle, expand, collapse, list, hydrated };
}
