// Importez le client Prisma
import { db } from "../../src/providers/db";

async function main() {
  // Vider la base de données
  console.log("Suppression des données existantes...");
  await db.trainingDiary.deleteMany({});
  await db.event.deleteMany({});
  await db.apprentice.deleteMany({});
  await db.apprenticeMentor.deleteMany({});
  await db.admin.deleteMany({});
  await db.curriculumManager.deleteMany({});
  await db.educationalTutor.deleteMany({});
  await db.formationCenter.deleteMany({});
  await db.speciality.deleteMany({});
  await db.teacher.deleteMany({});
  await db.company.deleteMany({});
  await db.user.deleteMany({});

  // Insertion d'utilisateurs
  const user1 = await db.user.create({
    data: {
      lastName: "Doe",
      firstName: "John",
      birthDate: new Date("1990-01-01"),
      gender: "Male",
      email: "john.doe@example.com",
      password: "securepassword",
      phone: "1234567890",
      active: true,
    },
  });

  const user2 = await db.user.create({
    data: {
      lastName: "Smith",
      firstName: "Jane",
      birthDate: new Date("1992-02-02"),
      gender: "Female",
      email: "jane.smith@example.com",
      password: "securepassword",
      phone: "0987654321",
      active: true,
    },
  });

  //const user3 =
  await db.user.create({
    data: {
      lastName: "joe",
      firstName: "Didon",
      birthDate: new Date("1993-02-02"),
      gender: "Male",
      email: "joe.bidon@exemple.com",
      password: "securepassword",
      phone: "0987654321",
      active: true,
    },
  });

  // Insertion de centres de formation
  const center1 = await db.formationCenter.create({
    data: {
      name: "Centre de Formation A",
      address: "123 Rue Exemple",
      city: "Paris",
      country: "France",
      studentNumber: 100,
      description: "Un centre de formation pour les professionnels.",
      field: "Informatique",
    },
  });

  //const center2 =
  await db.formationCenter.create({
    data: {
      name: "Centre de Formation B",
      address: "456 Avenue Exemple",
      city: "Lyon",
      country: "France",
      studentNumber: 50,
      description: "Centre spécialisé dans l'éducation technique.",
      field: "Bâtiment",
    },
  });

  // Insertion de tuteurs éducatifs
  const tutor1 = await db.educationalTutor.create({
    data: {
      userId: user1.id,
    },
  });

  const tutor2 = await db.educationalTutor.create({
    data: {
      userId: user2.id,
    },
  });

  // Insertion d'entreprises
  const company1 = await db.company.create({
    data: {
      name: "Entreprise A",
      address: "789 Boulevard Exemple",
      city: "Marseille",
      country: "France",
      description: "Une entreprise leader dans le secteur.",
      apprenticeNumber: 20,
      opco: "OPCO A",
    },
  });

  //const company2 =
  await db.company.create({
    data: {
      name: "Entreprise B",
      address: "321 Place Exemple",
      city: "Toulouse",
      country: "France",
      description: "Entreprise innovante dans le domaine.",
      apprenticeNumber: 30,
      opco: "OPCO B",
    },
  });

  const apprenticeMentor1 = await db.apprenticeMentor.create({
    data: {
      userId: user1.id,
      companyId: company1.id,
      poste: "Ingénieur Principal",
    },
  });

  // Insertion d'apprentis
  const apprentice1 = await db.apprentice.create({
    data: {
      userId: user1.id,
      promotion: "2024",
      poste: "Développeur",
      educationalTutorId: tutor1.id,
      apprenticeMentorId: apprenticeMentor1.id, // Assurez-vous que l'ID existe
      companyId: company1.id,
    },
  });

  //const apprentice2 =
  const apprentice2 = await db.apprentice.create({
    data: {
      userId: user2.id,
      promotion: "2024",
      poste: "Ingénieur",
      educationalTutorId: tutor2.id,
      apprenticeMentorId: apprenticeMentor1.id, // Assurez-vous que l'ID existe
      companyId: company1.id,
    },
  });

  //const TrainingDiary1 =
  await db.trainingDiary.create({
    data: {
      id: 1,
      name: "Cahier de formation de John Doe",
      description: "Cahier de formation pour les événements de formation de l'apprenti",
      deliverable: ["Livrable 1", "Livrable 2", "Livrable 3"],
      apprenticeId: apprentice1.id,
    },
  });

  await db.trainingDiary.create({
    data: {
      id: 2,
      name: "bla bla",
      description: "Bla bla bla",
      deliverable: ["Livrable 1", "Livrable 2", "Livrable 3"],
      apprenticeId: apprentice2.id,
    },
  });

  await db.eventState.create({
    data: {
      id: 1,
      name: "Non daté",
    },
  });

  await db.eventType.create({
    data: {
      id: 1,
      name: "Rapport",
    },
  });

  await db.event.create({
    data: {
      id: 1,
      endDate: new Date("2021-12-31"),
      name: "Rapport",
      typeId: 1,
      stateId: 1,
    },
  });
  await db.event.create({
    data: {
      id: 2,
      endDate: new Date("2021-12-31"),
      name: "Rapport 2",
      typeId: 1,
      stateId: 1,
    },
  });

  await db.trainingDiarysOnEvents.create({
    data: {
      trainingDiaryId: 1,
      eventId: 1,
    },
  });
  await db.trainingDiarysOnEvents.create({
    data: {
      trainingDiaryId: 1,
      eventId: 2,
    },
  });
  await db.trainingDiarysOnEvents.create({
    data: {
      trainingDiaryId: 2,
      eventId: 2,
    },
  });

  // Insertion de spécialités
  //const specialty1 =
  await db.speciality.create({
    data: {
      name: "Développement Web",
    },
  });

  //const specialty2 =
  await db.speciality.create({
    data: {
      name: "Data Science",
    },
  });

  const user4 = await db.user.create({
    data: {
      lastName: "Menigot",
      firstName: "Sebastien",
      birthDate: new Date("1973-02-02"),
      gender: "Male",
      email: "Menigot.Sebastien@exemple.com",
      password: "securepassword",
      phone: "0987654321",
      active: true,
    },
  });

  //const CurriculumManager1 =
  await db.curriculumManager.create({
    data: {
      userId: user4.id,
      formationCenterId: center1.id,
      dateDebut: new Date("2021-01-01"),
      dateFin: new Date("2025-12-31"),
    },
  });

  // await db.eve

  console.log("Données insérées avec succès!");
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
