import { ShiftPlan, Employee, Department, Schedule, ShiftType } from '@/types/prismaTypes';

export interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isWithinRange: boolean;
  weekNumber: number;
}

export interface ScheduleWithDetails extends Omit<Schedule, 'date'> {
  employee: Employee;
  shiftType: ShiftType;
  date: string; // ISO date string from the API
}

export interface ShiftPlanDepartment {
  id: string;
  department: Department;
  departmentId: string;
  shiftPlanId: string;
}

export interface ShiftPlanWithDepartments extends Omit<ShiftPlan, 'department'> {
  departments: ShiftPlanDepartment[];
  department?: Department; // Keep this for backward compatibility
}

export interface PendingChange {
  employeeId: string;
  date: string; // ISO date string
  shiftTypeId: string;
}

export interface FilterOptions {
  searchTerm: string;
  shiftTypeId: string | null;
  group?: string | null;
} 