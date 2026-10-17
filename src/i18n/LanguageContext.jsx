
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { translations } from './translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio-language');
      return saved === 'id' || saved === 'en'
        ? saved
        : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;

    try {
      localStorage.setItem(
        'portfolio-language',
        language
      );
    } catch {
      // Tetap berfungsi jika penyimpanan diblokir
    }
  }, [language]);

  const value = useMemo(() => {
    const t = (key) => {
      const resolve = (locale) =>
        key
          .split('.')
          .reduce(
            (obj, part) => obj?.[part],
            translations[locale]
          );

      const result =
        resolve(language) ?? resolve('en');

      return typeof result === 'string'
        ? result
        : key;
    };

    return {
      language,
      setLanguage,
      t,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider'
    );
  }

  return context;
};
