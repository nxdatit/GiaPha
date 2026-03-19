import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown, ArrowUp, ArrowDown, Users } from 'lucide-react';
import { useFamilyTreeStore } from '../store/familyTreeStore';
import { useUIStore } from '../store/uiStore';
import { getFullName, searchPeople, filterPeople } from '../store/selectors';
import { SearchBar } from '../components/search/SearchBar';
import { FilterPanel } from '../components/search/FilterPanel';

type SortKey = 'name' | 'generation' | 'birthDate' | 'deathDate' | 'occupation' | 'hometown';
type SortDir = 'asc' | 'desc';

export function ListPage() {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<SortKey>('generation');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const people = useFamilyTreeStore((s) => s.people);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const filters = useUIStore((s) => s.filters);
  const setSelectedPerson = useUIStore((s) => s.setSelectedPerson);

  const filteredPeople = useMemo(() => {
    let results = searchPeople(people, searchQuery);
    const filteredIds = new Set(filterPeople(people, filters).map((p) => p.id));
    return results.filter((p) => filteredIds.has(p.id));
  }, [people, searchQuery, filters]);

  const sortedPeople = useMemo(() => {
    const sorted = [...filteredPeople].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = getFullName(a).localeCompare(getFullName(b), 'vi');
          break;
        case 'generation':
          cmp = a.generation - b.generation;
          break;
        case 'birthDate':
          cmp = (a.birthDate || '').localeCompare(b.birthDate || '');
          break;
        case 'deathDate':
          cmp = (a.deathDate || '').localeCompare(b.deathDate || '');
          break;
        case 'occupation':
          cmp = (a.occupation || '').localeCompare(b.occupation || '', 'vi');
          break;
        case 'hometown':
          cmp = (a.hometown || '').localeCompare(b.hometown || '', 'vi');
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [filteredPeople, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function handleRowClick(id: string) {
    setSelectedPerson(id);
    window.location.hash = `#/person/${id}`;
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1" />
    );
  }

  const headerBtnClass =
    'flex items-center gap-0.5 font-semibold text-left hover:text-amber-600 transition-colors';

  if (Object.keys(people).length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="text-center text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">{t('list.empty', 'Chưa có thành viên nào')}</p>
          <p className="text-sm text-gray-400 mt-1">
            {t('list.emptyHint', 'Hãy thêm thành viên đầu tiên vào gia phả')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <SearchBar />
          <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {t('list.total', 'Tổng cộng')}: {sortedPeople.length}/{Object.keys(people).length}{' '}
            {t('list.members', 'thành viên')}
          </div>
        </div>
        <FilterPanel />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left w-12">#</th>
              <th className="px-4 py-3">
                <button onClick={() => handleSort('name')} className={headerBtnClass}>
                  {t('list.name', 'Họ tên')}
                  <SortIcon column="name" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button onClick={() => handleSort('generation')} className={headerBtnClass}>
                  {t('list.generation', 'Đời')}
                  <SortIcon column="generation" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button onClick={() => handleSort('birthDate')} className={headerBtnClass}>
                  {t('list.birth', 'Ngày sinh')}
                  <SortIcon column="birthDate" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button onClick={() => handleSort('deathDate')} className={headerBtnClass}>
                  {t('list.death', 'Ngày mất')}
                  <SortIcon column="deathDate" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button onClick={() => handleSort('occupation')} className={headerBtnClass}>
                  {t('list.occupation', 'Nghề nghiệp')}
                  <SortIcon column="occupation" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button onClick={() => handleSort('hometown')} className={headerBtnClass}>
                  {t('list.hometown', 'Quê quán')}
                  <SortIcon column="hometown" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedPeople.map((person, index) => (
              <tr
                key={person.id}
                onClick={() => handleRowClick(person.id)}
                className="bg-white dark:bg-gray-900 hover:bg-amber-50 dark:hover:bg-gray-800
                           cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {person.avatarBase64 ? (
                      <img
                        src={person.avatarBase64}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900
                                      flex items-center justify-center">
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                          {person.firstName?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getFullName(person)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {person.generation}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {person.birthDate || '—'}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {person.deathDate || '—'}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {person.occupation || '—'}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {person.hometown || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sortedPeople.map((person, index) => (
          <div
            key={person.id}
            onClick={() => handleRowClick(person.id)}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                       rounded-lg p-4 cursor-pointer hover:border-amber-300
                       dark:hover:border-amber-600 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-400 w-5">{index + 1}</span>
              {person.avatarBase64 ? (
                <img
                  src={person.avatarBase64}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900
                                flex items-center justify-center">
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    {person.firstName?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {getFullName(person)}
                </p>
                <p className="text-xs text-gray-500">
                  {t('list.generation', 'Đời')} {person.generation}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 dark:text-gray-400 ml-8">
              {person.birthDate && (
                <p>
                  <span className="text-gray-400">{t('list.birth', 'Ngày sinh')}:</span>{' '}
                  {person.birthDate}
                </p>
              )}
              {person.deathDate && (
                <p>
                  <span className="text-gray-400">{t('list.death', 'Ngày mất')}:</span>{' '}
                  {person.deathDate}
                </p>
              )}
              {person.occupation && (
                <p>
                  <span className="text-gray-400">{t('list.occupation', 'Nghề nghiệp')}:</span>{' '}
                  {person.occupation}
                </p>
              )}
              {person.hometown && (
                <p>
                  <span className="text-gray-400">{t('list.hometown', 'Quê quán')}:</span>{' '}
                  {person.hometown}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {sortedPeople.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>{t('list.noResults', 'Không tìm thấy thành viên nào phù hợp')}</p>
        </div>
      )}
    </div>
  );
}
