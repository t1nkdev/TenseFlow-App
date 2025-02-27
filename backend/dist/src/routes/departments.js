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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Get all departments
const getAllDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.status(500).json({ error: "Error fetching departments" });
    }
});
// Get all employees for manager selection
const getEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield prisma.employee.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                employeeId: true
            }
        });
        res.json(employees);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching employees" });
    }
});
// Create department
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.name) {
            res.status(400).json({ error: "Department name is required" });
            return;
        }
        const department = yield prisma.department.create({
            data: {
                name: req.body.name,
                description: req.body.description || null,
                status: req.body.status,
                managerId: req.body.manager || null
            },
            include: {
                manager: true
            }
        });
        res.json(department);
    }
    catch (error) {
        console.error('Department creation error:', error);
        res.status(500).json({
            error: "Error creating department",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Delete department
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if department exists
        const department = yield prisma.department.findUnique({
            where: { id },
            include: {
                employees: true,
                shiftPlans: true
            }
        });
        if (!department) {
            res.status(404).json({ error: "Department not found" });
            return;
        }
        // Check for dependencies
        if (department.employees.length > 0) {
            res.status(400).json({
                error: "Cannot delete department with assigned employees",
                details: `${department.employees.length} employees are still assigned to this department`
            });
            return;
        }
        if (department.shiftPlans.length > 0) {
            res.status(400).json({
                error: "Cannot delete department with active shift plans",
                details: `${department.shiftPlans.length} shift plans are associated with this department`
            });
            return;
        }
        // Delete department
        yield prisma.department.delete({
            where: { id }
        });
        res.json({ message: "Department deleted successfully" });
    }
    catch (error) {
        console.error('Department deletion error:', error);
        res.status(500).json({
            error: "Error deleting department",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get("/", getAllDepartments);
router.get("/employees", getEmployees);
router.post("/", createDepartment);
router.delete("/:id", deleteDepartment);
exports.default = router;
