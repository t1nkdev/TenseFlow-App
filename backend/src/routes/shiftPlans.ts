import express from 'express';
import {
  getAllShiftPlans,
  getShiftPlanDetails,
  updateShiftPlanStatus,
  createShiftPlan,
  deleteShiftPlan,
  updateShiftPlan,
  updateDepartmentOrder,
  saveScheduleChanges
} from '../controllers/shiftPlanController';

const router = express.Router();

// GET routes
router.get("/", getAllShiftPlans);
router.get("/:id/details", getShiftPlanDetails);

// POST routes
router.post("/", createShiftPlan);
router.post("/:id/schedules", saveScheduleChanges);

// PUT routes
router.put("/:id", updateShiftPlan);

// PATCH routes
router.patch("/:id/status", updateShiftPlanStatus);
router.patch("/:id/department-order", updateDepartmentOrder);

// DELETE routes
router.delete("/:id", deleteShiftPlan);

export default router; 