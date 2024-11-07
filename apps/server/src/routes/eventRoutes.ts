import express from "express";
import eventController from "../controllers/eventController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const result = await eventController.getEvents();
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});
router.post("/", async (req, res) => {
  try {
    const { description, endDate, type } = req.body;
    const result = await eventController.createEvent(description, new Date(endDate), type);
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, endDate, type } = req.body;
    const result = await eventController.modifyEvent(
      parseInt(id),
      description,
      new Date(endDate),
      type,
    );
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eventController.deleteEvent(parseInt(id));
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});
router.post("/:id/diary/:diaryId", async (req, res) => {
  try {
    const { id, diaryId } = req.params;
    const result = await eventController.AssociateEventWithDiary(parseInt(id), parseInt(diaryId));
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});
export default router;
