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
      logger.info(`Création du journal de bord de l'utilisateur ${userId}`);
      const result = await diaryController.createDiary(parseInt(userId));
      logger.info(`Journal de bord de l'utilisateur ${userId} créé`);

      reply(res, result);
    } catch (error: any) {
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
      logger.info(`Suppression du journal de bord de l'utilisateur ${userId}`);
      const result = await diaryController.deleteDiary(parseInt(userId));
      logger.info(`Journal de bord de l'utilisateur ${userId} supprimé`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
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
      logger.info(`Récupération du journal de bord de l'utilisateur ${userId}`);
      const result = await diaryController.getDiary(parseInt(userId));
      logger.info(`Journal de bord de l'utilisateur ${userId} récupéré`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

export default router;
