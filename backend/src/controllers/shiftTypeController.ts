import { RequestHandler } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for creating a shift type
export const CreateShiftTypeSchema = z.object({
  code: z.string().max(3),
  name: z.string().min(1),
  color: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  requiresTime: z.boolean(),
  shiftPlanId: z.string().uuid()
});

type CreateShiftTypeBody = z.infer<typeof CreateShiftTypeSchema>;

/**
 * Create a new shift type
 */
export const createShiftType: RequestHandler<{}, {}, CreateShiftTypeBody> = async (req, res) => {
  try {
    const shiftType = await prisma.shiftType.create({
      data: req.body
    });
    res.status(201).json(shiftType);
  } catch (error) {
    console.error('Error creating shift type:', error);
    
    // Check if it's a unique constraint violation
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
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
};

/**
 * Get all shift types for a specific shift plan
 */
export const getShiftTypesByPlan: RequestHandler<{ shiftPlanId: string }> = async (req, res) => {
  try {
    const shiftTypes = await prisma.shiftType.findMany({
      where: {
        shiftPlanId: req.params.shiftPlanId
      }
    });
    res.json(shiftTypes);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch shift types', details: errorMessage });
  }
};

/**
 * Update a shift type
 */
export const updateShiftType: RequestHandler<{ id: string }, {}, Partial<CreateShiftTypeBody>> = async (req, res) => {
  try {
    const shiftType = await prisma.shiftType.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(shiftType);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to update shift type', details: errorMessage });
  }
};

/**
 * Delete a shift type
 */
export const deleteShiftType: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    await prisma.shiftType.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to delete shift type', details: errorMessage });
  }
}; 