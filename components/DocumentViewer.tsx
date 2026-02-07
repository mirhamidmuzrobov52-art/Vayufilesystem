
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Asset } from '../services/fileEngine';
import { LazyMedia } from './LazyMedia';

interface DocumentViewerProps {
  assets: Asset[];
  fileName: string;
  extension: string;
  isReadOnly?: boolean;
  onEnlargeAsset?: (asset: Asset) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  assets, 
  fileName, 
  extension, 
  isReadOnly = false,
  onEnlargeAsset 
}) => {
  return (
    <div className="max-w-[760px] mx-auto min-h-[600px] flex flex-col">
      <div className="mb-12 md:mb-20 space-y-4 md:space-y-6">
        <div className="flex items-center gap-2 opacity-40">
            <Sparkles size={12} />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">{isReadOnly ? 'Binary Print' : 'Composition Live'}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[#1b1b1f] leading-tight tracking-tighter uppercase italic break-words">
          {fileName || 'Untitled'}
        </h1>
        <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-2">
           <div className="px-4 py-1.5 bg-[#f3f4f9] rounded-full border border-[#c7c6d040] text-[9px] md:text-[10px] font-black text-[#585e71] uppercase tracking-widest">
                Format: {extension}
           </div>
           <div className="hidden sm:block w-2 h-2 rounded-full bg-[#4f46e5]/20"></div>
           <span className="text-[9px] md:text-[10px] font-bold text-[#c7c6d0] uppercase tracking-widest italic">Vayu Secure Export</span>
        </div>
      </div>

      <div className="space-y-12 md:space-y-20 flex-1">
        {assets.map((asset) => (
          <div key={asset.id} className="relative group">
            {asset.type === 'text' && (
              <div className="text-[#1b1b1f] leading-[1.8] text-lg md:text-xl font-medium antialiased whitespace-pre-wrap">
                {asset.content || <span className="text-[#c7c6d0] font-normal italic">Void segment...</span>}
              </div>
            )}

            {(asset.type === 'image' || asset.type === 'video') && asset.dataUrl && (
              <div 
                className="rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl md:shadow-2xl shadow-indigo-100/40 ring-1 ring-black/5 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => onEnlargeAsset?.(asset)}
              >
                <LazyMedia 
                    id={asset.id}
                    type={asset.type} 
                    src={asset.dataUrl} 
                    alt={asset.name} 
                    objectFit={asset.objectFit}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-24 md:mt-32 pt-12 border-t border-[#f3f4f9] flex flex-col items-center gap-6">
        <div className="w-12 h-1 bg-[#4f46e5] rounded-full opacity-10"></div>
        <p className="text-[10px] font-black tracking-[0.6em] text-[#c7c6d0] uppercase italic">Terminus</p>
      </div>
    </div>
  );
};
