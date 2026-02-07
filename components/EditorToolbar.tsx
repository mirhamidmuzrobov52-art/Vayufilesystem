
import React from 'react';
import { motion } from 'framer-motion';
import { AlignLeft, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

interface EditorToolbarProps {
  onAddText: () => void;
  onAddMedia: (type: 'image' | 'video') => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onAddText, onAddMedia }) => {
  const tools = [
    { icon: AlignLeft, label: 'Text', action: onAddText, color: 'bg-[#d3e3fd]', text: 'text-[#041e49]' },
    { icon: ImageIcon, label: 'Image', action: () => onAddMedia('image'), color: 'bg-[#c2e7ff]', text: 'text-[#001d35]' },
    { icon: VideoIcon, label: 'Video', action: () => onAddMedia('video'), color: 'bg-[#f0e1f9]', text: 'text-[#21005d]' }
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-auto px-4 pointer-events-none">
      <div className="flex items-center gap-6 bg-white/95 backdrop-blur-3xl px-8 pt-5 pb-4 rounded-[2.5rem] border border-white/40 shadow-[0_15px_45px_rgba(0,0,0,0.18)] pointer-events-auto">
        {tools.map((tool, idx) => (
          <motion.button 
            key={idx}
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={tool.action} 
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className={`w-14 h-14 rounded-2xl ${tool.color} ${tool.text} flex items-center justify-center elevation-1 group-hover:elevation-2 transition-all`}>
              <tool.icon size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[9px] font-black text-[#1b1b1f]/60 uppercase tracking-[0.15em] whitespace-nowrap">
              {tool.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
