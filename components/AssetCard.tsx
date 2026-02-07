
import React from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { GripVertical, Maximize2, Trash2, Settings2 } from 'lucide-react';
import { Asset } from '../services/fileEngine';
import { M3Card } from './shared/M3Components';

interface AssetCardProps {
  asset: Asset;
  onRemove: (id: string) => void;
  onUpdateText: (id: string, content: string) => void;
  onUpdateAsset: (id: string, updates: Partial<Asset>) => void;
  onEnlarge: (asset: Asset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset, onRemove, onUpdateText, onUpdateAsset, onEnlarge
}) => {
  const controls = useDragControls();
  const fitMode = asset.objectFit || 'contain';
  const fitClasses = { cover: 'object-cover', contain: 'object-contain', fill: 'object-fill' };

  return (
    <Reorder.Item
      value={asset}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      whileDrag={{ 
        scale: 1.03,
        zIndex: 50,
      }}
      className="list-none mb-6 group select-none"
    >
      <motion.div
        whileDrag={{
          backgroundColor: "#f5f7ff",
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        }}
        className="rounded-[1.75rem]"
      >
        <M3Card variant="elevated" className="relative flex flex-col gap-6 overflow-hidden border border-[#c7c6d040] hover:border-[#4f46e550] shadow-sm transition-colors duration-300">
          
          {/* Header: Drag Handle, Identity, Always Visible Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div 
                  onPointerDown={(e) => controls.start(e)}
                  className="cursor-grab active:cursor-grabbing text-[#c7c6d0] p-2 rounded-xl hover:bg-[#4f46e510] hover:text-[#4f46e5] transition-all touch-none"
               >
                  <GripVertical size={20} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#585e71] mb-0.5">
                      {asset.type} Element
                  </span>
                  <h4 className="text-sm font-bold text-[#1b1b1f] truncate max-w-[150px] sm:max-w-[300px]">{asset.name}</h4>
               </div>
            </div>

            <button 
              onClick={() => onRemove(asset.id)}
              className="p-3 text-[#ba1a1a] bg-[#ffdad640] hover:bg-[#ffdad6] rounded-full transition-all border border-[#ba1a1a20]"
              aria-label="Remove element"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Content Segment */}
          <div className="space-y-4">
            {asset.type === 'text' ? (
              <textarea
                className="w-full p-5 bg-[#f3f4f9] rounded-2xl text-[14px] text-[#1b1b1f] min-h-[140px] border-none focus:ring-2 focus:ring-[#4f46e540] transition-all resize-none font-medium leading-relaxed"
                value={asset.content}
                placeholder="Start typing your story..."
                onChange={(e) => onUpdateText(asset.id, e.target.value)}
              />
            ) : (
              <div className="space-y-4">
                  <div 
                      onClick={() => onEnlarge(asset)}
                      className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center cursor-pointer relative group/media shadow-inner"
                  >
                      {asset.type === 'image' ? (
                          <img src={asset.dataUrl} className={`w-full h-full ${fitClasses[fitMode]} transition-transform duration-1000 group-hover/media:scale-105`} alt={asset.name} />
                      ) : (
                          <video src={asset.dataUrl} className={`w-full h-full ${fitClasses[fitMode]}`} />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/40 transition-all flex items-center justify-center">
                          <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              whileHover={{ scale: 1.1 }}
                              className="bg-white/95 backdrop-blur-md p-3 rounded-full shadow-xl"
                          >
                              <Maximize2 size={20} className="text-[#4f46e5]" />
                          </motion.div>
                      </div>
                  </div>

                  {/* Media Adjustments Overlay Style */}
                  <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                          <Settings2 size={14} className="text-[#585e71]" />
                          <span className="text-[10px] font-bold text-[#585e71] uppercase tracking-wider">Display</span>
                      </div>
                      <div className="flex bg-[#f3f4f9] p-1 rounded-xl border border-[#c7c6d050]">
                          {[
                              { id: 'cover', label: 'Fill' },
                              { id: 'contain', label: 'Fit' },
                              { id: 'fill', label: 'Stretch' }
                          ].map((mode) => (
                              <button 
                                  key={mode.id}
                                  onClick={() => onUpdateAsset(asset.id, { objectFit: mode.id as any })}
                                  className={`
                                      px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all
                                      ${fitMode === mode.id ? 'bg-white text-[#4f46e5] shadow-sm' : 'text-[#585e71] hover:text-[#1b1b1f]'}
                                  `}
                              >
                                  {mode.label}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
            )}
          </div>
        </M3Card>
      </motion.div>
    </Reorder.Item>
  );
};
