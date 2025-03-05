'use client';
import React, { useEffect, useState } from 'react';
import { isToday, isWeekend, CalendarDay } from '../../../../utils/DateUtils';
import TodayDateIndicator from './TodayDateIndicator';
import './calendar-styles.css';

interface CalendarGridHeaderProps {
  weeks: CalendarDay[][];
}

export default function CalendarGridHeader({ weeks }: CalendarGridHeaderProps) {
  // Add a state to force re-render
  const [forceUpdate, setForceUpdate] = useState(Date.now());
  
  // Force a re-render on component mount
  useEffect(() => {
    setForceUpdate(Date.now());
  }, []);
  
  // Check if today is in the current view
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // For debugging - log today's date
  console.log("Today's date:", today.toISOString().split('T')[0]);

  // Function to check if a day is today
  const isTodayDate = (day: CalendarDay) => {
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    
    const dayDate = new Date(day.date);
    return dayDate.getFullYear() === todayYear && 
           dayDate.getMonth() === todayMonth && 
           dayDate.getDate() === todayDay;
  };

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
            const isWeekendDay = isWeekend(day.date);
            
            // Check if this is the first day of a new week
            const isFirstDayOfNewWeek = index > 0 && weeks[0][index - 1].weekNumber !== day.weekNumber;
            
            // For debugging - log if we found today's date
            if (isTodayDate(day)) {
              console.log("Found today's date in calendar:", new Date(day.date).toISOString().split('T')[0]);
            }
            
            return (
              <div 
                key={index} 
                className={`
                  h-10 flex items-center justify-center border-r border-b border-gray-200
                  ${!day.isCurrentMonth ? 'bg-white text-gray-400' : 'bg-white'}
                  ${!day.isWithinRange ? 'bg-white' : ''}
                  ${isFirstDayOfNewWeek ? 'border-l-2 border-l-gray-300' : ''}
                  ${isTodayDate(day) ? 'today-cell' : ''}
                `}
                style={isTodayDate(day) ? { 
                  position: 'relative',
                  zIndex: 20,
                  padding: 0,
                  overflow: 'hidden'
                } : {}}
              >
                {isTodayDate(day) ? (
                  <TodayDateIndicator dayNumber={day.dayNumber} />
                ) : (
                  <span className={`text-sm font-medium ${
                    !day.isWithinRange || !day.isCurrentMonth
                      ? 'text-gray-400'
                      : isWeekendDay
                      ? 'text-red-600'
                      : 'text-gray-700'
                  }`}>
                    {day.dayNumber}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 