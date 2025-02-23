'use client';
import { AlertCircle, X } from 'lucide-react';

interface Props {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export default function GlobalNotification({ isVisible, setIsVisible }: Props) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-24 w-full z-30 bg-blue-500/10 backdrop-blur-sm">
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-20 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-700">
              Scheduled maintenance: Our services will be undergoing maintenance on Saturday, 20:00 UTC.
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
