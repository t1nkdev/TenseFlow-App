"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = require("../middleware/validateRequest");
const zod_1 = require("zod");
const cors_1 = __importDefault(require("cors"));
const shiftTypeController_1 = require("../controllers/shiftTypeController");
const router = (0, express_1.Router)();
// Add CORS middleware
router.use((0, cors_1.default)());
// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Error in shift types route:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        details: err.message || 'An unexpected error occurred'
    });
});
// Create shift type
router.post('/', (0, validateRequest_1.validateRequest)({
    body: shiftTypeController_1.CreateShiftTypeSchema
}), shiftTypeController_1.createShiftType);
// Get all shift types for a specific shift plan
router.get('/plan/:shiftPlanId', shiftTypeController_1.getShiftTypesByPlan);
// Update shift type
router.put('/:id', (0, validateRequest_1.validateRequest)({
    body: shiftTypeController_1.CreateShiftTypeSchema.partial(),
    params: zod_1.z.object({ id: zod_1.z.string().uuid() })
}), shiftTypeController_1.updateShiftType);
// Delete shift type
router.delete('/:id', (0, validateRequest_1.validateRequest)({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() })
}), shiftTypeController_1.deleteShiftType);
exports.default = router;
