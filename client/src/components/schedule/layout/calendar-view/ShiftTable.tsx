'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { Employee, ShiftType, Department } from '@/types/prismaTypes';
import PreloaderModals from '@/components/pr/PreloaderModals';
import { getShiftPlanDetails, updateDepartmentOrder } from '@/api/shiftPlans';
import { toast } from 'sonner';
import React from 'react';
import SearchFilterTable from './SearchFilterTable';
import DepartmentTabs from './DepartmentTabs';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { saveScheduleChanges, ScheduleChange, getSchedules, deleteSchedule } from '@/api/schedules';
import { 
  ShiftPlanWithDepartments, 
  WeekDay, 
  ScheduleWithDetails, 
  FilterOptions,
  PendingChange
} from './types';
import { 
  generateCalendarDays, 
  addMonths,
  groupDaysIntoWeeks,
  getMonthEndDate,
  differenceInDays
} from '../../../../utils/DateUtils';
import { groupDaysIntoCalendarWeeks } from './groupDaysIntoWeeks';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updatePlanDepartments } from '@/store/features/shifts/shiftsSlice';

// Define API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ShiftTableProps {
  selectedPlan?: ShiftPlanWithDepartments;
}

export default function ShiftTable({ selectedPlan }: ShiftTableProps) {
  // Get the current plan from Redux store
  const { plans } = useAppSelector(state => state.shifts);
  const dispatch = useAppDispatch();
  
  // State for calendar data
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // Initialize with the current date
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1); // First day of current month
  });
  const [weeks, setWeeks] = useState<WeekDay[][]>([]);
  
  // State for plan data
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedules, setSchedules] = useState<ScheduleWithDetails[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    shiftTypeId: null,
    group: null
  });
  
  // State for cell editing
  const [editingCell, setEditingCell] = useState<{ employeeId: string; date: Date } | null>(null);
  const [editValue, setEditValue] = useState('');
  
  // Refs for tracking state
  const dataLoadedRef = useRef(false);
  const previousPlanId = useRef<string | null>(null);
  const departmentsRef = useRef<any[]>([]);
  
  // Update ref when departments change
  useEffect(() => {
    departmentsRef.current = departments;
  }, [departments]);
  
  // Generate calendar days for the current month or plan date range
  const generateCalendarWeeks = useCallback(() => {
    if (!selectedPlan) return;
    
    try {
      const startDate = new Date(selectedPlan.startDate);
      const endDate = new Date(selectedPlan.endDate);
      const isShortPlan = differenceInDays(endDate, startDate) <= 31;
      
      // Generate days based on the plan's date range
      const days = generateCalendarDays(currentDate, startDate, endDate);
      
      // Group days into weeks - use different grouping for short plans
      const weeksArray = isShortPlan 
        ? groupDaysIntoCalendarWeeks(days)
        : groupDaysIntoWeeks(days);
      
      console.log(`Generated ${weeksArray.length} weeks for the calendar`);
      setWeeks(weeksArray);
    } catch (error) {
      console.error('Error generating calendar weeks:', error);
      setWeeks([]);
    }
  }, [currentDate, selectedPlan]);
  
  // Load plan data from API
  const loadPlanData = useCallback(async () => {
    if (!selectedPlan) return;
    
    try {
      setLoading(true);
      console.log('Loading plan data for:', selectedPlan.id);
      
      // Check if we have updated departments in the Redux store
      const currentPlanInStore = plans.find(p => p.id === selectedPlan.id);
      const hasDepartmentsInStore = currentPlanInStore && currentPlanInStore.departments && currentPlanInStore.departments.length > 0;
      
      // If we have departments in the store, use them instead of fetching from API
      if (hasDepartmentsInStore) {
        console.log('Using departments from Redux store:', currentPlanInStore.departments.map((d: any) => d.department?.name || 'Unknown'));
        setDepartments(currentPlanInStore.departments);
        
        // Try to restore the last selected department from localStorage
        const storageKey = `selectedDepartment_${selectedPlan.id}`;
        const savedDepartmentId = localStorage.getItem(storageKey);
        
        if (savedDepartmentId && currentPlanInStore.departments.some((d: any) => d.department?.id === savedDepartmentId)) {
          console.log('Restoring saved department selection:', savedDepartmentId);
          setSelectedDepartmentId(savedDepartmentId);
        } else if (!selectedDepartmentId || !currentPlanInStore.departments.find((d: any) => d.department?.id === selectedDepartmentId)) {
          // If no saved department or the saved one doesn't exist, select the first one
          if (currentPlanInStore.departments.length > 0 && currentPlanInStore.departments[0].department) {
            console.log('Setting first department as selected:', currentPlanInStore.departments[0].department.name);
            setSelectedDepartmentId(currentPlanInStore.departments[0].department.id);
          }
        }
      }
      
      const planDetails = await getShiftPlanDetails(selectedPlan.id);
      console.log('Plan details loaded:', planDetails);
      
      // Set departments - ensure we maintain the order from the backend
      // Only update if we didn't already set from Redux store
      if (!hasDepartmentsInStore && planDetails.departments && planDetails.departments.length > 0) {
        console.log('Setting departments from backend:', planDetails.departments.map((d: any) => d.department.name));
        
        // Compare with ref instead of state to avoid dependency cycle
        const currentDeptIds = departmentsRef.current.map(d => d.department.id).join(',');
        const newDeptIds = planDetails.departments.map((d: any) => d.department.id).join(',');
        
        if (currentDeptIds !== newDeptIds) {
          setDepartments(planDetails.departments);
        }
        
        // Try to restore the last selected department from localStorage
        const storageKey = `selectedDepartment_${selectedPlan.id}`;
        const savedDepartmentId = localStorage.getItem(storageKey);
        
        if (savedDepartmentId && planDetails.departments.some((d: any) => d.department.id === savedDepartmentId)) {
          console.log('Restoring saved department selection:', savedDepartmentId);
          setSelectedDepartmentId(savedDepartmentId);
        } else if (!selectedDepartmentId || !planDetails.departments.find((d: any) => d.department.id === selectedDepartmentId)) {
          // If no saved department or the saved one doesn't exist, select the first one
          console.log('Setting first department as selected:', planDetails.departments[0].department.name);
          setSelectedDepartmentId(planDetails.departments[0].department.id);
        }
      }
      
      // Load employees from departments
      const allEmployees: Employee[] = [];
      planDetails.departments.forEach((dept: any) => {
        if (dept.department && dept.department.employees) {
          dept.department.employees.forEach((emp: any) => {
            // Add departmentId to each employee
            allEmployees.push({
              ...emp,
              departmentId: dept.department.id
            });
          });
        }
      });
      
      console.log('Loaded employees with groups:', allEmployees.map(emp => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        departmentId: emp.departmentId,
        group: emp.group
      })));
      
      setEmployees(allEmployees);
      
      // Set schedules and shift types
      setSchedules(planDetails.schedules || []);
      setShiftTypes(planDetails.shiftTypes || []);
      
      // Set current date to plan start date if not set
      if (!currentDate || currentDate < new Date(selectedPlan.startDate)) {
        setCurrentDate(new Date(selectedPlan.startDate));
      }
      
      // Generate initial calendar
      generateCalendarWeeks();
      previousPlanId.current = selectedPlan.id;
      
    } catch (error) {
      console.error('Error loading plan data:', error);
      toast.error('Failed to load shift plan details');
    } finally {
      setLoading(false);
    }
  }, [selectedPlan, generateCalendarWeeks, currentDate, selectedDepartmentId]);
  
  // Filter schedules by selected shift type
  const filteredSchedules = useMemo(() => {
    if (!filters.shiftTypeId) return schedules;
    
    return schedules.filter(schedule => schedule.shiftType.id === filters.shiftTypeId);
  }, [schedules, filters.shiftTypeId]);
  
  // Get the shift for a specific employee on a specific date
  const getShiftForDay = useCallback((employeeId: string, date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return filteredSchedules.find(
      schedule => 
        schedule.employee.id === employeeId && 
        new Date(schedule.date).toISOString().split('T')[0] === dateString
    );
  }, [filteredSchedules]);
  
  // Handle cell click
  const handleCellClick = useCallback((employeeId: string, date: Date) => {
    setEditingCell({ employeeId, date });
    const shift = getShiftForDay(employeeId, date);
    setEditValue(shift ? shift.shiftType.code : '');
  }, [getShiftForDay]);
  
  // Load schedules for the current plan
  const loadSchedules = useCallback(async () => {
    if (!selectedPlan) return;
    
    try {
      console.log('Loading schedules for plan:', selectedPlan.id);
      const data = await getSchedules(selectedPlan.id);
      console.log(`Loaded ${data.length} schedules`);
      
      setSchedules(data);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast.error('Failed to load schedules');
    }
  }, [selectedPlan]);
  
  // Handle cell keyboard events
  const handleCellKeyDown = useCallback((e: React.KeyboardEvent, employeeId: string, date: Date) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const value = editValue.toUpperCase();
      
      console.log('Cell edit submitted:', { employeeId, date: date.toISOString(), value });
      
      // Find matching shift type
      const shiftType = shiftTypes.find(st => st.code === value);
      
      if (!value) {
        // Empty value - delete the existing schedule if there is one
        const dateString = date.toISOString().split('T')[0];
        const existingSchedule = schedules.find(
          s => s.employee.id === employeeId && 
               new Date(s.date).toISOString().split('T')[0] === dateString
        );
        
        if (existingSchedule && selectedPlan) {
          console.log('Deleting schedule:', existingSchedule.id);
          
          // Update UI immediately
          setSchedules(prev => 
            prev.filter(s => 
              !(s.employee.id === employeeId && 
                new Date(s.date).toISOString().split('T')[0] === dateString)
            )
          );
          
          // Delete from database
          deleteSchedule(existingSchedule.id)
            .then(() => {
              console.log('Schedule deleted successfully');
              toast.success('Shift removed');
            })
            .catch((error: Error) => {
              console.error('Failed to delete schedule:', error);
              toast.error('Failed to remove shift');
              
              // Revert UI change on error
              loadSchedules();
            });
        }
        
        // Clear editing state
        setEditingCell(null);
        setEditValue('');
        return;
      } 
      
      if (!shiftType) {
        // Invalid shift type
        toast.error(`Invalid shift code. Available codes: ${shiftTypes.map(st => st.code).join(', ')}`);
        return;
      }
      
      console.log('Found matching shift type:', shiftType);
      
      // We have a valid shift type - save it directly
      if (selectedPlan) {
        // Prepare the change object
        const change: ScheduleChange = {
          employeeId,
          date: date.toISOString().split('T')[0],
          shiftTypeId: shiftType.id
        };
        
        console.log('Saving change to database:', change);
        
        // Create a new schedule object for immediate UI update
        const newSchedule: ScheduleWithDetails = {
          id: `temp-${Date.now()}`,
          employeeId,
          employee: employees.find(e => e.id === employeeId)!,
          shiftTypeId: shiftType.id,
          shiftType,
          date: date.toISOString().split('T')[0],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Update UI immediately
        setSchedules(prev => {
          // Remove any existing schedule for this cell
          const filtered = prev.filter(s => 
            !(s.employee.id === employeeId && 
              new Date(s.date).toISOString().split('T')[0] === date.toISOString().split('T')[0])
          );
          // Add the new schedule
          return [...filtered, newSchedule];
        });
        
        // Save to database
        saveScheduleChanges(selectedPlan.id, [change])
          .then((response) => {
            console.log('Schedule saved successfully:', response);
            
            // Update the schedules with the real data from the server
            if (response && response.results) {
              const successResults = response.results.filter((r: { success: boolean }) => r.success);
              if (successResults.length > 0) {
                const result = successResults[0];
                if (result.schedule) {
                  // Update the schedules with the real data from the server
                  setSchedules(prev => {
                    return prev.map(s => {
                      if (s.id === newSchedule.id) {
                        return {
                          ...result.schedule,
                          // Ensure we have the full objects
                          employee: s.employee,
                          shiftType: s.shiftType
                        };
                      }
                      return s;
                    });
                  });
                }
              }
            }
          })
          .catch(error => {
            console.error('Failed to save shift:', error);
            toast.error('Failed to save shift');
            
            // Revert the UI change
            setSchedules(prev => prev.filter(s => s.id !== newSchedule.id));
          });
      }
      
      // Clear editing state
      setEditingCell(null);
      setEditValue('');
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  }, [editValue, shiftTypes, employees, selectedPlan, schedules, loadSchedules, deleteSchedule]);
  
  // Handle input change for cell editing
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Only allow valid shift codes
    if (value === '' || shiftTypes.some(st => st.code.startsWith(value))) {
      setEditValue(value);
    }
  }, [shiftTypes]);
  
  // Check if a cell is being edited
  const isEditingCell = useCallback((employeeId: string, date: Date) => {
    return editingCell !== null && 
           editingCell.employeeId === employeeId && 
           editingCell.date.toISOString().split('T')[0] === date.toISOString().split('T')[0];
  }, [editingCell]);
  
  // Get matching shift type for a code
  const getMatchingShiftType = useCallback((code: string) => {
    return shiftTypes.find(st => st.code === code || st.code.startsWith(code));
  }, [shiftTypes]);
  
  // Get the current value for a cell (including pending changes)
  const getCellValue = useCallback((employeeId: string, date: Date) => {
    // Check schedules directly
    const dateString = date.toISOString().split('T')[0];
    const shift = schedules.find(
      schedule => 
        schedule.employee.id === employeeId && 
        new Date(schedule.date).toISOString().split('T')[0] === dateString
    );
    
    if (shift) {
      console.log(`Found shift for ${employeeId} on ${dateString}: ${shift.shiftType.code}`);
      return { code: shift.shiftType.code, color: shift.shiftType.color };
    }
    
    // No value found
    return { code: '', color: '' };
  }, [schedules]);
  
  // Update calendar when current date changes or when plan changes
  useEffect(() => {
    if (selectedPlan) {
      generateCalendarWeeks();
    }
  }, [currentDate, selectedPlan, generateCalendarWeeks]);
  
  // Reset currentDate when selectedPlan changes
  useEffect(() => {
    if (selectedPlan) {
      // Reset to the current month or the plan start month if it's in the future
      const today = new Date();
      const planStart = new Date(selectedPlan.startDate);
      
      // If plan starts in the future, use plan start date
      // Otherwise use current month
      if (planStart > today) {
        setCurrentDate(new Date(planStart.getFullYear(), planStart.getMonth(), 1));
      } else {
        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
      }
      
      console.log('Reset current date for new plan');
    }
  }, [selectedPlan?.id]); // Only run when the plan ID changes
  
  // Determine if we're showing the entire plan range
  const isShowingEntirePlan = useMemo(() => {
    if (!selectedPlan) return false;
    
    const startDate = new Date(selectedPlan.startDate);
    const endDate = new Date(selectedPlan.endDate);
    
    // If the plan is 31 days or less, we show the exact date range
    return differenceInDays(endDate, startDate) <= 31;
  }, [selectedPlan]);
  
  // Handle month change - only applicable when not showing the entire plan
  const handleChangeMonth = useCallback((increment: number) => {
    if (isShowingEntirePlan) return;
    
    setCurrentDate(prev => {
      const newDate = addMonths(prev, increment);
      
      // Ensure we don't go before the start date or after the end date
      const startDate = new Date(selectedPlan?.startDate || '');
      const endDate = new Date(selectedPlan?.endDate || '');
      
      if (increment < 0 && newDate < startDate) {
        return new Date(startDate);
      }
      
      if (increment > 0) {
        const lastDayOfNewMonth = getMonthEndDate(newDate);
        if (lastDayOfNewMonth > endDate) {
          // If the last day of the new month is after the end date,
          // set to the month containing the end date
          return new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        }
      }
      
      return newDate;
    });
  }, [selectedPlan, isShowingEntirePlan]);
  
  // Handle department change
  const handleDepartmentChange = useCallback((departmentId: string) => {
    console.log('Department selected:', departmentId);
    setSelectedDepartmentId(departmentId);
    
    // Save the selected department to localStorage
    if (selectedPlan) {
      const storageKey = `selectedDepartment_${selectedPlan.id}`;
      localStorage.setItem(storageKey, departmentId);
      console.log('Saved department selection to localStorage:', departmentId);
    }
    
    // Find the selected department
    const selectedDept = departments.find(d => d.department.id === departmentId);
    if (selectedDept) {
      console.log('Selected department:', selectedDept.department.name);
    }
  }, [departments, selectedPlan]);
  
  // Handle department reordering
  const handleDepartmentsReorder = useCallback(async (reorderedDepartments: Department[]) => {
    if (!selectedPlan) return;
    
    console.log('Departments reordered:', reorderedDepartments.map(d => d.name));
    
    // Create new department relations array
    const newDepartments = reorderedDepartments.map(dept => {
      const existingDept = departments.find(d => d.department.id === dept.id);
      return existingDept || { department: dept };
    });
    
    // Update state with the new order
    setDepartments(newDepartments);
    
    // Update the Redux store with the new department order
    dispatch(updatePlanDepartments({
      planId: selectedPlan.id,
      departments: newDepartments
    }));
    
    // Make sure the selected department is still valid after reordering
    if (selectedDepartmentId && !reorderedDepartments.find(d => d.id === selectedDepartmentId)) {
      // If the selected department is no longer in the list, select the first one
      console.log('Selected department no longer exists, selecting first department');
      handleDepartmentChange(reorderedDepartments[0].id);
    }
    
    try {
      // Save the new order to the backend without showing a notification
      const departmentIds = reorderedDepartments.map(dept => dept.id);
      console.log('Saving department order to backend:', departmentIds);
      await updateDepartmentOrder(selectedPlan.id, departmentIds);
      console.log('Department order saved successfully');
      // Success notification removed
    } catch (error) {
      console.error('Failed to update department order:', error);
      toast.error('Failed to update department order');
      
      // Reload the original data if the API call fails
      loadPlanData();
    }
  }, [selectedPlan, departments, selectedDepartmentId, handleDepartmentChange, loadPlanData, dispatch]);
  
  // Filter employees based on search term, selected shift type, and department
  const filteredEmployees = useMemo(() => {
    if (!employees.length) return [];
    
    let filtered = [...employees];
    
    // Filter by department
    if (selectedDepartmentId) {
      filtered = filtered.filter(emp => emp.departmentId === selectedDepartmentId);
    } else if (departments.length > 0 && departments[0].department) {
      // If no department is selected but we have departments, use the first one
      const firstDeptId = departments[0].department.id;
      filtered = filtered.filter(emp => emp.departmentId === firstDeptId);
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.employeeId.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by group
    if (filters.group) {
      filtered = filtered.filter(emp => emp.group === filters.group);
    }
    
    return filtered;
  }, [employees, selectedDepartmentId, departments, filters]);
  
  // Load plan data when selected plan changes
  useEffect(() => {
    if (selectedPlan && (!dataLoadedRef.current || previousPlanId.current !== selectedPlan.id)) {
      console.log('Loading data for plan:', selectedPlan.id);
      dataLoadedRef.current = true;
      loadPlanData();
    }
  }, [selectedPlan, loadPlanData]);
  
  // Load schedules when the plan changes
  useEffect(() => {
    if (selectedPlan) {
      loadSchedules();
    }
  }, [selectedPlan, loadSchedules]);
  
  // Watch for changes in the Redux store plans and update departments if needed
  useEffect(() => {
    if (!selectedPlan) return;
    
    // Find the current plan in the Redux store
    const currentPlanInStore = plans.find(p => p.id === selectedPlan.id);
    
    // If the plan exists in the store and has departments, update our local state
    if (currentPlanInStore && currentPlanInStore.departments && currentPlanInStore.departments.length > 0) {
      console.log('Updating departments from Redux store:', 
        currentPlanInStore.departments.map((d: any) => d.department?.name || 'Unknown'));
      
      // Compare current departments with store departments to avoid unnecessary updates
      const currentDeptIds = departments.map(d => d.department.id).join(',');
      const storeDeptIds = currentPlanInStore.departments.map((d: any) => d.department?.id || '').join(',');
      
      if (currentDeptIds !== storeDeptIds) {
        console.log('Department IDs changed, updating departments');
        setDepartments(currentPlanInStore.departments);
        
        // If the selected department is no longer in the list, select the first one
        if (selectedDepartmentId && 
            !currentPlanInStore.departments.some((d: any) => d.department?.id === selectedDepartmentId)) {
          if (currentPlanInStore.departments.length > 0 && currentPlanInStore.departments[0].department) {
            console.log('Selected department no longer exists, selecting first department');
            setSelectedDepartmentId(currentPlanInStore.departments[0].department.id);
          }
        }
      }
    }
  }, [plans, selectedPlan, departments, selectedDepartmentId]);
  
  // Empty state when no plan is selected
  if (!selectedPlan) {
    return (
      <div className="flex-1 grid h-[900px] place-items-center">
        <div className="translate-y-16 text-center">
          <Calendar className="w-12 h-10 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Shift Plan Selected</h3>
          <p className="text-sm text-gray-500 mt-1">Select a shift plan from the sidebar to view the schedule</p>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (loading) {
    return <PreloaderModals onFinish={() => setLoading(false)} />;
  }
  
  const startDate = new Date(selectedPlan.startDate);
  const endDate = new Date(selectedPlan.endDate);
  
  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Search and Filter with Department Tabs */}
      <SearchFilterTable 
        onFilterChange={setFilters}
        shiftPlanId={selectedPlan?.id}
        departments={departments.map(d => d.department)}
      >
        <DepartmentTabs 
          departments={departments.map(d => d.department)}
          selectedDepartmentId={selectedDepartmentId}
          onDepartmentChange={handleDepartmentChange}
          onDepartmentsReorder={handleDepartmentsReorder}
        />
      </SearchFilterTable>
      
      {/* Month Navigation */}
      <CalendarHeader 
        currentDate={currentDate}
        startDate={startDate}
        endDate={endDate}
        onChangeMonth={handleChangeMonth}
        planName={selectedPlan.name}
        departmentNames={departments.map(d => d.department.name)}
      />
      
      {/* Calendar Grid */}
      <div className="flex-1 min-h-0 relative">
        <CalendarGrid 
          weeks={weeks}
          employees={filteredEmployees}
          getCellValue={getCellValue}
          onCellClick={handleCellClick}
          onCellKeyDown={handleCellKeyDown}
          isEditable={true}
          isEditingCell={isEditingCell}
          editValue={editValue}
          onEditValueChange={handleInputChange}
          getMatchingShiftType={getMatchingShiftType}
        />
      </div>
    </div>
  );
}
