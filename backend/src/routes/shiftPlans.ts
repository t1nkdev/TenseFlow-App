import express, { Router } from 'express';
import { PrismaClient, PlanStatus } from '@prisma/client';

interface CreateShiftPlanBody {
  name: string;
  startDate: string;
  endDate: string;
  departmentId: string;
  status?: PlanStatus;
  shiftType: 'rotating' | 'fixed';
}

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all shift plans
const getAllShiftPlans: express.RequestHandler = async (req, res) => {
  try {
    const shiftPlans = await prisma.shiftPlan.findMany({
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
  } catch (error) {
    res.status(500).json({ error: "Error fetching shift plans" });
  }
};

// Get shift plan details
const getShiftPlanDetails: express.RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shiftPlan = await prisma.shiftPlan.findUnique({
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
  } catch (error) {
    next(error);
  }
};

// Create shift plan
const createShiftPlan: express.RequestHandler<{}, {}, CreateShiftPlanBody> = async (req, res) => {
  try {
    const shiftPlan = await prisma.shiftPlan.create({
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
  } catch (error) {
    console.error('Shift plan creation error:', error);
    res.status(500).json({ 
      error: "Error creating shift plan",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete shift plan
const deleteShiftPlan: express.RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if shift plan exists and get dependencies
    const shiftPlan = await prisma.shiftPlan.findUnique({
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
      await prisma.schedule.deleteMany({
        where: { shiftPlanId: id }
      });
    }

    // Delete all related shift types
    if (shiftPlan.shiftTypes.length > 0) {
      await prisma.shiftType.deleteMany({
        where: { shiftPlanId: id }
      });
    }

    // Delete the shift plan
    await prisma.shiftPlan.delete({
      where: { id }
    });

    res.json({ message: "Shift plan deleted successfully" });
  } catch (error) {
    console.error('Shift plan deletion error:', error);
    res.status(500).json({ 
      error: "Error deleting shift plan",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

router.get("/", getAllShiftPlans);
router.get("/:id/details", getShiftPlanDetails);
router.post("/", createShiftPlan);
router.delete("/:id", deleteShiftPlan);

export default router; 