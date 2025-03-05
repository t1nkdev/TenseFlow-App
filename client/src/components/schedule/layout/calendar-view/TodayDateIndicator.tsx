import React from 'react';

interface TodayDateIndicatorProps {
  dayNumber: number;
}

export default function TodayDateIndicator({ dayNumber }: TodayDateIndicatorProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-orange-500">
      <span className="text-2xl font-black text-white">
        {dayNumber}
      </span>
    </div>
  );
} 