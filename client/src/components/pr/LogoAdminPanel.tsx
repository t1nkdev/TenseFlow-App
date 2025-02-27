'use client';

import { motion } from 'framer-motion';

export default function LogoAdminPanel() {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center gap-8">
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
        <div className="absolute inset-0 bg-[#6B21A8]" />
        <div className="absolute -left-[36px] h-full flex">
          <div className="h-16 w-[12px] bg-[#A855F7]" style={{ opacity: 0.4 }}></div>
          <div className="h-16 w-[12px] bg-[#9333EA]" style={{ opacity: 0.6 }}></div>
          <div className="h-16 w-[12px] bg-[#7E22CE]" style={{ opacity: 0.8 }}></div>
        </div>
      </motion.div>

      <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#6B21A8]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
}
