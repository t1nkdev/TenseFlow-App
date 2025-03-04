'use client';
import { Bug, X } from 'lucide-react';

interface Props {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export default function GlobalNotification({ isVisible, setIsVisible }: Props) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 pt-4 w-full z-30">
      {/* Beta Warning */}
      <div className="bg-orange-500 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-8 lg:px-20 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-white" />
              <p className="text-sm text-white">
                Beta Version: This app is still in development. You may encounter bugs or unexpected behavior.
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-0.5 hover:bg-orange-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
