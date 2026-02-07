
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Maximize2, Play, ZapOff } from 'lucide-react';
import { useQuantumResource } from '../hooks/useQuantumResource';
import { AssetModality } from '../services/quantumOrchestrator';

interface LazyMediaProps {
  id: string; // Required for orchestration
  type: 'image' | 'video';
  src: string;
  alt: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export const LazyMedia: React.FC<LazyMediaProps> = ({ id, type, src, alt, objectFit = 'contain' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { modality, setVisibility } = useQuantumResource(id, type);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisibility(entry.isIntersecting);
      },
      { threshold: 0.01, rootMargin: '400px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [setVisibility]);

  const fitClass = 
    objectFit === 'cover' ? 'object-cover' : 
    objectFit === 'fill' ? 'object-fill' : 'object-contain';

  const isHibernated = modality === AssetModality.HIBERNATED;

  return (
    <div 
      ref={containerRef} 
      className={`rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-950 min-h-[300px] flex items-center justify-center relative group/media transition-opacity duration-500 ${isHibernated ? 'opacity-40 grayscale' : 'opacity-100'}`}
    >
      {isHibernated && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200 space-y-3 bg-slate-900/80 backdrop-blur-md z-10 animate-in fade-in">
           <div className="p-4 bg-white/10 rounded-3xl shadow-sm">
             <ZapOff className="w-6 h-6 text-indigo-400" />
           </div>
           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Quantum Hibernation (VRAM Saved)</span>
        </div>
      )}

      {modality === AssetModality.ACTIVE && !hasError && (
        type === 'image' ? (
          <img 
            src={src} 
            className={`w-full ${fitClass} max-h-[700px] animate-in fade-in zoom-in-95 duration-700`} 
            alt={alt}
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <video 
              src={src} 
              autoPlay
              muted
              loop
              playsInline
              className={`w-full h-full ${fitClass} animate-in fade-in duration-700`} 
              onError={() => setHasError(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white scale-90 group-hover/media:scale-100 transition-transform shadow-2xl border border-white/30">
                  <Play size={24} fill="currentColor" />
               </div>
            </div>
          </div>
        )
      )}

      {hasError && (
        <div className="flex flex-col items-center gap-2 text-rose-400">
          <Loader2 className="animate-spin" />
          <span className="text-[10px] font-bold">Decoding Failure</span>
        </div>
      )}
      
      {/* Universal Hover Overlay */}
      {!isHibernated && (
        <div className="absolute inset-0 bg-indigo-600/0 group-hover/media:bg-indigo-600/10 transition-colors flex items-start justify-end p-6 opacity-0 group-hover/media:opacity-100">
           <div className="p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl text-indigo-600">
              <Maximize2 size={20} />
           </div>
        </div>
      )}
    </div>
  );
};
