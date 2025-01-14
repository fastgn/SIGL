import { faker } from "@faker-js/faker";
import request from "supertest";
import { describe, expect, it } from "vitest";
import authController from "../../../src/controllers/authController";
import app from "../../../src/index";
import passwordUtils from "../../../src/services/password.service";
import prisma from "../../helpers/prisma";

const password = "password";
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
    describe("[GET] /company", () => {
      it("should respond with status 200 and return a list of companies", async () => {
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
          .get("/company")
          .set({ Authorization: `Bearer ${token}` })
          .send();
        expect(response.status).toBe(200);
      });
    });

    describe("[POST] /company", () => {
      it("should respond with status 201 and create a new company", async () => {
        const newCompany = {
          name: faker.company.name(),
          address: faker.address.streetAddress(),
          city: faker.address.city(),
          country: faker.address.country(),
          description: faker.company.catchPhrase(),
          opco: faker.company.name(),
        };
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

        const response = await await request(app)
          .post("/company")
          .set({ Authorization: `Bearer ${token}` })
          .send(newCompany);
        expect(response.status).toBe(200);
      });
    });

    describe("[GET] /company/:company_id", () => {
      it("should respond with status 200 and return the requested company", async () => {
        const company = await prisma.company.create({
          data: {
            name: faker.company.name(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            country: faker.address.country(),
            description: faker.company.catchPhrase(),
            opco: faker.company.name(),
          },
        });
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

        const response = await await request(app)
          .get(`/company/${company.id}`)
          .set({ Authorization: `Bearer ${token}` })
          .send();
        expect(response.status).toBe(200);
      });
    });

    describe("[DELETE] /company/:company_id", () => {
      it("should respond with status 204 and delete the specified company", async () => {
        const company = await prisma.company.create({
          data: {
            name: faker.company.name(),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            country: faker.address.country(),
            description: faker.company.catchPhrase(),
            opco: "blabla",
          },
        });
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

        const response = await await request(app)
          .delete(`/company/${company.id}`)
          .set({ Authorization: `Bearer ${token}` })
          .send();
        expect(response.status).toBe(200);

        const deletedCompany = await prisma.company.findUnique({ where: { id: company.id } });
        expect(deletedCompany).toBeNull();
      });
    });
  });
});
