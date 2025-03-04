"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getEmployees = exports.getAllDepartments = exports.CreateDepartmentSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schema for creating/updating departments
exports.CreateDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
    departmentId: zod_1.z.string().min(1, "Department ID is required"),
    manager: zod_1.z.string().nullable(),
    groups: zod_1.z.array(zod_1.z.string()).optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional()
});
/**
 * Get all departments
 */
const getAllDepartments = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield prisma.department.findMany({
            include: {
                manager: true,
                employees: true
            }
        });
        res.json(departments);
    }
    catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({
            error: "Error fetching departments",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getAllDepartments = getAllDepartments;
/**
 * Get all employees across all departments
 */
const getEmployees = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield prisma.employee.findMany({
            include: {
                department: true
            }
        });
        res.json(employees);
    }
    catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            error: "Error fetching employees",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getEmployees = getEmployees;
/**
 * Create a new department
 */
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, departmentId, manager, groups, status } = req.body;
        // Check if department ID already exists
        const existingDepartment = yield prisma.department.findFirst({
            where: {
                id: departmentId
            }
        });
        if (existingDepartment) {
            res.status(400).json({
                error: "Validation error",
                details: "Department ID already exists"
            });
            return;
        }
        // Create the department
        const department = yield prisma.department.create({
            data: {
                id: departmentId,
                name,
                description,
                groups: groups || [],
                managerId: manager,
                status: status || 'ACTIVE'
            },
            include: {
                manager: true,
                employees: true
            }
        });
        // Log the created department for debugging
        console.log('Created department:', JSON.stringify(department, null, 2));
        res.status(201).json(department);
    }
    catch (error) {
        console.error('Error creating department:', error);
        res.status(500).json({
            error: "Error creating department",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.createDepartment = createDepartment;
/**
 * Update an existing department
 */
const updateDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, manager, groups, status } = req.body;
        // Check if department exists
        const existingDepartment = yield prisma.department.findUnique({
            where: { id }
        });
        if (!existingDepartment) {
            res.status(404).json({
                error: "Not found",
                details: "Department not found"
            });
            return;
        }
        // Update the department
        const department = yield prisma.department.update({
            where: { id },
            data: {
                name,
                description,
                groups: groups || [],
                managerId: manager,
                status
            },
            include: {
                manager: true,
                employees: true
            }
        });
        // Log the updated department for debugging
        console.log('Updated department:', JSON.stringify(department, null, 2));
        res.json(department);
    }
    catch (error) {
        console.error('Error updating department:', error);
        res.status(500).json({
            error: "Error updating department",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateDepartment = updateDepartment;
/**
 * Delete a department
 */
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if department exists and get dependencies
        const department = yield prisma.department.findUnique({
            where: { id },
            include: {
                employees: true,
                shiftPlanDepartments: {
                    include: {
                        schedules: true
                    }
                }
            }
        });
        if (!department) {
            res.status(404).json({ error: "Department not found" });
            return;
        }
        // Check for employees
        if (department.employees.length > 0) {
            res.status(400).json({
                error: "Cannot delete department with assigned employees",
                details: `${department.employees.length} employees are still assigned to this department`
            });
            return;
        }
        // Delete the department from all shift plans first
        if (department.shiftPlanDepartments.length > 0) {
            // First, update any schedules that reference these ShiftPlanDepartment records
            // to remove the reference
            for (const spd of department.shiftPlanDepartments) {
                if (spd.schedules.length > 0) {
                    yield prisma.schedule.updateMany({
                        where: {
                            shiftPlanDepartmentId: spd.id
                        },
                        data: {
                            shiftPlanDepartmentId: null
                        }
                    });
                }
            }
            // Then delete all ShiftPlanDepartment records for this department
            yield prisma.shiftPlanDepartment.deleteMany({
                where: {
                    departmentId: id
                }
            });
        }
        // Delete the department
        yield prisma.department.delete({
            where: { id }
        });
        res.json({
            message: "Department deleted successfully",
            details: department.shiftPlanDepartments.length > 0
                ? `Department was also removed from ${department.shiftPlanDepartments.length} shift plans`
                : undefined
        });
    }
    catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({
            error: "Failed to delete department",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.deleteDepartment = deleteDepartment;
