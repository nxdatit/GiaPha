import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../store/uiStore';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const toggleLanguage = useUIStore((state) => state.toggleLanguage);
  const language = useUIStore((state) => state.language);

  const handleToggle = () => {
    const newLang = language === 'vi' ? 'en' : 'vi';
    toggleLanguage();
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={handleToggle}
      className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
      title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
    >
      {language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
    </button>
  );
}
