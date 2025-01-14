import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, expect, it } from "vitest";
import authController from "../../../src/controllers/authController";
import app from "../../../src/index";
import passwordUtils from "../../../src/services/password.service";
import prisma from "../../helpers/prisma";

describe("/company", async () => {
  describe("[GET] /company", () => {
    it("Doit répondre avec un code `200` avec la liste des entreprises existantes", async () => {
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

      // Faire une requête GET à /company
      const { status } = await request(app)
        .get(`/company`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      expect(status).toBe(200);
    });

    it("Doit répondre avec un code `401` si on n'est pas authentifié", async () => {
      // Faire une requête GET à /company
      const { status } = await request(app).get(`/company`);
      expect(status).toBe(401);
    });

    it("Doit répondre avec un code `401` si on n'est pas admin", async () => {
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

      const login = await authController.login({
        email: user.email,
        password: password,
      });
      const token = login.data.token;

      // Faire une requête GET à /company
      const { status } = await request(app)
        .get(`/company`)
        .set({
          Authorization: `Bearer ${"abc"}`,
        });
      expect(status).toBe(401);
    });

    it("Doit répondre avec un code `401` si l'utilisateur n'existe plus", async () => {
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

      const login = await authController.login({
        email: user.email,
        password: password,
      });
      const token = login.data.token;

      // Supprimer l'utilisateur
      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      // Faire une requête GET à /company
      const { status } = await request(app)
        .get(`/company`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      expect(status).toBe(401);
    });
  });
  // describe("[POST] /diary/user/:id", () => {
  //   it("Doit répondre avec un code `200` pour un utilisateur existant", async () => {
  //     // Créer un utilisateur dans la base de données
  //     const password = faker.internet.password();
  //     const user = await prisma.user.create({
  //       data: {
  //         firstName: faker.person.firstName(),
  //         lastName: faker.person.lastName(),
  //         email: faker.internet.email(),
  //         password: await passwordUtils.crypt(password),
  //         active: true,
  //         birthDate: faker.date.past(),
  //         gender: "male",
  //         phone: faker.phone.number(),
  //         apprentice: {
  //           create: {},
  //         },
  //         admin: {
  //           create: {},
  //         },
  //       },
  //     });
  //     const login = await authController.login({
  //       email: user.email,
  //       password: password,
  //     });
  //     const token = login.data.token;

  //     // Faire une requête POST à /diary/user/:id
  //     const { status, body } = await request(app)
  //       .post(`/diary/user/${user.id}`)
  //       .set({
  //         Authorization: `Bearer ${token}`,
  //       });
  //     expect(status).toBe(200);
  //   });
  // });
  // describe("[DELETE] /diary/user/:id", () => {
  //   it("Doit répondre avec un code `200` pour un utilisateur existant", async () => {
  //     // Créer un utilisateur dans la base de données
  //     const password = faker.internet.password();
  //     const user = await prisma.user.create({
  //       data: {
  //         firstName: faker.person.firstName(),
  //         lastName: faker.person.lastName(),
  //         email: faker.internet.email(),
  //         password: await passwordUtils.crypt(password),
  //         active: true,
  //         birthDate: faker.date.past(),
  //         gender: "male",
  //         phone: faker.phone.number(),
  //         apprentice: {
  //           create: {
  //             trainingDiary: {
  //               create: {},
  //             },
  //           },
  //         },
  //         admin: {
  //           create: {},
  //         },
  //       },
  //     });
  //     const login = await authController.login({
  //       email: user.email,
  //       password: password,
  //     });
  //     const token = login.data.token;

  //     // Faire une requête DELETE à /diary/user/:id
  //     const { status, body } = await request(app)
  //       .delete(`/diary/user/${user.id}`)
  //       .set({
  //         Authorization: `Bearer ${token}`,
  //       });
  //     expect(status).toBe(200);
  //   });
  // });
});
