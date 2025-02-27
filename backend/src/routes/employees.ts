import express, { Request, Response, Router } from 'express';
import { PrismaClient, Status } from '@prisma/client';

interface CreateEmployeeBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeId: string;
  role: string;
  departmentId: string;
  startDate: string;
  status?: Status;
}

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all employees
const getAllEmployees: express.RequestHandler = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        managedDepartment: true
      }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Error fetching employees" });
  }
};

// Create employee
const createEmployee: express.RequestHandler<{}, {}, CreateEmployeeBody> = async (req, res) => {
  try {
    const employee = await prisma.employee.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        employeeId: req.body.employeeId,
        role: req.body.role,
        departmentId: req.body.departmentId,
        startDate: new Date(req.body.startDate),
        status: req.body.status || 'ACTIVE'
      },
      include: {
        department: true
      }
    });
    res.json(employee);
  } catch (error) {
    console.error('Employee creation error:', error);
    res.status(500).json({ 
      error: "Error creating employee",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete employee
const deleteEmployee: express.RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists and get their dependencies
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        managedDepartment: true,
        schedules: true
      }
    });

    if (!employee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }

    // Delete all schedules for this employee first
    if (employee.schedules.length > 0) {
      await prisma.schedule.deleteMany({
        where: { employeeId: id }
      });
    }

    // If employee is managing a department, update the department to remove the manager
    if (employee.managedDepartment) {
      await prisma.department.update({
        where: { id: employee.managedDepartment.id },
        data: { managerId: null }
      });
    }

    // Delete employee
    await prisma.employee.delete({
      where: { id }
    });

    res.json({ 
      message: "Employee deleted successfully",
      wasManager: employee.managedDepartment !== null,
      departmentName: employee.managedDepartment?.name
    });
  } catch (error) {
    console.error('Employee deletion error:', error);
    res.status(500).json({ 
      error: "Error deleting employee",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

router.get("/", getAllEmployees);
router.post("/", createEmployee);
router.delete("/:id", deleteEmployee);

export default router;
