import express from 'express';
import {
  getSchedulesByPlan,
  saveScheduleChanges,
  deleteSchedule
} from '../controllers/scheduleController';

const router = express.Router();

// GET routes
router.get("/:planId", getSchedulesByPlan);

// POST routes
router.post("/:planId", saveScheduleChanges);

// DELETE routes
router.delete("/:id", deleteSchedule);

export default router; 