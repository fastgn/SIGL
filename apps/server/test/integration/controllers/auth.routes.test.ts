import request from "supertest";
import app from "../../../src/index";
import { describe, expect, it } from "vitest";
import prisma from "../../helpers/prisma";
import { faker } from "@faker-js/faker";
import passwordUtils from "../../../src/services/password.service";

describe("/auth", async () => {
  describe("[POST] /auth/signup", () => {
    it("Doit répondre avec un code `200` pour des identifiants valides", async () => {
      // Créer un utilisateur dans la base de données
      const password = faker.internet.password();
      const user = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: await passwordUtils.crypt(password),
          active: true,
          birthDate: faker.date.past(),
          gender: "male",
          phone: faker.phone.number(),
        },
      });

      // Faire une requête POST à /auth/signup
      const { status, body } = await request(app).post("/auth/login").send({
        email: user.email,
        password: password,
      });

      // Vérifier que la réponse est correcte
      expect(status).toBe(200);
      expect(body.data.token).toBeDefined();
      expect(body.data.user).toMatchObject({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate.toISOString(),
      });
    });

    it("Doit répondre avec un code `401` pour des identifiants invalides", async () => {
      // Faire une requête POST à /auth/signup
      const { status } = await request(app).post("/auth/login").send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      // Vérifier que la réponse est correcte
      expect(status).toBe(401);
    });
  });
});
