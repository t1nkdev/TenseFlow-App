import { Employee, Department, ShiftType, Schedule, ShiftPlan } from './prismaTypes';

// Extended types
export interface EmployeeWithDepartment extends Employee {
  department: Department;
}

export interface DepartmentWithEmployees extends Department {
  employees: Employee[];
  manager: Employee | null;
}

export interface ShiftPlanWithDetails extends ShiftPlan {
  department: Department;
  shiftTypes: ShiftType[];
  schedules: Schedule[];
}

// Form types
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  departmentId: string;
  startDate: string;
}

export interface DepartmentFormData {
  name: string;
  description?: string;
  managerId?: string;
}

export interface ShiftTypeFormData {
  code: string;
  name: string;
  color: string;
  startTime?: string;
  endTime?: string;
  requiresTime: boolean;
}

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
