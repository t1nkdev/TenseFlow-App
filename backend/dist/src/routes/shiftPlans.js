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
// Get all shift plans
const getAllShiftPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shiftPlans = yield prisma.shiftPlan.findMany({
            include: {
                department: true,
                shiftTypes: true,
                schedules: {
                    include: {
                        employee: true,
                        shiftType: true
                    }
                }
            }
        });
        res.json(shiftPlans);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching shift plans" });
    }
});
// Get shift plan details
const getShiftPlanDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const shiftPlan = yield prisma.shiftPlan.findUnique({
            where: { id },
            include: {
                department: {
                    include: {
                        employees: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                employeeId: true,
                                role: true,
                                status: true
                            }
                        }
                    }
                },
                schedules: {
                    include: {
                        employee: true,
                        shiftType: true
                    }
                },
                shiftTypes: true
            }
        });
        if (!shiftPlan) {
            res.status(404).json({ error: "Shift plan not found" });
            return;
        }
        res.json(shiftPlan);
    }
    catch (error) {
        next(error);
    }
});
// Create shift plan
const createShiftPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shiftPlan = yield prisma.shiftPlan.create({
            data: {
                name: req.body.name,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
                departmentId: req.body.departmentId,
                status: req.body.status || 'DRAFT'
            },
            include: {
                department: true
            }
        });
        res.json(shiftPlan);
    }
    catch (error) {
        console.error('Shift plan creation error:', error);
        res.status(500).json({
            error: "Error creating shift plan",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Delete shift plan
const deleteShiftPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if shift plan exists and get dependencies
        const shiftPlan = yield prisma.shiftPlan.findUnique({
            where: { id },
            include: {
                schedules: true,
                shiftTypes: true
            }
        });
        if (!shiftPlan) {
            res.status(404).json({ error: "Shift plan not found" });
            return;
        }
        // Delete all related schedules first
        if (shiftPlan.schedules.length > 0) {
            yield prisma.schedule.deleteMany({
                where: { shiftPlanId: id }
            });
        }
        // Delete all related shift types
        if (shiftPlan.shiftTypes.length > 0) {
            yield prisma.shiftType.deleteMany({
                where: { shiftPlanId: id }
            });
        }
        // Delete the shift plan
        yield prisma.shiftPlan.delete({
            where: { id }
        });
        res.json({ message: "Shift plan deleted successfully" });
    }
    catch (error) {
        console.error('Shift plan deletion error:', error);
        res.status(500).json({
            error: "Error deleting shift plan",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get("/", getAllShiftPlans);
router.get("/:id/details", getShiftPlanDetails);
router.post("/", createShiftPlan);
router.delete("/:id", deleteShiftPlan);
exports.default = router;
