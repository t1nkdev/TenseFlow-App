'use client';

export default function LoaderAnimation() {
  return (
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gray-100">
      <div className="h-full bg-[#0066B3] animate-slide-right" />
    </div>
  );
}
