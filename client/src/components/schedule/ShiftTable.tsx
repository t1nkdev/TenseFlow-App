'use client';
import { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { ShiftPlan, Employee, Department, Schedule, ShiftType } from '@/types/prismaTypes';
import PreloaderModals from '../pr/PreloaderModals';
import { getShiftPlanDetails } from '@/api/shiftPlans';

interface ShiftTableProps {
  selectedPlan?: ShiftPlan;
}

interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isCurrentMonth: boolean;
}

interface ScheduleWithDetails extends Omit<Schedule, 'date'> {
  employee: Employee;
  shiftType: ShiftType;
  date: string; // ISO date string from the API
}

export default function ShiftTable({ selectedPlan }: ShiftTableProps) {
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    selectedPlan ? new Date(selectedPlan.startDate) : new Date()
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [weeks, setWeeks] = useState<WeekDay[][]>([]);
  const [previousPlanId, setPreviousPlanId] = useState<string>();
  const [schedules, setSchedules] = useState<ScheduleWithDetails[]>([]);

  const loadPlanData = useCallback(async () => {
    if (!selectedPlan || selectedPlan.id === previousPlanId) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      const planDetails = await getShiftPlanDetails(selectedPlan.id);
      setEmployees(planDetails.department.employees || []);
      setSchedules(planDetails.schedules || []);
      setCurrentDate(new Date(selectedPlan.startDate));
      setPreviousPlanId(selectedPlan.id);
    } catch (error) {
      console.error('Error loading plan data:', error);
    } finally {
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      // If the load time was very quick, add a small delay for better UX
      if (loadTime < 300) {
        await new Promise(resolve => setTimeout(resolve, 300 - loadTime));
      }
      
      setLoading(false);
    }
  }, [selectedPlan, previousPlanId]);

  // Get the shift for a specific employee on a specific date
  const getShiftForDay = useCallback((employeeId: string, date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return schedules.find(
      schedule => 
        schedule.employee.id === employeeId && 
        new Date(schedule.date).toISOString().split('T')[0] === dateString
    );
  }, [schedules]);

  useEffect(() => {
    loadPlanData();
  }, [loadPlanData]);

  useEffect(() => {
    if (selectedPlan) {
      generateCalendarDays();
    }
  }, [currentDate, selectedPlan]);

  const generateCalendarDays = () => {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Find the first Monday before or on the start date
    const firstDay = new Date(startDate);
    while (firstDay.getDay() !== 1) { // 1 is Monday
      firstDay.setDate(firstDay.getDate() - 1);
    }

    // Generate all days until we reach the end of the month
    const days: WeekDay[] = [];
    const currentDay = new Date(firstDay);
    
    while (currentDay <= endDate || days.length % 7 !== 0) {
      days.push({
        date: new Date(currentDay),
        dayName: currentDay.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: currentDay.getDate(),
        isCurrentMonth: currentDay.getMonth() === currentDate.getMonth()
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Split days into weeks
    const weeksArray: WeekDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArray.push(days.slice(i, i + 7));
    }
    setWeeks(weeksArray);
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + increment));
    setCurrentDate(new Date(newDate));
  };

  if (!selectedPlan) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Shift Plan Selected</h3>
          <p className="text-sm text-gray-500 mt-1">Select a shift plan from the sidebar to view the schedule</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <PreloaderModals onFinish={() => setLoading(false)} />;
  }

  const startDate = new Date(selectedPlan.startDate);
  const endDate = new Date(selectedPlan.endDate);
  const isMonthInRange = currentDate >= startDate && currentDate <= endDate;

  return (
    <div className="flex-1 flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{selectedPlan.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedPlan.department?.name} • {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            disabled={!isMonthInRange}
            className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <span className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => changeMonth(1)}
            disabled={!isMonthInRange}
            className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 w-[200px] sticky left-0 bg-gray-50 border-r border-gray-200">
                  Employee Details
                </th>
                {weeks.map((week, weekIndex) => (
                  <th key={weekIndex} colSpan={7} className="text-center py-2 px-6 text-sm font-medium text-gray-500 border-r border-gray-200">
                    Week {getWeekNumber(week[0].date)}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 sticky left-0 bg-gray-50 border-r border-gray-200"></th>
                {weeks.map((week) => (
                  week.map((day, dayIndex) => (
                    <th
                      key={dayIndex}
                      className={`text-center py-2 px-2 text-sm font-medium ${
                        day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {day.dayName}
                    </th>
                  ))
                ))}
              </tr>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 sticky left-0 bg-gray-50 border-r border-gray-200"></th>
                {weeks.map((week) => (
                  week.map((day, dayIndex) => (
                    <th
                      key={dayIndex}
                      className={`text-center py-2 px-2 text-sm font-medium ${
                        day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {day.dayNumber}
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 sticky left-0 bg-white border-r border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                      <div className="text-sm text-gray-500">ID: {employee.employeeId}</div>
                      <div className="text-sm text-gray-500">{employee.position}</div>
                    </div>
                  </td>
                  {weeks.map((week) => (
                    week.map((day, dayIndex) => {
                      const shift = getShiftForDay(employee.id, day.date);
                      return (
                        <td
                          key={dayIndex}
                          className={`text-center py-2 px-2 border-r border-gray-100 min-w-[60px] ${
                            day.isCurrentMonth ? '' : 'bg-gray-50/50'
                          }`}
                        >
                          <div 
                            className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-sm font-medium ${
                              shift ? `bg-${shift.shiftType.color}50 text-${shift.shiftType.color}600` : ''
                            }`}
                          >
                            {shift ? shift.shiftType.code : '-'}
                          </div>
                        </td>
                      );
                    })
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
