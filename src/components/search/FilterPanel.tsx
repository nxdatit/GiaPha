import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useFamilyTreeStore } from '../../store/familyTreeStore';
import { useUIStore } from '../../store/uiStore';
import { getGenerations } from '../../store/selectors';

export function FilterPanel() {
  const { t } = useTranslation();

  const people = useFamilyTreeStore((s) => s.people);
  const filters = useUIStore((s) => s.filters);
  const setFilters = useUIStore((s) => s.setFilters);

  const generations = useMemo(() => getGenerations(people), [people]);

  const occupations = useMemo(() => {
    const set = new Set<string>();
    for (const person of Object.values(people)) {
      if (person.occupation?.trim()) {
        set.add(person.occupation.trim());
      }
    }
    return Array.from(set).sort();
  }, [people]);

  const hometowns = useMemo(() => {
    const set = new Set<string>();
    for (const person of Object.values(people)) {
      if (person.hometown?.trim()) {
        set.add(person.hometown.trim());
      }
    }
    return Array.from(set).sort();
  }, [people]);

  const hasActiveFilters =
    filters.generation !== undefined ||
    !!filters.occupation ||
    !!filters.hometown;

  function handleGenerationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setFilters({
      ...filters,
      generation: value === '' ? undefined : Number(value),
    });
  }

  function handleOccupationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setFilters({
      ...filters,
      occupation: value === '' ? undefined : value,
    });
  }

  function handleHometownChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setFilters({
      ...filters,
      hometown: value === '' ? undefined : value,
    });
  }

  function clearFilters() {
    setFilters({});
  }

  const selectClass =
    'px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white ' +
    'dark:bg-gray-800 dark:border-gray-600 dark:text-white ' +
    'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filters.generation ?? ''}
        onChange={handleGenerationChange}
        className={selectClass}
      >
        <option value="">{t('filter.allGenerations', 'Tất cả đời')}</option>
        {generations.map((gen) => (
          <option key={gen} value={gen}>
            {t('filter.generation', 'Đời')} {gen}
          </option>
        ))}
      </select>

      <select
        value={filters.occupation ?? ''}
        onChange={handleOccupationChange}
        className={selectClass}
      >
        <option value="">{t('filter.allOccupations', 'Tất cả nghề nghiệp')}</option>
        {occupations.map((occ) => (
          <option key={occ} value={occ}>
            {occ}
          </option>
        ))}
      </select>

      <select
        value={filters.hometown ?? ''}
        onChange={handleHometownChange}
        className={selectClass}
      >
        <option value="">{t('filter.allHometowns', 'Tất cả quê quán')}</option>
        {hometowns.map((ht) => (
          <option key={ht} value={ht}>
            {ht}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-2 text-sm text-red-600
                     hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20
                     rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          {t('filter.clear', 'Xóa bộ lọc')}
        </button>
      )}
    </div>
  );
}
