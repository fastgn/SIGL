import express from "express";
import diaryController from "../controllers/diaryController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await diaryController.createDiary(parseInt(user_id));
    reply(res, result);
  } catch (error) {
    console.error(error);
    reply(res, ControllerError.INTERNAL());
  }
});
export default router;
