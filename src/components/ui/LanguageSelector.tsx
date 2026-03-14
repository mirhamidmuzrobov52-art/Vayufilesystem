import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../lib/LanguageContext';

const languages = [
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Русский' },
  { id: 'uz', label: 'Oʻzbekcha' },
  { id: 'sa', label: 'العربية (SA)' },
  { id: 'uae', label: 'العربية (AE)' },
  { id: 'id', label: 'Bahasa Indonesia' },
  { id: 'de', label: 'Deutsch' },
  { id: 'ko', label: '한국어' }
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLang = languages.find(l => l.id === language);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-m3-surface-container-low hover:bg-m3-surface-container transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-m3-primary" />
          <span className="text-sm font-bold text-m3-on-surface">
            {selectedLang?.label}
          </span>
        </div>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 w-full mb-2 bg-m3-surface-container rounded-2xl p-2 shadow-xl border border-m3-outline-variant/20 z-50 max-h-60 overflow-y-auto"
          >
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  language === lang.id
                    ? "bg-m3-primary text-m3-on-primary"
                    : "text-m3-on-surface hover:bg-m3-on-surface/5"
                )}
              >
                {lang.label}
                {language === lang.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
