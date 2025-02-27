import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function loadJsonFile(filename: string) {
  const filePath = path.join(__dirname, 'seed', filename);
  const data = readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

async function main() {
  try {
    console.log('Starting seed...');

    // Load JSON data
    const { departments } = await loadJsonFile('departments.json');
    const { employees } = await loadJsonFile('employees.json');
    const { shifts: shiftTypes } = await loadJsonFile('shifts.json');
    const { schedules } = await loadJsonFile('schedules.json');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.schedule.deleteMany();
    await prisma.shiftType.deleteMany();
    await prisma.shiftPlan.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.department.deleteMany();

    // Format dates for employees
    const formattedEmployees = employees.map((emp: any) => ({
      ...emp,
      startDate: new Date(emp.startDate).toISOString()
    }));

    // Seed departments first (without manager references)
    console.log('Seeding departments...');
    await prisma.department.createMany({
      data: departments.map(({ managerId, ...dept }: any) => dept)
    });

    // Seed employees
    console.log('Seeding employees...');
    await prisma.employee.createMany({
      data: formattedEmployees
    });

    // Update department managers
    console.log('Updating department managers...');
    for (const dept of departments) {
      await prisma.department.update({
        where: { id: dept.id },
        data: { managerId: dept.managerId }
      });
    }

    // Create default shift plan
    console.log('Creating default shift plan...');
    const defaultPlan = await prisma.shiftPlan.create({
      data: {
        id: "plan001",
        name: "Default Plan",
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        status: "PUBLISHED",
        departmentId: departments[0].id
      }
    });

    // Seed shifts with shiftPlanId
    console.log('Seeding shifts...');
    await prisma.shiftType.createMany({
      data: shiftTypes.map((shift: any) => ({
        ...shift,
        shiftPlanId: defaultPlan.id
      }))
    });

    // Seed schedules
    console.log('Seeding schedules...');
    const formattedSchedules = schedules.map((schedule: any) => {
      const { shiftId, ...rest } = schedule; // Remove shiftId from the data
      return {
        ...rest,
        shiftTypeId: shiftId, // Map shiftId to shiftTypeId
        shiftPlanId: defaultPlan.id, // Add shiftPlanId from the default plan
        date: new Date(schedule.date).toISOString(),
        createdAt: new Date(schedule.createdAt).toISOString(),
        updatedAt: new Date(schedule.updatedAt).toISOString()
      };
    });

    await prisma.schedule.createMany({
      data: formattedSchedules
    });

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
