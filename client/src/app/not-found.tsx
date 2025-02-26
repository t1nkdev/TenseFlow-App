'use client';
import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full px-6 text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-block p-6 bg-blue-50 rounded-full">
            <FileQuestion className="w-16 h-16 text-[#0066B3]" />
          </div>
        </div>

        {/* Error Code & Message */}
        <h1 className="text-7xl font-semibold text-[#0066B3] mb-4">
          404
        </h1>
        <h2 className="text-2xl font-medium text-gray-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500">
          We couldn't find the page you're looking for. 
          Please check the URL or return to the homepage.
        </p>

        {/* Action Button */}
        <Link 
          href="/main/shift-schedule"
          className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-50 text-[#0066B3] rounded-lg hover:bg-blue-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
} 