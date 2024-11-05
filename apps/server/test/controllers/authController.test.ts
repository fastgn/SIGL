import { test, expect, vi, describe } from "vitest";
import bcrypt from "bcrypt";
import { db } from "../../src/providers/__mocks__/db";
import authController from "../../src/controllers/authController";

import env from "../../src/services/env.service";

// Mocker les interactions avec la base de données
vi.mock("../../src/providers/db");

env.init({
  env: {
    TOKEN_SECRET: "YOUR_SECRET",
  },
});

describe("Authentification", () => {
  test("Authentifier un utilisateur", async () => {
    // Définir ce que l'appel à db.user.findUnique doit retourner
    db.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@test.com",
      password: bcrypt.hashSync("password", 10),
      firstName: "Test",
      lastName: "User",
      birthDate: new Date("1990-01-01"),
      gender: "male",
      phone: "+1234567890",
      active: true,
      creationDate: new Date(),
      updateDate: new Date(),
    });

    // Appeler la méthode login du controller
    const res = await authController.login({
      email: "test@test.com",
      password: "password",
    });

    // Vérifier que la réponse est bien un succès
    expect(res.status).toBe(200);
  });
});
