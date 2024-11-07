import { test, expect, vi, describe } from "vitest";
import eventController from "../../src/controllers/eventController";
import { db } from "../../src/providers/__mocks__/db";

vi.mock("../../src/providers/db");

describe("Test Event Controller", () => {
  test("Créer un event", async () => {
    db.event.create.mockResolvedValue({
      id: 1,
      description: "Description de l'event 1",
      endDate: new Date(),
      type: "type 1",
    });

    const res = await eventController.createEvent("Description de l'event 1", new Date(), "type 1");
    //console.log(res);
    expect(res.status).toBe(200);
  });
  test("Modifier un event", async () => {
    db.event.findFirst.mockResolvedValue({
      id: 1,
      description: "blabla",
      endDate: new Date(),
      type: "type 3",
    });

    db.event.update.mockResolvedValue({
      id: 1,
      description: "Description de l'event 1",
      endDate: new Date(),
      type: "type 1",
    });

    const res = await eventController.modifyEvent(
      1,
      "Description de l'event 1",
      new Date(),
      "type 1",
    );
    //console.log(res);
    expect(res.status).toBe(200);
  });
});
