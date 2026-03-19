import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileText, Image, Database, Upload } from 'lucide-react';
import { useFamilyTreeStore } from '../../store/familyTreeStore';
import {
  exportTreeToPDF,
  exportTreeToPNG,
  exportDataToJSON,
  importDataFromJSON,
} from '../../utils/exportUtils';

export function ExportMenu() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = useFamilyTreeStore((s) => s.exportData);
  const importData = useFamilyTreeStore((s) => s.importData);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleExportPDF() {
    setIsOpen(false);
    setIsExporting(true);
    try {
      await exportTreeToPDF('tree-canvas', 'gia-pha');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert(t('export.errorPDF', 'Không thể xuất PDF. Hãy chắc chắn đang ở trang cây gia phả.'));
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportPNG() {
    setIsOpen(false);
    setIsExporting(true);
    try {
      await exportTreeToPNG('tree-canvas', 'gia-pha');
    } catch (error) {
      console.error('Failed to export PNG:', error);
      alert(t('export.errorPNG', 'Không thể xuất PNG. Hãy chắc chắn đang ở trang cây gia phả.'));
    } finally {
      setIsExporting(false);
    }
  }

  function handleExportJSON() {
    setIsOpen(false);
    try {
      const data = exportData();
      exportDataToJSON(data, 'gia-pha-backup');
    } catch (error) {
      console.error('Failed to export JSON:', error);
      alert(t('export.errorJSON', 'Không thể xuất dữ liệu.'));
    }
  }

  function handleImportClick() {
    setIsOpen(false);
    const confirmed = window.confirm(
      t(
        'export.importConfirm',
        'Nhập dữ liệu sẽ thay thế toàn bộ dữ liệu hiện tại. Bạn có chắc chắn muốn tiếp tục?'
      )
    );
    if (confirmed) {
      fileInputRef.current?.click();
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importDataFromJSON(file);

      if (!data.people || !data.metadata) {
        throw new Error('Invalid data format');
      }

      importData(data);
      alert(t('export.importSuccess', 'Nhập dữ liệu thành công!'));
    } catch (error) {
      console.error('Failed to import JSON:', error);
      alert(
        t(
          'export.importError',
          'Không thể nhập dữ liệu. Hãy chắc chắn file JSON hợp lệ.'
        )
      );
    }

    // Reset file input so the same file can be re-imported if needed
    e.target.value = '';
  }

  const menuItemClass =
    'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left ' +
    'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                   text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                   border border-gray-300 dark:border-gray-600 rounded-lg
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        {isExporting
          ? t('export.exporting', 'Đang xuất...')
          : t('export.button', 'Xuất')}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-56 bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg
                        overflow-hidden">
          <button onClick={handleExportPDF} className={menuItemClass}>
            <FileText className="w-4 h-4 text-red-500" />
            <span>{t('export.pdf', 'Xuất PDF')}</span>
          </button>

          <button onClick={handleExportPNG} className={menuItemClass}>
            <Image className="w-4 h-4 text-green-500" />
            <span>{t('export.png', 'Xuất PNG')}</span>
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700" />

          <button onClick={handleExportJSON} className={menuItemClass}>
            <Database className="w-4 h-4 text-blue-500" />
            <span>{t('export.backupJSON', 'Sao lưu JSON')}</span>
          </button>

          <button onClick={handleImportClick} className={menuItemClass}>
            <Upload className="w-4 h-4 text-amber-500" />
            <span>{t('export.importJSON', 'Nhập JSON')}</span>
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
