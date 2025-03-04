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
exports.saveScheduleChanges = exports.updateDepartmentOrder = exports.updateShiftPlan = exports.deleteShiftPlan = exports.createShiftPlan = exports.updateShiftPlanStatus = exports.getShiftPlanDetails = exports.getAllShiftPlans = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Get all shift plans
 */
const getAllShiftPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shiftPlans = yield prisma.shiftPlan.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                departments: {
                    include: {
                        department: true
                    }
                }
            }
        });
        res.json(shiftPlans);
    }
    catch (error) {
        console.error('Error fetching shift plans:', error);
        res.status(500).json({
            error: "Error fetching shift plans",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getAllShiftPlans = getAllShiftPlans;
/**
 * Get shift plan details
 */
const getShiftPlanDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const shiftPlan = yield prisma.shiftPlan.findUnique({
            where: { id },
            include: {
                departments: {
                    orderBy: {
                        displayOrder: 'asc'
                    },
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
                                        status: true,
                                        group: true
                                    }
                                }
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
                shiftTypes: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });
        if (!shiftPlan) {
            res.status(404).json({ error: "Shift plan not found" });
            return;
        }
        res.json(shiftPlan);
    }
    catch (error) {
        console.error('Error fetching shift plan details:', error);
        res.status(500).json({
            error: "Error fetching shift plan details",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getShiftPlanDetails = getShiftPlanDetails;
/**
 * Update shift plan status
 */
const updateShiftPlanStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Validate status
        if (!status || !['DRAFT', 'ACTIVE', 'ARCHIVED'].includes(status)) {
            res.status(400).json({
                error: "Validation error",
                details: "Invalid status value. Must be one of: DRAFT, ACTIVE, ARCHIVED"
            });
            return;
        }
        const updatedPlan = yield prisma.shiftPlan.update({
            where: { id },
            data: { status }
        });
        res.json(updatedPlan);
    }
    catch (error) {
        console.error('Error updating shift plan status:', error);
        res.status(500).json({
            error: "Error updating shift plan status",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateShiftPlanStatus = updateShiftPlanStatus;
/**
 * Create a new shift plan
 */
const createShiftPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate dates
        const startDate = new Date(req.body.startDate + 'T00:00:00');
        const endDate = new Date(req.body.endDate + 'T00:00:00');
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 10); // Max 10 years in the future
        // Set hours to 0 for accurate date comparison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        maxDate.setHours(0, 0, 0, 0);
        // Check if dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            res.status(400).json({
                error: "Validation error",
                details: "Invalid date format"
            });
            return;
        }
        // Check if dates are within valid range
        if (startDate > maxDate || endDate > maxDate) {
            res.status(400).json({
                error: "Validation error",
                details: "Dates cannot be more than 10 years in the future"
            });
            return;
        }
        // Check if end date is after start date
        if (endDate <= startDate) {
            res.status(400).json({
                error: "Validation error",
                details: "End date must be after start date"
            });
            return;
        }
        // Check if at least one department is selected
        if (!req.body.departmentIds || req.body.departmentIds.length === 0) {
            res.status(400).json({
                error: "Validation error",
                details: "At least one department must be selected"
            });
            return;
        }
        // Create the shift plan with departments
        const shiftPlan = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // First create the shift plan
            const newPlan = yield tx.shiftPlan.create({
                data: {
                    name: req.body.name,
                    startDate: startDate,
                    endDate: endDate,
                    status: req.body.status || 'DRAFT'
                }
            });
            // Create department associations
            yield Promise.all(req.body.departmentIds.map((departmentId, index) => tx.shiftPlanDepartment.create({
                data: {
                    shiftPlanId: newPlan.id,
                    departmentId,
                    displayOrder: index
                }
            })));
            // Fetch the complete plan with departments
            const planWithDepartments = yield tx.shiftPlan.findUnique({
                where: { id: newPlan.id },
                include: {
                    departments: {
                        include: {
                            department: true
                        }
                    }
                }
            });
            if (!planWithDepartments) {
                throw new Error('Failed to create shift plan');
            }
            return planWithDepartments;
        }));
        res.status(201).json(shiftPlan);
    }
    catch (error) {
        console.error('Shift plan creation error:', error);
        res.status(500).json({
            error: "Error creating shift plan",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.createShiftPlan = createShiftPlan;
/**
 * Delete a shift plan
 */
const deleteShiftPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if shift plan exists
        const shiftPlan = yield prisma.shiftPlan.findUnique({
            where: { id },
            include: {
                schedules: true
            }
        });
        if (!shiftPlan) {
            res.status(404).json({ error: "Shift plan not found" });
            return;
        }
        // Delete the shift plan and all related data
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Delete schedules
            if (shiftPlan.schedules.length > 0) {
                yield tx.schedule.deleteMany({
                    where: { shiftPlanId: id }
                });
            }
            // Delete shift types
            yield tx.shiftType.deleteMany({
                where: { shiftPlanId: id }
            });
            // Delete department associations
            yield tx.shiftPlanDepartment.deleteMany({
                where: { shiftPlanId: id }
            });
            // Finally delete the shift plan
            yield tx.shiftPlan.delete({
                where: { id }
            });
        }));
        res.json({ message: "Shift plan deleted successfully" });
    }
    catch (error) {
        console.error('Error deleting shift plan:', error);
        res.status(500).json({
            error: "Error deleting shift plan",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.deleteShiftPlan = deleteShiftPlan;
/**
 * Update a shift plan
 */
const updateShiftPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate dates
        const startDate = new Date(req.body.startDate + 'T00:00:00');
        const endDate = new Date(req.body.endDate + 'T00:00:00');
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 10); // Max 10 years in the future
        // Set hours to 0 for accurate date comparison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        maxDate.setHours(0, 0, 0, 0);
        // Check if dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            res.status(400).json({
                error: "Validation error",
                details: "Invalid date format"
            });
            return;
        }
        // Check if dates are within valid range
        if (startDate > maxDate || endDate > maxDate) {
            res.status(400).json({
                error: "Validation error",
                details: "Dates cannot be more than 10 years in the future"
            });
            return;
        }
        // Check if end date is after start date
        if (endDate <= startDate) {
            res.status(400).json({
                error: "Validation error",
                details: "End date must be after start date"
            });
            return;
        }
        // Check if at least one department is selected
        if (!req.body.departmentIds || req.body.departmentIds.length === 0) {
            res.status(400).json({
                error: "Validation error",
                details: "At least one department must be selected"
            });
            return;
        }
        // Update the shift plan with departments
        const shiftPlan = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // First update the shift plan
            const updatedPlan = yield tx.shiftPlan.update({
                where: { id },
                data: {
                    name: req.body.name,
                    startDate: startDate,
                    endDate: endDate,
                    status: req.body.status || 'DRAFT'
                }
            });
            // Delete existing department associations
            yield tx.shiftPlanDepartment.deleteMany({
                where: { shiftPlanId: id }
            });
            // Create new department associations
            yield Promise.all(req.body.departmentIds.map((departmentId, index) => tx.shiftPlanDepartment.create({
                data: {
                    shiftPlanId: id,
                    departmentId,
                    displayOrder: index
                }
            })));
            // Fetch the complete plan with departments
            const planWithDepartments = yield tx.shiftPlan.findUnique({
                where: { id },
                include: {
                    departments: {
                        include: {
                            department: true
                        }
                    }
                }
            });
            if (!planWithDepartments) {
                throw new Error('Failed to update shift plan');
            }
            return planWithDepartments;
        }));
        res.json(shiftPlan);
    }
    catch (error) {
        console.error('Shift plan update error:', error);
        res.status(500).json({
            error: "Error updating shift plan",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateShiftPlan = updateShiftPlan;
/**
 * Update the order of departments in a shift plan
 */
const updateDepartmentOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { departmentIds } = req.body;
        console.log(`Updating department order for plan ${id}:`, departmentIds);
        if (!departmentIds || !Array.isArray(departmentIds)) {
            console.error('Invalid departmentIds:', departmentIds);
            res.status(400).json({ error: "departmentIds must be an array" });
            return;
        }
        // First, verify the shift plan exists
        const shiftPlan = yield prisma.shiftPlan.findUnique({
            where: { id },
            include: {
                departments: true
            }
        });
        if (!shiftPlan) {
            console.error(`Shift plan ${id} not found`);
            res.status(404).json({ error: "Shift plan not found" });
            return;
        }
        // Verify all department IDs are valid and belong to this plan
        const existingDeptIds = shiftPlan.departments.map(d => d.departmentId);
        console.log('Existing department IDs:', existingDeptIds);
        const allDepartmentsExist = departmentIds.every(id => existingDeptIds.includes(id));
        if (!allDepartmentsExist) {
            console.error('Some department IDs are invalid:', departmentIds.filter(id => !existingDeptIds.includes(id)));
            res.status(400).json({
                error: "Some department IDs are invalid or not associated with this shift plan"
            });
            return;
        }
        // Update the display order for each department
        const updatePromises = departmentIds.map((departmentId, index) => prisma.shiftPlanDepartment.update({
            where: {
                shiftPlanId_departmentId: {
                    shiftPlanId: id,
                    departmentId
                }
            },
            data: {
                displayOrder: index
            }
        }));
        yield Promise.all(updatePromises);
        // Return the updated shift plan with departments in the correct order
        const updatedShiftPlan = yield prisma.shiftPlan.findUnique({
            where: { id },
            include: {
                departments: {
                    orderBy: {
                        displayOrder: 'asc'
                    },
                    include: {
                        department: true
                    }
                }
            }
        });
        console.log(`Department order updated successfully for plan ${id}`);
        res.json(updatedShiftPlan);
    }
    catch (error) {
        console.error('Error updating department order:', error);
        res.status(500).json({
            error: "Failed to update department order",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateDepartmentOrder = updateDepartmentOrder;
// Add a new controller function for saving schedule changes
const saveScheduleChanges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { changes } = req.body;
        console.log(`Saving ${changes.length} schedule changes for plan ${id}`);
        if (!changes || !Array.isArray(changes) || changes.length === 0) {
            res.status(400).json({ error: 'No valid changes provided' });
            return;
        }
        // Process each change
        const results = yield Promise.all(changes.map((change) => __awaiter(void 0, void 0, void 0, function* () {
            const { employeeId, date, shiftTypeId } = change;
            // Validate inputs
            if (!employeeId || !date || !shiftTypeId) {
                return { success: false, error: 'Missing required fields', change };
            }
            try {
                // Check if a schedule already exists for this employee and date
                const existingSchedule = yield prisma.schedule.findFirst({
                    where: {
                        employeeId,
                        date: new Date(date),
                        shiftType: {
                            shiftPlanId: id
                        }
                    }
                });
                if (existingSchedule) {
                    // Update existing schedule
                    const updated = yield prisma.schedule.update({
                        where: { id: existingSchedule.id },
                        data: { shiftTypeId },
                        include: {
                            employee: true,
                            shiftType: true
                        }
                    });
                    return { success: true, action: 'updated', schedule: updated };
                }
                else {
                    // Create new schedule
                    const created = yield prisma.schedule.create({
                        data: {
                            employeeId,
                            date: new Date(date),
                            shiftTypeId,
                            shiftPlanId: id
                        },
                        include: {
                            employee: true,
                            shiftType: true
                        }
                    });
                    return { success: true, action: 'created', schedule: created };
                }
            }
            catch (error) {
                console.error('Error processing schedule change:', error);
                return { success: false, error: 'Database error', change };
            }
        })));
        // Count successes and failures
        const successes = results.filter(r => r.success).length;
        const failures = results.filter(r => !r.success).length;
        if (failures > 0) {
            console.warn(`${failures} out of ${changes.length} schedule changes failed`);
        }
        res.status(200).json({
            message: `Successfully processed ${successes} out of ${changes.length} schedule changes`,
            results
        });
    }
    catch (error) {
        console.error('Error saving schedule changes:', error);
        res.status(500).json({ error: 'Failed to save schedule changes' });
    }
});
exports.saveScheduleChanges = saveScheduleChanges;
