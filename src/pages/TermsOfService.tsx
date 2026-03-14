import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';

export const TermsOfService: React.FC = () => {
  const { translations: t } = useLanguage();
  const p = t.terms;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8 text-m3-on-surface break-words"
    >
      <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight break-words">{p.title}</h1>
      <p className="text-m3-on-surface-variant break-words">{p.lastUpdated}</p>
      
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section1}</h2>
        <p className="whitespace-pre-wrap break-words">{p.intro}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section2}</h2>
        <p className="whitespace-pre-wrap break-words">{p.acceptanceDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section3}</h2>
        <p className="whitespace-pre-wrap break-words">{p.usageDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section4}</h2>
        <p className="whitespace-pre-wrap break-words">{p.accountsDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section5}</h2>
        <p className="whitespace-pre-wrap break-words">{p.intellectualPropertyDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section6}</h2>
        <p className="whitespace-pre-wrap break-words">{p.conductDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section7}</h2>
        <p className="whitespace-pre-wrap break-words">{p.indemnificationDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section8}</h2>
        <p className="whitespace-pre-wrap break-words">{p.changesDesc}</p>
      </section>
    </motion.div>
  );
};
