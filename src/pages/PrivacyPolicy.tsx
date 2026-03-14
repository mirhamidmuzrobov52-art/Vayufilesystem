import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';

export const PrivacyPolicy: React.FC = () => {
  const { translations: t } = useLanguage();
  const p = t.privacy;

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
        <p className="whitespace-pre-wrap break-words">{p.dataCollectionDesc}</p>
        <ul className="list-disc pl-4 sm:pl-6 space-y-2 break-words">
          <li>{p.personalData}</li>
          <li>{p.technicalData}</li>
          <li>{p.files}</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section3}</h2>
        <p className="whitespace-pre-wrap break-words">{p.dataUsageDesc}</p>
        <ul className="list-disc pl-4 sm:pl-6 space-y-2 break-words">
          <li>{p.provideService}</li>
          <li>{p.contact}</li>
          <li>{p.security}</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section4}</h2>
        <p className="whitespace-pre-wrap break-words">{p.retentionDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section5}</h2>
        <p className="whitespace-pre-wrap break-words">{p.protectionDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section6}</h2>
        <p className="whitespace-pre-wrap break-words">{p.sharingDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section7}</h2>
        <p className="whitespace-pre-wrap break-words">{p.cookiesDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section8}</h2>
        <p className="whitespace-pre-wrap break-words">{p.rightsDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section9}</h2>
        <p className="whitespace-pre-wrap break-words">{p.childrenDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section10}</h2>
        <p className="whitespace-pre-wrap break-words">{p.transfersDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section11}</h2>
        <p className="whitespace-pre-wrap break-words">{p.linksDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section12}</h2>
        <p className="whitespace-pre-wrap break-words">{p.policyChangesDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section13}</h2>
        <p className="whitespace-pre-wrap break-words">{p.contactUsDesc}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold break-words">{p.section14}</h2>
        <p className="whitespace-pre-wrap break-words">{p.definitionsDesc}</p>
      </section>
    </motion.div>
  );
};
