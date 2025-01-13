import prisma from "./prisma";

export default async () => {
  await prisma.$transaction([
    prisma.admin.deleteMany(),
    prisma.apprentice.deleteMany(),
    prisma.apprenticeCoordinator.deleteMany(),
    prisma.apprenticeMentor.deleteMany(),
    prisma.company.deleteMany(),
    prisma.companyAccount.deleteMany(),
    prisma.curriculumManager.deleteMany(),
    prisma.deliverable.deleteMany(),
    prisma.educationalTutor.deleteMany(),
    prisma.emailTemplate.deleteMany(),
    prisma.event.deleteMany(),
    prisma.eventFile.deleteMany(),
    prisma.formationCenter.deleteMany(),
    prisma.group.deleteMany(),
    prisma.groupFile.deleteMany(),
    prisma.note.deleteMany(),
    prisma.speciality.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.trainingDiary.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};
