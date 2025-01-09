import request from "supertest";
import app from "../../../src/index";
import { describe, expect, it } from "vitest";
import prisma from "../../helpers/prisma";
import { fa, faker } from "@faker-js/faker";
import passwordUtils from "../../../src/services/password.service";
import authController from "../../../src/controllers/authController";
import { EnumUserRole } from "@sigl/types";

// Tests pour les routes d'utilisateur
describe("/user", () => {
  describe("[POST] /user", () => {
    it("Doit créer un utilisateur et répondre avec un code `200`", async () => {
      function getRandomEnumValue<T extends object>(e: T): T[keyof T] {
        const values = Object.values(e) as T[keyof T][];
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex];
      }

      // Exemple d'utilisation
      const RandEnumUserRole = getRandomEnumValue(EnumUserRole);
      console.log(RandEnumUserRole);

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
      const newUser = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: "international" }),
        role: EnumUserRole.APPRENTICE_MENTOR,
        birthDate: faker.date.past(),
      };
      console.log(newUser);
      const response = await request(app)
        .post("/user")
        .set("Authorization", `Bearer ${token}`)
        .send(newUser);
      console.log(response.body);
      expect(response.status).toBe(200);
      const useremail = await prisma.user.findUnique({
        where: {
          email: newUser.email,
        },
      });
      expect(useremail?.email).toBe(newUser.email);
    });
  });

  describe("[GET] /user", () => {
    it("Doit retourner tous les utilisateurs avec un code `200`", async () => {
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
      const password2 = faker.internet.password();
      const user2 = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: await passwordUtils.crypt(password2),
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
      const response = await request(app).get("/user").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe("[GET] /user/:id", () => {
    it("Doit retourner un utilisateur existant avec un code `200`", async () => {
      const password = faker.internet.password();
      const user = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: await passwordUtils.crypt(password),
          birthDate: faker.date.birthdate(),
          gender: "OTHER",
          phone: faker.phone.number(),
          active: true,
          admin: {
            create: {},
          },
        },
      });
      const login = await authController.login({
        email: user.email,
        password: password,
      });
      expect(login?.data?.token).toBeDefined();
      const token = login.data.token;
      const response = await request(app)
        .get(`/user/${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it("Doit répondre avec un code `404` si l'utilisateur n'existe pas", async () => {
      const password = faker.internet.password();
      const user = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: await passwordUtils.crypt(password),
          birthDate: faker.date.birthdate(),
          gender: "OTHER",
          phone: faker.phone.number(),
          active: true,
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
      const response = await request(app)
        .get("/user/99999")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });
  });

  describe("[DELETE] /user/:id", () => {
    it("Doit supprimer un utilisateur existant et répondre avec un code `200`", async () => {
      const password = faker.internet.password();
      const user = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: await passwordUtils.crypt(password),
          birthDate: faker.date.birthdate(),
          gender: "OTHER",
          phone: faker.phone.number(),
          active: true,
          admin: {
            create: {},
          },
        },
      });

      const login = await authController.login({
        email: user.email,
        password: password,
      });
      console.log(login);
      const token = login.data.token;
      const response = await request(app)
        .delete(`/user/${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe("[PATCH] /user/:id/password", () => {
    it("Doit mettre à jour le mot de passe d'un utilisateur et répondre avec un code `200`", async () => {
      const password = faker.internet.password();
      const user = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: await passwordUtils.crypt(password),
          birthDate: faker.date.birthdate(),
          gender: "OTHER",
          phone: faker.phone.number(),
          active: true,
          apprentice: {
            create: {
              trainingDiary: {
                create: {},
              },
            },
          },
        },
      });
      const admin = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: await passwordUtils.crypt(password),
          birthDate: faker.date.birthdate(),
          gender: "OTHER",
          phone: faker.phone.number(),
          active: true,
          admin: {
            create: {},
          },
        },
      });
      const login = await authController.login({
        email: admin.email,
        password: password,
      });
      const token = login.data.token;

      const response = await request(app)
        .patch(`/user/${user.id}/password`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          password: "NewPassword123",
          confirmPassword: "NewPassword123",
        });

      expect(response.status).toBe(200);
      const response2 = await request(app)
        .patch(`/user/${user.id}/password`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          password: "NewPassword12",
          confirmPassword: "NewPassword123",
        });
      expect(response2.status).toBe(400);

      const login2 = await authController.login({
        email: user.email,
        password: "NewPassword123",
      });
      const token2 = login2.data.token;

      const response3 = await request(app)
        .patch(`/user/${user.id}/password`)
        .set("Authorization", `Bearer ${token2}`)
        .send({
          password: "NewPassword1234",
          confirmPassword: "NewPassword1234",
          currentPassword: "NewPassword123",
        });
      expect(response3.status).toBe(200);

      const reponse4 = await request(app)
        .patch(`/user/${user.id}/password`)
        .set("Authorization", `Bearer ${token2}`)
        .send({
          password: "NewPassword123",
          confirmPassword: "NewPassword123",
          currentPassword: "WrongPassword",
        });
      expect(reponse4.status).toBe(401);
      const reponse5 = await request(app)
        .patch(`/user/${user.id}/password`)
        .set("Authorization", `Bearer ${token2}`)
        .send({
          password: "NewPassword12345",
          confirmPassword: "NewPassword123",
          currentPassword: "NewPassword1234",
        });
      expect(reponse4.status).toBe(401);
    });
  });
});
