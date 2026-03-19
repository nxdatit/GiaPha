import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFamilyTreeStore } from '../store/familyTreeStore';
import { useUIStore } from '../store/uiStore';
import { TreePine, UserPlus, Upload, Database } from 'lucide-react';
import { generateSampleData } from '../data/sampleData';
import TreeCanvas from '../components/tree/TreeCanvas';
import TreeControls from '../components/tree/TreeControls';
import PersonDetail from '../components/person/PersonDetail';
import PersonForm from '../components/person/PersonForm';
import { SearchBar } from '../components/search/SearchBar';
import { FilterPanel } from '../components/search/FilterPanel';
import { importDataFromJSON } from '../utils/exportUtils';

export function TreePage() {
  const { t } = useTranslation();
  const people = useFamilyTreeStore((state) => state.people);
  const importData = useFamilyTreeStore((state) => state.importData);
  const selectedPersonId = useUIStore((state) => state.selectedPersonId);
  const setSelectedPerson = useUIStore((state) => state.setSelectedPerson);
  const hasPeople = Object.keys(people).length > 0;

  const [showAddForm, setShowAddForm] = useState(false);

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const data = await importDataFromJSON(file);
        importData(data);
      } catch {
        alert(t('export.importError'));
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {hasPeople && (
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex items-center gap-4 flex-wrap">
          <SearchBar />
          <FilterPanel />
        </div>
      )}

      <div className="flex-1 relative" id="tree-canvas">
        {hasPeople ? (
          <>
            <TreeCanvas />
            <TreeControls />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-4">
              <TreePine className="w-20 h-20 mx-auto mb-6 text-emerald-200" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {t('empty.title')}
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {t('empty.description')}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <UserPlus className="w-5 h-5" />
                {t('empty.addFirst')}
              </button>
              <div className="mt-4 flex flex-col items-center gap-3">
                <button
                  onClick={() => importData(generateSampleData())}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-emerald-300 text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <Database className="w-4 h-4" />
                  {t('empty.loadSample')}
                </button>
                <div className="text-sm text-gray-400">
                  {t('empty.orImport')}{' '}
                  <button
                    onClick={handleImport}
                    className="text-emerald-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    {t('empty.importData')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedPersonId && people[selectedPersonId] && (
        <PersonDetail
          personId={selectedPersonId}
          onClose={() => setSelectedPerson(null)}
        />
      )}

      <PersonForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
      />
    </div>
  );
}
