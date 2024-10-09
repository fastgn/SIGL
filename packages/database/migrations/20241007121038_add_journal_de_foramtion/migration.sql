/*
  Warnings:

  - You are about to drop the column `Promotion` on the `Apprentice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trainingDiary_id]` on the table `Apprentice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ApprenticeMentor_id` to the `Apprentice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EducationalTutor_id` to the `Apprentice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotion` to the `Apprentice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingDiary_id` to the `Apprentice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Apprentice" DROP COLUMN "Promotion",
ADD COLUMN     "ApprenticeMentor_id" INTEGER NOT NULL,
ADD COLUMN     "EducationalTutor_id" INTEGER NOT NULL,
ADD COLUMN     "promotion" TEXT NOT NULL,
ADD COLUMN     "trainingDiary_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "trainingDiary" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "event" TEXT[],
    "delivrable" TEXT[],

    CONSTRAINT "trainingDiary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Apprentice_trainingDiary_id_key" ON "Apprentice"("trainingDiary_id");

-- AddForeignKey
ALTER TABLE "Apprentice" ADD CONSTRAINT "Apprentice_EducationalTutor_id_fkey" FOREIGN KEY ("EducationalTutor_id") REFERENCES "EducationalTutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apprentice" ADD CONSTRAINT "Apprentice_ApprenticeMentor_id_fkey" FOREIGN KEY ("ApprenticeMentor_id") REFERENCES "ApprenticeMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apprentice" ADD CONSTRAINT "Apprentice_trainingDiary_id_fkey" FOREIGN KEY ("trainingDiary_id") REFERENCES "trainingDiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
