import * as runtime from '@prisma/client/runtime/library.js';
import $Types = runtime.Types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>

// Model Types
export type Department = $Public.Department
export type Employee = $Public.Employee
export type Shift = $Public.Shift
export type ShiftType = $Public.ShiftType
export type Schedule = $Public.Schedule
export type ShiftPlan = $Public.ShiftPlan

// Utility Types
export type Enumerable<T> = T | Array<T>
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]
export type TruthyKeys<T> = { [key in keyof T]: T[key] extends false | undefined | null ? never : key }[keyof T]

// Prisma Utility Types
export type SelectAndInclude = {
  select?: any
  include?: any
}

export type RejectOnNotFound = boolean | ((error: Error) => Error)
export type RejectPerOperation = { [P in "findUnique" | "findFirst"]?: RejectOnNotFound }

// Common Status Types
export type Status = "ACTIVE" | "INACTIVE" | "PENDING" | "ARCHIVED"
export type ShiftStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "IN_PROGRESS"
export type PlanStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

// Relation Types
export type DepartmentRelations = {
  employees?: Employee[]
  manager?: Employee | null
  shiftPlans?: ShiftPlan[]
}

export type EmployeeRelations = {
  department?: Department
  managedDepartments?: Department[]
  schedules?: Schedule[]
}

export type ShiftPlanRelations = {
  department?: Department
  shiftTypes?: ShiftType[]
  schedules?: Schedule[]
}

// Prisma Client Extension Types
export type ExtensionArgs = $Extensions.Args
export type Extension = $Extensions.Client




