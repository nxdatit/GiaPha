import React, { useCallback } from 'react';
import {
  ArrowDownUp,
  ArrowLeftRight,
  ChevronsDownUp,
  ChevronsUpDown,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../store/uiStore';
import { useFamilyTreeStore } from '../../store/familyTreeStore';

const TreeControls: React.FC = () => {
  const { t } = useTranslation();
  const orientation = useUIStore((s) => s.orientation);
  const setOrientation = useUIStore((s) => s.setOrientation);
  const collapseAll = useUIStore((s) => s.collapseAll);
  const expandAll = useUIStore((s) => s.expandAll);
  const people = useFamilyTreeStore((s) => s.people);

  const toggleOrientation = useCallback(() => {
    setOrientation(orientation === 'vertical' ? 'horizontal' : 'vertical');
  }, [orientation, setOrientation]);

  const handleCollapseAll = useCallback(() => {
    const idsWithChildren = Object.values(people)
      .filter((p) => p.childrenIds.length > 0)
      .map((p) => p.id);
    collapseAll(idsWithChildren);
  }, [people, collapseAll]);

  const handleExpandAll = useCallback(() => {
    expandAll();
  }, [expandAll]);

  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-white rounded-lg shadow-md border border-gray-200 p-1.5">
      <button
        onClick={toggleOrientation}
        className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
        title={
          orientation === 'vertical'
            ? t('tree.switchHorizontal', 'Chuyển ngang')
            : t('tree.switchVertical', 'Chuyển dọc')
        }
      >
        {orientation === 'vertical' ? (
          <ArrowLeftRight size={18} />
        ) : (
          <ArrowDownUp size={18} />
        )}
      </button>

      <div className="border-t border-gray-200" />

      <button
        onClick={handleCollapseAll}
        className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
        title={t('tree.collapseAll', 'Thu gọn tất cả')}
      >
        <ChevronsDownUp size={18} />
      </button>

      <button
        onClick={handleExpandAll}
        className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
        title={t('tree.expandAll', 'Mở rộng tất cả')}
      >
        <ChevronsUpDown size={18} />
      </button>
    </div>
  );
};

export default TreeControls;
