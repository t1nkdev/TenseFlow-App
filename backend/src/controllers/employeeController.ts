import { RequestHandler } from 'express';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateEmployeeBody {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  employeeId: string;
  role: string;
  departmentId: string;
  group?: string;
  status?: Status;
}

/**
 * Get all employees
 */
export const getAllEmployees: RequestHandler = async (req, res) => {
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
 * Create a new employee
 */
export const createEmployee: RequestHandler<{}, {}, CreateEmployeeBody> = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      employeeId, 
      role, 
      departmentId, 
      group,
      status 
    } = req.body;
    
    // Check if employee ID already exists
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        employeeId
      }
    });
    
    if (existingEmployee) {
      res.status(400).json({ 
        error: "Validation error",
        details: "Employee ID already exists"
      });
      return;
    }
    
    // Create data object with required fields
    const employeeData: any = {
      firstName,
      lastName,
      employeeId,
      role,
      departmentId,
      status: status || 'ACTIVE'
    };
    
    // Only add email if it's provided and not empty
    if (email && email.trim() !== '') {
      employeeData.email = email;
    }
    
    // Add phone if provided
    if (phone) {
      employeeData.phone = phone;
    }
    
    // Add group if provided
    if (group) {
      employeeData.group = group;
    }
    
    // Create the employee
    const employee = await prisma.employee.create({
      data: employeeData,
      include: {
        department: true
      }
    });
    
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ 
      error: "Error creating employee",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete an employee
 */
export const deleteEmployee: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        schedules: true,
        managedDepartment: true
      }
    });
    
    if (!employee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    
    // Check for dependencies
    if (employee.managedDepartment) {
      res.status(400).json({
        error: "Cannot delete employee who is managing a department",
        details: `Employee is managing the ${employee.managedDepartment.name} department`
      });
      return;
    }
    
    if (employee.schedules.length > 0) {
      res.status(400).json({
        error: "Cannot delete employee with assigned schedules",
        details: `Employee has ${employee.schedules.length} schedules assigned`
      });
      return;
    }
    
    // Delete the employee
    await prisma.employee.delete({
      where: { id }
    });
    
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ 
      error: "Failed to delete employee",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update an employee
 */
export const updateEmployee: RequestHandler<{ id: string }, {}, CreateEmployeeBody> = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      employeeId, 
      role, 
      departmentId, 
      group,
      status 
    } = req.body;
    
    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id }
    });
    
    if (!existingEmployee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    
    // Check if the new employee ID already exists (if changed)
    if (employeeId !== existingEmployee.employeeId) {
      const duplicateEmpId = await prisma.employee.findFirst({
        where: {
          employeeId,
          id: { not: id }
        }
      });
      
      if (duplicateEmpId) {
        res.status(400).json({ 
          error: "Validation error",
          details: "Employee ID already exists"
        });
        return;
      }
    }
    
    // Update the employee
    // Create data object with required fields
    const employeeData: any = {
      firstName,
      lastName,
      employeeId,
      role,
      departmentId,
      status
    };
    
    // Only add email if it's provided and not empty
    if (email && email.trim() !== '') {
      employeeData.email = email;
    } else {
      employeeData.email = null;
    }
    
    // Add phone if provided
    if (phone) {
      employeeData.phone = phone;
    } else {
      employeeData.phone = null;
    }
    
    // Add group if provided
    if (group) {
      employeeData.group = group;
    } else {
      employeeData.group = null;
    }
    
    const employee = await prisma.employee.update({
      where: { id },
      data: employeeData,
      include: {
        department: true
      }
    });
    
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ 
      error: "Failed to update employee",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 