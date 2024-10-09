/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registerDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `active` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_date` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mail` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "registerDate",
DROP COLUMN "username",
ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "mail" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "update_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "FormationCenter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "adress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "student_number" INTEGER,
    "description" TEXT,
    "field" TEXT,

    CONSTRAINT "FormationCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationalTutor" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "EducationalTutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apprentice" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "company_id" INTEGER,
    "Promotion" TEXT NOT NULL,
    "poste" TEXT,

    CONSTRAINT "Apprentice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprenticeMentor" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "poste" TEXT,

    CONSTRAINT "ApprenticeMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "formation_center_id" INTEGER NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumManager" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "FormationCenter_id" INTEGER,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3),

    CONSTRAINT "CurriculumManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprenticeCoordinator" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "FormationCenter_id" INTEGER NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3),

    CONSTRAINT "ApprenticeCoordinator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id_admin" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "Compagny" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT,
    "apprentice_number" INTEGER,
    "OPCO" TEXT,

    CONSTRAINT "Compagny_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialite" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specialite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompagnyToSpecialite" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SpecialiteToTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EducationalTutor_user_id_key" ON "EducationalTutor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Apprentice_user_id_key" ON "Apprentice"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ApprenticeMentor_user_id_key" ON "ApprenticeMentor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_user_id_key" ON "Teacher"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumManager_user_id_key" ON "CurriculumManager"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ApprenticeCoordinator_user_id_key" ON "ApprenticeCoordinator"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_user_id_key" ON "Admin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_CompagnyToSpecialite_AB_unique" ON "_CompagnyToSpecialite"("A", "B");

-- CreateIndex
CREATE INDEX "_CompagnyToSpecialite_B_index" ON "_CompagnyToSpecialite"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SpecialiteToTeacher_AB_unique" ON "_SpecialiteToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_SpecialiteToTeacher_B_index" ON "_SpecialiteToTeacher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- AddForeignKey
ALTER TABLE "EducationalTutor" ADD CONSTRAINT "EducationalTutor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apprentice" ADD CONSTRAINT "Apprentice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apprentice" ADD CONSTRAINT "Apprentice_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Compagny"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeMentor" ADD CONSTRAINT "ApprenticeMentor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeMentor" ADD CONSTRAINT "ApprenticeMentor_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Compagny"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumManager" ADD CONSTRAINT "CurriculumManager_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumManager" ADD CONSTRAINT "CurriculumManager_FormationCenter_id_fkey" FOREIGN KEY ("FormationCenter_id") REFERENCES "FormationCenter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeCoordinator" ADD CONSTRAINT "ApprenticeCoordinator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeCoordinator" ADD CONSTRAINT "ApprenticeCoordinator_FormationCenter_id_fkey" FOREIGN KEY ("FormationCenter_id") REFERENCES "FormationCenter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompagnyToSpecialite" ADD CONSTRAINT "_CompagnyToSpecialite_A_fkey" FOREIGN KEY ("A") REFERENCES "Compagny"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompagnyToSpecialite" ADD CONSTRAINT "_CompagnyToSpecialite_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecialiteToTeacher" ADD CONSTRAINT "_SpecialiteToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Specialite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecialiteToTeacher" ADD CONSTRAINT "_SpecialiteToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
