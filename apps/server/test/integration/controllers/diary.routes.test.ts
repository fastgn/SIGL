import request from "supertest";
import app from "../../../src/index";
import { describe, expect, it } from "vitest";
import prisma from "../../helpers/prisma";
import { faker } from "@faker-js/faker";
import passwordUtils from "../../../src/services/password.service";
import authController from "../../../src/controllers/authController";
import { logger } from "@azure/storage-blob";

describe("/diary/user/:id", async () => {
  describe("[GET] /diary/user/:id", () => {
    it("Doit répondre avec un code `200` pour un utilisateur existant", async () => {
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
          apprentice: {
            create: {
              trainingDiary: {
                create: {},
              },
            },
          },
        },
      });

      const login = await authController.login({
        email: user.email,
        password: password,
      });
      const token = login.data.token;

      // Faire une requête GET à /diary/user/:id
      const { status } = await request(app)
        .get(`/diary/user/${user.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      expect(status).toBe(200);
    });
  });
  describe("[POST] /diary/user/:id", () => {
    it("Doit répondre avec un code `200` pour un utilisateur existant", async () => {
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
          apprentice: {
            create: {},
          },
          admin: {
            create: {},
          },
        },
      });
      const login = await authController.login({
        email: user.email,
        password: password,
      });
      const token = login.data.token;

      // Faire une requête POST à /diary/user/:id
      const { status, body } = await request(app)
        .post(`/diary/user/${user.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      expect(status).toBe(200);
    });
  });
  describe("[DELETE] /diary/user/:id", () => {
    it("Doit répondre avec un code `200` pour un utilisateur existant", async () => {
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
          apprentice: {
            create: {
              trainingDiary: {
                create: {},
              },
            },
          },
          admin: {
            create: {},
          },
        },
      });
      const login = await authController.login({
        email: user.email,
        password: password,
      });
      const token = login.data.token;

      // Faire une requête DELETE à /diary/user/:id
      const { status } = await request(app)
        .delete(`/diary/user/${user.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      expect(status).toBe(200);
    });

    it("Doit répondre avec un code `401` si on n'est pas authentifié", async () => {
      // Faire une requête DELETE à /diary/user/:id
      const { status } = await request(app).delete(`/diary/user/123`);
      expect(status).toBe(401);
    });
  });
});
