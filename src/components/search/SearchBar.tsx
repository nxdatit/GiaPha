import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useFamilyTreeStore } from '../../store/familyTreeStore';
import { useUIStore } from '../../store/uiStore';
import { getFullName } from '../../store/selectors';
import { useSearch } from '../../hooks/useSearch';

export function SearchBar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const people = useFamilyTreeStore((s) => s.people);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const setSelectedPerson = useUIStore((s) => s.setSelectedPerson);

  const { results, debouncedQuery } = useSearch(people, searchQuery);

  const visibleResults = debouncedQuery.trim().length > 0 ? results.slice(0, 10) : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  }

  function handleSelectPerson(id: string) {
    setSelectedPerson(id);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={t('search.placeholder', 'Tìm kiếm thành viên...')}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                     bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {isOpen && visibleResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200
                        dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {visibleResults.map((person) => (
            <button
              key={person.id}
              onClick={() => handleSelectPerson(person.id)}
              className="w-full flex items-center gap-3 px-4 py-2 text-left
                         hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors
                         border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              {person.avatarBase64 ? (
                <img
                  src={person.avatarBase64}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900
                                flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    {person.firstName?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {getFullName(person)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('search.generation', 'Đời')}: {person.generation}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
