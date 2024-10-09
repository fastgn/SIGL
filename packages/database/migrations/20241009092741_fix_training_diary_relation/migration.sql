/*
  Warnings:

  - You are about to drop the column `trainingDiary_id` on the `Apprentice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[apprentice_id]` on the table `TrainingDiary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apprentice_id` to the `TrainingDiary` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Apprentice" DROP CONSTRAINT "Apprentice_trainingDiary_id_fkey";

-- DropIndex
DROP INDEX "Apprentice_trainingDiary_id_key";

-- AlterTable
ALTER TABLE "Apprentice" DROP COLUMN "trainingDiary_id";

-- AlterTable
ALTER TABLE "TrainingDiary" ADD COLUMN     "apprentice_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TrainingDiary_apprentice_id_key" ON "TrainingDiary"("apprentice_id");

-- AddForeignKey
ALTER TABLE "TrainingDiary" ADD CONSTRAINT "TrainingDiary_apprentice_id_fkey" FOREIGN KEY ("apprentice_id") REFERENCES "Apprentice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
