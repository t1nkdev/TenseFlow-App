'use client';
import { Search, Plus } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (value: string) => void;
  onFilterStatus: (value: string) => void;
  showFilters: boolean;
  onAdd: () => void;
}

export default function SearchFilterEmployees({ 
  onSearch, 
  onFilterStatus,
  showFilters,
  onAdd
}: SearchFilterProps) {
  if (!showFilters) return null;

  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-[#1564a0] border-b border-gr ay-200">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#0d5285] border border-[#3a7cb3] rounded-lg text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>
      <select
        onChange={(e) => onFilterStatus(e.target.value)}
        className="px-3 py-2 bg-[#0d5285] border border-[#3a7cb3] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="ON_LEAVE">On Leave</option>
        <option value="INACTIVE">Inactive</option>
      </select>
            
    </div>
  );
}
