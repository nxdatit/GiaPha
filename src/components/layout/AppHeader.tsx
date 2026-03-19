import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TreePine, List, Info } from 'lucide-react';
import { LanguageToggle } from '../common/LanguageToggle';
import { ExportMenu } from '../export/ExportMenu';

export function AppHeader() {
  const { t } = useTranslation();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-emerald-100 text-emerald-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <TreePine className="w-6 h-6 text-emerald-600" />
            <h1 className="text-lg font-bold text-gray-900">
              {t('app.title')}
            </h1>
          </div>

          <nav className="flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              <TreePine className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.tree')}</span>
            </NavLink>
            <NavLink to="/list" className={navLinkClass}>
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.list')}</span>
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.about')}</span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <ExportMenu />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
