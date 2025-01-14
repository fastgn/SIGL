import request from "supertest";
import app from "../../../src/index";
import { describe, expect, it, beforeAll } from "vitest";
import prisma from "../../helpers/prisma";
import { faker } from "@faker-js/faker";
import passwordUtils from "../../../src/services/password.service";
import authController from "../../../src/controllers/authController";
import { logger } from "@azure/storage-blob";

describe("/dashboard", () => {
  it("/users/count should return the number of users", async () => {
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
        apprentice: {
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
      .get("/dashboard/users/count")
      .set({ Authorization: `Bearer ${token}` });
    logger.info(response.body);
    expect(response.status).toBe(200);
  });

  it("/users/count/role should return the number of users by role", async () => {
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
        apprentice: {
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
      .get("/dashboard/users/count/role")
      .set({ Authorization: `Bearer ${token}` });
    logger.info(response.body);
    expect(response.status).toBe(200);
  });

  it("/notes/:userId should return the latest notes", async () => {
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
        apprentice: {
          create: {},
        },
      },
    });

    const login = await authController.login({
      email: user.email,
      password: password,
    });
    const token = login.data.token;
    const userId = user.id; // Adjust according to your seeded data
    const response = await request(app)
      .get(`/dashboard/notes/${userId}`)
      .set({ Authorization: `Bearer ${token}` });
    logger.info(response.body);
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .get(`/dashboard/notes/1`)
      .set({ Authorization: `Bearer ${token}` });
    expect(response2.status).toBe(400);
  });

  it("/events/:userId should return the next events", async () => {
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
        apprentice: {
          create: {},
        },
      },
    });

    const login = await authController.login({
      email: user.email,
      password: password,
    });
    const token = login.data.token;
    const userId = user.id; // Adjust according to your seeded data
    const response = await request(app)
      .get(`/dashboard/events/${userId}?role=apprentice`)
      .set({ Authorization: `Bearer ${token}` });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .get(`/dashboard/events/1`)
      .set({ Authorization: `Bearer ${token}` });
    expect(response2.status).toBe(400);
  });

  it("/groups should return all groups", async () => {
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
        apprentice: {
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
      .get("/dashboard/groups")
      .set({ Authorization: `Bearer ${token}` });
    logger.info(response.body);
    expect(response.status).toBe(200);
  });

  it("/apprentices/promotion should return the number of apprentices by promotion", async () => {
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
        apprentice: {
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
      .get("/dashboard/apprentices/promotion")
      .set({ Authorization: `Bearer ${token}` });
    logger.info(response.body);
    expect(response.status).toBe(200);
  });

  it("/deliverable/event/:eventId should return deliverables for an event", async () => {
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
        apprentice: {
          create: {},
        },
      },
    });

    const login = await authController.login({
      email: user.email,
      password: password,
    });
    const token = login.data.token;
    const eventId = 1; // Adjust according to your seeded data
    const response = await request(app)
      .get(`/dashboard/deliverable/event/${eventId}`)
      .set({ Authorization: `Bearer ${token}` });
    logger.info(response.body);
    expect(response.status).toBe(200);
  });

  it("/deliverable/event should return all deliverables by event", async () => {
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
        apprentice: {
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
      .get("/dashboard/deliverable/event")
      .set({ Authorization: `Bearer ${token}` });
    logger.info(response.body);
    expect(response.status).toBe(200);
  });
});
