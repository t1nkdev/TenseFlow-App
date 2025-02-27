import express, { Request, Response, Router } from 'express';
import { PrismaClient, Status } from '@prisma/client';

interface CreateDepartmentBody {
  name: string;
  description?: string;
  status: Status;
  manager?: string | null;
}

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all departments
const getAllDepartments: express.RequestHandler = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        manager: true,
        employees: true
      }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching departments" });
  }
};

// Get all employees for manager selection
const getEmployees: express.RequestHandler = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeId: true
      }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Error fetching employees" });
  }
};

// Create department
const createDepartment: express.RequestHandler<{}, {}, CreateDepartmentBody> = async (req, res) => {
  try {
    if (!req.body.name) {
      res.status(400).json({ error: "Department name is required" });
      return;
    }

    const department = await prisma.department.create({
      data: {
        name: req.body.name,
        description: req.body.description || null,
        status: req.body.status,
        managerId: req.body.manager || null
      },
      include: {
        manager: true
      }
    });
    res.json(department);
  } catch (error) {
    console.error('Department creation error:', error);
    res.status(500).json({ 
      error: "Error creating department",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete department
const deleteDepartment: express.RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        employees: true,
        shiftPlans: true
      }
    });

    if (!department) {
      res.status(404).json({ error: "Department not found" });
      return;
    }

    // Check for dependencies
    if (department.employees.length > 0) {
      res.status(400).json({ 
        error: "Cannot delete department with assigned employees",
        details: `${department.employees.length} employees are still assigned to this department`
      });
      return;
    }

    if (department.shiftPlans.length > 0) {
      res.status(400).json({ 
        error: "Cannot delete department with active shift plans",
        details: `${department.shiftPlans.length} shift plans are associated with this department`
      });
      return;
    }

    // Delete department
    await prisma.department.delete({
      where: { id }
    });

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error('Department deletion error:', error);
    res.status(500).json({ 
      error: "Error deleting department",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

router.get("/", getAllDepartments);
router.get("/employees", getEmployees);
router.post("/", createDepartment);
router.delete("/:id", deleteDepartment);

export default router; 