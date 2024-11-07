import express from "express";

const router = express.Router();

import diaryController from "../controllers/diaryController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";

router.post(
  "/:userId",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await diaryController.createDiary(parseInt(userId));
      reply(res, result);
    } catch (error: any) {
      console.error(error);
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.delete(
  "/:userId",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await diaryController.deleteDiary(parseInt(userId));
      reply(res, result);
    } catch (error) {
      console.error(error);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get(
  "/:userId",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await diaryController.getDiary(parseInt(userId));
      reply(res, result);
    } catch (error) {
      console.error(error);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

export default router;
