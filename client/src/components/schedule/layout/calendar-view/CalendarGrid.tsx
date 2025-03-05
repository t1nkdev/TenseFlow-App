'use client';
import React, { useState } from 'react';
import { Employee } from '@/types/prismaTypes';
import { getWeekNumber, isToday, isWeekend, CalendarDay } from '../../../../utils/DateUtils';
import ShiftCell from './ShiftCell';
import './calendar-styles.css';

interface CalendarGridProps {
  weeks: CalendarDay[][];
  employees: Employee[];
  getCellValue: (employeeId: string, date: Date) => { code: string; color: string };
  onCellClick: (employeeId: string, date: Date) => void;
  onCellKeyDown: (e: React.KeyboardEvent, employeeId: string, date: Date) => void;
  isEditable: boolean;
  isEditingCell: (employeeId: string, date: Date) => boolean;
  editValue: string;
  onEditValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getMatchingShiftType: (code: string) => { color: string } | undefined;
}

export default function CalendarGrid({
  weeks,
  employees,
  getCellValue,
  onCellClick,
  onCellKeyDown,
  isEditable,
  isEditingCell,
  editValue,
  onEditValueChange,
  getMatchingShiftType
}: CalendarGridProps) {
  // If no weeks data is available, show a message
  if (!weeks.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Calendar Data</h3>
          <p className="text-sm text-gray-500">
            There is no calendar data available for the selected period.
          </p>
        </div>
      </div>
    );
  }

  // Determine the maximum number of days in any week
  const maxDaysInWeek = Math.max(...weeks.map(week => week.length));
  
  // Calculate total number of days across all weeks
  const totalDays = weeks.reduce((sum, week) => sum + week.length, 0);

  // Get matching shift type for the current edit value
  const matchingShiftType = getMatchingShiftType(editValue);

  // Check if today is in the current view
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Group employees by their group property
  const groupedEmployees: { [key: string]: Employee[] } = {};
  
  // First, sort employees by group to ensure consistent order
  const sortedEmployees = [...employees].sort((a, b) => {
    const groupA = a.group || 'No Group';
    const groupB = b.group || 'No Group';
    return groupA.localeCompare(groupB);
  });
  
  // Then group them
  sortedEmployees.forEach(employee => {
    const group = employee.group || 'No Group';
    if (!groupedEmployees[group]) {
      groupedEmployees[group] = [];
    }
    groupedEmployees[group].push(employee);
  });

  // Get all groups in sorted order
  const groups = Object.keys(groupedEmployees).sort();

  // Add state for tracking hover
  const [hoverState, setHoverState] = useState<{
    employeeId: string | null;
    date: string | null;
  }>({
    employeeId: null,
    date: null
  });

  // Function to handle cell hover
  const handleCellHover = (employeeId: string, date: Date) => {
    setHoverState({
      employeeId,
      date: date.toISOString()
    });
  };

  // Function to clear hover state
  const handleCellLeave = () => {
    setHoverState({
      employeeId: null,
      date: null
    });
  };

  return (
    <div className="overflow-auto h-full">
      <div className="min-w-max">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            {/* Week Row with buttons */}
            <tr>
              <th className="sticky left-0 z-20 w-[280px] bg-white border-b border-gray-200">
                <div className="flex items-center h-10 pl-6 gap-2">
                  <button 
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Staff
                  </button>
                  <button 
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter
                  </button>
                </div>
              </th>
              <th className="border-b border-gray-200" colSpan={totalDays}>
                {/* Empty space above week numbers */}
              </th>
            </tr>
            
            {/* Week Numbers Row */}
            <tr>
              <th className="sticky left-0 z-20 w-[280px] bg-white border-b border-gray-200">
                {/* Empty space for employee columns */}
              </th>
              {weeks.map((week, weekIndex) => {
                // Calculate the week number for this week
                const weekNumber = week.length > 0 ? getWeekNumber(week[0].date) : 0;
                return (
                  <th 
                    key={weekIndex} 
                    colSpan={week.length} 
                    className={`h-8 border-b border-gray-200 ${weekIndex > 0 ? 'border-l border-gray-200' : ''}`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">Week {weekNumber}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
            
            {/* Column Headers and Days Row */}
            <tr>
              <th className="sticky left-0 z-20 w-[280px] bg-white border-b border-gray-200">
                <div className="flex items-center h-8">
                  <div className="grid grid-cols-[80px_1fr] gap-2 w-full pl-6">
                    <div className="flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span className="text-xs font-medium text-gray-700">ID</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs font-medium text-gray-700">Name</span>
                    </div>
                  </div>
                </div>
              </th>
              {weeks.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    const isTodayDate = isToday(day.date);
                    const isWeekendDay = isWeekend(day.date);
                    const isHovered = hoverState.date === day.date.toISOString();
                    
                    return (
                      <th
                        key={`${weekIndex}-${dayIndex}`}
                        className={`h-8 w-10 border-b border-gray-200 ${
                          !day.isWithinRange 
                            ? 'bg-gray-50' 
                            : isTodayDate
                            ? 'bg-gray-100'
                            : isWeekendDay
                            ? 'bg-gray-50/50'
                            : ''
                        } ${dayIndex === 0 && weekIndex > 0 ? 'border-l border-gray-200' : ''}
                        ${isHovered ? 'bg-blue-100' : ''}`}
                      >
                        <div className="flex flex-col items-center">
                          <span className={`text-[11px] font-medium ${
                            isWeekendDay ? 'text-red-500' : 'text-gray-500'
                          }`}>{day.dayName}</span>
                          <span className={`text-xs font-medium ${
                            !day.isWithinRange 
                              ? 'text-gray-400'
                              : isWeekendDay
                              ? 'text-red-600'
                              : 'text-gray-700'
                          }`}>
                            {day.dayNumber}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Render employees by group with group headers */}
            {groups.map(group => (
              <React.Fragment key={group}>
                {/* Group header row */}
                <tr className="group-header">
                  <td 
                    colSpan={totalDays + 1} 
                    className="border-b border-gray-200"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>
                        {group === 'No Group' ? 'Unassigned' : group}
                      </span>
                      <span>
                        {groupedEmployees[group].length} {groupedEmployees[group].length === 1 ? 'employee' : 'employees'}
                      </span>
                    </div>
                  </td>
                </tr>
                
                {/* Employees in this group */}
                {groupedEmployees[group].map((employee, empIndex) => {
                  const isRowHovered = hoverState.employeeId === employee.id;
                  
                  return (
                    <tr 
                      key={employee.id} 
                      className={`${empIndex % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'} 
                        ${isRowHovered ? 'bg-blue-50' : 'hover:bg-gray-50/80'}`}
                    >
                      {/* Employee info */}
                      <td 
                        className={`sticky left-0 z-10 border-b border-r border-gray-200 
                          ${isRowHovered ? 'bg-blue-50' : empIndex % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}
                      >
                        <div className="flex items-center py-1.5 pl-6">
                          <div className="grid grid-cols-[80px_1fr] gap-2 w-full">
                            <span className="text-xs font-medium text-gray-500">{employee.employeeId}</span>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-800 truncate">
                                {employee.firstName} {employee.lastName}
                              </span>
                              {employee.position && (
                                <span className="text-xs text-gray-500 truncate">{employee.position}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Shift cells */}
                      {weeks.map((week, weekIndex) => (
                        <React.Fragment key={weekIndex}>
                          {week.map((day, dayIndex) => {
                            const isEditing = isEditingCell(employee.id, day.date);
                            const cellValue = getCellValue(employee.id, day.date);
                            const isTodayDate = isToday(day.date);
                            const isWeekendDay = isWeekend(day.date);
                            const isCellHovered = hoverState.employeeId === employee.id && 
                                                 hoverState.date === day.date.toISOString();
                            const isColumnHovered = hoverState.date === day.date.toISOString();

                            return (
                              <td
                                key={`${weekIndex}-${dayIndex}`}
                                className={`p-0 border-r border-b border-gray-200 ${
                                  dayIndex === 0 && weekIndex > 0 ? 'border-l border-gray-200' : ''
                                } ${isWeekendDay ? 'bg-gray-50' : ''} ${isTodayDate ? 'bg-blue-50' : ''}
                                ${isCellHovered ? 'bg-blue-200' : isColumnHovered || isRowHovered ? 'bg-blue-100' : ''}`}
                                style={{ width: '26px', height: '26px' }}
                                onMouseEnter={() => handleCellHover(employee.id, day.date)}
                                onMouseLeave={handleCellLeave}
                              >
                                {isEditing ? (
                                  <div 
                                    className="h-full w-full flex items-center justify-center"
                                    style={matchingShiftType ? { 
                                      backgroundColor: `${matchingShiftType.color}15`
                                    } : { 
                                      backgroundColor: 'rgba(59, 130, 246, 0.08)'
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={editValue}
                                      onChange={onEditValueChange}
                                      onKeyDown={(e) => onCellKeyDown(e, employee.id, day.date)}
                                      onBlur={(e) => {
                                        // Simulate Enter key press when input loses focus
                                        const enterEvent = {
                                          key: 'Enter',
                                          preventDefault: () => {}
                                        } as React.KeyboardEvent;
                                        onCellKeyDown(enterEvent, employee.id, day.date);
                                      }}
                                      className="w-full bg-transparent text-center text-sm font-semibold focus:outline-none"
                                      style={matchingShiftType ? { 
                                        color: matchingShiftType.color 
                                      } : { 
                                        color: '#3B82F6'
                                      }}
                                      maxLength={3}
                                      autoFocus
                                    />
                                  </div>
                                ) : (
                                  <div 
                                    className="w-full h-full"
                                    onMouseEnter={() => handleCellHover(employee.id, day.date)}
                                    onMouseLeave={handleCellLeave}
                                  >
                                    <ShiftCell
                                      employeeId={employee.id}
                                      date={day.date}
                                      shiftCode={cellValue.code}
                                      shiftColor={cellValue.color}
                                      isEditable={isEditable}
                                      isWithinRange={true}
                                      onClick={onCellClick}
                                      onKeyDown={onCellKeyDown}
                                    />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}