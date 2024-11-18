import { db } from "../../src/providers/db";
import password from "../../src/services/password.service";

async function main() {
  console.log("Initialisation de la base de données...");
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
  console.log("Base de données initialisée.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
