'use client';
import React from 'react';

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
      className={`w-full h-full flex items-center justify-center ${isEditable ? 'cursor-pointer hover:brightness-95' : 'cursor-default'}`}
      style={{ 
        backgroundColor: shiftCode ? `${shiftColor}15` : 'transparent'
      }}
      data-date={date.toISOString()}
      data-employee-id={employeeId}
    >
      {shiftCode ? (
        <span className="text-sm font-semibold" style={{ color: shiftColor }}>
          {shiftCode}
        </span>
      ) : (
        <span className="text-xs text-gray-300">-</span>
      )}
    </div>
  );
}