'use client';
import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (value: string) => void;
  onFilterDepartment: (value: string) => void;
  onFilterStatus: (value: string) => void;
  showFilters: boolean;
}

export default function SearchFilterEmployees({ 
  onSearch, 
  onFilterDepartment, 
  onFilterStatus,
  showFilters 
}: SearchFilterProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  if (!showFilters) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-3">
          <select
            onChange={(e) => onFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Design">Design</option>
            <option value="HR">HR</option>
          </select>

          <select
            onChange={(e) => onFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            More Filters
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filters - Expandable */}
      {showAdvancedFilters && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="">All Roles</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="">All Time</option>
                <option value="last_week">Last Week</option>
                <option value="last_month">Last Month</option>
                <option value="last_year">Last Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option value="name">Name</option>
                <option value="recent">Most Recent</option>
                <option value="department">Department</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
