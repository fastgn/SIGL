import { describe, expect, test, vi } from "vitest";
import { db } from "../../../src/providers/__mocks__/db";
import userController from "../../../src/controllers/userController";
import { EnumUserRole } from "@sigl/types";

// Mocker les interactions avec la base de données
vi.mock("../../src/providers/db");

describe("Ajouter un utilisateur", () => {
  test("Ajouter un nouvel utilisateur", async () => {
    // Définir ce que l'appel à db.user.create doit retourner
    db.user.create.mockResolvedValue({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      birthDate: new Date("1990-01-01"),
      email: "john.doe@mail.com",
      phone: "+33612345678",
      gender: "male",
      active: true,
      password: "securepassword",
      creationDate: new Date(),
      updateDate: new Date(),
    });

    // Appeler la méthode add du controller
    const res = await userController.add({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@mail.com",
      phone: "+33612345678",
      birthDate: new Date("1990-01-01"),
      role: EnumUserRole.APPRENTICE,
    });

    // Vérifier que la réponse est bien un succès
    expect(res.status).toBe(200);
  });

  test("Ajouter un utilisateur ayant déjà une adresse mail enregistrée", async () => {
    // Définir ce que l'appel à db.user.findFirst doit retourner
    db.user.findFirst.mockResolvedValue({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      birthDate: new Date("1990-01-01"),
      email: "john.doe@mail.com",
      phone: "+33612345678",
      gender: "male",
      active: true,
      password: "securepassword",
      creationDate: new Date(),
      updateDate: new Date(),
    });

    // Ajouter un deuxième utilisateur avec la même adresse mail
    const res = await userController.add({
      firstName: "Emily",
      lastName: "Grims",
      email: "john.doe@mail.com",
      phone: "+33687654321",
      birthDate: new Date("1995-01-01"),
      role: EnumUserRole.TEACHER,
    });

    // Vérifier que la réponse est bien un succès
    expect(res.status).toBe(400);
  });
});
