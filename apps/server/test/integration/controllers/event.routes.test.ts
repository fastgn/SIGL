import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, expect, it } from "vitest";
import authController from "../../../src/controllers/authController";
import app from "../../../src/index";
import passwordUtils from "../../../src/services/password.service";
import prisma from "../../helpers/prisma";

describe("/events", async () => {
  describe("[GET] /event", () => {
    it("ca doit retourner 200 et les events", async () => {
      const event1 = await prisma.event.create({
        data: {
          description: faker.lorem.words(),
          endDate: faker.date.future(),
          type: faker.lorem.word(),
        },
      });
      const event2 = await prisma.event.create({
        data: {
          description: faker.lorem.words(),
          endDate: faker.date.future(),
          type: faker.lorem.word(),
        },
      });
      const password = faker.internet.password();
      const useradmin = await prisma.user.create({
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
      const token = await authController.login({ email: useradmin.email, password: password });
      const response = await request(app)
        .get("/events")
        .set("Authorization", `Bearer ${token.data.token}`)
        .expect(200);
      expect(response.body.data.map((event: { id: string }) => event.id)).toEqual([
        event1.id,
        event2.id,
      ]);
    });
  });
  describe("[GET] /events/diary/:id", () => {
    it("ca doit retourner 200 et les events d un journal donnée", async () => {
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
                },
              },
            },
          },
          groups: {
            create: {
              name: faker.lorem.word(),
              description: faker.lorem.words(),
              color: faker.internet.color(),
              events: {
                create: {
                  description: faker.lorem.words(),
                  endDate: faker.date.future(),
                  type: faker.lorem.word(),
                },
              },
            },
          },
        },
      });
      const diary = await prisma.trainingDiary.findFirst();
      if (!diary) {
        throw new Error("Diary not found");
      }
      const id = diary.id;
      const token = await authController.login({ email: user.email, password: password });
      await request(app)
        .get(`/events/diary/${id}`)
        .set("Authorization", `Bearer ${token.data.token}`)
        .expect(200);
    });
  });
  describe("[POST] /events", async () => {
    it("ca doit retourner 200 et créer un journal", async () => {
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
                },
              },
            },
          },
          admin: {
            create: {},
          },
          groups: {
            create: {
              name: faker.lorem.word(),
              description: faker.lorem.words(),
              color: faker.internet.color(),
            },
          },
        },
      });
      const group = await prisma.group.findFirst();
      const idgroup = group?.id;
      const token = await authController.login({ email: user.email, password: password });
      await request(app)
        .post("/events")
        .set("Authorization", `Bearer ${token.data.token}`)
        .send({
          description: faker.lorem.words(),
          endDate: faker.date.future(),
          type: faker.lorem.word(),
          groupId: idgroup,
        })
        .expect(200);
    });
  });
  describe("[PUT] /events/:id", async () => {
    it("ca doit retourner 200 et modifier un event", async () => {
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
                },
              },
            },
          },
          admin: {
            create: {},
          },
          groups: {
            create: {
              name: faker.lorem.word(),
              description: faker.lorem.words(),
              color: faker.internet.color(),
              events: {
                create: {
                  description: faker.lorem.words(),
                  endDate: faker.date.future(),
                  type: faker.lorem.word(),
                },
              },
            },
          },
        },
      });
      const event = await prisma.event.findFirst();
      const id = event?.id;
      const token = await authController.login({ email: user.email, password: password });
      const response = await request(app)
        .put(`/events/${id}`)
        .set("Authorization", `Bearer ${token.data.token}`)
        .send({
          description: faker.lorem.words(),
          endDate: faker.date.future(),
          type: faker.lorem.word(),
        })
        .expect(200);
    });
  });
  describe("[DELETE] /events/:id", async () => {
    it("ca doit retourner 200 et supprimer un event", async () => {
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
                },
              },
            },
          },
          admin: {
            create: {},
          },
          groups: {
            create: {
              name: faker.lorem.word(),
              description: faker.lorem.words(),
              color: faker.internet.color(),
              events: {
                create: {
                  description: faker.lorem.words(),
                  endDate: faker.date.future(),
                  type: faker.lorem.word(),
                },
              },
            },
          },
        },
      });
      const event = await prisma.event.findFirst();
      const id = event?.id;
      const token = await authController.login({ email: user.email, password: password });
      await request(app)
        .delete(`/events/${id}`)
        .set("Authorization", `Bearer ${token.data.token}`)
        .expect(200);
    });
  });
});
