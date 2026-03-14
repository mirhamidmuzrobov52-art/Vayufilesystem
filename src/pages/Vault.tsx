import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Trash2, ExternalLink, ShieldCheck, UploadCloud, Edit3, Save, X, File as FileIcon, Plus, Clock } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { VaultService, ArchiveFile, Archive } from '../services/vaultService';

interface VaultProps {
  onOpenAsset: (asset: { name: string; type: string; data: string | Uint8Array }) => void;
}

export const Vault: React.FC<VaultProps> = ({ onOpenAsset }) => {
  const { translations: en } = useLanguage();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [archiveName, setArchiveName] = useState<string>('');
  const [files, setFiles] = useState<ArchiveFile[]>([]);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [editingFileName, setEditingFileName] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [storedArchives, setStoredArchives] = useState<Archive[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadStoredArchives();
  }, []);

  const loadStoredArchives = async () => {
    try {
      const archives = await VaultService.getStoredArchives();
      setStoredArchives(archives.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Failed to load stored archives:", error);
    }
  };

  const handleOpenStoredArchive = async (archive: Archive) => {
    setIsDecrypting(true);
    try {
      const decryptedFiles = await VaultService.openArchive(archive.data);
      setFiles(decryptedFiles);
      setArchiveName(archive.name);
    } catch (error) {
      console.error("Failed to decrypt:", error);
      alert(error instanceof Error ? error.message : "Failed to decrypt archive");
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDeleteStoredArchive = async (id: string) => {
    try {
      await VaultService.deleteStoredArchive(id);
      await loadStoredArchives();
    } catch (error) {
      console.error("Failed to delete stored archive:", error);
    }
  };

  const handleUploadArchive = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | undefined;
    
    if ('dataTransfer' in e) {
      e.preventDefault();
      setIsDragging(false);
      file = e.dataTransfer.files?.[0];
    } else {
      file = e.target.files?.[0];
    }
    
    if (!file) return;
    if (!file.name.endsWith('.katm')) {
      alert("Please select a valid .katm archive file.");
      return;
    }

    setIsDecrypting(true);
    try {
      // Save to local storage first
      await VaultService.saveExternalArchive(file);
      await loadStoredArchives();

      const decryptedFiles = await VaultService.openArchive(file);
      setFiles(decryptedFiles);
      setArchiveName(file.name);
    } catch (error) {
      console.error("Failed to decrypt:", error);
      alert(error instanceof Error ? error.message : "Failed to decrypt archive");
    } finally {
      setIsDecrypting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let newFiles: FileList | null = null;
    
    if ('dataTransfer' in e) {
      e.preventDefault();
      setIsDragging(false);
      newFiles = e.dataTransfer.files;
    } else {
      newFiles = e.target.files;
    }
    
    if (!newFiles || newFiles.length === 0) return;

    const addedFiles: ArchiveFile[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      addedFiles.push({
        name: newFiles[i].name,
        type: newFiles[i].type || 'application/octet-stream',
        data: newFiles[i]
      });
    }

    setFiles(prev => [...prev, ...addedFiles]);
    if (addFileInputRef.current) addFileInputRef.current.value = '';
  };

  const handleDeleteFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  const handleRenameFile = (oldName: string) => {
    if (!newFileName.trim() || newFileName === oldName) {
      setEditingFileName(null);
      return;
    }
    
    setFiles(prev => prev.map(f => {
      if (f.name === oldName) {
        return { ...f, name: newFileName.trim() };
      }
      return f;
    }));
    setEditingFileName(null);
  };

  const handleSaveAndDownload = async () => {
    setIsEncrypting(true);
    try {
      // Convert ArchiveFile[] to DraftAsset[] format expected by sealArchive
      const draftAssets = files.map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        name: f.name,
        type: f.type,
        size: f.data.size,
        file: f.data instanceof File ? f.data : new File([f.data], f.name, { type: f.type })
      }));

      const newArchive = await VaultService.sealArchive(archiveName, draftAssets);
      VaultService.downloadArchive(newArchive);
      await loadStoredArchives();
      setIsEditorMode(false);
    } catch (error) {
      console.error("Failed to save archive:", error);
      alert("Failed to save and encrypt archive");
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleCloseArchive = () => {
    setFiles([]);
    setArchiveName('');
    setIsEditorMode(false);
  };

  const handleOpenFile = async (file: ArchiveFile) => {
    const url = URL.createObjectURL(file.data);
    onOpenAsset({
      name: file.name,
      type: file.type,
      data: url
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-5xl space-y-8 py-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-m3-outline-variant pb-6">
        <div className="space-y-1 min-w-0">
          <h2 className="text-4xl md:text-5xl font-black text-m3-on-surface uppercase italic tracking-tighter leading-none truncate">
            {en.vault.title}
          </h2>
          <p className="text-m3-on-surface-variant text-xs md:text-sm font-medium uppercase tracking-widest opacity-60 truncate">
            {archiveName ? archiveName : "Secure File Pipeline"}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-m3-primary bg-m3-primary/10 px-3 py-1 rounded-full shrink-0">
          <ShieldCheck size={12} />
          {en.vault.secureLabel}
        </div>
      </div>

      {!archiveName ? (
        <div className="space-y-8">
          <Card 
            className={`p-12 border-dashed border-2 transition-colors ${isDragging ? 'border-m3-primary bg-m3-primary/5 scale-[1.02]' : 'border-m3-outline-variant bg-transparent'} flex flex-col items-center justify-center text-center space-y-6`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleUploadArchive as any}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-m3-primary text-m3-on-primary' : 'bg-m3-primary/10 text-m3-primary'}`}>
              <UploadCloud size={40} className={isDragging ? 'animate-bounce' : ''} />
            </div>
            <div className="space-y-2 pointer-events-none">
              <h3 className="text-2xl font-black uppercase tracking-tight">{en.vault.openArchive || "Open Secure Archive"}</h3>
              <p className="text-m3-on-surface-variant max-w-md mx-auto">
                {en.vault.dropDescription || "Drop your encrypted .katm file here or click to browse and view its contents locally in your browser."}
              </p>
            </div>
            <input 
              type="file" 
              accept=".katm" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleUploadArchive}
            />
            <Button 
              size="lg" 
              onClick={() => fileInputRef.current?.click()}
              loading={isDecrypting}
            >
              {isDecrypting ? "Decrypting..." : (en.vault.selectFile || "Select .katm File")}
            </Button>
          </Card>

          {storedArchives.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-m3-on-surface-variant pl-2">
                Local Vault Storage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {storedArchives.map((archive) => (
                    <motion.div
                      key={archive.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Card className="p-5 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-m3-error hover:bg-m3-error/10"
                            onClick={() => handleDeleteStoredArchive(archive.id)}
                            icon={<Trash2 size={16} />}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-m3-primary/10 flex items-center justify-center text-m3-primary">
                              <Package size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-m3-on-surface truncate pr-8">{archive.name}</h3>
                              <div className="flex items-center gap-2 text-[10px] text-m3-on-surface-variant uppercase font-bold tracking-tighter">
                                <Clock size={10} />
                                {new Date(archive.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-[10px] font-black text-m3-on-surface-variant uppercase tracking-widest">
                              {(archive.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            <Button 
                              variant="tonal" 
                              size="sm" 
                              onClick={() => handleOpenStoredArchive(archive)}
                              icon={<ExternalLink size={14} />}
                            >
                              {en.vault.open}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between bg-m3-surface-container p-4 rounded-2xl gap-4">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <Button 
                variant="ghost" 
                onClick={handleCloseArchive}
                icon={<X size={18} />}
                className="text-xs md:text-sm px-3 md:px-4"
              >
                Close Archive
              </Button>
              <div className="hidden md:block h-6 w-[1px] bg-m3-outline-variant" />
              <Button
                variant={isEditorMode ? "tonal" : "ghost"}
                onClick={() => setIsEditorMode(!isEditorMode)}
                icon={<Edit3 size={18} />}
                className={`text-xs md:text-sm px-3 md:px-4 ${isEditorMode ? "bg-m3-primary/20 text-m3-primary" : ""}`}
              >
                {isEditorMode ? "Exit Editor Mode" : "Editor Mode"}
              </Button>
            </div>
            
            {isEditorMode && (
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  ref={addFileInputRef}
                  onChange={handleAddFiles}
                />
                <Button 
                  variant="outlined" 
                  onClick={() => addFileInputRef.current?.click()}
                  icon={<Plus size={18} />}
                  className="text-xs md:text-sm px-3 md:px-4 flex-1 md:flex-none justify-center"
                >
                  Add Files
                </Button>
                <Button 
                  onClick={handleSaveAndDownload}
                  loading={isEncrypting}
                  icon={<Save size={18} />}
                  className="text-xs md:text-sm px-3 md:px-4 flex-1 md:flex-none justify-center"
                >
                  {isEncrypting ? "Encrypting..." : "Save & Download"}
                </Button>
              </div>
            )}
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px] p-4 rounded-3xl transition-colors ${isEditorMode && isDragging ? 'bg-m3-primary/5 border-2 border-dashed border-m3-primary' : 'border-2 border-transparent'}`}
            onDragOver={isEditorMode ? handleDragOver : undefined}
            onDragLeave={isEditorMode ? handleDragLeave : undefined}
            onDrop={isEditorMode ? handleAddFiles as any : undefined}
          >
            <AnimatePresence mode="popLayout">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className="p-5 group relative overflow-hidden">
                    {isEditorMode && (
                      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-m3-error hover:bg-m3-error/10"
                          onClick={() => handleDeleteFile(file.name)}
                          icon={<Trash2 size={16} />}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-m3-primary/10 flex items-center justify-center text-m3-primary">
                          <FileIcon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          {isEditorMode && editingFileName === file.name ? (
                            <input
                              type="text"
                              autoFocus
                              value={newFileName}
                              onChange={(e) => setNewFileName(e.target.value)}
                              onBlur={() => handleRenameFile(file.name)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRenameFile(file.name);
                                if (e.key === 'Escape') setEditingFileName(null);
                              }}
                              className="w-full bg-m3-surface border border-m3-primary/50 rounded px-2 py-1 text-sm font-bold text-m3-on-surface focus:outline-none focus:ring-1 focus:ring-m3-primary"
                            />
                          ) : (
                            <h3 
                              className={`font-bold text-m3-on-surface truncate pr-8 ${isEditorMode ? 'cursor-pointer hover:text-m3-primary' : ''}`}
                              onClick={() => {
                                if (isEditorMode) {
                                  setEditingFileName(file.name);
                                  setNewFileName(file.name);
                                }
                              }}
                              title={isEditorMode ? "Click to rename" : file.name}
                            >
                              {file.name}
                            </h3>
                          )}
                          <div className="text-[10px] text-m3-on-surface-variant uppercase font-bold tracking-tighter mt-1">
                            {file.type || 'Unknown Type'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-[10px] font-black text-m3-on-surface-variant uppercase tracking-widest">
                          {(file.data.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                        <Button 
                          variant="tonal" 
                          size="sm" 
                          onClick={() => handleOpenFile(file)}
                          icon={<ExternalLink size={14} />}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {files.length === 0 && (
              <div className="col-span-full py-12 text-center text-m3-on-surface-variant opacity-60 italic pointer-events-none">
                {isEditorMode ? (isDragging ? "Drop files here to add" : "No files found. Drag and drop files here to add them.") : "No files found in this archive."}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

