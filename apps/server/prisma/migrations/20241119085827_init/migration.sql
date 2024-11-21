-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormationCenter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "studentNumber" INTEGER,
    "description" TEXT,
    "field" TEXT,

    CONSTRAINT "FormationCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationalTutor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EducationalTutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apprentice" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "promotion" TEXT,
    "poste" TEXT,
    "educationalTutorId" INTEGER,
    "apprenticeMentorId" INTEGER,

    CONSTRAINT "Apprentice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprenticeMentor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "poste" TEXT,

    CONSTRAINT "ApprenticeMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "formationCenterId" INTEGER,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumManager" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "formationCenterId" INTEGER,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),

    CONSTRAINT "CurriculumManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprenticeCoordinator" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "formationCenterId" INTEGER,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),

    CONSTRAINT "ApprenticeCoordinator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "idAdmin" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("idAdmin")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT,
    "apprenticeNumber" INTEGER,
    "opco" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speciality" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingDiary" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "event" TEXT[],
    "deliverable" TEXT[],
    "apprenticeId" INTEGER NOT NULL,

    CONSTRAINT "TrainingDiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "trainingDiaryId" INTEGER NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyToSpeciality" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SpecialityToTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EducationalTutor_userId_key" ON "EducationalTutor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Apprentice_userId_key" ON "Apprentice"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApprenticeMentor_userId_key" ON "ApprenticeMentor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumManager_userId_key" ON "CurriculumManager"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApprenticeCoordinator_userId_key" ON "ApprenticeCoordinator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingDiary_apprenticeId_key" ON "TrainingDiary"("apprenticeId");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToSpeciality_AB_unique" ON "_CompanyToSpeciality"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToSpeciality_B_index" ON "_CompanyToSpeciality"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SpecialityToTeacher_AB_unique" ON "_SpecialityToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_SpecialityToTeacher_B_index" ON "_SpecialityToTeacher"("B");

-- AddForeignKey
ALTER TABLE "EducationalTutor" ADD CONSTRAINT "EducationalTutor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apprentice" ADD CONSTRAINT "Apprentice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apprentice" ADD CONSTRAINT "Apprentice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apprentice" ADD CONSTRAINT "Apprentice_educationalTutorId_fkey" FOREIGN KEY ("educationalTutorId") REFERENCES "EducationalTutor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apprentice" ADD CONSTRAINT "Apprentice_apprenticeMentorId_fkey" FOREIGN KEY ("apprenticeMentorId") REFERENCES "ApprenticeMentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeMentor" ADD CONSTRAINT "ApprenticeMentor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeMentor" ADD CONSTRAINT "ApprenticeMentor_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumManager" ADD CONSTRAINT "CurriculumManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumManager" ADD CONSTRAINT "CurriculumManager_formationCenterId_fkey" FOREIGN KEY ("formationCenterId") REFERENCES "FormationCenter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeCoordinator" ADD CONSTRAINT "ApprenticeCoordinator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprenticeCoordinator" ADD CONSTRAINT "ApprenticeCoordinator_formationCenterId_fkey" FOREIGN KEY ("formationCenterId") REFERENCES "FormationCenter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingDiary" ADD CONSTRAINT "TrainingDiary_apprenticeId_fkey" FOREIGN KEY ("apprenticeId") REFERENCES "Apprentice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_trainingDiaryId_fkey" FOREIGN KEY ("trainingDiaryId") REFERENCES "TrainingDiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToSpeciality" ADD CONSTRAINT "_CompanyToSpeciality_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToSpeciality" ADD CONSTRAINT "_CompanyToSpeciality_B_fkey" FOREIGN KEY ("B") REFERENCES "Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecialityToTeacher" ADD CONSTRAINT "_SpecialityToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecialityToTeacher" ADD CONSTRAINT "_SpecialityToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
