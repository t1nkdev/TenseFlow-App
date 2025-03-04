/*
  Warnings:

  - A unique constraint covering the columns `[code,shiftPlanId]` on the table `shift_types` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "shift_types_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "shift_types_code_shiftPlanId_key" ON "shift_types"("code", "shiftPlanId");
