'use client';
import React from 'react';
import { Plus, Settings, Calendar } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { openCreateShiftModal, openSettingsModal } from '@/store/features/ui/uiSlice';

interface SidebarHeaderProps {
  title: string;
}

export default function SidebarHeader({ title }: SidebarHeaderProps) {
  const dispatch = useAppDispatch();

  const handleCreateClick = () => {
    dispatch(openCreateShiftModal());
  };

  const handleConfigureClick = () => {
    dispatch(openSettingsModal({
      initialTab: 1,
      initialItem: 0
    }));
  };

  return (
    <div className="p-3 pl-5 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#0066B3]" />
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
        <button
          onClick={handleConfigureClick}
          className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-[#0066B3] transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 