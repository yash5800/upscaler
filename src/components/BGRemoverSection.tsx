import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BGRemoverSectionProps {
  onLaunchBGRemove: () => void;
}

export default function BGRemoverSection({ onLaunchBGRemove }: BGRemoverSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="w-screen max-w-none relative left-1/2 -translate-x-1/2 rounded-[32px] sm:rounded-[44px] bg-white text-neutral-900 py-14 sm:py-18 lg:py-20 px-4 sm:px-8 lg:px-12 shadow-[0_30px_100px_rgba(0,0,0,0.7)] relative z-20 overflow-hidden -mb-10 sm:-mb-12 lg:-mb-14">
      {/* Scoped styles replicating the exact 3D tilt & pop-out animation from ztest.html */}
      <style>{`
        .bgr-3d-wrapper {
          position: relative;
          height: 480px;
          width: 100%;
          max-width: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 800px;
        }

        @media (min-width: 640px) {
          .bgr-3d-wrapper {
            height: 560px;
            max-width: 480px;
          }
        }

        .bgr-3d-card {
          position: relative;
          height: 100%;
          width: 90%;
          text-align: center;
          transition: 0.2s ease-out;
          transition-delay: 0.3s;
        }

        .bgr-3d-wrapper:hover .bgr-3d-card,
        .bgr-3d-wrapper.is-hovered .bgr-3d-card {
          transform: rotateX(50deg);
          transform-origin: bottom;
          filter: brightness(30%);
          height: 95%;
        }

        .bgr-3d-card img {
          height: 100%;
          width: 100%;
          border: 3px solid #fff;
          border-radius: 18px;
          object-fit: cover;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }

        .bgr-3d-popup {
          position: absolute;
          height: 100%;
          width: 100%;
          pointer-events: none;
        }

        .bgr-3d-popup img {
          position: absolute;
          height: 80%;
          top: 50%;
          left: 50%;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.7);
          transition: 0.2s ease-out;
          transition-delay: 0s;
          filter: drop-shadow(0 25px 35px rgba(0, 0, 0, 0.6));
        }

        .bgr-3d-wrapper:hover .bgr-3d-popup img,
        .bgr-3d-wrapper.is-hovered .bgr-3d-popup img {
          transform: translate(-50%, -50%) scale(1.2);
          transition-delay: 0.2s;
          opacity: 1;
        }
      `}</style>

      <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* ========================================================================= */}
        {/* LEFT COLUMN: 3 TIERED STATEMENTS MATCHING REFERENCE UI */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col gap-8 sm:gap-10">
          {/* Subtle Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C86A]/10 border border-[#00C86A]/20 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#00C86A] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00A855]">
              Neural Background Remover
            </span>
          </div>

          {/* 3 Tiered Headline Items */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Item 1 - Active Highlighted */}
            <div
              onClick={() => setActiveTab(0)}
              className="cursor-pointer transition-all duration-300 select-none group"
            >
              <h3
                className={`text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight transition-colors duration-300 leading-tight ${
                  activeTab === 0 ? 'text-neutral-950' : 'text-neutral-300 hover:text-neutral-500'
                }`}
              >
                <span className="text-[#00C86A]">Remove Image Background</span> 100% free and unlimited.
              </h3>
              {activeTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3.5 flex flex-col gap-3 max-w-lg"
                >
                  <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
                    Eliminate tedious pen-tool cutouts. Isolate portraits, commercial e-commerce products, and complex silhouettes in milliseconds with sub-pixel neural segmentation.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C86A]" />
                      Sub-Pixel Hair Cutouts
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C86A]" />
                      Transparent Objects
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C86A]" />
                      1-Click Instant Cutout
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Item 2 */}
            <div
              onClick={() => setActiveTab(1)}
              className="cursor-pointer transition-all duration-300 select-none group"
            >
              <h3
                className={`text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight transition-colors duration-300 leading-tight ${
                  activeTab === 1 ? 'text-neutral-950' : 'text-neutral-300 hover:text-neutral-500'
                }`}
              >
                <span className={activeTab === 1 ? 'text-[#00C86A]' : ''}>100% On-Device Privacy</span> with zero cloud uploads.
              </h3>
              {activeTab === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3.5 flex flex-col gap-3 max-w-lg"
                >
                  <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
                    Your sensitive photos and proprietary designs never leave your computer. Neural vision models run locally in browser memory powered by WebGPU and WASM SIMD.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C86A]" />
                      Air-Gapped Client Security
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C86A]" />
                      Zero Cloud Server Storage
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C86A]" />
                      Hardware WebGPU Shaders
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Item 3 */}
            <div
              onClick={() => setActiveTab(2)}
              className="cursor-pointer transition-all duration-300 select-none group"
            >
              <h3
                className={`text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight transition-colors duration-300 leading-tight ${
                  activeTab === 2 ? 'text-neutral-950' : 'text-neutral-300 hover:text-neutral-500'
                }`}
              >
                <span className={activeTab === 2 ? 'text-[#00C86A]' : ''}>Custom Backdrops</span> & full original resolution export.
              </h3>
              {activeTab === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3.5 flex flex-col gap-3 max-w-lg"
                >
                  <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
                    Download crisp transparent alpha PNG cutouts or swap in clean solid studio colors and backdrops. Output files retain 100% of their original sensor resolution and sharpness.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C86A]" />
                      Lossless High-Res PNG
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C86A]" />
                      Custom Color Backdrops
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C86A]" />
                      No Compression Loss
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2">
            <button
              onClick={onLaunchBGRemove}
              className="px-6 py-3.5 rounded-full bg-neutral-950 hover:bg-black text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group w-fit"
            >
              <span>Explore BG Remover</span>
              <span className="text-[#00FF85] group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: EXACT 3D POP-OUT CUTOUT ANIMATION FROM ztest.html           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 flex items-center justify-center p-4 sm:p-8">
          <div
            onClick={() => setIsHovered(!isHovered)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bgr-3d-wrapper cursor-pointer select-none ${isHovered ? 'is-hovered' : ''}`}
          >
            {/* Tilt Card (Original Photo) */}
            <div className="bgr-3d-card">
              <img src="/bg-img.jpg" alt="Original Photo" />
            </div>

            {/* Popup Cutout (Background Removed PNG) */}
            <div className="bgr-3d-popup">
              <img src="/bg-removed.png" alt="Background Removed Cutout" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
