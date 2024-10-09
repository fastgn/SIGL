// Importez le client Prisma
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
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
  // Insertion d'utilisateurs
  const user1 = await db.user.create({
    data: {
      name: "Doe",
      first_name: "John",
      birth_date: new Date("1990-01-01"),
      gender: "Male",
      mail: "john.doe@example.com",
      password: "securepassword",
      phone: "1234567890",
      active: true,
    },
  });

  const user2 = await db.user.create({
    data: {
      name: "Smith",
      first_name: "Jane",
      birth_date: new Date("1992-02-02"),
      gender: "Female",
      mail: "jane.smith@example.com",
      password: "securepassword",
      phone: "0987654321",
      active: true,
    },
  });

  //const user3 =
  await db.user.create({
    data: {
      name: "joe",
      first_name: "Didon",
      birth_date: new Date("1993-02-02"),
      gender: "Male",
      mail: "joe.bidon@exemple.com",
      password: "securepassword",
      phone: "0987654321",
      active: true,
    },
  });

  // Insertion de centres de formation
  //const center1 =
  await db.formationCenter.create({
    data: {
      name: "Centre de Formation A",
      adress: "123 Rue Exemple",
      city: "Paris",
      country: "France",
      student_number: 100,
      description: "Un centre de formation pour les professionnels.",
      field: "Informatique",
    },
  });

  //const center2 =
  await db.formationCenter.create({
    data: {
      name: "Centre de Formation B",
      adress: "456 Avenue Exemple",
      city: "Lyon",
      country: "France",
      student_number: 50,
      description: "Centre spécialisé dans l'éducation technique.",
      field: "Bâtiment",
    },
  });

  // Insertion de tuteurs éducatifs
  const tutor1 = await db.educationalTutor.create({
    data: {
      user_id: user1.id,
    },
  });

  const tutor2 = await db.educationalTutor.create({
    data: {
      user_id: user2.id,
    },
  });

  // Insertion d'entreprises
  const company1 = await db.compagny.create({
    data: {
      name: "Entreprise A",
      address: "789 Boulevard Exemple",
      city: "Marseille",
      country: "France",
      description: "Une entreprise leader dans le secteur.",
      apprentice_number: 20,
      OPCO: "OPCO A",
    },
  });

  //const company2 =
  await db.compagny.create({
    data: {
      name: "Entreprise B",
      address: "321 Place Exemple",
      city: "Toulouse",
      country: "France",
      description: "Entreprise innovante dans le domaine.",
      apprentice_number: 30,
      OPCO: "OPCO B",
    },
  });

  const apprenticeMentor1 = await db.apprenticeMentor.create({
    data: {
      user_id: user1.id,
      company_id: company1.id,
      poste: "Ingénieur Principal",
    },
  });

  const TrainingDiary1 = await db.trainingDiary.create({
    data: {
      name: "Cahier de formation de John Doe",
      description: "Cahier de formation pour les événements de formation de l'apprenti",
      event: ["Événement 1", "Événement 2", "Événement 3"],
      delivrable: ["Livrable 1", "Livrable 2", "Livrable 3"],
    },
  });

  const TrainingDiary2 = await db.trainingDiary.create({
    data: {
      name: "Cahier de formation de Jane Smith",
      description: "Cahier de formation pour les événements de formation de l'apprenti",
      event: ["Événement 1", "Événement 2", "Événement 3"],
      delivrable: ["Livrable 1", "Livrable 2", "Livrable 3"],
    },
  });

  // Insertion d'apprentis
  //const apprentice1 =
  await db.apprentice.create({
    data: {
      user_id: user1.id,
      promotion: "2024",
      poste: "Développeur",
      EducationalTutor_id: tutor1.id,
      ApprenticeMentor_id: apprenticeMentor1.id, // Assurez-vous que l'ID existe
      trainingDiary_id: TrainingDiary1.id, // Assurez-vous que l'ID existe
      company_id: company1.id,
    },
  });

  //const apprentice2 =
  await db.apprentice.create({
    data: {
      user_id: user2.id,
      promotion: "2024",
      poste: "Ingénieur",
      EducationalTutor_id: tutor2.id,
      ApprenticeMentor_id: apprenticeMentor1.id, // Assurez-vous que l'ID existe
      trainingDiary_id: TrainingDiary2.id, // Assurez-vous que l'ID existe
      company_id: company1.id,
    },
  });
  // Insertion de spécialités
  //const specialty1 =
  await db.specialite.create({
    data: {
      name: "Développement Web",
    },
  });

  //const specialty2 =
  await db.specialite.create({
    data: {
      name: "Data Science",
    },
  });

  console.log("Données insérées avec succès!");
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
