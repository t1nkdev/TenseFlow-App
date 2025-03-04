import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all schedules for a shift plan
export const getSchedulesByPlan: RequestHandler<{ planId: string }> = async (req, res) => {
  try {
    const { planId } = req.params;
    console.log(`Getting schedules for plan: ${planId}`);
    
    const schedules = await prisma.schedule.findMany({
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
  } catch (error) {
    console.error('Error getting schedules:', error);
    res.status(500).json({ error: 'Failed to get schedules' });
  }
};

// Save schedule changes for a shift plan
export const saveScheduleChanges: RequestHandler<{ planId: string }, any, { changes: Array<{ employeeId: string; date: string; shiftTypeId: string }> }> = async (req, res) => {
  try {
    const { planId } = req.params;
    const { changes } = req.body;
    
    console.log(`Saving ${changes?.length || 0} schedule changes for plan ${planId}`);
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
        const existingSchedule = await prisma.schedule.findFirst({
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
          const updated = await prisma.schedule.update({
            where: { id: existingSchedule.id },
            data: { shiftTypeId },
            include: {
              employee: true,
              shiftType: true
            }
          });
          
          console.log(`Schedule updated successfully: ${updated.id}`);
          result = { success: true, action: 'updated', scheduleId: updated.id, schedule: updated };
        } else {
          console.log(`No existing schedule found, creating new one...`);
          // Create new schedule
          const created = await prisma.schedule.create({
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
      } catch (error) {
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
    
  } catch (error) {
    console.error('Error saving schedule changes:', error);
    res.status(500).json({ error: 'Failed to save schedule changes' });
  }
};

// Delete a schedule
export const deleteSchedule: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting schedule: ${id}`);
    
    await prisma.schedule.delete({
      where: { id }
    });
    
    console.log(`Schedule deleted successfully: ${id}`);
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
}; 