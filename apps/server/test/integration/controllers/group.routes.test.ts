import request from "supertest";
import app from "../../../src/index";
import { describe, expect, it } from "vitest";
import prisma from "../../helpers/prisma";
import { faker } from "@faker-js/faker";
import passwordUtils from "../../../src/services/password.service";
import authController from "../../../src/controllers/authController";
import { stat } from "fs";

describe("/groups", async () => {
  describe("[GET] /groups", () => {
    it("Doit répondre avec un code `200` et recup tous les groupes", async () => {
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
      const login = await authController.login({
        email: useradmin.email,
        password: password,
      });

      const token = login.data.token;

      const group = await prisma.group.create({
        data: {
          name: "grp1",
          description: faker.lorem.sentence(),
          color: faker.internet.color(),
          users: {
            connect: {
              id: useradmin.id,
            },
          },
        },
      });

      const { status, body } = await request(app)
        .get("/groups")
        .set({
          Authorization: `Bearer ${token}`,
        });
      //console.log(body);
      expect(status).toBe(200);
    });
  });
  describe("[POST] /groups", () => {
    it("Doit répondre avec un code `200` et ajouter un groupe", async () => {
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
      const user2 = await prisma.user.create({
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
        email: useradmin.email,
        password: password,
      });

      const token = login.data.token;

      const { status, body } = await request(app)
        .post("/groups")
        .set({
          Authorization: `Bearer ${token}`,
        })
        .send({
          name: "grp1",
          description: faker.lorem.sentence(),
          color: faker.internet.color(),
          user: [useradmin.id, user2.id],
        });
      //console.log(body);
      expect(status).toBe(200);
    });
  });
  describe("[DELETE] /groups/:id", () => {
    it("Doit répondre avec un code `200` et supprimer un groupe", async () => {
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
      const user2 = await prisma.user.create({
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
        email: useradmin.email,
        password: password,
      });
      const token = login.data.token;

      const group = await prisma.group.create({
        data: {
          name: "grp1",
          description: faker.lorem.sentence(),
          color: faker.internet.color(),
          users: {
            connect: [{ id: useradmin.id }, { id: user2.id }],
          },
        },
      });

      const { status, body } = await request(app)
        .delete(`/groups/${group.id}`)
        .set({
          Authorization: `Bearer ${token}`,
        });
      //console.log(body);
      expect(status).toBe(200);
    });
  });
  describe("[POST] /groups/:id/link", () => {
    it("Doit répondre avec un code `200` et link un usr à un grp", async () => {
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
      const login = await authController.login({
        email: useradmin.email,
        password: password,
      });

      const token = login.data.token;

      const group = await prisma.group.create({
        data: {
          name: "grp1",
          description: faker.lorem.sentence(),
          color: faker.internet.color(),
          users: {
            connect: {
              id: useradmin.id,
            },
          },
        },
      });

      const user2 = await prisma.user.create({
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

      const { status, body } = await request(app)
        .post(`/groups/${group.id}/link`)
        .set({
          Authorization: `Bearer ${token}`,
        })
        .send({
          userIds: [user2.id],
        });
      //console.log(body);
      expect(status).toBe(200);
    });
  });
  describe("[DELETE] /groups/:id/link", () => {
    it("Doit répondre avec un code `200` et unlink un usr à un grp", async () => {
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

      const login = await authController.login({
        email: useradmin.email,
        password: password,
      });

      const token = login.data.token;

      const group = await prisma.group.create({
        data: {
          name: "grp1",
          description: faker.lorem.sentence(),
          color: faker.internet.color(),
          users: {
            connect: {
              id: useradmin.id,
            },
          },
        },
      });

      const { status, body } = await request(app)
        .delete(`/groups/${group.id}/link`)
        .set({
          Authorization: `Bearer ${token}`,
        })
        .send({
          userIds: [useradmin.id],
        });
      console.log(body);
      expect(status).toBe(200);
    });
  });
});
