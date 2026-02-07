
import React from 'react';
import { X, Eye } from 'lucide-react';
import { Asset } from '../services/fileEngine';
import { DocumentViewer } from './DocumentViewer';

interface PreviewModalProps {
  assets: Asset[];
  fileName: string;
  extension: string;
  onClose: () => void;
  onEnlargeAsset?: (asset: Asset) => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ 
  assets, 
  fileName, 
  extension, 
  onClose,
  onEnlargeAsset
}) => {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-10 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#F8FAFC] w-full max-w-5xl h-full rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl border border-white/30">
        <div className="bg-white px-10 py-8 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><Eye size={20}/></div>
             <div>
                <h3 className="font-black text-slate-800 tracking-tight text-lg uppercase tracking-widest">Master Preview</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{fileName || 'Untitled'}.{extension}</p>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all border border-transparent hover:border-slate-200 active:scale-90"
          >
            <X size={24}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          <DocumentViewer 
            assets={assets} 
            fileName={fileName} 
            extension={extension} 
            onEnlargeAsset={onEnlargeAsset}
          />
        </div>
      </div>
    </div>
  );
};
