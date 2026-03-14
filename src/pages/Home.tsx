import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'motion/react';
import { Layers, ArrowRight, ShieldCheck, Zap, Sparkles, Github, Twitter, Mail } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { useLanguage } from '../lib/LanguageContext';

const ScrollZoomHero = ({ scrollYProgress, videoRef }: { scrollYProgress: MotionValue<number>; videoRef: React.RefObject<HTMLVideoElement> }) => {
  const { translations: en } = useLanguage();
  
  // Smooth out the scroll progress to prevent jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Background atmosphere - deeper parallax and cinematic feel
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.1]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.4], [0.4, 0.6]);
  
  // Stage 1: ARXUN CORE (Cinematic Entry)
  const textScale = useTransform(smoothProgress, [0, 0.25], [1, 2]);
  const textOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const textY = useTransform(smoothProgress, [0, 0.25], [0, -20]);

  // Stage 2: The Future of Digital Assets (High-End Editorial)
  const futureOpacity = useTransform(smoothProgress, [0.2, 0.35, 0.5, 0.7], [0, 1, 1, 0]);
  const futureScale = useTransform(smoothProgress, [0.2, 0.35, 0.5, 0.7], [0.95, 1, 1, 1.05]);
  const futureY = useTransform(smoothProgress, [0.2, 0.35], [30, 0]);

  // Fade out UI elements before content covers them
  const uiOpacity = useTransform(smoothProgress, [0.15, 0.3], [1, 0]);

  return (
    <div className="h-full relative w-full overflow-hidden bg-m3-surface selection:bg-m3-primary/30">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/src/assets/grok_video_2026-03-13-21-51-17.mp4"
        />
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
      </div>

      <div className="h-full w-full flex items-center justify-center relative">
        {/* Stage 1: KATM */}
        <motion.div 
          style={{ 
            opacity: textOpacity as any, 
            scale: textScale as any, 
            y: textY as any,
            willChange: 'transform, opacity'
          }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-7xl sm:text-9xl md:text-[10rem] font-black italic tracking-[-0.05em] text-white leading-[0.75] uppercase">
                KATM
              </h1>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="flex items-center justify-center gap-8"
            >
              <div className="h-[1px] w-16 bg-white" />
              <p className="text-[10px] font-black uppercase tracking-[1.2em] whitespace-nowrap text-white">{en.home.heroArchiveEngine}</p>
              <div className="h-[1px] w-16 bg-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stage 2: The Future of Digital Assets */}
        <motion.div 
          style={{ 
            opacity: futureOpacity as any, 
            scale: futureScale as any, 
            y: futureY as any,
            willChange: 'transform, opacity'
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
        >
          <div className="max-w-6xl space-y-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-[1px] h-16 bg-white/50" />
              <span className="text-[11px] font-black uppercase tracking-[0.7em] text-white drop-shadow-md">{en.home.heroNewStandard}</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-[-0.06em] leading-[0.8] italic uppercase drop-shadow-xl">
              {en.home.heroFutureOf} <br /> 
              <span className="text-white drop-shadow-2xl">{en.home.heroDigitalAssets}</span>
            </h2>
            <div className="h-[1px] w-32 bg-white/30 mx-auto" />
            <p className="text-white text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-semibold tracking-tight drop-shadow-md">
              {en.home.futureDesc}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Pro UI Elements - Refined */}
      <motion.div 
        style={{ opacity: uiOpacity as any }}
        className="absolute inset-x-0 bottom-12 px-12 z-50 pointer-events-none flex justify-between items-end"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">{en.home.systemStatus}</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
              <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{en.home.coreOperational}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-6">
          <div className="flex flex-col items-end gap-2">
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">{en.home.scrollProgress}</span>
            <div className="w-48 h-[1px] bg-white/10 overflow-hidden">
              <motion.div 
                style={{ scaleX: smoothProgress as any }}
                className="h-full bg-m3-primary origin-left"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const MotionShowcase = () => {
  const { translations: en } = useLanguage();
  const features = [
    { title: "Independent transforms", desc: "Animate x, y, rotateZ etc independently, without wrapper elements.", links: ["Motion for React", "Motion", "Motion for Vue"] },
    { title: "Scroll animation", desc: "Smooth, hardware-accelerated scroll animations.", links: ["Motion for React", "Motion's scroll function", "Motion for Vue"] },
    { title: "Exit animation", desc: "Motion's AnimatePresence makes it easy to animate elements as they exit.", links: ["Motion for React", "Motion for Vue"] },
    { title: "Gestures", desc: "Hover, press and drag gestures that feel native, not “webby”.", links: ["React", "Motion's hover function", "Motion for Vue"] },
    { title: "Layout animation", desc: "Animate between different layouts with Motion’s industry-leading layout animation engine.", links: ["React", "View Transitions API", "Vue"] },
    { title: "Timeline sequences", desc: "Variants, stagger and timelines make it easy to precisely orchestrate animations.", links: ["React variants", "animate function", "Vue"] },
    { title: "Spring physics", desc: "Real spring physics for great-feeling animations.", links: ["React stagger", "stagger function"] }
  ];

  return (
    <div className="w-full space-y-24 py-24">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tight text-m3-on-surface">{en.home.motionShowcaseTitle}</h2>
        <p className="text-m3-on-surface-variant/60 font-black uppercase tracking-[0.2em] text-[10px]">{en.home.motionShowcaseSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <Card key={i} variant="outlined" className="p-6 space-y-4 group hover:border-m3-primary/50 transition-all">
            <div className="w-10 h-10 bg-m3-primary/10 rounded-xl flex items-center justify-center text-m3-primary group-hover:bg-m3-primary group-hover:text-m3-on-primary transition-all">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-m3-on-surface">{f.title}</h3>
            <p className="text-sm text-m3-on-surface-variant/70 leading-relaxed">{f.desc}</p>
            <div className="pt-4 flex flex-wrap gap-2">
              {f.links.map((l, j) => (
                <span key={j} className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-m3-surface-container rounded-full text-m3-on-surface-variant/60">{l}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Footer = ({ setView }: { setView: (view: string) => void }) => {
  const { translations: en } = useLanguage();
  return (
    <footer className="w-full bg-m3-surface-container-low border-t border-m3-outline-variant/20 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4 md:col-span-2">
          <Logo size="sm" />
          <p className="text-m3-on-surface-variant text-sm max-w-sm leading-relaxed">
            {en.home.futureDesc}
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-m3-on-surface-variant">Platform</h4>
          <ul className="space-y-2">
            <li><button onClick={() => setView('home')} className="text-sm text-m3-on-surface hover:text-m3-primary transition-colors">{en.nav.home}</button></li>
            <li><button onClick={() => setView('builder')} className="text-sm text-m3-on-surface hover:text-m3-primary transition-colors">{en.nav.builder}</button></li>
            <li><button onClick={() => setView('vault')} className="text-sm text-m3-on-surface hover:text-m3-primary transition-colors">{en.nav.vault}</button></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-m3-on-surface-variant">Connect</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-m3-surface-container flex items-center justify-center text-m3-on-surface hover:bg-m3-primary hover:text-m3-on-primary transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-m3-surface-container flex items-center justify-center text-m3-on-surface hover:bg-m3-primary hover:text-m3-on-primary transition-colors">
              <Github size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-m3-surface-container flex items-center justify-center text-m3-on-surface hover:bg-m3-primary hover:text-m3-on-primary transition-colors">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-m3-outline-variant/20 text-xs text-m3-on-surface-variant font-medium">
        <p>© {new Date().getFullYear()} ARXUN. {en.guide.allRightsReserved}</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-m3-primary transition-colors">{en.guide.privacyPolicy}</a>
          <a href="#" className="hover:text-m3-primary transition-colors">{en.guide.termsOfService}</a>
        </div>
      </div>
    </footer>
  );
};

export const Home: React.FC<{ setView: (view: any) => void; isSidebarOpen: boolean }> = ({ setView, isSidebarOpen }) => {
  const { translations: en } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    if (videoRef.current) {
      if (isSidebarOpen) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.error("Video play failed:", e));
      }
    }
  }, [isSidebarOpen]);

  return (
    <div className="w-full relative bg-m3-surface">
      {/* Master Container for Sticky Hero */}
      <div ref={containerRef} className="relative h-[250vh] w-full">
        {/* Sticky Hero Section */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <ScrollZoomHero scrollYProgress={scrollYProgress as any} videoRef={videoRef} />
        </div>
      </div>

      {/* Parallax Content Section */}
      <div className="relative z-30 w-full bg-m3-surface shadow-[0_-20px_50px_rgba(0,0,0,0.15)] rounded-t-[3rem] -mt-[100vh] pt-12 flex flex-col min-h-screen">
        <div className="w-full max-w-7xl mx-auto space-y-32 px-6 py-24 flex-grow">
          <div className="flex flex-wrap justify-center gap-8 pt-4">
              <Button 
                onClick={() => setView('builder')}
                size="lg"
                className="h-16 px-10 text-sm tracking-[0.2em]"
                icon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              >
                {en.home.initBuilder}
              </Button>
              <Button 
                onClick={() => setView('vault')}
                variant="tonal"
                size="lg"
                className="h-16 px-10 text-sm tracking-[0.2em]"
              >
                {en.home.accessVault}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: ShieldCheck, label: en.home.features.encrypted, desc: en.home.features.encryptedDesc },
                { icon: Zap, label: en.home.features.instant, desc: en.home.features.instantDesc },
                { icon: Layers, label: en.home.features.universal, desc: en.home.features.universalDesc },
                { icon: Sparkles, label: en.home.features.highFi, desc: en.home.features.highFiDesc }
              ].map((feature, i) => (
                <Card key={i} variant="outlined" className="p-8 space-y-6 group hover:border-m3-primary transition-all bg-m3-surface/40 backdrop-blur-md border-m3-outline-variant/10">
                  <div className="w-12 h-12 rounded-2xl bg-m3-primary/10 flex items-center justify-center text-m3-primary group-hover:bg-m3-primary group-hover:text-m3-on-primary transition-colors">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest text-m3-on-surface">{feature.label}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-m3-on-surface-variant/50 leading-relaxed">{feature.desc}</p>
                  </div>
                </Card>
              ))}
            </div>

            <MotionShowcase />
        </div>
      </div>
    </div>
  );
};
