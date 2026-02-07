
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  RefreshCcw, FileDown, CheckCircle2, 
  Layers, Eye, Undo2, Redo2, Cpu, Binary, X, Share2,
  FileBadge, Database, Type, Image as ImageIcon, Video as VideoIcon,
  User, AlignLeft
} from 'lucide-react';

// Modules
import { Asset, FilePackage, fileToDataUrl, createPackage, parsePackage } from './services/fileEngine';
import { useHistory } from './hooks/useHistory';

// M3 Styled Components
import { M3Button, M3Card, M3TextField, M3Switch } from './components/shared/M3Components';
import { AssetCard } from './components/AssetCard';
import { MediaModal } from './components/MediaModal';
import { PreviewModal } from './components/PreviewModal';
import { EditorToolbar } from './components/EditorToolbar';
import { ReaderView } from './components/ReaderView';

const App = () => {
  const [view, setView] = useState<'build' | 'open'>('build');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [enlargedAsset, setEnlargedAsset] = useState<Asset | null>(null);
  
  const [fileName, setFileName] = useState('');
  const [extension, setExtension] = useState('Vayu');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  
  const { state: assets, push, undo, redo, reset, canUndo, canRedo } = useHistory<Asset[]>([]);

  const [loadedFile, setLoadedFile] = useState<FilePackage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const headerRef = useRef(null);
  const activeUrlRef = useRef<string | null>(null);

  const stats = useMemo(() => {
    return {
      text: assets.filter(a => a.type === 'text').length,
      image: assets.filter(a => a.type === 'image').length,
      video: assets.filter(a => a.type === 'video').length,
      words: assets.reduce((acc, a) => acc + (a.content?.split(/\s+/).filter(Boolean).length || 0), 0)
    };
  }, [assets]);

  useEffect(() => {
    gsap.fromTo(headerRef.current, 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }
    );
  }, []);

  const handleAddText = () => {
    const next = [...assets, { id: Math.random().toString(36).substr(2, 9), type: 'text', name: `Section ${assets.length + 1}`, content: '' } as Asset];
    push(next);
  };

  const handleAddMedia = (type: 'image' | 'video') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 100 * 1024 * 1024) return setError("Package size limit: 100MB");
        const dataUrl = await fileToDataUrl(file);
        push([...assets, { 
          id: Math.random().toString(36).substr(2, 9), 
          type, 
          name: file.name, 
          dataUrl,
          objectFit: 'contain' 
        } as Asset]);
        setError(null);
      }
    };
    input.click();
  };

  const handleRemove = (id: string) => push(assets.filter(a => a.id !== id));
  const handleUpdateText = (id: string, content: string) => push(assets.map(a => a.id === id ? { ...a, content } : a), false);
  const handleUpdateAsset = (id: string, updates: Partial<Asset>) => push(assets.map(a => a.id === id ? { ...a, ...updates } : a));

  const handleGenerate = async () => {
    if (assets.length === 0) return setError("Composer is empty.");
    setIsGenerating(true);
    const blob = createPackage(fileName, extension, assets, author, description);
    const url = URL.createObjectURL(blob);
    if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current);
    activeUrlRef.current = url;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName || 'Archive'}.${extension.toLowerCase() || 'vayu'}`;
    link.click();
    
    setIsGenerating(false);
    setDownloadReady(true);
    setTimeout(() => setDownloadReady(false), 3000);
  };

  const handleShareArchive = async () => {
    if (assets.length === 0) return setError("Composer is empty.");
    setIsSharing(true);
    try {
      const blob = createPackage(fileName, extension, assets, author, description);
      const extStr = (extension || 'vayu').toLowerCase();
      const file = new File([blob], `${fileName || 'Archive'}.${extStr}`, { type: 'application/octet-stream' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Archive: ${fileName}`,
          text: `Binary archive created by ${author || 'Anonymous'} using Vayu Studio.`
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Archive: ${fileName}`,
          text: `Check out this ${extStr} archive!`,
          url: window.location.href
        });
      } else {
        throw new Error("Sharing not supported in this environment.");
      }
    } catch (err: any) {
      setError("System share failed. Try downloading instead.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleOpenFormat = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = parsePackage(event.target?.result as string);
            setLoadedFile(parsed);
            setError(null);
          } catch (err: any) { setError(err.message); }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleEditLoadedFile = (file: FilePackage) => {
    reset(file.data); 
    setFileName(file.meta.name);
    setExtension(file.meta.ext);
    setAuthor(file.meta.author || '');
    setDescription(file.meta.description || '');
    setLoadedFile(null);
    setView('build');
  };

  return (
    <div className="min-h-screen flex flex-col app-container overflow-hidden pb-32">
      
      <header ref={headerRef} className="flex flex-col items-center py-6 md:py-8 flex-shrink-0">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-3 bg-white rounded-2xl border border-indigo-50 shadow-sm">
              <Binary size={24} className="text-[#4f46e5]" strokeWidth={2.5} />
           </div>
           <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#1b1b1f] uppercase leading-none italic">Vayu</h1>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#585e71] opacity-50">Universal Studio</span>
           </div>
        </div>

        <M3Switch 
          active={view === 'open'} 
          onClick={(isOpening: boolean) => setView(isOpening ? 'open' : 'build')}
          leftLabel="Compose"
          rightLabel="Vault"
        />
      </header>

      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {view === 'build' ? (
            <motion.div 
              key="build-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <M3Card variant="elevated" className="space-y-6 bg-white/70 backdrop-blur-xl border border-white/50">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 px-1">
                    <FileBadge size={14} className="text-[#4f46e5]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#585e71]">Format Blueprint</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <M3TextField label="File Name" value={fileName} onChange={(e: any) => setFileName(e.target.value)} placeholder="Project_X" />
                    <M3TextField label="Custom Extension" value={extension} onChange={(e: any) => setExtension(e.target.value)} placeholder="vayu" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 z-10" />
                      <M3TextField label="Creator / Author" value={author} onChange={(e: any) => setAuthor(e.target.value)} placeholder="Name" className="pl-10" />
                    </div>
                    <div className="relative">
                      <AlignLeft size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 z-10" />
                      <M3TextField label="Description" value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="Brief memo" className="pl-10" />
                    </div>
                  </div>
                </div>

                {/* Composition Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                   {[
                     { label: 'Texts', count: stats.text, icon: Type },
                     { label: 'Images', count: stats.image, icon: ImageIcon },
                     { label: 'Videos', count: stats.video, icon: VideoIcon },
                     { label: 'Words', count: stats.words, icon: Database }
                   ].map((item, i) => (
                     <div key={i} className="bg-[#f3f4f9] p-3 rounded-2xl flex flex-col items-center gap-1 border border-[#c7c6d020]">
                        <item.icon size={12} className="text-[#585e71] opacity-40" />
                        <span className="text-sm font-black text-[#1b1b1f]">{item.count}</span>
                        <span className="text-[8px] font-bold text-[#585e71] uppercase tracking-tighter">{item.label}</span>
                     </div>
                   ))}
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#c7c6d040]">
                  <div className="flex bg-[#f3f4f9] p-1 rounded-2xl border border-[#c7c6d040]">
                    <button onClick={undo} disabled={!canUndo} className="p-3 text-[#585e71] disabled:opacity-20 hover:bg-white rounded-xl transition-all"><Undo2 size={18}/></button>
                    <button onClick={redo} disabled={!canRedo} className="p-3 text-[#585e71] disabled:opacity-20 hover:bg-white rounded-xl transition-all"><Redo2 size={18}/></button>
                  </div>
                  <M3Button variant="tonal" onClick={() => setIsPreviewOpen(true)} disabled={assets.length === 0} icon={Eye}>Live View</M3Button>
                </div>
              </M3Card>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                   <div className="flex items-center gap-2">
                      <Cpu size={14} className="text-indigo-500 opacity-40" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#585e71] opacity-60">Memory Stack</span>
                   </div>
                   {assets.length > 0 && (
                     <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{assets.length} fragments</span>
                   )}
                </div>
                
                <Reorder.Group axis="y" values={assets} onReorder={push} className="space-y-4">
                    <AnimatePresence mode="popLayout">
                    {assets.map((asset) => (
                        <AssetCard 
                        key={asset.id} 
                        asset={asset} 
                        onRemove={handleRemove} 
                        onUpdateText={handleUpdateText} 
                        onUpdateAsset={handleUpdateAsset}
                        onEnlarge={setEnlargedAsset}
                        />
                    ))}
                    </AnimatePresence>
                </Reorder.Group>

                {assets.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 border-2 border-dashed border-indigo-100/40 rounded-[3rem] text-center bg-white/40 backdrop-blur-sm">
                        <Layers size={40} className="mx-auto mb-6 text-indigo-100" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200">Composer Stream Void</p>
                    </motion.div>
                )}
              </div>

              <div className="pt-6 flex flex-col gap-4">
                <M3Button 
                  fullWidth
                  className="py-10 text-lg font-black uppercase tracking-[0.2em] rounded-[3rem] shadow-xl border-b-4 border-indigo-800" 
                  onClick={handleGenerate} 
                  disabled={isGenerating || assets.length === 0}
                  icon={isGenerating ? RefreshCcw : downloadReady ? CheckCircle2 : FileDown}
                >
                  {isGenerating ? 'Compiling Package...' : downloadReady ? 'Download Verified' : `Generate .${extension || 'vayu'}`}
                </M3Button>
                
                <M3Button 
                  fullWidth
                  variant="tonal"
                  className="py-6 font-black uppercase tracking-widest rounded-[2rem] border border-indigo-100" 
                  onClick={handleShareArchive} 
                  disabled={isSharing || assets.length === 0}
                  icon={isSharing ? RefreshCcw : Share2}
                >
                  {isSharing ? 'Connecting System...' : 'Distribute Archive'}
                </M3Button>
              </div>

              <EditorToolbar onAddText={handleAddText} onAddMedia={handleAddMedia} />
            </motion.div>
          ) : (
            <motion.div 
              key="reader-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ReaderView 
                loadedFile={loadedFile} 
                onOpenFormat={handleOpenFormat} 
                onEdit={handleEditLoadedFile}
                onClose={() => setLoadedFile(null)}
                onEnlargeAsset={setEnlargedAsset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isPreviewOpen && (
          <PreviewModal 
            assets={assets} 
            fileName={fileName} 
            extension={extension} 
            onClose={() => setIsPreviewOpen(false)} 
            onEnlargeAsset={setEnlargedAsset} 
          />
        )}
        {enlargedAsset && (
          <MediaModal asset={enlargedAsset} onClose={() => setEnlargedAsset(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#1b1b1f] text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] flex items-center gap-4 border border-white/10 glass">
            <span className="text-xs font-bold">{error}</span>
            <button onClick={() => setError(null)} className="p-1.5 hover:bg-white/10 rounded-full"><X size={14}/></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
