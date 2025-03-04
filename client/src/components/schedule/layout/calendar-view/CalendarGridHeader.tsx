'use client';
import React from 'react';
import { isToday, isWeekend, CalendarDay } from '../../../../utils/DateUtils';

interface CalendarGridHeaderProps {
  weeks: CalendarDay[][];
}

export default function CalendarGridHeader({ weeks }: CalendarGridHeaderProps) {
  // Check if today is in the current view
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If weeks array is empty or first week is undefined, render placeholder
  if (!weeks.length || !weeks[0]) {
    return (
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex">
          <div className="w-[60px] h-10 flex items-center justify-center bg-gray-50 border-r border-b border-gray-200">
            <span className="text-xs font-medium text-gray-600">Week</span>
          </div>
          <div className="flex-1 grid grid-cols-7">
            {Array(7).fill(null).map((_, index) => (
              <div 
                key={index} 
                className="h-10 flex flex-col items-center justify-center border-r border-b border-gray-200 bg-gray-50"
              >
                <span className="text-xs font-medium text-gray-400">-</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Determine the maximum number of days in any week
  const maxDaysInWeek = Math.max(...weeks.map(week => week.length));
  
  // Default to 7 days if all weeks are empty
  const gridCols = maxDaysInWeek > 0 ? maxDaysInWeek : 7;

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      {/* Week numbers column header */}
      <div className="flex">
        <div className="w-[60px] h-10 flex items-center justify-center bg-gray-50 border-r border-b border-gray-200">
          <span className="text-xs font-medium text-gray-600">Week</span>
        </div>
        
        {/* Day headers */}
        <div className={`flex-1 grid grid-cols-${gridCols}`}>
          {weeks[0].map((day, index) => {
            const isWeekendDay = isWeekend(day.date);
            
            // Check if this is the first day of a new week
            const isFirstDayOfNewWeek = index > 0 && weeks[0][index - 1].weekNumber !== day.weekNumber;
            
            return (
              <div 
                key={index} 
                className={`h-10 flex flex-col items-center justify-center border-r border-b border-gray-200 bg-gray-50/40
                ${isFirstDayOfNewWeek ? 'border-l-2 border-l-gray-300' : ''}`}
              >
                <span className={`text-xs font-medium ${
                  isWeekendDay ? 'text-red-600' : 'text-gray-600'
                }`}>{day.dayName}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Date numbers */}
      <div className="flex">
        <div className="w-[60px] h-10 flex items-center justify-center bg-gray-50 border-r border-b border-gray-200">
          <span className="text-xs font-medium text-gray-600">
            {weeks[0].length > 0 ? weeks[0][0].weekNumber : '-'}
          </span>
        </div>
        
        <div className={`flex-1 grid grid-cols-${gridCols}`}>
          {weeks[0].map((day, index) => {
            const isTodayDate = isToday(day.date);
            const isWeekendDay = isWeekend(day.date);
            
            // Check if this is the first day of a new week
            const isFirstDayOfNewWeek = index > 0 && weeks[0][index - 1].weekNumber !== day.weekNumber;
            
            return (
              <div 
                key={index} 
                className={`
                  h-10 flex items-center justify-center border-r border-b border-gray-200
                  ${!day.isCurrentMonth ? 'bg-white text-gray-400' : 'bg-white'}
                  ${!day.isWithinRange ? 'bg-white' : ''}
                  ${isTodayDate ? 'bg-blue-50' : ''}
                  ${isFirstDayOfNewWeek ? 'border-l-2 border-l-gray-300' : ''}
                `}
              >
                <span className={`text-sm font-medium ${
                  !day.isWithinRange || !day.isCurrentMonth
                    ? 'text-gray-400'
                    : isTodayDate
                    ? 'text-blue-600'
                    : isWeekendDay
                    ? 'text-red-600'
                    : 'text-gray-700'
                }`}>
                  {day.dayNumber}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 