import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import Footer from './Footer';
import PoppedCard from './PoppedCard';
import CardsTest from './CardsTest';
import TruckScene from './TruckScene';
import type { ViewTab } from '../types';

interface HomePageProps {
  onLaunchUpscaler: () => void;
  onLaunchBGRemove: () => void;
  onSelectSample: (sampleUrl: string, type: 'upscale' | 'bg_remove') => void;
  onTabChange: (tab: ViewTab) => void;
}

const SAMPLES = [
  {
    id: 's1',
    name: 'Street Fashion Portrait',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    type: 'bg_remove' as const,
    tag: 'Portrait Cutout',
    description: 'Extract subject with sub-pixel edge detection',
  },
  {
    id: 's2',
    name: 'Cyberpunk Neon City',
    src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    type: 'upscale' as const,
    tag: '8K Super-Res',
    description: '4x upscale with micro-texture enhancement',
  },
  {
    id: 's3',
    name: 'Luxury Product Design',
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    type: 'bg_remove' as const,
    tag: 'E-Commerce BG',
    description: 'Clean product cutout for commercial use',
  },
];

const FEATURES_TABS = [
  {
    id: 'f1',
    title: 'Neural Super-Resolution',
    subtitle: 'Reconstruct high-frequency textures and crisp edges up to 8K resolution without artifacts.',
    badge: '4x Factor',
    demoImg: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    detailTitle: 'ESPCN & Real-ESRGAN Engine',
    detailDesc: 'Direct ONNX Runtime Web execution utilizing WebGPU shaders for hardware-accelerated tensor math.',
  },
  {
    id: 'f2',
    title: 'Sub-Pixel Hair Cutouts',
    subtitle: 'Isolate subjects with sub-pixel precision around transparent objects and fine hair strands.',
    badge: 'BiRefNet AI',
    demoImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    detailTitle: 'BiRefNet Neural Segmentation',
    detailDesc: 'Dual-path vision transformers generate smooth alpha matte masks directly in browser memory.',
  },
  {
    id: 'f3',
    title: '100% On-Device Privacy',
    subtitle: 'Zero cloud servers, zero external data uploads. Your images never leave your computer.',
    badge: 'Local WASM',
    demoImg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    detailTitle: 'Air-Gapped Client Security',
    detailDesc: 'Complete offline capability powered by WASM SIMD and client-side memory isolation.',
  },
];

