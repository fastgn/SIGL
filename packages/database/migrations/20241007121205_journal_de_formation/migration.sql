/*
  Warnings:

  - You are about to drop the `trainingDiary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Apprentice" DROP CONSTRAINT "Apprentice_trainingDiary_id_fkey";

-- DropTable
DROP TABLE "trainingDiary";

-- CreateTable
CREATE TABLE "TrainingDiary" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "event" TEXT[],
    "delivrable" TEXT[],

    CONSTRAINT "TrainingDiary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Apprentice" ADD CONSTRAINT "Apprentice_trainingDiary_id_fkey" FOREIGN KEY ("trainingDiary_id") REFERENCES "TrainingDiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
