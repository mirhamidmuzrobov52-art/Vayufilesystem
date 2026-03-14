import React from 'react';
import { motion } from 'motion/react';
import { FileText, Image as ImageIcon, Video, Music, File, Download, X, Maximize2 } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface UniversalViewerProps {
  asset: {
    name: string;
    type: string;
    data: string | Uint8Array;
  } | null;
  onClose: () => void;
}

import { useLanguage } from '@/src/lib/LanguageContext';

export const UniversalViewer: React.FC<UniversalViewerProps> = ({ asset, onClose }) => {
  const { translations: en } = useLanguage();
  if (!asset) return null;

  const renderContent = () => {
    const { type, data, name } = asset;

    if (type.startsWith('image/')) {
      return (
        <img 
          src={data as string} 
          alt={name} 
          className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
          referrerPolicy="no-referrer"
        />
      );
    }

    if (type.startsWith('video/')) {
      return (
        <video controls className="max-w-full max-h-[70vh] rounded-xl shadow-2xl">
          <source src={data as string} type={type} />
        </video>
      );
    }

    if (type.startsWith('audio/')) {
      return (
        <div className="p-12 bg-m3-surface-container rounded-3xl border border-m3-outline-variant flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-m3-primary/10 flex items-center justify-center text-m3-primary animate-pulse">
            <Music size={40} />
          </div>
          <audio controls className="w-full max-w-md">
            <source src={data as string} type={type} />
          </audio>
          <p className="font-bold text-m3-on-surface">{name}</p>
        </div>
      );
    }

    // Fallback for other types
    return (
      <div className="p-12 bg-m3-surface-container rounded-3xl border border-m3-outline-variant flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-m3-secondary/10 flex items-center justify-center text-m3-secondary">
          <File size={40} />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-bold text-m3-on-surface">{name}</p>
          <p className="text-sm text-m3-on-surface-variant uppercase font-black tracking-widest">{type}</p>
        </div>
        <Button variant="filled" icon={<Download size={18} />} onClick={() => {
          const link = document.createElement('a');
          link.href = data as string;
          link.download = name;
          link.click();
        }}>
          {en.builder.downloadToView}
        </Button>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-xl"
    >
      <div className="absolute top-6 right-6 flex gap-2">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={onClose}
          icon={<X size={24} />}
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-5xl flex flex-col items-center justify-center"
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
};
