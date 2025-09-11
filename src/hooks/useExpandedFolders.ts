'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type StorageKey = string;

/**

 * Gestisce un set di folder ID espansi con persistenza opzionale.
 * Gestione stato cartelle espanse/compresse in una sidebar ad albero con presistenza in localStorage.
 */
export function useExpandedFolders(
  initial: string[] = [],
  options?: { storageKey?: StorageKey }
) {
  const storageKey = options?.storageKey ?? 'sidebar:expandedFolders';

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set(initial);
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) return new Set<string>(JSON.parse(raw));
    } catch {}
    return new Set(initial);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(Array.from(expanded))
      );
    } catch {}
  }, [expanded, storageKey]);

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

  return { isExpanded, toggle, expand, collapse, list };
}
