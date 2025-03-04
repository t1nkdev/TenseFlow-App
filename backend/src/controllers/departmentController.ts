import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for creating/updating departments
export const CreateDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  departmentId: z.string().min(1, "Department ID is required"),
  manager: z.string().nullable(),
  groups: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional()
});

export type CreateDepartmentBody = z.infer<typeof CreateDepartmentSchema>;

/**
 * Get all departments
 */
export const getAllDepartments: RequestHandler = async (_req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        manager: true,
        employees: true
      }
    });
    
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ 
      error: "Error fetching departments",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all employees across all departments
 */
export const getEmployees: RequestHandler = async (_req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true
      }
    });
    
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ 
      error: "Error fetching employees",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Create a new department
 */
export const createDepartment: RequestHandler = async (req, res) => {
  try {
    const { name, description, departmentId, manager, groups, status } = req.body;
    
    // Check if department ID already exists
    const existingDepartment = await prisma.department.findFirst({
      where: {
        id: departmentId
      }
    });
    
    if (existingDepartment) {
      res.status(400).json({ 
        error: "Validation error",
        details: "Department ID already exists"
      });
      return;
    }
    
    // Create the department
    const department = await prisma.department.create({
      data: {
        id: departmentId,
        name,
        description,
        groups: groups || [],
        managerId: manager,
        status: status || 'ACTIVE'
      },
      include: {
        manager: true,
        employees: true
      }
    });
    
    // Log the created department for debugging
    console.log('Created department:', JSON.stringify(department, null, 2));
    
    res.status(201).json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ 
      error: "Error creating department",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update an existing department
 */
export const updateDepartment: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, manager, groups, status } = req.body;
    
    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id }
    });
    
    if (!existingDepartment) {
      res.status(404).json({ 
        error: "Not found",
        details: "Department not found"
      });
      return;
    }
    
    // Update the department
    const department = await prisma.department.update({
      where: { id },
      data: {
        name,
        description,
        groups: groups || [],
        managerId: manager,
        status
      },
      include: {
        manager: true,
        employees: true
      }
    });
    
    // Log the updated department for debugging
    console.log('Updated department:', JSON.stringify(department, null, 2));
    
    res.json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ 
      error: "Error updating department",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete a department
 */
export const deleteDepartment: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if department exists and get dependencies
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        employees: true,
        shiftPlanDepartments: {
          include: {
            schedules: true
          }
        }
      }
    });
    
    if (!department) {
      res.status(404).json({ error: "Department not found" });
      return;
    }
    
    // Check for employees
    if (department.employees.length > 0) {
      res.status(400).json({
        error: "Cannot delete department with assigned employees",
        details: `${department.employees.length} employees are still assigned to this department`
      });
      return;
    }
    
    // Delete the department from all shift plans first
    if (department.shiftPlanDepartments.length > 0) {
      // First, update any schedules that reference these ShiftPlanDepartment records
      // to remove the reference
      for (const spd of department.shiftPlanDepartments) {
        if (spd.schedules.length > 0) {
          await prisma.schedule.updateMany({
            where: {
              shiftPlanDepartmentId: spd.id
            },
            data: {
              shiftPlanDepartmentId: null
            }
          });
        }
      }
      
      // Then delete all ShiftPlanDepartment records for this department
      await prisma.shiftPlanDepartment.deleteMany({
        where: {
          departmentId: id
        }
      });
    }
    
    // Delete the department
    await prisma.department.delete({
      where: { id }
    });
    
    res.json({ 
      message: "Department deleted successfully",
      details: department.shiftPlanDepartments.length > 0 
        ? `Department was also removed from ${department.shiftPlanDepartments.length} shift plans` 
        : undefined
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ 
      error: "Failed to delete department",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 