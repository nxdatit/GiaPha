import type { Person, FilterState } from '../types';

export function getFullName(person: Person): string {
  return `${person.lastName} ${person.firstName}`.trim();
}

function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function searchPeople(
  people: Record<string, Person>,
  query: string
): Person[] {
  if (!query || query.trim().length === 0) {
    return Object.values(people);
  }

  const normalizedQuery = removeDiacritics(query.toLowerCase().trim());

  return Object.values(people).filter((person) => {
    const fullName = getFullName(person);
    const normalizedName = removeDiacritics(fullName.toLowerCase());
    return normalizedName.includes(normalizedQuery);
  });
}

export function filterPeople(
  people: Record<string, Person>,
  filters: FilterState
): Person[] {
  return Object.values(people).filter((person) => {
    if (
      filters.generation !== undefined &&
      person.generation !== filters.generation
    ) {
      return false;
    }

    if (filters.occupation) {
      const normalizedOccupation = removeDiacritics(
        (person.occupation ?? '').toLowerCase()
      );
      const normalizedFilter = removeDiacritics(
        filters.occupation.toLowerCase()
      );
      if (!normalizedOccupation.includes(normalizedFilter)) {
        return false;
      }
    }

    if (filters.hometown) {
      const normalizedHometown = removeDiacritics(
        (person.hometown ?? '').toLowerCase()
      );
      const normalizedFilter = removeDiacritics(
        filters.hometown.toLowerCase()
      );
      if (!normalizedHometown.includes(normalizedFilter)) {
        return false;
      }
    }

    return true;
  });
}

export function getAncestors(
  people: Record<string, Person>,
  personId: string
): Person[] {
  const ancestors: Person[] = [];
  const visited = new Set<string>();

  function collect(id: string): void {
    if (visited.has(id)) return;
    visited.add(id);

    const person = people[id];
    if (!person) return;

    if (person.fatherId && people[person.fatherId]) {
      ancestors.push(people[person.fatherId]);
      collect(person.fatherId);
    }

    if (person.motherId && people[person.motherId]) {
      ancestors.push(people[person.motherId]);
      collect(person.motherId);
    }
  }

  collect(personId);
  return ancestors;
}

export function getDescendants(
  people: Record<string, Person>,
  personId: string
): Person[] {
  const descendants: Person[] = [];
  const visited = new Set<string>();

  function collect(id: string): void {
    if (visited.has(id)) return;
    visited.add(id);

    const person = people[id];
    if (!person) return;

    for (const childId of person.childrenIds) {
      if (people[childId] && !visited.has(childId)) {
        descendants.push(people[childId]);
        collect(childId);
      }
    }
  }

  collect(personId);
  return descendants;
}

export function getGenerations(people: Record<string, Person>): number[] {
  const generations = new Set<number>();

  for (const person of Object.values(people)) {
    generations.add(person.generation);
  }

  return Array.from(generations).sort((a, b) => a - b);
}
