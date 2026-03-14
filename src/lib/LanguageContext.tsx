import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './lang/english.json';

type Translations = typeof en;

interface LanguageContextType {
  language: string;
  translations: Translations;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languages: Record<string, any> = {
  en,
  ru: () => import('./lang/ru.json'),
  uz: () => import('./lang/uz.json'),
  sa: () => import('./lang/sa.json'),
  uae: () => import('./lang/uae.json'),
  id: () => import('./lang/id.json'),
  de: () => import('./lang/de.json'),
  ko: () => import('./lang/ko.json'),
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<Translations>(en);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('arxun_lang', lang);
    if (lang === 'en') {
      setTranslations(en);
    } else {
      try {
        const module = await languages[lang]();
        setTranslations(module.default || module);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}`, error);
        setTranslations(en);
      }
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('arxun_lang');
    if (savedLang && languages[savedLang]) {
      setLanguage(savedLang);
    } else {
      // Auto-detection
      const browserLang = navigator.language.split('-')[0];
      const region = navigator.language.split('-')[1];
      
      let detected = 'en';
      if (browserLang === 'ru') detected = 'ru';
      else if (browserLang === 'uz') detected = 'uz';
      else if (browserLang === 'de') detected = 'de';
      else if (browserLang === 'ko') detected = 'ko';
      else if (browserLang === 'id') detected = 'id';
      else if (browserLang === 'ar') {
        if (region === 'SA') detected = 'sa';
        else if (region === 'AE') detected = 'uae';
        else detected = 'sa'; // Default Arabic
      }
      
      setLanguage(detected);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
