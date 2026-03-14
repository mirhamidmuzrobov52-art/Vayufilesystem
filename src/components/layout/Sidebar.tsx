import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Home, Layers, FolderOpen, Info, BookOpen, LifeBuoy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Logo } from '../ui/Logo';
import { useLanguage } from '../../lib/LanguageContext';
import { LanguageSelector } from '../ui/LanguageSelector';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  setView: (view: any) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  setView,
  theme,
  toggleTheme
}) => {
  const { translations: en } = useLanguage();

  const menuItems = [
    { id: 'home', label: en.nav.home, icon: Home },
    { id: 'builder', label: en.nav.builder, icon: Layers },
    { id: 'vault', label: en.nav.vault, icon: FolderOpen },
    { id: 'about', label: en.nav.about, icon: Info },
    { id: 'guide', label: en.nav.guide, icon: BookOpen },
    { id: 'support', label: en.nav.support, icon: LifeBuoy }
  ];

  // Scroll Lock Implementation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with optimized backdrop blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-m3-on-surface/40 backdrop-blur-[4px] xl:hidden"
          />
          
          <motion.aside 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-[160] w-[320px] bg-m3-surface border-r border-m3-outline-variant/20 p-6 flex flex-col gap-8 shadow-2xl xl:hidden"
          >
            <div className="flex items-center justify-between">
              <Logo size="sm" />
              <button onClick={onClose} className="p-2 rounded-full hover:bg-m3-on-surface/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 flex-grow">
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => { setView(item.id); onClose(); }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200",
                    currentView === item.id 
                      ? "bg-m3-primary text-m3-on-primary shadow-m3-1" 
                      : "text-m3-on-surface-variant hover:bg-m3-on-surface/5"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <LanguageSelector />
            </div>

            <div className="p-6 bg-m3-surface-container rounded-[2rem] border border-m3-outline-variant/10">
              <p className="text-[10px] font-black uppercase tracking-[1.2em] ml-[1.2em] text-m3-on-surface">ARXUN</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-m3-on-surface-variant/40 mt-1">ARXUN Studio Pro v5.0</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
