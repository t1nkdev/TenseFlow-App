-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "groups" TEXT[] DEFAULT ARRAY[]::TEXT[];
