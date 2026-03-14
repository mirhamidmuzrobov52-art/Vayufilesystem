import React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageCircle, Github, Twitter } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { Button } from '../components/ui/Button';

export const Support: React.FC = () => {
  const { translations: en } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      className="w-full max-w-2xl space-y-12 py-10"
    >
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-black text-m3-on-surface uppercase italic tracking-tighter">{en.support.title}</h2>
        <p className="text-m3-on-surface-variant">{en.support.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button variant="tonal" className="justify-start h-16 px-6" icon={<Mail size={20} />}>
          <div className="text-left">
            <div className="text-xs opacity-60 uppercase font-black tracking-widest">{en.support.emailLabel}</div>
            <div className="font-bold">support@katm.io</div>
          </div>
        </Button>

        <Button variant="tonal" className="justify-start h-16 px-6" icon={<MessageCircle size={20} />}>
          <div className="text-left">
            <div className="text-xs opacity-60 uppercase font-black tracking-widest">{en.support.discordLabel}</div>
            <div className="font-bold">KATM Community</div>
          </div>
        </Button>

        <div className="flex gap-4 pt-4">
          <Button variant="outlined" className="flex-1" icon={<Github size={18} />}>GitHub</Button>
          <Button variant="outlined" className="flex-1" icon={<Twitter size={18} />}>Twitter</Button>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-m3-surface-variant/30 border border-m3-outline-variant text-center space-y-2">
        <p className="text-xs text-m3-on-surface-variant uppercase tracking-widest font-bold">{en.support.faqTitle}</p>
        <p className="text-sm text-m3-on-surface-variant">{en.support.faqDesc}</p>
      </div>
    </motion.div>
  );
};
