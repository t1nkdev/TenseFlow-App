import { CalendarDay } from '../../../../utils/DateUtils';

/**
 * Groups calendar days into weeks based on their calendar position
 * This ensures that days are correctly grouped by their actual position in the calendar
 */
export const groupDaysIntoCalendarWeeks = (days: CalendarDay[]): CalendarDay[][] => {
  if (days.length === 0) return [];
  
  // Sort days by date
  const sortedDays = [...days].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];
  
  // Group days into weeks based on their day of week
  sortedDays.forEach((day, index) => {
    // Start a new week if this is the first day or if it's a Sunday (day 0)
    if (index === 0 || day.date.getDay() === 0) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [day];
    } else {
      currentWeek.push(day);
    }
  });
  
  // Add the last week if it has any days
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return weeks;
}; 