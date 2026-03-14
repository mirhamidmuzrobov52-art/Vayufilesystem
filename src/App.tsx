import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Guide } from './pages/Guide';
import { Support } from './pages/Support';
import { Vault } from './pages/Vault';
import { Builder } from './pages/Builder';
import { UniversalViewer } from './components/ui/UniversalViewer';
import { gsap } from 'gsap';
import { VaultService, DraftAsset } from './services/vaultService';
import { cn } from './lib/utils';

// Types
type View = 'home' | 'builder' | 'vault' | 'about' | 'guide' | 'support' | 'privacy' | 'terms';

export default function App() {
  // State
  const [view, setView] = useState<View>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('t');
    return (saved === 'l' ? 'light' : 'dark');
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draftAssets, setDraftAssets] = useState<DraftAsset[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeAsset, setActiveAsset] = useState<{ name: string; type: string; data: string | Uint8Array } | null>(null);

  // Initial Loading Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Theme Management
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('t', theme === 'light' ? 'l' : 'd');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Archive Management (Mocking IndexedDB for now)
  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    const newAssets = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      file
    }));
    setDraftAssets(prev => [...prev, ...newAssets]);
  };

  const handleRemoveDraft = (id: string) => {
    setDraftAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleCreateArchive = async (name: string) => {
    setIsCreating(true);
    try {
      const newArchive = await VaultService.sealArchive(name, draftAssets);
      VaultService.downloadArchive(newArchive);
      setDraftAssets([]);
      setView('vault');
    } catch (error) {
      console.error("Archive creation failed:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // View Rendering
  const renderView = () => {
    switch (view) {
      case 'home': return <Home setView={setView} isSidebarOpen={isSidebarOpen} />;
      case 'builder': return (
        <Builder 
          draftAssets={draftAssets} 
          onUpload={handleUpload} 
          onRemove={handleRemoveDraft}
          onCreateArchive={handleCreateArchive}
          isCreating={isCreating}
          onPreviewAsset={setActiveAsset}
        />
      );
      case 'vault': return (
        <Vault 
          onOpenAsset={setActiveAsset} 
        />
      );
      case 'about': return <About />;
      case 'guide': return <Guide />;
      case 'support': return <Support />;
      case 'privacy': return <PrivacyPolicy />;
      case 'terms': return <TermsOfService />;
      default: return <Home setView={setView} isSidebarOpen={isSidebarOpen} />;
    }
  };

  return (
    <div className="min-h-screen bg-m3-surface text-m3-on-surface transition-colors duration-500 font-sans selection:bg-m3-primary/30">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[200] bg-m3-surface flex flex-col items-center justify-center gap-6"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-m3-primary border-t-transparent rounded-full"
              style={{ willChange: 'transform' }}
            />
            <div className="text-center">
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">ARXUN</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Initializing Core</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <Navbar 
        currentView={view} 
        setView={setView} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onMobileMenuToggle={() => setIsSidebarOpen(true)}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={view} 
        setView={(v) => { setView(v as View); setIsSidebarOpen(false); }}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <main className={cn(
        "flex flex-col items-center w-full",
        view === 'home' ? "pt-0 pb-0 px-0" : "pt-24 pb-20 px-6"
      )}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer setView={setView} />

      {/* Universal Viewer Modal */}
      <AnimatePresence>
        {activeAsset && (
          <UniversalViewer 
            asset={activeAsset} 
            onClose={() => setActiveAsset(null)} 
          />
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-m3-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-m3-secondary/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
