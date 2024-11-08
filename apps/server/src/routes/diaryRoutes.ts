import express from "express";
import diaryController from "../controllers/diaryController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await diaryController.createDiary(parseInt(user_id));
    reply(res, result);
  } catch (error: any) {
    console.error(error);
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});
export default router;
