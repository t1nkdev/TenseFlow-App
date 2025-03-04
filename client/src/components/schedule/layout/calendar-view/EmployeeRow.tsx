'use client';
import React from 'react';
import { Employee } from '@/types/prismaTypes';
import { getWeekNumber } from '../../../../utils/DateUtils';
import ShiftCell from './ShiftCell';

interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isWithinRange: boolean;
}

interface EmployeeRowProps {
  employee: Employee;
  weeks: WeekDay[][];
  getCellValue: (employeeId: string, date: Date) => { code: string; color: string };
  onCellClick: (employeeId: string, date: Date) => void;
  onCellKeyDown: (e: React.KeyboardEvent, employeeId: string, date: Date) => void;
  isEditable: boolean;
}

export default function EmployeeRow({
  employee,
  weeks,
  getCellValue,
  onCellClick,
  onCellKeyDown,
  isEditable
}: EmployeeRowProps) {
  // If no weeks data is available, render just the employee name
  if (!weeks.length) {
    return (
      <div className="grid grid-cols-[60px_1fr]">
        <div className="h-8 flex items-center px-2 border-r border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 truncate">
          {employee.firstName} {employee.lastName}
        </div>
        <div className="h-8 border-b border-gray-200 bg-gray-50 text-center text-xs text-gray-500">
          No calendar data
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[60px_1fr]">
      {/* Employee name column */}
      <div className="h-8 flex items-center px-2 border-r border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 truncate">
        {employee.firstName} {employee.lastName}
      </div>
      
      {/* Shift cells for each day */}
      <div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((day, dayIndex) => {
              const cellValue = getCellValue(employee.id, day.date);
              return (
                <ShiftCell
                  key={`${employee.id}-${day.date.toISOString()}`}
                  employeeId={employee.id}
                  date={day.date}
                  shiftCode={cellValue.code}
                  shiftColor={cellValue.color}
                  isEditable={isEditable}
                  isWithinRange={day.isWithinRange}
                  onClick={onCellClick}
                  onKeyDown={onCellKeyDown}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
} 