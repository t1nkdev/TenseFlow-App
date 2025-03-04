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
exports.updateEmployee = exports.deleteEmployee = exports.createEmployee = exports.getAllEmployees = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Get all employees
 */
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getAllEmployees = getAllEmployees;
/**
 * Create a new employee
 */
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phone, employeeId, role, departmentId, group, status } = req.body;
        // Check if employee ID already exists
        const existingEmployee = yield prisma.employee.findFirst({
            where: {
                employeeId
            }
        });
        if (existingEmployee) {
            res.status(400).json({
                error: "Validation error",
                details: "Employee ID already exists"
            });
            return;
        }
        // Create data object with required fields
        const employeeData = {
            firstName,
            lastName,
            employeeId,
            role,
            departmentId,
            status: status || 'ACTIVE'
        };
        // Only add email if it's provided and not empty
        if (email && email.trim() !== '') {
            employeeData.email = email;
        }
        // Add phone if provided
        if (phone) {
            employeeData.phone = phone;
        }
        // Add group if provided
        if (group) {
            employeeData.group = group;
        }
        // Create the employee
        const employee = yield prisma.employee.create({
            data: employeeData,
            include: {
                department: true
            }
        });
        res.status(201).json(employee);
    }
    catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({
            error: "Error creating employee",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.createEmployee = createEmployee;
/**
 * Delete an employee
 */
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if employee exists
        const employee = yield prisma.employee.findUnique({
            where: { id },
            include: {
                schedules: true,
                managedDepartment: true
            }
        });
        if (!employee) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        // Check for dependencies
        if (employee.managedDepartment) {
            res.status(400).json({
                error: "Cannot delete employee who is managing a department",
                details: `Employee is managing the ${employee.managedDepartment.name} department`
            });
            return;
        }
        if (employee.schedules.length > 0) {
            res.status(400).json({
                error: "Cannot delete employee with assigned schedules",
                details: `Employee has ${employee.schedules.length} schedules assigned`
            });
            return;
        }
        // Delete the employee
        yield prisma.employee.delete({
            where: { id }
        });
        res.json({ message: "Employee deleted successfully" });
    }
    catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({
            error: "Failed to delete employee",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.deleteEmployee = deleteEmployee;
/**
 * Update an employee
 */
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, employeeId, role, departmentId, group, status } = req.body;
        // Check if employee exists
        const existingEmployee = yield prisma.employee.findUnique({
            where: { id }
        });
        if (!existingEmployee) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        // Check if the new employee ID already exists (if changed)
        if (employeeId !== existingEmployee.employeeId) {
            const duplicateEmpId = yield prisma.employee.findFirst({
                where: {
                    employeeId,
                    id: { not: id }
                }
            });
            if (duplicateEmpId) {
                res.status(400).json({
                    error: "Validation error",
                    details: "Employee ID already exists"
                });
                return;
            }
        }
        // Update the employee
        // Create data object with required fields
        const employeeData = {
            firstName,
            lastName,
            employeeId,
            role,
            departmentId,
            status
        };
        // Only add email if it's provided and not empty
        if (email && email.trim() !== '') {
            employeeData.email = email;
        }
        else {
            employeeData.email = null;
        }
        // Add phone if provided
        if (phone) {
            employeeData.phone = phone;
        }
        else {
            employeeData.phone = null;
        }
        // Add group if provided
        if (group) {
            employeeData.group = group;
        }
        else {
            employeeData.group = null;
        }
        const employee = yield prisma.employee.update({
            where: { id },
            data: employeeData,
            include: {
                department: true
            }
        });
        res.json(employee);
    }
    catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({
            error: "Failed to update employee",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateEmployee = updateEmployee;
