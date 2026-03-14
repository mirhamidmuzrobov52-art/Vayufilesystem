import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';

export const About: React.FC = () => {
  const { translations: en } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      className="w-full max-w-3xl space-y-10 py-10 text-left"
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-m3-on-surface uppercase italic tracking-tighter">{en.about.title}</h2>
        <div className="h-1 w-16 bg-m3-primary" />
      </div>
      <div className="prose prose-sm text-m3-on-surface-variant leading-relaxed space-y-6">
        <p>{en.about.p1}</p>
        <p>{en.about.p2}</p>
        <div className="grid grid-cols-2 gap-6 pt-6">
          <div className="space-y-1">
            <h4 className="font-black text-m3-on-surface uppercase text-[10px] tracking-widest">{en.about.vision}</h4>
            <p className="text-xs opacity-60">{en.about.visionDesc}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-m3-on-surface uppercase text-[10px] tracking-widest">{en.about.tech}</h4>
            <p className="text-xs opacity-60">{en.about.techDesc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
