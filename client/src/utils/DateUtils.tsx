'use client';

/**
 * Date utility types and functions for the shift calendar
 */

export interface CalendarDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isWithinRange: boolean;
  weekNumber: number;
}

/**
 * Formats a date in DD.MM.YYYY format
 */
export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Formats a date range as a string (e.g., "Jan 1 - Jan 31, 2023")
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const yearOptions: Intl.DateTimeFormatOptions = { year: 'numeric' };
  
  const start = startDate.toLocaleDateString('en-US', options);
  const end = endDate.toLocaleDateString('en-US', options);
  const year = endDate.toLocaleDateString('en-US', yearOptions);
  
  return `${start} - ${end}, ${year}`;
};

/**
 * Returns the short day name (e.g., "Mon", "Tue")
 */
export const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Calculates the ISO week number for a given date
 * This uses the ISO 8601 standard where weeks start on Monday
 */
export const getWeekNumber = (date: Date): number => {
  // Create a copy of the date to avoid modifying the original
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  
  // Calculate full weeks to nearest Thursday
  const weekNumber = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  
  return weekNumber;
};

/**
 * Checks if a date falls within a given range (inclusive)
 */
export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

/**
 * Checks if two dates are in the same month and year
 */
export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && 
         date1.getMonth() === date2.getMonth();
};

/**
 * Adds or subtracts months from a date
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Returns the first day of the month for a given date
 */
export const getMonthStartDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Returns the last day of the month for a given date
 */
export const getMonthEndDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Returns the month name and year (e.g., "January 2023")
 */
export const getMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * Returns the number of days in a month
 */
export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Checks if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

/**
 * Checks if a date is a weekend (Saturday or Sunday)
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

/**
 * Gets the first day of the week containing the given date
 * Assumes weeks start on Sunday (0)
 */
export const getFirstDayOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = date.getDay();
  if (day !== 0) { // If not Sunday
    result.setDate(date.getDate() - day);
  }
  return result;
};

/**
 * Gets the last day of the week containing the given date
 * Assumes weeks end on Saturday (6)
 */
export const getLastDayOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = date.getDay();
  if (day !== 6) { // If not Saturday
    result.setDate(date.getDate() + (6 - day));
  }
  return result;
};

/**
 * Generates an array of calendar days for the date range of the plan
 */
export const generateCalendarDays = (
  currentDate: Date, 
  startDate: Date, 
  endDate: Date
): CalendarDay[] => {
  const days: CalendarDay[] = [];
  
  // Determine if we should show the entire plan range or just the current month
  const showEntirePlan = differenceInDays(endDate, startDate) <= 31;
  
  if (showEntirePlan) {
    // Generate days for the exact plan date range (no extra days)
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);
    
    // Generate all days in the range, including start and end dates
    const currentDay = new Date(rangeStart);
    while (currentDay <= rangeEnd) {
      const date = new Date(currentDay);
      days.push({
        date,
        dayName: getDayName(date),
        dayNumber: date.getDate(),
        isCurrentMonth: isSameMonth(date, currentDate),
        isWithinRange: true, // All days are within range
        weekNumber: getWeekNumber(date)
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
  } else {
    // Generate days for the current month only
    const monthStart = getMonthStartDate(currentDate);
    const monthEnd = getMonthEndDate(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      days.push({
        date,
        dayName: getDayName(date),
        dayNumber: i,
        isCurrentMonth: true,
        isWithinRange: isDateInRange(date, startDate, endDate),
        weekNumber: getWeekNumber(date)
      });
    }
  }
  
  return days;
};

/**
 * Calculate the difference in days between two dates
 */
export const differenceInDays = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Groups calendar days into weeks based on their ISO week number
 * This ensures that weeks are correctly continued across month boundaries
 */
export const groupDaysIntoWeeks = (days: CalendarDay[]): CalendarDay[][] => {
  if (days.length === 0) return [];
  
  // Group days by week number
  const weekMap = new Map<number, CalendarDay[]>();
  
  days.forEach(day => {
    if (!weekMap.has(day.weekNumber)) {
      weekMap.set(day.weekNumber, []);
    }
    weekMap.get(day.weekNumber)!.push(day);
  });
  
  // Sort the weeks by week number
  const sortedWeeks = Array.from(weekMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(entry => entry[1]);
  
  return sortedWeeks;
}; 