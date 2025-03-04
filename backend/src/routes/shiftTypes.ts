import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';
import cors from 'cors';
import { 
  createShiftType, 
  getShiftTypesByPlan, 
  updateShiftType, 
  deleteShiftType,
  CreateShiftTypeSchema
} from '../controllers/shiftTypeController';

const router = Router();

// Add CORS middleware
router.use(cors());

// Error handling middleware
router.use((err: any, req: any, res: any, next: Function) => {
  console.error('Error in shift types route:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message || 'An unexpected error occurred'
  });
});

// Create shift type
router.post('/', validateRequest({
  body: CreateShiftTypeSchema
}), createShiftType);

// Get all shift types for a specific shift plan
router.get('/plan/:shiftPlanId', getShiftTypesByPlan);

// Update shift type
router.put('/:id', validateRequest({
  body: CreateShiftTypeSchema.partial(),
  params: z.object({ id: z.string().uuid() })
}), updateShiftType);

// Delete shift type
router.delete('/:id', validateRequest({
  params: z.object({ id: z.string().uuid() })
}), deleteShiftType);

export default router; 