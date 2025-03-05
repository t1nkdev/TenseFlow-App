'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { ShiftType, Department } from '@/types/prismaTypes';
import { useAppSelector } from '@/store/hooks';

interface SearchFilterTableProps {
  onFilterChange: (filters: {
    searchTerm: string;
    shiftTypeId: string | null;
    group: string | null;
  }) => void;
  shiftPlanId?: string;
  departments?: Department[];
  children?: React.ReactNode;
}

export default function SearchFilterTable({ onFilterChange, shiftPlanId, departments = [], children }: SearchFilterTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShiftType, setSelectedShiftType] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { list: shiftTypes } = useAppSelector(state => state.shiftTypes);
  const filterRef = useRef<HTMLDivElement>(null);

  // Get all unique groups from departments
  const availableGroups = React.useMemo(() => {
    const groups = new Set<string>();
    departments.forEach(dept => {
      if (dept.groups && dept.groups.length > 0) {
        dept.groups.forEach((group: string) => groups.add(group));
      }
    });
    return Array.from(groups).sort();
  }, [departments]);

  // Apply filters when search term, selected shift type, or selected group changes
  useEffect(() => {
    const filters = {
      searchTerm,
      shiftTypeId: selectedShiftType,
      group: selectedGroup
    };
    
    onFilterChange(filters);
  }, [searchTerm, selectedShiftType, selectedGroup, onFilterChange]);

  // Reset filters when shift plan changes
  useEffect(() => {
    setSearchTerm('');
    setSelectedShiftType(null);
    setSelectedGroup(null);
  }, [shiftPlanId]);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleClearFilters = () => {
    setSelectedShiftType(null);
    setSelectedGroup(null);
  };

  return (
    <div className="bg-[#1564a0] border-b border-gray-200">
      <div className="flex items-center p-3">
        {/* Search and Filter Section */}
        <div className="flex items-center gap-2 mr-4">
          {/* Search Input */}
          <div className="relative w-[250px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="block w-full pl-10 pr-10 py-2 bg-[#0d5285] border border-[#3a7cb3] rounded-lg text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-white hover:text-blue-200" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-3 py-2 bg-[#0d5285] border border-[#3a7cb3] rounded-lg text-sm flex items-center gap-2 text-white`}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0d5285] border border-[#3a7cb3] rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-4 border-b border-[#3a7cb3]">
                  <h3 className="text-sm font-medium text-white">Filter Options</h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Shift Type Filter */}
                  <div>
                    <label className="block text-xs font-medium text-blue-200 mb-2">
                      Shift Type
                    </label>
                    <select
                      value={selectedShiftType || ''}
                      onChange={(e) => setSelectedShiftType(e.target.value || null)}
                      className="w-full px-3 py-2 bg-[#1564a0] border border-[#3a7cb3] rounded-xl text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                      <option value="">All Shift Types</option>
                      {shiftTypes.map((shift) => (
                        <option key={shift.id} value={shift.id}>
                          {shift.code} - {shift.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Group Filter */}
                  {availableGroups.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-blue-200 mb-2">
                        Group
                      </label>
                      <select
                        value={selectedGroup || ''}
                        onChange={(e) => setSelectedGroup(e.target.value || null)}
                        className="w-full px-3 py-2 bg-[#1564a0] border border-[#3a7cb3] rounded-xl text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="">All Groups</option>
                        {availableGroups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-[#0d5285] border-t border-[#3a7cb3] flex justify-between">
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-blue-200 hover:text-white transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-3 py-1 bg-[#1564a0] text-xs text-white font-medium rounded-lg hover:bg-[#1564a0]/80 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Department Tabs - directly next to search bar */}
        <div className="flex-1 overflow-x-auto">
          {children}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedShiftType || selectedGroup) && (
        <div className="flex items-center gap-2 px-3 pb-2">
          <span className="text-xs text-white">Active filters:</span>
          
          {/* Shift Type Filter Badge */}
          {selectedShiftType && (
            <div className="flex items-center gap-1 px-2 py-1 bg-[#0d5285] text-white rounded-md text-xs border border-[#3a7cb3]">
              {shiftTypes.find(s => s.id === selectedShiftType)?.code || 'Shift'} 
              <button onClick={() => setSelectedShiftType(null)}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {/* Group Filter Badge */}
          {selectedGroup && (
            <div className="flex items-center gap-1 px-2 py-1 bg-[#0d5285] text-white rounded-md text-xs border border-[#3a7cb3]">
              Group: {selectedGroup}
              <button onClick={() => setSelectedGroup(null)}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
