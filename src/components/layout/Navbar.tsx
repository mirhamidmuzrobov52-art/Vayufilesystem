import React, { useState } from 'react';
import { Globe, Sun, Moon, Menu, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Logo } from '../ui/Logo';
import { useLanguage } from '../../lib/LanguageContext';

interface NavbarProps {
  currentView: string;
  setView: (view: any) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onMobileMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setView,
  theme,
  toggleTheme,
  onMobileMenuToggle
}) => {
  const { language, setLanguage, translations: en } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const navItems = [
    { id: 'home', label: en.nav.home },
    { id: 'builder', label: en.nav.builder },
    { id: 'vault', label: en.nav.vault },
    { id: 'about', label: en.nav.about },
    { id: 'guide', label: en.nav.guide },
    { id: 'support', label: en.nav.support }
  ];

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

  return (
    <nav className="fixed top-6 left-6 right-6 z-[100] flex justify-between items-center pointer-events-none">
      {/* Brand Container */}
      <button 
        onClick={() => setView('home')}
        className="pointer-events-auto flex items-center gap-3 bg-m3-surface-container/80 backdrop-blur-2xl border border-m3-outline-variant/20 rounded-full px-5 py-3 shadow-lg shadow-black/10 hover:bg-m3-surface-container/90 transition-all"
      >
        <Logo size="sm" />
      </button>

      {/* Desktop Navigation */}
      <div className="hidden xl:flex pointer-events-auto items-center gap-1 bg-m3-surface-container/80 backdrop-blur-2xl border border-m3-outline-variant/20 rounded-full px-2 py-1.5 shadow-lg shadow-black/10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
              currentView === item.id
                ? "bg-m3-primary text-m3-on-primary shadow-md"
                : "text-m3-on-surface-variant hover:bg-m3-on-surface/10 hover:text-m3-on-surface"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Controls Container */}
      <div className="pointer-events-auto flex items-center gap-2 bg-m3-surface-container/80 backdrop-blur-2xl border border-m3-outline-variant/20 rounded-full px-3 py-2 shadow-lg shadow-black/10">
        {/* Desktop Language Selector */}
        <div className="hidden xl:block relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-m3-on-surface-variant hover:bg-m3-on-surface/10 transition-all"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-bold">{languages.find(l => l.id === language)?.label || 'English'}</span>
            <ChevronDown className={cn("w-3 h-3 transition-transform", isLangOpen ? "rotate-180" : "")} />
          </button>
          
          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-48 bg-m3-surface-container rounded-2xl p-2 shadow-xl border border-m3-outline-variant/20 z-50"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id);
                      setIsLangOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all",
                      language === lang.id
                        ? "bg-m3-primary text-m3-on-primary"
                        : "text-m3-on-surface hover:bg-m3-on-surface/5"
                    )}
                  >
                    {lang.label}
                    {language === lang.id && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden xl:block w-[1px] h-4 bg-m3-outline-variant/30 mx-1" />

        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-m3-on-surface-variant hover:bg-m3-on-surface/10 transition-all"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <button 
          onClick={onMobileMenuToggle}
          className="xl:hidden p-2.5 rounded-full bg-m3-primary text-m3-on-primary transition-all shadow-md"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
