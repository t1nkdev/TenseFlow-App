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
// Get all employees
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield prisma.employee.findMany({
            include: {
                department: true,
                managedDepartment: true
            }
        });
        res.json(employees);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching employees" });
    }
});
// Create employee
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield prisma.employee.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                employeeId: req.body.employeeId,
                role: req.body.role,
                departmentId: req.body.departmentId,
                startDate: new Date(req.body.startDate),
                status: req.body.status || 'ACTIVE'
            },
            include: {
                department: true
            }
        });
        res.json(employee);
    }
    catch (error) {
        console.error('Employee creation error:', error);
        res.status(500).json({
            error: "Error creating employee",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Delete employee
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        // Check if employee exists and get their dependencies
        const employee = yield prisma.employee.findUnique({
            where: { id },
            include: {
                managedDepartment: true,
                schedules: true
            }
        });
        if (!employee) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        // Delete all schedules for this employee first
        if (employee.schedules.length > 0) {
            yield prisma.schedule.deleteMany({
                where: { employeeId: id }
            });
        }
        // If employee is managing a department, update the department to remove the manager
        if (employee.managedDepartment) {
            yield prisma.department.update({
                where: { id: employee.managedDepartment.id },
                data: { managerId: null }
            });
        }
        // Delete employee
        yield prisma.employee.delete({
            where: { id }
        });
        res.json({
            message: "Employee deleted successfully",
            wasManager: employee.managedDepartment !== null,
            departmentName: (_a = employee.managedDepartment) === null || _a === void 0 ? void 0 : _a.name
        });
    }
    catch (error) {
        console.error('Employee deletion error:', error);
        res.status(500).json({
            error: "Error deleting employee",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get("/", getAllEmployees);
router.post("/", createEmployee);
router.delete("/:id", deleteEmployee);
exports.default = router;
