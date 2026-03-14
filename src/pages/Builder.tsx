import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Plus, Trash2, Package, Shield, FileText, Image as ImageIcon, Video, Music, File, Eye } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface DraftAsset {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
}

interface BuilderProps {
  draftAssets: DraftAsset[];
  onUpload: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  onCreateArchive: (name: string) => void;
  isCreating: boolean;
  onPreviewAsset: (asset: { name: string; type: string; data: string | Uint8Array }) => void;
}

export const Builder: React.FC<BuilderProps> = ({ 
  draftAssets, 
  onUpload, 
  onRemove, 
  onCreateArchive,
  isCreating,
  onPreviewAsset
}) => {
  const { translations: en } = useLanguage();
  const [archiveName, setArchiveName] = React.useState('');
  const [isDragging, setIsDragging] = React.useState(false);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={18} />;
    if (type.startsWith('video/')) return <Video size={18} />;
    if (type.startsWith('audio/')) return <Music size={18} />;
    if (type.includes('pdf') || type.includes('word') || type.includes('text')) return <FileText size={18} />;
    return <File size={18} />;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-5xl space-y-8 py-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-m3-outline-variant pb-8">
        <div className="space-y-2 min-w-0">
          <h2 className="text-4xl md:text-6xl font-black text-m3-on-surface uppercase italic tracking-tighter leading-none truncate">
            {en.builder.title}
          </h2>
          <p className="text-m3-on-surface-variant text-xs md:text-sm font-medium uppercase tracking-[0.2em] opacity-60 truncate">
            {en.builder.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <input
            type="text"
            placeholder={en.builder.namePlaceholder}
            value={archiveName}
            onChange={(e) => setArchiveName(e.target.value)}
            className="h-12 px-6 rounded-2xl bg-m3-surface-container border border-m3-outline-variant focus:border-m3-primary focus:ring-1 focus:ring-m3-primary outline-none transition-all text-sm font-bold w-full sm:w-auto"
          />
          <Button 
            variant="filled" 
            className="h-12 px-8 w-full sm:w-auto justify-center"
            disabled={draftAssets.length === 0 || !archiveName || isCreating}
            loading={isCreating}
            onClick={() => onCreateArchive(archiveName)}
            icon={<Package size={18} />}
          >
            {en.builder.createAction}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Zone */}
        <div className="lg:col-span-1">
          <label 
            className="group cursor-pointer block h-full"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              multiple 
              className="hidden" 
              onChange={(e) => onUpload(e.target.files)}
            />
            <Card variant="outlined" className={`h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center space-y-4 border-dashed border-2 transition-all ${isDragging ? 'border-m3-primary bg-m3-primary/5 scale-[1.02]' : 'group-hover:border-m3-primary group-hover:bg-m3-primary/5'}`}>
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-transform ${isDragging ? 'bg-m3-primary text-m3-on-primary scale-110' : 'bg-m3-primary/10 text-m3-primary group-hover:scale-110'}`}>
                <Upload size={32} className={isDragging ? 'animate-bounce' : ''} />
              </div>
              <div className="space-y-1 pointer-events-none">
                <p className="font-black uppercase italic tracking-tighter text-xl">{en.builder.uploadTitle}</p>
                <p className="text-xs text-m3-on-surface-variant font-bold uppercase tracking-widest opacity-60">
                  {isDragging ? 'Drop files here' : en.builder.uploadSubtitle}
                </p>
              </div>
            </Card>
          </label>
        </div>

        {/* Assets List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-m3-on-surface-variant">
              {en.builder.assetsLabel} ({draftAssets.length})
            </h3>
            {draftAssets.length > 0 && (
              <div className="flex items-center gap-2 text-[10px] font-black text-m3-primary uppercase tracking-widest">
                <Shield size={12} />
                {en.builder.encryptedLabel}
              </div>
            )}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {draftAssets.length === 0 ? (
                <div className="py-20 text-center opacity-30 italic font-medium">
                  {en.builder.noAssets}
                </div>
              ) : (
                draftAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="p-4 flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-m3-surface-container-highest flex items-center justify-center text-m3-on-surface-variant">
                        {getFileIcon(asset.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{asset.name}</p>
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                          {(asset.size / 1024).toFixed(1)} KB • {asset.type.split('/')[1] || 'FILE'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            const url = URL.createObjectURL(asset.file);
                            onPreviewAsset({
                              name: asset.name,
                              type: asset.type,
                              data: url
                            });
                          }}
                          icon={<Eye size={16} />}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-m3-error"
                          onClick={() => onRemove(asset.id)}
                          icon={<Trash2 size={16} />}
                        />
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
