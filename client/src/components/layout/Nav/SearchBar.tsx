'use client';
import { Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const searchCategories = [
  'Apps',
  'Employees',
  'Documents',
  'Tasks',
  'Schedules'
];

export default function SearchBar() {
  const [searchCategory, setSearchCategory] = useState('Apps');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative flex items-center w-[420px]">
      <div className="relative w-full">
        <div className="flex">
          <button 
            onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-l-xl border-r border-gray-200 hover:bg-gray-200"
          >
            <span className="text-xs font-medium">{searchCategory}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${searchDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${searchCategory}...`}
              className="w-full text-gray-600 px-4 py-1.5 pl-10 bg-gray-100 rounded-r-xl
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-gray-600"
            />
            <Search className="w-4 h-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        {searchDropdownOpen && (
          <div 
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            onMouseLeave={() => setSearchDropdownOpen(false)}
          >
            {searchCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSearchCategory(category);
                  setSearchDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center"
              >
                <Search className="w-4 h-4 mr-2 text-gray-400" />
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 