export default function HomePage({
  onLaunchUpscaler,
  onLaunchBGRemove,
  onSelectSample,
  onTabChange,
}: HomePageProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const currentTab = FEATURES_TABS[activeFeatureTab];

  return (
    <div className="relative min-h-screen bg-[#050507] text-white">

      <div className="flex flex-col gap-16 pt-2 pb-12 max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ========================================================================= */}
        {/* HERO SECTION ON PAGE BODY WITH VIDEO BACKGROUND (NO CARD BORDERS) */}
        {/* ========================================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="relative w-full flex flex-col items-center justify-center text-center py-6 sm:py-10 md:py-14 group"
        >
          {/* LOOPING VIDEO BACKGROUND DIRECTLY ON PAGE BODY */}
          <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden pointer-events-none rounded-3xl sm:rounded-[36px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              src="/upscaled-video.mp4"
              className="w-full h-full object-cover opacity-30 filter brightness-90 contrast-110 pointer-events-none scale-105 group-hover:scale-100 transition-transform duration-1000"
            />

            {/* SEAMLESS GRADIENT FADES TO MELT VIDEO INTO BODY BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-black/30 to-[#050507]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_10%,_#050507_85%)]" />
          </div>

          {/* HERO CONTENT OVER VIDEO */}
          <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto">

            {/* TOP CENTERED TECH BADGE */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-semibold text-white shadow-lg"
            >
              <span className="px-2 py-0.5 rounded bg-[#00FF85]/20 text-[#00FF85] text-[10px] font-bold font-mono border border-[#00FF85]/30">
                NEW
              </span>
              <span>Next-Gen Local AI Creative Platform</span>
            </motion.div>

            {/* CENTERED HERO HEADLINE QUOTE */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08]"
            >
              Pixel perfection, <br />
              <span className="text-[#00FF85] drop-shadow-[0_0_25px_rgba(0,255,133,0.4)]">
                powered on your device.
              </span>
            </motion.h1>

            {/* CENTERED HERO SUBTITLE */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-xl text-neutral-300 font-normal max-w-2xl leading-relaxed"
            >
              Enhance image resolution up to 8K and extract crisp subject cutouts instantly inside your web browser. 100% private, client-side WebGPU acceleration.
            </motion.p>

            {/* CENTERED ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLaunchUpscaler}
                className="group px-8 py-3.5 rounded-full bg-[#00FF85] text-black font-bold text-sm sm:text-base transition-all duration-300 shadow-[0_0_30px_rgba(0,255,133,0.4)] hover:shadow-[0_0_50px_rgba(0,255,133,0.7)] flex items-center gap-2.5"
              >
                <span>Launch AI Upscaler Studio</span>
                <span className="w-6 h-6 rounded-full bg-black text-[#00FF85] flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLaunchBGRemove}
                className="group px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-xl text-white font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2.5"
              >
                <span>Launch BG Remover Canvas</span>
                <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs group-hover:rotate-12 transition-transform">
                  <Icon name="spark" size={14} />
                </span>
              </motion.button>
            </motion.div>

            {/* METRICS STRIP */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-6 border-t border-white/15 text-xs sm:text-sm font-medium text-neutral-300 w-full max-w-3xl mt-2">
              <span className="flex items-center gap-2">
                <span className="text-[#00FF85] font-bold">✓</span> 100% On-Device Privacy
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#00FF85] font-bold">✓</span> WebGPU / WASM Local AI
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#00FF85] font-bold">✓</span> Unlimited High-Res Exports
              </span>
            </div>

          </div>
        </motion.section>

        {/* ========================================================================= */}
        {/* DUAL POPPED WORKSPACE CARDS ("CHOOSE YOUR STUDIO" - reference.mp4 style) */}
        {/* ========================================================================= */}
        <section className="flex flex-col gap-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto flex flex-col gap-3"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00FF85]">
              Choose Your Studio
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Crafted for Creatives & Engineers
            </h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Pick the workstation built specifically for your image processing needs.
            </p>
          </motion.div>

          <div className="flex flex-col gap-10">

            {/* ROW 1: AI UPSCALER STUDIO (LEFT) & CARDS TEST DECK (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* POPPED CARD 1: AI UPSCALER STUDIO */}
              <div className="lg:col-span-6 h-full">
                <PoppedCard onClick={onLaunchUpscaler} glowColor="rgba(0, 255, 133, 0.3)">
                  <div className="flex flex-col gap-7 h-full justify-between">

                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <motion.div
                          whileHover={{ rotate: 12, scale: 1.1 }}
                          className="w-14 h-14 rounded-2xl bg-[#00FF85]/10 border border-[#00FF85]/30 text-[#00FF85] flex items-center justify-center shadow-lg"
                        >
                          <Icon name="image" size={28} />
                        </motion.div>

                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00FF85] bg-[#00FF85]/10 px-3 py-1 rounded-full border border-[#00FF85]/30 shadow-[0_0_15px_rgba(0,255,133,0.2)]">
                          Super-Resolution
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#00FF85] transition-colors duration-300 mb-2">
                          AI 8K Upscaler Studio
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                          Transform compressed or low-res graphics into crisp 8K master images. Restores facial features, sharpens micro-details, and eliminates noise.
                        </p>
                      </div>

                      {/* BULLET POINTS WITH ELECTRIC MINT "+" ICONS (reference.mp4 style) */}
                      <div className="flex flex-col gap-3 pt-2">
                        {[
                          '2x, 4x, 8x Tensor Scale Factors',
                          'Real-ESRGAN & ESPCN Neural Models',
                          'Face Restoration & De-Noising Pipelines',
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-200"
                          >
                            <span className="text-[#00FF85] font-black text-lg">+</span>
                            <span>{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* CARD BOTTOM ACTION BUTTON */}
                    <div className="pt-6 border-t border-white/10 flex items-center justify-between mt-4">
                      <span className="text-xs font-mono text-neutral-400">Zero Artifacts</span>
                      <motion.span
                        whileHover={{ scale: 1.05, x: 4 }}
                        className="px-5 py-2.5 rounded-full bg-[#00FF85] text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,255,133,0.3)] flex items-center gap-2"
                      >
                        <span>Explore Upscaler</span>
                        <span>→</span>
                      </motion.span>
                    </div>

                  </div>
                </PoppedCard>
              </div>

              {/* RIGHT SIDE: CARDS TEST DECK COMPONENT */}
              <div className="lg:col-span-6 flex items-center justify-center overflow-visible">
                <CardsTest />
              </div>

            </div>


            {/* ROW 2: CARDS DECK (LEFT) & NEURAL BG REMOVER CANVAS (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* LEFT SIDE: CARDS TEST DECK COMPONENT (2 CARDS FOR BG REMOVER) */}
              <div className="lg:col-span-6 flex items-center justify-center overflow-visible">
                <CardsTest
                  cards={[
                    {
                      title: "Portrait Input",
                      color: "from-teal-500 via-emerald-500 to-cyan-700",
                      image: "/bg-img.jpg",
                    },
                    {
                      title: "Product Cutout",
                      color: "from-sky-500 via-blue-600 to-indigo-700",
                      image: "/bg-removed.png",
                      background: "checkerboard",
                    },
                  ]}
                />
              </div>

              {/* RIGHT SIDE: NEURAL BG REMOVER CANVAS POPPED CARD */}
              <div className="lg:col-span-6 h-full">
                <PoppedCard onClick={onLaunchBGRemove} glowColor="rgba(0, 255, 133, 0.3)">
                  <div className="flex flex-col gap-7 h-full justify-between">

                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <motion.div
                          whileHover={{ rotate: 12, scale: 1.1 }}
                          className="w-14 h-14 rounded-2xl bg-[#00FF85]/10 border border-[#00FF85]/30 text-[#00FF85] flex items-center justify-center shadow-lg"
                        >
                          <Icon name="spark" size={28} />
                        </motion.div>

                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00FF85] bg-[#00FF85]/10 px-3 py-1 rounded-full border border-[#00FF85]/30 shadow-[0_0_15px_rgba(0,255,133,0.2)]">
                          Neural Cutout
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#00FF85] transition-colors duration-300 mb-2">
                          Neural BG Remover Canvas
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                          Isolate subject portraits, commercial products, and complex graphics instantly with sub-pixel edge detection and an interactive refinement brush.
                        </p>
                      </div>

                      {/* BULLET POINTS WITH ELECTRIC MINT "+" ICONS (reference.mp4 style) */}
                      <div className="flex flex-col gap-3 pt-2">
                        {[
                          'BiRefNet Vision Transformer Segmentation',
                          'Interactive Erase & Restore Brush Canvas',
                          'Instant Transparent PNG Batch Export',
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-200"
                          >
                            <span className="text-[#00FF85] font-black text-lg">+</span>
                            <span>{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* CARD BOTTOM ACTION BUTTON */}
                    <div className="pt-6 border-t border-white/10 flex items-center justify-between mt-4">
                      <span className="text-xs font-mono text-neutral-400">Sub-Pixel Cutouts</span>
                      <motion.span
                        whileHover={{ scale: 1.05, x: 4 }}
                        className="px-5 py-2.5 rounded-full bg-white/10 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 border border-white/15"
                      >
                        <span>Explore Cutouts</span>
                        <span>→</span>
                      </motion.span>
                    </div>

                  </div>
                </PoppedCard>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* "AI CHANGING IMAGE WORKFLOWS" SHOWCASE SECTION (reference.mp4 style) */}
        {/* ========================================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 180 }}
          className="rounded-[36px] border border-white/10 bg-[#0A0A0E] p-8 sm:p-12 relative overflow-hidden shadow-2xl"
        >
          <div className="flex flex-col gap-10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00FF85]">
                AI Changing Image Workflows
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
                Designed for absolute speed & precision
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

              {/* LEFT SIDE: TAB LIST */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {FEATURES_TABS.map((tab, idx) => {
                  const isActive = activeFeatureTab === idx;
                  return (
                    <motion.div
                      key={tab.id}
                      onClick={() => setActiveFeatureTab(idx)}
                      whileHover={{ x: 6 }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col gap-2 ${isActive
                        ? 'bg-[#14141A] border-[#00FF85]/60 shadow-[0_10px_30px_rgba(0,255,133,0.15)]'
                        : 'bg-transparent border-white/5 hover:border-white/20 hover:bg-white/5'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-bold transition-colors ${isActive ? 'text-[#00FF85]' : 'text-white'}`}>
                          {tab.title}
                        </h3>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${isActive ? 'bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/30' : 'bg-white/5 text-neutral-400 border-white/10'
                          }`}>
                          {tab.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                        {tab.subtitle}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* RIGHT SIDE: ANIMATED DYNAMIC SHOWCASE CARD */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTab.id}
                    initial={{ opacity: 0, x: 20, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                    className="rounded-3xl border border-white/15 bg-[#121218] p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <h4 className="text-base font-bold text-white">{currentTab.detailTitle}</h4>
                        <p className="text-xs text-neutral-400">{currentTab.detailDesc}</p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00FF85] shadow-[0_0_12px_#00FF85] animate-pulse" />
                    </div>

                    {/* Dynamic Graphic Preview */}
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black group-hover:border-[#00FF85]/40 transition duration-500">
                      <img
                        src={currentTab.demoImg}
                        alt={currentTab.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      {/* Overlay badge */}
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#00FF85]/40 text-xs font-mono font-bold text-[#00FF85] shadow-lg">
                        {currentTab.badge} Active
                      </span>

                      {/* Bottom Floating Bar */}
                      {/* <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs text-white">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#00FF85]" />
                          Client-Side GPU Shader Execution
                        </span>
                        <span className="font-mono text-[#00FF85]">Zero Latency</span>
                      </div> */}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </motion.section>

        {/* ========================================================================= */}
        {/* SAMPLE DEMOS GRID */}
        {/* ========================================================================= */}
        <section className="flex flex-col gap-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00FF85]">
              Instant Demos
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Try sample assets with a single click
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {SAMPLES.map((sample, idx) => (
              <motion.div
                key={sample.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -8, scale: 1.025 }}
                onClick={() => onSelectSample(sample.src, sample.type)}
                className="group cursor-pointer rounded-2xl border border-white/10 bg-[#0E0E12] overflow-hidden hover:border-[#00FF85]/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="relative h-52 overflow-hidden bg-black">
                  <img
                    src={sample.src}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#00FF85]/30 text-[11px] font-mono font-bold text-[#00FF85]">
                    {sample.tag}
                  </span>
                </div>

                <div className="p-5 flex items-center justify-between border-t border-white/10 bg-[#121216]">
                  <div>
                    <b className="block text-sm font-bold text-[#00FF85] transition">
                      {sample.name}
                    </b>
                    <small className="text-xs text-neutral-400">{sample.description}</small>
                  </div>
                  <motion.span
                    whileHover={{ scale: 1.1, x: 2 }}
                    className="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-[#00FF85] text-white group-hover:text-black flex items-center justify-center text-sm transition-all duration-300 font-bold"
                  >
                    →
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3D TRUCK SCENE DIRECTLY ON PAGE BODY (NO CARD BORDER OR BACKGROUND BOX) */}
        {/* ========================================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 180 }}
          className="relative w-full h-[340px] sm:h-[400px] md:h-[450px] my-6 overflow-hidden pointer-events-none"
        >
          <div className="w-full h-full pointer-events-auto">
            <TruckScene />
          </div>
        </motion.section>

      </div>

      {/* FOOTER */}
      <Footer onTabChange={onTabChange} />
    </div>
  );
}
