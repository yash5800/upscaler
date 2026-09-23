import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AIUpscalerSectionProps {
  onLaunchUpscaler: () => void;
}

export default function AIUpscalerSection({ onLaunchUpscaler }: AIUpscalerSectionProps) {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section className="w-screen max-w-none relative left-1/2 -translate-x-1/2 rounded-t-none rounded-b-[32px] sm:rounded-b-[44px] bg-[#07080D] border-x border-b border-t-0 border-white/10 pt-16 sm:pt-20 lg:pt-24 pb-6 sm:py-8 lg:py-8 px-4 sm:px-8 lg:px-12 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.85)] z-10">
      {/* Outer ambient green back-glow matching reference screenshot */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00C86A]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00FF85]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Centered Inner Container with balanced height between 500px and 600px */}
      <div className="max-w-[1300px] mx-auto w-full relative z-10 lg:h-[650px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-4">

        {/* ========================================================================= */}
        {/* LEFT: CONTENT (Beside Card 3 on the left, and sitting directly ABOVE Card 1)*/}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-3 sm:gap-3.5 max-w-md xl:max-w-lg pt-1 z-30">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C86A]/10 border border-[#00C86A]/20 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#00C86A] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00C86A]">
              AI 8K Super-Resolution
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-bold tracking-tight text-white leading-[1.2]">
            <span className="text-[#00C86A]">GenAI</span> will execute more mundane development tasks
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed max-w-sm">
            Developers will orchestrate the work of AI agents while focusing on higher-level problem solving
          </p>

          {/* Launch Studio CTA */}
          <div className="pt-0.5">
            <button
              onClick={onLaunchUpscaler}
              className="px-5 py-2.5 rounded-full bg-[#00FF85] hover:bg-[#00E575] text-black font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(0,255,133,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group w-fit cursor-pointer"
            >
              <span>Launch Upscaler Studio</span>
              <span className="group-hover:translate-x-1 transition-transform font-black">→</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT: CARDS CLUSTER (Card 3 Hero, Card 2 Overlapping, Card 1 Centered)   */}
        {/* ========================================================================= */}
        <div className="relative shrink-0 flex items-start justify-center lg:justify-end scale-[0.75] xs:scale-[0.84] sm:scale-[0.92] lg:scale-100 origin-center lg:origin-top-right my-2 lg:my-0">
          <div className="relative">

            {/* ----------------------------------------------------------------- */}
            {/* CARD 3: MOST LARGE SPIDERMAN CARD (spiderman1_2model.png)         */}
            {/* ----------------------------------------------------------------- */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              onMouseEnter={() => setActiveCard(2)}
              onMouseLeave={() => setActiveCard(null)}
              onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
              className={`top-[45px] w-[280px] sm:w-[310px] lg:w-[335px] xl:w-[350px] h-[410px] sm:h-[430px] lg:h-[550px] rounded-[28px] sm:rounded-[34px] overflow-hidden border transition-all duration-500 relative cursor-pointer group z-10 ${
                activeCard === 2
                  ? 'border-white ring-2 ring-white/60 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_45px_rgba(255,255,255,0.35),0_0_15px_rgba(255,255,255,0.6),inset_0_1px_3px_rgba(255,255,255,0.8)]'
                  : 'border-white/30 hover:border-white/80 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.35)] hover:shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_35px_rgba(255,255,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.6)]'
              }`}
            >
              <img
                src="/cards_imgs/spiderman1_2model.png"
                alt="8K Ultra Super-Resolution Spiderman"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute bottom-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1 text-white rounded bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold flex items-center gap-2 shadow-lg text-neutral-300 border border-white/10">
                  <span>REAL-ESRGAN</span>
                </div>
              </div>
            </motion.div>

            {/* ----------------------------------------------------------------- */}
            {/* CARD 2 WRAPPER: Overlaps Card 3 on bottom-left, anchors Card 1    */}
            {/* ----------------------------------------------------------------- */}
            <div className="absolute -bottom-1 lg:-bottom-20 -left-16 sm:-left-20 lg:-left-24 z-20 w-[190px] sm:w-[205px] lg:w-[215px]">

              {/* CARD 2 ELEMENT (spiderman_1model.png) */}
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                onMouseEnter={() => setActiveCard(1)}
                onMouseLeave={() => setActiveCard(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCard(activeCard === 1 ? null : 1);
                }}
                className={`w-full rounded-[22px] sm:rounded-[24px] bg-[#161824] border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col relative z-20 ${
                  activeCard === 1
                    ? 'border-white ring-2 ring-white/60 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(255,255,255,0.35),0_0_15px_rgba(255,255,255,0.6),inset_0_1px_3px_rgba(255,255,255,0.8)]'
                    : 'border-white/30 hover:border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_22px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.35)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_32px_rgba(255,255,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.6)]'
                }`}
              >
                <div className="relative w-full h-[250px] sm:h-[265px] lg:h-[275px] bg-black overflow-hidden flex items-center justify-center group">
                  <img
                    src="/cards_imgs/spiderman_1model.png"
                    alt="AI Model 1 Upscaled Spiderman"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                  />
                  <div className="absolute text-white font-bold bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-neutral-300 border border-white/10"
                  >
                    ESPCN Turbo
                  </div>
                </div>
              </motion.div>

              {/* --------------------------------------------------------------- */}
              {/* CARD 1 ANCHOR: ON LEFT SIDE ON CENTER OF CARD 2                 */}
              {/* --------------------------------------------------------------- */}
              <div className="absolute -left-[155px] sm:-left-[165px] lg:-left-[230px] top-[-30%] z-10">

                {/* Card 1 Element (spiderman.jpg) */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  onMouseEnter={() => setActiveCard(0)}
                  onMouseLeave={() => setActiveCard(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCard(activeCard === 0 ? null : 0);
                  }}
                  className={`w-[165px] sm:w-[175px] lg:w-[180px] rounded-[18px] sm:rounded-[20px] bg-[#141620] border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col ${
                    activeCard === 0
                      ? 'border-white ring-2 ring-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(255,255,255,0.35),0_0_12px_rgba(255,255,255,0.6),inset_0_1px_3px_rgba(255,255,255,0.8)]'
                      : 'border-white/30 hover:border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.35)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_28px_rgba(255,255,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.6)]'
                  }`}
                >
                  {/* Image Preview Window (spiderman.jpg) */}
                  <div className="relative w-full h-[175px] sm:h-[185px] lg:h-[190px] bg-black overflow-hidden flex items-center justify-center">
                    <img
                      src="/cards_imgs/spiderman.jpg"
                      alt="1x Low-res Spiderman"
                      className="w-full h-full object-cover select-none"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="absolute text-white font-bold bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-neutral-300 border border-white/10">
                      ORG
                    </div>
                  </div>
                </motion.div>

                {/* AI DELEGATED SYMBOL: Directly below small card with curved arrow to Card 2 */}
                <div className="absolute top-[calc(100%+40px)] left-1/2 -translate-x-[40px] flex flex-col items-center justify-center rotate-[30deg] select-none pointer-events-none whitespace-nowrap">
                  <span
                    className="text-md font-bold text-white italic tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                    style={{ fontFamily: 'cursive, system-ui, sans-serif' }}
                  >
                    AI Delegated
                  </span>
                  
                  {/* Curved SVG Arrow curving towards Card 2 */}

                  <svg
                    width="68"
                    height="30"
                    viewBox="0 0 68 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#00C86A] drop-shadow-[0_0_6px_rgba(0,200,106,0.5)] translate-x-3"
                  >
                    <path
                      d="M 6 6 C 18 22, 42 26, 60 18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 52 12 L 61 18 L 53 24"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
