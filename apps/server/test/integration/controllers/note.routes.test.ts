import request from "supertest";
import app from "../../../src/index";
import { describe, expect, it } from "vitest";
import prisma from "../../helpers/prisma";
import { faker } from "@faker-js/faker";
import passwordUtils from "../../../src/services/password.service";
import authController from "../../../src/controllers/authController";

describe("/note", async () => {
  describe("[POST] /note", () => {
    it("Doit répondre avec un code `200` et créer une note", async () => {
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

      // Faire une requête POST à /auth/signup
      const { status } = await request(app)
        .post("/note")
        .set({
          Authorization: `Bearer ${token}`,
        })
        .send({
          title: faker.lorem.word(),
          content: faker.lorem.paragraph(),
        });

      // Vérifier que la réponse est correcte
      expect(status).toBe(200);
    });
  });
  describe("[GET] /note", () => {
    it("Doit répondre avec un code `200` et get une note", async () => {
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
                create: {
                  description: faker.lorem.words(),
                  notes: {
                    create: {
                      title: faker.lorem.word(),
                      content: faker.lorem.paragraph(),
                    },
                  },
                },
              },
            },
          },
        },
      });
      const note = await prisma.note.findFirst({});
      const login = await authController.login({
        email: user.email,
        password: password,
      });
      const token = login.data.token;
      // Faire une requête GET à /note
      const { status } = await request(app)
        .get("/note")
        .set({
          Authorization: `Bearer ${token}`,
        });
      expect(status).toBe(200);
    });
  });
  describe("[PATCH] /note/:id", () => {
    it("Doit répondre avec un code `200` et modifier une note", async () => {
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
                create: {
                  description: faker.lorem.words(),
                  notes: {
                    create: {
                      title: faker.lorem.word(),
                      content: faker.lorem.paragraph(),
                    },
                  },
                },
              },
            },
          },
        },
      });
      const note = await prisma.note.findFirst({});
      const noteId = note?.id;
      const login = await authController.login({
        email: user.email,
        password: password,
      });
      const token = login.data.token;
      // Faire une requête GET à /note
      const { status } = await request(app)
        .patch(`/note/${noteId}`)
        .set({
          Authorization: `Bearer ${token}`,
        })
        .send({
          title: faker.lorem.word(),
          content: faker.lorem.paragraph(),
        });
      expect(status).toBe(200);
    });
  });
  describe("[DELETE] /note/:id", () => {
    it("Doit répondre avec un code `200` et supprimer une note", async () => {
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
                create: {
                  description: faker.lorem.words(),
                  notes: {
                    create: {
                      title: faker.lorem.word(),
                      content: faker.lorem.paragraph(),
                    },
                  },
                },
              },
            },
          },
        },
      });
      const note = await prisma.note.findFirst({});
      const noteId = note?.id;
      const login = await authController.login({
        email: user.email,
        password: password,
      });
      const token = login.data.token;
      // Faire une requête GET à /note
      const { status } = await request(app)
        .delete(`/note/${noteId}`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      expect(status).toBe(200);
      const noteSuppr = await prisma.note.findFirst({});
      expect(noteSuppr).toBeNull();
    });
  });
});
