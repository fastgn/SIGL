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
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupFile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT,
    "blobName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" INTEGER,

    CONSTRAINT "GroupFile_pkey" PRIMARY KEY ("id")
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
    "promotion" TEXT DEFAULT 'promotion par défault',
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
    "country" TEXT NOT NULL DEFAULT 'France',
    "description" TEXT DEFAULT ' ',
    "apprenticeNumber" INTEGER DEFAULT 0,
    "opco" TEXT DEFAULT '',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speciality" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT,
    "blobName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" INTEGER,

    CONSTRAINT "EventFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingDiary" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "apprenticeId" INTEGER NOT NULL,

    CONSTRAINT "TrainingDiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyAccount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "CompanyAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "trainingDiaryId" INTEGER NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deliverable" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "blobName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" INTEGER,
    "trainingDiaryId" INTEGER,

    CONSTRAINT "Deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "inProgressSemester" TEXT,
    "obtainedSemester" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillEvaluation" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "skillId" INTEGER NOT NULL,
    "biannualEvaluationId" INTEGER NOT NULL,

    CONSTRAINT "SkillEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiannualEvaluation" (
    "id" SERIAL NOT NULL,
    "semester" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trainingDiaryId" INTEGER NOT NULL,

    CONSTRAINT "BiannualEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
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

-- CreateTable
CREATE TABLE "_EventToGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToMeeting" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MeetingPresenter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MeetingJury" (
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
CREATE UNIQUE INDEX "CompanyAccount_userId_key" ON "CompanyAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyAccount_companyId_key" ON "CompanyAccount"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_key" ON "EmailTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_code_key" ON "Skill"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_description_key" ON "Skill"("description");

-- CreateIndex
CREATE UNIQUE INDEX "SkillEvaluation_skillId_biannualEvaluationId_key" ON "SkillEvaluation"("skillId", "biannualEvaluationId");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToUser_AB_unique" ON "_GroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToUser_B_index" ON "_GroupToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToSpeciality_AB_unique" ON "_CompanyToSpeciality"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToSpeciality_B_index" ON "_CompanyToSpeciality"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SpecialityToTeacher_AB_unique" ON "_SpecialityToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_SpecialityToTeacher_B_index" ON "_SpecialityToTeacher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToGroup_AB_unique" ON "_EventToGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToGroup_B_index" ON "_EventToGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToMeeting_AB_unique" ON "_EventToMeeting"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToMeeting_B_index" ON "_EventToMeeting"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MeetingPresenter_AB_unique" ON "_MeetingPresenter"("A", "B");

-- CreateIndex
CREATE INDEX "_MeetingPresenter_B_index" ON "_MeetingPresenter"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MeetingJury_AB_unique" ON "_MeetingJury"("A", "B");

-- CreateIndex
CREATE INDEX "_MeetingJury_B_index" ON "_MeetingJury"("B");

-- AddForeignKey
ALTER TABLE "GroupFile" ADD CONSTRAINT "GroupFile_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "EventFile" ADD CONSTRAINT "EventFile_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingDiary" ADD CONSTRAINT "TrainingDiary_apprenticeId_fkey" FOREIGN KEY ("apprenticeId") REFERENCES "Apprentice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyAccount" ADD CONSTRAINT "CompanyAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyAccount" ADD CONSTRAINT "CompanyAccount_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_trainingDiaryId_fkey" FOREIGN KEY ("trainingDiaryId") REFERENCES "TrainingDiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_trainingDiaryId_fkey" FOREIGN KEY ("trainingDiaryId") REFERENCES "TrainingDiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillEvaluation" ADD CONSTRAINT "SkillEvaluation_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillEvaluation" ADD CONSTRAINT "SkillEvaluation_biannualEvaluationId_fkey" FOREIGN KEY ("biannualEvaluationId") REFERENCES "BiannualEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiannualEvaluation" ADD CONSTRAINT "BiannualEvaluation_trainingDiaryId_fkey" FOREIGN KEY ("trainingDiaryId") REFERENCES "TrainingDiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToSpeciality" ADD CONSTRAINT "_CompanyToSpeciality_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToSpeciality" ADD CONSTRAINT "_CompanyToSpeciality_B_fkey" FOREIGN KEY ("B") REFERENCES "Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecialityToTeacher" ADD CONSTRAINT "_SpecialityToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpecialityToTeacher" ADD CONSTRAINT "_SpecialityToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToGroup" ADD CONSTRAINT "_EventToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToGroup" ADD CONSTRAINT "_EventToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToMeeting" ADD CONSTRAINT "_EventToMeeting_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToMeeting" ADD CONSTRAINT "_EventToMeeting_B_fkey" FOREIGN KEY ("B") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingPresenter" ADD CONSTRAINT "_MeetingPresenter_A_fkey" FOREIGN KEY ("A") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingPresenter" ADD CONSTRAINT "_MeetingPresenter_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingJury" ADD CONSTRAINT "_MeetingJury_A_fkey" FOREIGN KEY ("A") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingJury" ADD CONSTRAINT "_MeetingJury_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
