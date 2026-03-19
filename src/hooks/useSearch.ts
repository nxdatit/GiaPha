import { useState, useEffect, useMemo } from 'react';
import type { Person } from '../types';
import { searchPeople } from '../store/selectors';

interface UseSearchResult {
  results: Person[];
  debouncedQuery: string;
}

export function useSearch(
  people: Record<string, Person>,
  query: string
): UseSearchResult {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(
    () => searchPeople(people, debouncedQuery),
    [people, debouncedQuery]
  );

  return { results, debouncedQuery };
}
