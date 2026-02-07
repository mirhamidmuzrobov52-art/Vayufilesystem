
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { FileCode, Unlock, FolderOpen, Edit3, X, Zap, ShieldCheck, Box, Layers, Maximize2, Cpu, Play } from 'lucide-react';
import { FilePackage, Asset } from '../services/fileEngine';
import { DocumentViewer } from './DocumentViewer';
import { M3Button, M3Card } from './shared/M3Components';

interface ReaderViewProps {
  loadedFile: FilePackage | null;
  onOpenFormat: () => void;
  onEdit: (file: FilePackage) => void;
  onClose: () => void;
  onEnlargeAsset: (asset: Asset) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ 
  loadedFile, onOpenFormat, onEdit, onClose, onEnlargeAsset 
}) => {
  const containerRef = React.useRef(null);

  useEffect(() => {
    if (loadedFile && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [loadedFile]);

  if (!loadedFile) {
    return (
      <div className="px-4 py-8 md:py-16">
        <M3Card variant="elevated" className="py-20 px-8 text-center flex flex-col items-center gap-10 bg-white/70 backdrop-blur-xl border-white/50 shadow-[0_30px_70px_rgba(0,0,0,0.05)] rounded-[3rem]">
          <div className="relative group cursor-pointer" onClick={onOpenFormat}>
            <div className="absolute -inset-8 bg-indigo-500/10 rounded-full blur-3xl animate-pulse group-hover:bg-indigo-500/20 transition-all"></div>
            <div className="w-32 h-32 md:w-40 md:h-40 bg-indigo-50 text-indigo-600 rounded-[3.5rem] flex items-center justify-center elevation-1 relative z-10 border-4 border-white transition-transform group-hover:scale-110 duration-500">
              <Unlock size={56} strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-[#1b1b1f] tracking-tight uppercase italic leading-none">Vayu Vault</h2>
            <p className="text-xs md:text-sm text-[#585e71] max-w-xs mx-auto font-medium leading-relaxed opacity-60">
              Open encrypted .vayu archives and interact with integrated rich media.
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenFormat} 
            className="w-full max-w-sm py-16 md:py-20 border-2 border-dashed border-[#c7c6d0] rounded-[3rem] text-[#4f46e5] font-black uppercase tracking-[0.2em] hover:bg-white hover:border-[#4f46e5] transition-all flex flex-col items-center gap-6 group"
          >
            <div className="p-5 bg-indigo-100/50 rounded-3xl shadow-lg group-hover:shadow-indigo-100 transition-all text-indigo-600">
              <FolderOpen size={40} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] opacity-70">Initialize Import</span>
          </motion.button>
        </M3Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-8 md:space-y-12 px-2 md:px-0 pb-32 max-w-6xl mx-auto">
      
      {/* Decrypted Meta Banner */}
      <M3Card variant="elevated" className="bg-[#1b1b1f] text-white p-6 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden relative shadow-[0_25px_80px_-15px_rgba(0,0,0,0.4)] border-none rounded-[3rem]">
        <div className="absolute top-[-20%] right-[-10%] p-12 opacity-[0.04] pointer-events-none hidden md:block">
           <Cpu size={320} strokeWidth={2} />
        </div>
        
        <div className="flex items-center gap-6 md:gap-8 relative z-10 w-full md:w-auto">
          <div className="p-5 md:p-7 bg-white/5 rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl">
            <FileCode size={36} md:size={48} strokeWidth={1.5} className="text-indigo-400" />
          </div>
          <div className="space-y-2 overflow-hidden">
             <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-green-400/80">Checksum Verified</p>
             </div>
             <h4 className="font-black text-2xl md:text-4xl tracking-tighter truncate italic uppercase">{loadedFile.meta.name}.{loadedFile.meta.ext}</h4>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
          <M3Button 
            variant="tonal" 
            className="py-5 bg-white/5 text-white hover:bg-white/10 border-none rounded-2xl md:px-12" 
            onClick={onClose} 
            icon={X}
          >
            Close Vault
          </M3Button>
          <M3Button 
            className="py-5 px-10 md:px-16 rounded-2xl font-black text-lg tracking-wider" 
            onClick={() => onEdit(loadedFile)} 
            icon={Edit3}
          >
            Edit Mode
          </M3Button>
        </div>
      </M3Card>

      {/* Document Canvas */}
      <div className="bg-white rounded-[3rem] md:rounded-[4.5rem] py-12 md:py-28 px-6 md:px-32 elevation-2 border border-[#c7c6d020] overflow-hidden relative shadow-2xl">
         <DocumentViewer 
            assets={loadedFile.data} 
            fileName={loadedFile.meta.name} 
            extension={loadedFile.meta.ext} 
            isReadOnly 
            onEnlargeAsset={onEnlargeAsset} 
         />
      </div>

      {/* Media Quick-Access Blueprint */}
      <M3Card variant="outlined" className="p-10 md:p-20 text-center space-y-12 md:space-y-16 rounded-[3.5rem] md:rounded-[4.5rem] bg-white/30 border-indigo-100/40 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
           <Zap size={20} className="text-indigo-500 animate-pulse" />
           <p className="text-[11px] font-black text-[#585e71] uppercase tracking-[0.6em] italic">Binary Media Fragments</p>
           <div className="w-24 h-[1px] bg-indigo-100"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {loadedFile.data.filter(a => a.type !== 'text').map(asset => (
            <motion.button 
              whileHover={{ scale: 1.12, y: -12, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              key={asset.id}
              onClick={() => onEnlargeAsset(asset)}
              className="group relative aspect-square rounded-3xl md:rounded-[2.5rem] overflow-hidden border-4 border-white elevation-1 hover:elevation-4 transition-all ring-1 ring-indigo-50 shadow-xl bg-slate-900"
            >
              {asset.type === 'video' ? (
                <div className="w-full h-full relative">
                   <video src={asset.dataUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125" />
                   <div className="absolute inset-0 flex items-center justify-center text-white/80">
                      <Play size={24} fill="currentColor" />
                   </div>
                </div>
              ) : (
                <img src={asset.dataUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125" alt={asset.name} />
              )}
              <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                <Maximize2 size={32} className="text-white drop-shadow-2xl" />
              </div>
            </motion.button>
          ))}
          {loadedFile.data.filter(a => a.type !== 'text').length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-6 opacity-30 py-16">
               <Layers size={64} className="text-indigo-900/20" />
               <p className="text-xs font-black uppercase tracking-[0.4em]">Zero Visual Fragments</p>
            </div>
          )}
        </div>
      </M3Card>
    </div>
  );
};
