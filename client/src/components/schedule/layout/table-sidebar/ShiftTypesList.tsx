'use client';
import React from 'react';
import { ShiftType } from '@/types/prismaTypes';
import { Settings } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { openSettingsModal } from '@/store/features/ui/uiSlice';

interface ShiftTypesListProps {
  shiftTypes: ShiftType[];
  isVisible: boolean;
}

export default function ShiftTypesList({ shiftTypes, isVisible }: ShiftTypesListProps) {
  const dispatch = useAppDispatch();
  
  if (!isVisible) {
    return null;
  }

  const handleConfigureClick = () => {
    dispatch(openSettingsModal({
      initialTab: 1,
      initialItem: 0
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-gray-500">Shift Legend</h4>
        <button 
          onClick={handleConfigureClick}
          className="text-xs text-[#0066B3] hover:text-[#0066B3]/80 font-medium flex items-center gap-1"
        >
          <Settings className="w-3 h-3" />
          <span>Configure</span>
        </button>
      </div>
      
      {shiftTypes.length === 0 ? (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex flex-col items-center text-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">No shift types configured</p>
              <p className="text-xs text-gray-400 mt-0.5">Configure shift types in settings first</p>
            </div>
            <span 
              onClick={handleConfigureClick}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Configure Shifts
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {shiftTypes.map((shift) => (
            <div 
              key={shift.id}
              className="flex items-center gap-2"
            >
              <div 
                className="w-7 h-7 rounded flex items-center justify-center"
                style={{ backgroundColor: `${shift.color}15` }}
              >
                <span className="text-sm font-medium" style={{ color: shift.color }}>
                  {shift.code}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                - {shift.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 