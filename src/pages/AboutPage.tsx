import { useTranslation } from 'react-i18next';
import {
  TreePine,
  Search,
  Download,
  Languages,
  WifiOff,
  Info,
} from 'lucide-react';

const featureIcons = {
  tree: TreePine,
  search: Search,
  export: Download,
  bilingual: Languages,
  offline: WifiOff,
};

export function AboutPage() {
  const { t } = useTranslation();

  const features = Object.entries(featureIcons).map(([key, Icon]) => ({
    key,
    icon: Icon,
    text: t(`about.featureList.${key}`),
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 bg-gradient-to-br from-emerald-50 to-teal-50 text-center">
          <Info className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {t('about.title')}
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            {t('about.description')}
          </p>
        </div>

        {/* Features */}
        <div className="px-6 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('about.features')}
          </h2>
          <ul className="space-y-3">
            {features.map(({ key, icon: Icon, text }) => (
              <li key={key} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700 pt-1">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Storage note */}
        <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
          <p className="text-sm text-amber-800">{t('about.storage')}</p>
        </div>
      </div>
    </div>
  );
}
