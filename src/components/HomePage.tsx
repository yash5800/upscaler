// HomePage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';
import Footer from './Footer';
import PoppedCard from './PoppedCard';
import CardsTest from './CardsTest';
import TruckScene from './TruckScene';
import type { ViewTab } from '../types';
import Hero from "./Hero";
import PixelifyStory from './PixelifyStory';
import BGRemoverSection from './BGRemoverSection';
import AIUpscalerSection from './AIUpscalerSection';

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

      {/* ========================================================================= */}
      {/* HERO SECTION AT FULL VIEWPORT SCREEN WIDTH (100VW) */}
      {/* ========================================================================= */}
      <Hero
        onLaunchUpscaler={onLaunchUpscaler}
        onLaunchBGRemove={onLaunchBGRemove}
      />

      <div id="home-content" className="flex flex-col gap-16 pt-12 pb-12 max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

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

          <div className="flex flex-col gap-0 relative">

            {/* ROW 1: NEURAL BACKGROUND REMOVER WORKSTATION (REFERENCE UI) */}
            <BGRemoverSection onLaunchBGRemove={onLaunchBGRemove} />

            {/* ROW 2: AI UPSCALER STUDIO (REFERENCE UI WITH SPIDERMAN CARDS) */}
            <AIUpscalerSection onLaunchUpscaler={onLaunchUpscaler} />

          </div>
        </section>

        {/* ========================================================================= */}
        {/* PixelifyStory
        {/* ========================================================================= */}
        
{/* 
          <PixelifyStory /> */}


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
