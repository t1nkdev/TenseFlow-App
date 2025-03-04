/*
  Warnings:

  - The values [PUBLISHED] on the enum `PlanStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlanStatus_new" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
ALTER TABLE "shift_plans" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "shift_plans" ALTER COLUMN "status" TYPE "PlanStatus_new" USING ("status"::text::"PlanStatus_new");
ALTER TYPE "PlanStatus" RENAME TO "PlanStatus_old";
ALTER TYPE "PlanStatus_new" RENAME TO "PlanStatus";
DROP TYPE "PlanStatus_old";
ALTER TABLE "shift_plans" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
