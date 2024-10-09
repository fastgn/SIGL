// Importez le client Prisma
// import { PrismaClient } from '@prisma/client';
import { initDB } from "../src/providers/db";

async function main() {
  const db = await initDB();
  // Vider la base de données
  console.log("Suppression des données existantes...");
  await db.apprentice.deleteMany({});
  await db.apprenticeMentor.deleteMany({});
  await db.admin.deleteMany({});
  await db.curriculumManager.deleteMany({});
  await db.educationalTutor.deleteMany({});
  await db.formationCenter.deleteMany({});
  await db.specialite.deleteMany({});
  await db.teacher.deleteMany({});
  await db.compagny.deleteMany({});
  await db.user.deleteMany({});
  //console.log(db.trainingDiary.findMany());
  await db.trainingDiary.deleteMany({});
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
