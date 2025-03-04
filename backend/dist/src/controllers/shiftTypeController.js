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
exports.deleteShiftType = exports.updateShiftType = exports.getShiftTypesByPlan = exports.createShiftType = exports.CreateShiftTypeSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schema for creating a shift type
exports.CreateShiftTypeSchema = zod_1.z.object({
    code: zod_1.z.string().max(3),
    name: zod_1.z.string().min(1),
    color: zod_1.z.string(),
    startTime: zod_1.z.string().optional(),
    endTime: zod_1.z.string().optional(),
    requiresTime: zod_1.z.boolean(),
    shiftPlanId: zod_1.z.string().uuid()
});
/**
 * Create a new shift type
 */
const createShiftType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shiftType = yield prisma.shiftType.create({
            data: req.body
        });
        res.status(201).json(shiftType);
    }
    catch (error) {
        console.error('Error creating shift type:', error);
        // Check if it's a unique constraint violation
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            res.status(409).json({
                error: 'A shift type with this code already exists in this shift plan',
                details: error.meta
            });
            return;
        }
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            error: 'Failed to create shift type',
            details: errorMessage
        });
    }
});
exports.createShiftType = createShiftType;
/**
 * Get all shift types for a specific shift plan
 */
const getShiftTypesByPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shiftTypes = yield prisma.shiftType.findMany({
            where: {
                shiftPlanId: req.params.shiftPlanId
            }
        });
        res.json(shiftTypes);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Failed to fetch shift types', details: errorMessage });
    }
});
exports.getShiftTypesByPlan = getShiftTypesByPlan;
/**
 * Update a shift type
 */
const updateShiftType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shiftType = yield prisma.shiftType.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(shiftType);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Failed to update shift type', details: errorMessage });
    }
});
exports.updateShiftType = updateShiftType;
/**
 * Delete a shift type
 */
const deleteShiftType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.shiftType.delete({
            where: { id: req.params.id }
        });
        res.status(204).send();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Failed to delete shift type', details: errorMessage });
    }
});
exports.deleteShiftType = deleteShiftType;
