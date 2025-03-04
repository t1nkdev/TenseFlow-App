'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Info } from 'lucide-react';
import { getMonthName, addMonths, formatDateRange, differenceInDays } from '../../../../utils/DateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  startDate: Date;
  endDate: Date;
  onChangeMonth: (increment: number) => void;
  planName: string;
  departmentNames: string[];
}

interface MonthOption {
  month: number;
  year: number;
  label: string;
}

export default function CalendarHeader({ 
  currentDate, 
  startDate, 
  endDate, 
  onChangeMonth,
  planName,
  departmentNames
}: CalendarHeaderProps) {
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const monthSelectorRef = useRef<HTMLDivElement>(null);
  const yearSelectorRef = useRef<HTMLDivElement>(null);
  
  // Check if we're showing the entire plan range
  const isShowingEntirePlan = differenceInDays(endDate, startDate) <= 31;
  
  // Generate array of available months and years
  const availableMonths: MonthOption[] = [];
  const availableYears = new Set<number>();
  
  let tempDate = new Date(startDate);
  while (tempDate <= endDate) {
    availableMonths.push({
      month: tempDate.getMonth(),
      year: tempDate.getFullYear(),
      label: `${getMonthName(tempDate)} ${tempDate.getFullYear()}`
    });
    availableYears.add(tempDate.getFullYear());
    tempDate = addMonths(tempDate, 1);
  }
  
  const years = Array.from(availableYears).sort((a, b) => a - b);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthSelectorRef.current && 
        !monthSelectorRef.current.contains(event.target as Node) &&
        yearSelectorRef.current && 
        !yearSelectorRef.current.contains(event.target as Node)
      ) {
        setShowMonthSelector(false);
        setShowYearSelector(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleMonthYearSelect = (month: number, year: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    newDate.setFullYear(year);
    
    // Calculate the difference in months to use with the existing onChangeMonth function
    const currentMonth = currentDate.getMonth() + currentDate.getFullYear() * 12;
    const newMonth = month + year * 12;
    const monthDifference = newMonth - currentMonth;
    
    onChangeMonth(monthDifference);
    setShowMonthSelector(false);
    setShowYearSelector(false);
  };
  
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Plan and Department Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">{planName}</h2>
            <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
              Active
            </div>
          </div>
          
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {departmentNames.length > 0 ? (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <span className="inline-flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                  {departmentNames.length > 3 
                    ? `${departmentNames.slice(0, 3).join(', ')} +${departmentNames.length - 3} more`
                    : departmentNames.join(', ')}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">No departments</span>
            )}
            
            <span className="text-gray-300 mx-1">•</span>
            
            <span className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
              {formatDateRange(startDate, endDate)}
            </span>
            
            {isShowingEntirePlan && (
              <div className="ml-2 flex items-center text-sm text-blue-600">
                <Info className="w-3.5 h-3.5 mr-1" />
                <span>Showing exact plan dates</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Month and Year Selector */}
        <div className="flex items-center">
          {!isShowingEntirePlan && (
            <div className="relative">
              <div className="flex items-center gap-2">
                {/* Month selector */}
                <div ref={monthSelectorRef} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMonthSelector(!showMonthSelector);
                      setShowYearSelector(false);
                    }}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-900"
                  >
                    {getMonthName(currentDate)}
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {/* Month dropdown */}
                  {showMonthSelector && (
                    <div 
                      className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto"
                    >
                      <div className="p-2 grid grid-cols-1 gap-1">
                        {months.map((monthName, index) => {
                          // Check if this month is within the plan date range for the current year
                          const isAvailable = availableMonths.some(m => 
                            m.month === index && m.year === currentDate.getFullYear()
                          );
                          
                          return (
                            <button
                              key={monthName}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isAvailable) {
                                  handleMonthYearSelect(index, currentDate.getFullYear());
                                }
                              }}
                              className={`text-left px-3 py-2 rounded-md text-sm ${
                                currentDate.getMonth() === index 
                                  ? 'bg-blue-50 text-blue-600 font-medium' 
                                  : isAvailable 
                                    ? 'text-gray-700 hover:bg-gray-50' 
                                    : 'text-gray-300 cursor-not-allowed'
                              }`}
                              disabled={!isAvailable}
                            >
                              {monthName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Year selector */}
                <div ref={yearSelectorRef} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowYearSelector(!showYearSelector);
                      setShowMonthSelector(false);
                    }}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-900"
                  >
                    {currentDate.getFullYear()}
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {/* Year dropdown */}
                  {showYearSelector && (
                    <div 
                      className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto"
                    >
                      <div className="p-2 grid grid-cols-1 gap-1">
                        {years.map(year => (
                          <button
                            key={year}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMonthYearSelect(currentDate.getMonth(), year);
                            }}
                            className={`text-left px-3 py-2 rounded-md text-sm ${
                              currentDate.getFullYear() === year 
                                ? 'bg-blue-50 text-blue-600 font-medium' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 