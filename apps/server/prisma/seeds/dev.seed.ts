import { db } from "../../src/providers/db";
import password from "../../src/services/password.service";

async function main() {
  console.log("Initialisation de la base de données...");
  // Administrateur
  await db.user.create({
    data: {
      lastName: "Doe",
      firstName: "John",
      birthDate: new Date("1990-01-01"),
      active: true,
      email: "admin@fastgn.com",
      password: await password.crypt("root"),
      gender: "male",
      phone: "1234567890",
      admin: {
        create: {},
      },
    },
  });
  await db.user.create({
    data: {
      lastName: "Akerman",
      firstName: "Alice",
      birthDate: new Date("1991-02-02"),
      active: true,
      email: "alice@fastgn.com",
      password: await password.crypt("1234"),
      gender: "female",
      phone: "6666666666",
      apprentice: {
        create: {},
      },
    },
  });
  await db.user.create({
    data: {
      lastName: "LeBricoleur",
      firstName: "Bob",
      birthDate: new Date("1992-03-03"),
      active: true,
      email: "bob@bric.com",
      password: await password.crypt("azerty"),
      gender: "helicopter",
      phone: "7777777777",
      teacher: {
        create: {},
      },
    },
  });
  // Apprenti avec un journal de formation
  await db.user.create({
    data: {
      lastName: "Julie",
      firstName: "Meulin",
      birthDate: new Date("1998-05-23"),
      active: true,
      email: "julie.meulin@eseo.fr",
      password: await password.crypt("password"),
      gender: "male",
      phone: "1234567890",
      apprentice: {
        create: {
          trainingDiary: {
            create: {},
          },
        },
      },
    },
  });
  console.log("Base de données initialisée.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
