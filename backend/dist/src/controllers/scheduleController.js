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
exports.deleteSchedule = exports.saveScheduleChanges = exports.getSchedulesByPlan = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all schedules for a shift plan
const getSchedulesByPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planId } = req.params;
        console.log(`Getting schedules for plan: ${planId}`);
        const schedules = yield prisma.schedule.findMany({
            where: {
                shiftPlanId: planId
            },
            include: {
                employee: true,
                shiftType: true
            }
        });
        console.log(`Found ${schedules.length} schedules`);
        res.status(200).json(schedules);
    }
    catch (error) {
        console.error('Error getting schedules:', error);
        res.status(500).json({ error: 'Failed to get schedules' });
    }
});
exports.getSchedulesByPlan = getSchedulesByPlan;
// Save schedule changes for a shift plan
const saveScheduleChanges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planId } = req.params;
        const { changes } = req.body;
        console.log(`Saving ${(changes === null || changes === void 0 ? void 0 : changes.length) || 0} schedule changes for plan ${planId}`);
        console.log('Changes data:', JSON.stringify(changes, null, 2));
        if (!changes || !Array.isArray(changes) || changes.length === 0) {
            console.error('No valid changes provided');
            res.status(400).json({ error: 'No valid changes provided' });
            return;
        }
        // Process each change
        const results = [];
        for (const change of changes) {
            const { employeeId, date, shiftTypeId } = change;
            // Validate inputs
            if (!employeeId || !date || !shiftTypeId) {
                console.error('Missing required fields:', { employeeId, date, shiftTypeId });
                results.push({ success: false, error: 'Missing required fields', change });
                continue;
            }
            try {
                console.log(`Processing change for employee ${employeeId} on ${date}`);
                // Check if a schedule already exists for this employee and date
                const existingSchedule = yield prisma.schedule.findFirst({
                    where: {
                        employeeId,
                        date: new Date(date),
                        shiftPlanId: planId
                    }
                });
                let result;
                if (existingSchedule) {
                    console.log(`Found existing schedule: ${existingSchedule.id}, updating...`);
                    // Update existing schedule
                    const updated = yield prisma.schedule.update({
                        where: { id: existingSchedule.id },
                        data: { shiftTypeId },
                        include: {
                            employee: true,
                            shiftType: true
                        }
                    });
                    console.log(`Schedule updated successfully: ${updated.id}`);
                    result = { success: true, action: 'updated', scheduleId: updated.id, schedule: updated };
                }
                else {
                    console.log(`No existing schedule found, creating new one...`);
                    // Create new schedule
                    const created = yield prisma.schedule.create({
                        data: {
                            employeeId,
                            date: new Date(date),
                            shiftTypeId,
                            shiftPlanId: planId
                        },
                        include: {
                            employee: true,
                            shiftType: true
                        }
                    });
                    console.log(`New schedule created: ${created.id}`);
                    result = { success: true, action: 'created', scheduleId: created.id, schedule: created };
                }
                results.push(result);
            }
            catch (error) {
                console.error('Error processing schedule change:', error);
                results.push({ success: false, error: 'Database error', change });
            }
        }
        // Count successes and failures
        const successes = results.filter(r => r.success).length;
        const failures = results.filter(r => !r.success).length;
        console.log(`Successfully processed ${successes} out of ${changes.length} schedule changes`);
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
// Delete a schedule
const deleteSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Deleting schedule: ${id}`);
        yield prisma.schedule.delete({
            where: { id }
        });
        console.log(`Schedule deleted successfully: ${id}`);
        res.status(200).json({ message: 'Schedule deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ error: 'Failed to delete schedule' });
    }
});
exports.deleteSchedule = deleteSchedule;
