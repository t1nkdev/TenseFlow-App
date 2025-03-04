'use client';
import React from 'react';
import { ShiftType } from '@/types/prismaTypes';

interface ShiftCellProps {
  employeeId: string;
  date: Date;
  shiftCode: string;
  shiftColor: string;
  isEditable: boolean;
  isWithinRange: boolean;
  onClick: (employeeId: string, date: Date) => void;
  onKeyDown: (e: React.KeyboardEvent, employeeId: string, date: Date) => void;
}

export default function ShiftCell({
  employeeId,
  date,
  shiftCode,
  shiftColor,
  isEditable,
  isWithinRange,
  onClick,
  onKeyDown
}: ShiftCellProps) {
  
  const handleClick = () => {
    if (isEditable) {
      onClick(employeeId, date);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditable) {
      onKeyDown(e, employeeId, date);
    }
  };
  
  return (
    <div
      role="button"
      tabIndex={isEditable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        h-10 flex items-center justify-center border-r border-b border-gray-200
        ${isEditable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}
      `}
      data-date={date.toISOString()}
      data-employee-id={employeeId}
    >
      {shiftCode && (
        <div 
          className="min-w-[2rem] h-8 px-1.5 rounded-md flex items-center justify-center"
          style={{ backgroundColor: `${shiftColor}15` }}
        >
          <span className="text-sm font-semibold" style={{ color: shiftColor }}>
            {shiftCode}
          </span>
        </div>
      )}
    </div>
  );
} 