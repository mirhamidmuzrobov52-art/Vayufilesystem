
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, Download, Volume2, VolumeX, 
  SkipBack, SkipForward, Share2, MoreVertical, 
  ChevronLeft, ChevronRight, Maximize2, Info, RefreshCcw
} from 'lucide-react';
import { Asset } from '../services/fileEngine';

interface MediaModalProps {
  asset: Asset;
  onClose: () => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ asset, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showUI, setShowUI] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'copied'>('idle');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const uiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const resetUITimer = useCallback(() => {
    setShowUI(true);
    if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    if (isPlaying && asset.type === 'video') {
      uiTimeoutRef.current = setTimeout(() => setShowUI(false), 2500);
    }
  }, [isPlaying, asset.type]);

  useEffect(() => {
    resetUITimer();
    return () => { if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current); };
  }, [isPlaying, resetUITimer]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleMediaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showUI) {
      resetUITimer();
    } else if (asset.type === 'video') {
      togglePlay();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleDownload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!asset.dataUrl) return;
    const link = document.createElement('a');
    link.href = asset.dataUrl;
    link.download = asset.name || 'vayu-media';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!asset.dataUrl) return;
    
    setShareStatus('sharing');
    
    try {
      // Stage 1: Attempt to share as a real file (highest priority)
      if (navigator.share && navigator.canShare) {
        const response = await fetch(asset.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], asset.name || 'media_fragment', { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: asset.name,
            text: `Vayu Studio Fragment: ${asset.name}`,
          });
          setShareStatus('idle');
          return;
        }
      }

      // Stage 2: Attempt standard URL sharing
      if (navigator.share) {
        await navigator.share({
          title: asset.name,
          text: `Check out this fragment from Vayu Studio`,
          url: window.location.href
        });
        setShareStatus('idle');
      } else {
        throw new Error('Share API missing');
      }
    } catch (err) {
      console.debug('System sharing unavailable, falling back to clipboard', err);
      // Stage 3: Clipboard fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2500);
      } catch (clipErr) {
        alert('Sharing not supported on this device/context.');
        setShareStatus('idle');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fitClass = 
    asset.objectFit === 'cover' ? 'object-cover' : 
    asset.objectFit === 'fill' ? 'object-fill' : 'object-contain';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={resetUITimer}
      onClick={() => !showUI && resetUITimer()}
      className="fixed inset-0 z-[100] bg-[#000000e6] backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden touch-none select-none"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-white/5 blur-[150px] rounded-full" />
      </div>

      {/* Media Canvas */}
      <div className="relative w-full h-full flex items-center justify-center cursor-pointer p-0 sm:p-2" onClick={handleMediaClick}>
        {asset.type === 'image' ? (
          <motion.img 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={asset.dataUrl} 
            className={`max-w-full max-h-full ${fitClass} transition-all duration-300`} 
            alt={asset.name} 
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              loop 
              src={asset.dataUrl} 
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
              className={`max-w-full max-h-full ${fitClass}`} 
            />
            <AnimatePresence>
              {!isPlaying && showUI && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute p-6 bg-black/40 backdrop-blur-md rounded-full text-white pointer-events-none z-20 border border-white/10 shadow-2xl"
                >
                  <Play size={40} fill="white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Header Bar */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-50 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"
          >
            <div className="flex items-center gap-3 pointer-events-auto">
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-xl border border-white/5 transition-all active:scale-90"
                aria-label="Back"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col">
                <h3 className="text-white font-semibold text-sm md:text-base leading-tight truncate max-w-[150px] sm:max-w-xs md:max-w-lg">
                  {asset.name}
                </h3>
                <div className="flex items-center gap-1.5 opacity-60">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{asset.type}</span>
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Archive Media</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
              <button 
                onClick={handleShare} 
                className={`p-3 rounded-full transition-all flex items-center gap-2 ${shareStatus === 'copied' ? 'bg-green-500 text-white px-4' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                {shareStatus === 'copied' ? <span className="text-[10px] font-black uppercase tracking-widest">Link Copied</span> : <Share2 size={20} />}
                {shareStatus === 'sharing' && <RefreshCcw size={18} className="animate-spin" />}
              </button>
              <button onClick={handleDownload} className="p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all">
                <Download size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Footer Controls */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 w-full z-50 pointer-events-none px-4 pb-4 md:pb-8"
          >
            <div className="max-w-4xl mx-auto w-full pointer-events-auto">
              {asset.type === 'video' ? (
                <div className="bg-[#1a1a1ae6] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 md:p-6 shadow-2xl flex flex-col gap-4">
                  {/* Slim Scrub Bar */}
                  <div className="w-full space-y-2">
                    <div className="relative h-1 w-full bg-white/10 rounded-full group/slider">
                      <div 
                        className="absolute h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" 
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                      <input 
                        type="range" min="0" max={duration} step="0.1" value={currentTime}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-white/40 tabular-nums">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                       <button onClick={(e) => { e.stopPropagation(); if(videoRef.current) videoRef.current.currentTime -= 10; }} className="p-2 text-white/60 hover:text-white transition-colors">
                         <SkipBack size={20} />
                       </button>
                       <button 
                         onClick={togglePlay} 
                         className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                       >
                         {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor" className="ml-1"/>}
                       </button>
                       <button onClick={(e) => { e.stopPropagation(); if(videoRef.current) videoRef.current.currentTime += 10; }} className="p-2 text-white/60 hover:text-white transition-colors">
                         <SkipForward size={20} />
                       </button>
                    </div>

                    <div className="flex items-center gap-4">
                       <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                         {[1, 1.5, 2].map(speed => (
                           <button 
                            key={speed} 
                            onClick={(e) => { e.stopPropagation(); setPlaybackRate(speed); }}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${playbackRate === speed ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white'}`}
                           >
                            {speed}x
                           </button>
                         ))}
                       </div>
                       
                       <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="p-2 text-white/60 hover:text-white transition-all">
                         {isMuted || volume === 0 ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                       </button>

                       <button 
                        onClick={handleShare}
                        className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all hidden sm:flex"
                       >
                         <Share2 size={20} />
                       </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center pb-4">
                  <div className="bg-[#1a1a1ae6] backdrop-blur-2xl border border-white/10 rounded-full px-8 py-3 flex items-center gap-8 shadow-2xl">
                     <button onClick={handleShare} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                        <Share2 size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">{shareStatus === 'copied' ? 'Link Copied' : 'System Share'}</span>
                     </button>
                     <div className="w-[1px] h-4 bg-white/10" />
                     <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 text-white font-bold transition-colors"
                     >
                        <Download size={18} />
                        <span className="text-xs uppercase tracking-widest">Save Local</span>
                     </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        input[type=range] { -webkit-appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid transparent;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          margin-top: -6px;
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
        }
      `}</style>
    </motion.div>
  );
};
