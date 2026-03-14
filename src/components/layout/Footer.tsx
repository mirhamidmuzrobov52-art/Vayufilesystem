import React from 'react';
import { Logo } from '../ui/Logo';
import { Github, Twitter, Mail } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

export const Footer: React.FC<{ setView: (view: any) => void }> = ({ setView }) => {
  const { translations: t } = useLanguage();

  return (
    <footer className="w-full mt-20 bg-m3-surface-container-low border-t border-m3-on-surface/10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="space-y-4">
          <Logo size="sm" />
          <p className="text-m3-on-surface-variant text-sm leading-relaxed">
            {t.brand.fullName}. {t.brand.tagline}.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-m3-on-surface">{t.nav.home}</h4>
          <ul className="space-y-2">
            <li><button onClick={() => setView('guide')} className="text-sm text-m3-on-surface-variant hover:text-m3-primary transition-colors">{t.nav.guide}</button></li>
            <li><button onClick={() => setView('support')} className="text-sm text-m3-on-surface-variant hover:text-m3-primary transition-colors">{t.nav.support}</button></li>
            <li><button onClick={() => setView('about')} className="text-sm text-m3-on-surface-variant hover:text-m3-primary transition-colors">{t.nav.about}</button></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-m3-on-surface">{t.nav.support}</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-m3-surface-container flex items-center justify-center text-m3-on-surface hover:bg-m3-primary hover:text-m3-on-primary transition-all shadow-sm">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-m3-surface-container flex items-center justify-center text-m3-on-surface hover:bg-m3-primary hover:text-m3-on-primary transition-all shadow-sm">
              <Github size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-m3-surface-container flex items-center justify-center text-m3-on-surface hover:bg-m3-primary hover:text-m3-on-primary transition-all shadow-sm">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center pt-8 border-t border-m3-on-surface/10 text-xs text-m3-on-surface-variant/70 font-medium space-y-4">
        <p>© {new Date().getFullYear()} {t.brand.name}. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <button onClick={() => setView('privacy')} className="hover:text-m3-primary transition-colors">{t.privacy.title}</button>
          <button onClick={() => setView('terms')} className="hover:text-m3-primary transition-colors">{t.terms.title}</button>
        </div>
      </div>
    </footer>
  );
};
