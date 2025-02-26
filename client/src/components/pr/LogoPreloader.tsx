'use client';

import { motion } from 'framer-motion';

export default function LogoPreloader() {
  return (
    <div className="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center">
      <motion.div 
        className="relative w-16 h-16"
        animate={{
          scale: [0.95, 1, 0.95],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <div className="absolute inset-0 bg-[#0066B3]" />
        <div className="absolute -left-[36px] h-full flex">
          <div className="h-16 w-[12px] bg-[#66A3D8]" style={{ opacity: 0.4 }}></div>
          <div className="h-16 w-[12px] bg-[#3385C6]" style={{ opacity: 0.6 }}></div>
          <div className="h-16 w-[12px] bg-[#0077CC]" style={{ opacity: 0.8 }}></div>
        </div>
      </motion.div>
    </div>
  );
}
