'use client';
import { useEffect } from 'react';

interface PreloaderModalsProps {
  onFinish: () => void;
}

export default function PreloaderModals({ onFinish }: PreloaderModalsProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 500); // Keep quick transition to modal (0.5 seconds)
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 flex items-center justify-center">
      {/* Slower Circle Spinner */}
      <div className="w-12 h-12 border-4 border-[#0066B3]/20 border-t-[#0066B3] rounded-full animate-[spin_1.2s_linear_infinite]" />

      {/* Option 2: Three Dots */}
      {/* <div className="flex gap-2">
        <div className="w-3 h-3 bg-[#0066B3] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-3 h-3 bg-[#0066B3] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-3 h-3 bg-[#0066B3] rounded-full animate-bounce" />
      </div> */}

      {/* Option 3: Pulsing Ring */}
      {/* <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-[#0066B3] rounded-full animate-ping opacity-75" />
        <div className="relative border-4 border-[#0066B3] rounded-full w-full h-full" />
      </div> */}
    </div>
  );
}
