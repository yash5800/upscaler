import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface PoppedCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  glowColor?: string;
}

export default function PoppedCard({
  children,
  onClick,
  className = '',
  glowColor = 'rgba(0, 255, 133, 0.25)',
}: PoppedCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{
        scale: 1.025,
        y: -6,
        boxShadow: `0 30px 70px ${glowColor}`,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={`relative cursor-pointer rounded-[32px] border border-white/12 bg-[#0E0E14] p-8 sm:p-10 transition-colors duration-300 hover:border-[#00FF85]/60 overflow-hidden ${className}`}
    >
      {/* Inner Container keeping text/icon depth and effects */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
