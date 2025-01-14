import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../../src/index";
import prisma from "../../helpers/prisma";
import authController from "../../../src/controllers/authController";
import passwordUtils from "../../../src/services/password.service";

const password = "password";
describe("/meeting", () => {
  describe("[GET] /meeting", () => {
    it("should respond with status 200 and return a list of meetings", async () => {
      const admin = await prisma.user.create({
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
          apprentice: {
            create: {},
          },
        },
      });
      const token = (await authController.login({ email: admin.email, password })).data.token;
      const response = await request(app)
        .get("/meeting")
        .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(200);
    });
  });

  describe("[GET] /meeting/:id", () => {
    it("should respond with status 200 and return the requested meeting", async () => {
      const admin = await prisma.user.create({
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
          apprentice: {
            create: {},
          },
        },
      });
      const token = (await authController.login({ email: admin.email, password })).data.token;
      const meeting = await prisma.meeting.create({
        data: {
          title: faker.lorem.words(5),
          date: faker.date.future(),
        },
      });

      const response = await request(app)
        .get(`/meeting/${meeting.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send();
      expect(response.status).toBe(200);
    });
  });

  describe("[GET] /meeting/user/:id", () => {
    it("should respond with status 200 and return meetings for a specific user", async () => {
      const admin = await prisma.user.create({
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
          apprentice: {
            create: {},
          },
        },
      });
      const token = (await authController.login({ email: admin.email, password })).data.token;

      const meeting = await prisma.meeting.create({
        data: {
          title: faker.lorem.words(5),
          date: faker.date.future(),
          jury: {
            connect: {
              id: admin.id,
            },
          },
        },
      });

      const response = await request(app)
        .get(`/meeting/user/${admin.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send();
      expect(response.status).toBe(200);
    });
  });

  describe("[POST] /meeting", () => {
    it("should respond with status 201 and create a new meeting", async () => {
      const admin = await prisma.user.create({
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
          apprentice: {
            create: {},
          },
        },
      });
      const token = (await authController.login({ email: admin.email, password })).data.token;
      const newMeeting = {
        title: faker.lorem.words(5),
        date: faker.date.future(),
      };

      const response = await request(app)
        .post("/meeting")
        .set({ Authorization: `Bearer ${token}` })
        .send(newMeeting);
      expect(response.status).toBe(400);
    });
  });

  describe("[DELETE] /meeting/:id", () => {
    it("should respond with status 204 and delete the specified meeting", async () => {
      const admin = await prisma.user.create({
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
          apprentice: {
            create: {},
          },
        },
      });
      const token = (await authController.login({ email: admin.email, password })).data.token;
      const meeting = await prisma.meeting.create({
        data: {
          title: faker.lorem.words(5),
          date: faker.date.future(),
        },
      });

      const response = await request(app)
        .delete(`/meeting/${meeting.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send();
      expect(response.status).toBe(200);

      const deletedMeeting = await prisma.meeting.findUnique({ where: { id: meeting.id } });
      expect(deletedMeeting).toBeNull();
    });
  });
});
