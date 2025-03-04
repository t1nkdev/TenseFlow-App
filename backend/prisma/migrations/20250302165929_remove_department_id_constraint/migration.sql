/*
  Warnings:

  - You are about to drop the column `departmentId` on the `shift_plans` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "shift_plans" DROP CONSTRAINT "shift_plans_departmentId_fkey";

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "shiftPlanDepartmentId" TEXT;

-- AlterTable
ALTER TABLE "shift_plans" DROP COLUMN "departmentId";

-- CreateTable
CREATE TABLE "shift_plan_departments" (
    "id" TEXT NOT NULL,
    "shiftPlanId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shift_plan_departments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shift_plan_departments_shiftPlanId_departmentId_key" ON "shift_plan_departments"("shiftPlanId", "departmentId");

-- AddForeignKey
ALTER TABLE "shift_plan_departments" ADD CONSTRAINT "shift_plan_departments_shiftPlanId_fkey" FOREIGN KEY ("shiftPlanId") REFERENCES "shift_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_plan_departments" ADD CONSTRAINT "shift_plan_departments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_shiftPlanDepartmentId_fkey" FOREIGN KEY ("shiftPlanDepartmentId") REFERENCES "shift_plan_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
