import { describe, expect, test, vi } from "vitest";
import diaryController from "../../../src/controllers/diaryController";
import { db } from "../../../src/providers/__mocks__/db";
import { beforeEach } from "node:test";

vi.mock("../../src/providers/db");

describe("Créer un journal de formation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Créer un journal de formation pour un utilisateur existant", async () => {
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

    db.trainingDiary.create.mockResolvedValue({
      id: 1,
      description: "Journal de formation",
      apprenticeId: 1,
    });

    const res = await diaryController.createDiary(1);
    expect(res.status).toBe(200);
  });
  test("Supprimer un journal de formation pour un utilisateur existant", async () => {
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

    db.trainingDiary.delete.mockResolvedValue({
      id: 1,
      description: "Journal de formation",
      apprenticeId: 1,
    });

    const res = await diaryController.deleteDiary(1);
    expect(res.status).toBe(200);
  });
  test("Récupérer le journal de formation d'un apprenti", async () => {
    const userWithApprentice = {
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
      apprentice: {
        id: 1,
        trainingDiary: [
          {
            id: 1,
            description: "Journal de formation",
            apprenticeId: 1,
          },
        ],
      },
    };

    db.user.findFirst.mockResolvedValue(userWithApprentice);

    const res = await diaryController.getDiary(1);

    expect(res.status).toBe(460);
  });
});
