import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Shield, Zap, Database } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { Card } from '../components/ui/Card';

export const Guide: React.FC = () => {
  const { translations: en } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      className="w-full max-w-4xl space-y-12 py-10"
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-m3-on-surface uppercase italic tracking-tighter">{en.guide.title}</h2>
        <p className="text-m3-on-surface-variant max-w-xl">{en.guide.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-m3-primary/10 flex items-center justify-center text-m3-primary">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold text-m3-on-surface">{en.guide.step1Title}</h3>
          <p className="text-sm text-m3-on-surface-variant leading-relaxed">{en.guide.step1Desc}</p>
        </Card>

        <Card className="p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-m3-secondary/10 flex items-center justify-center text-m3-secondary">
            <Database size={24} />
          </div>
          <h3 className="text-xl font-bold text-m3-on-surface">{en.guide.step2Title}</h3>
          <p className="text-sm text-m3-on-surface-variant leading-relaxed">{en.guide.step2Desc}</p>
        </Card>

        <Card className="p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-m3-tertiary/10 flex items-center justify-center text-m3-tertiary">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-m3-on-surface">{en.guide.step3Title}</h3>
          <p className="text-sm text-m3-on-surface-variant leading-relaxed">{en.guide.step3Desc}</p>
        </Card>

        <Card className="p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-m3-error/10 flex items-center justify-center text-m3-error">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-m3-on-surface">{en.guide.step4Title}</h3>
          <p className="text-sm text-m3-on-surface-variant leading-relaxed">{en.guide.step4Desc}</p>
        </Card>
      </div>
    </motion.div>
  );
};
