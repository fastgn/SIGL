import express from "express";

const router = express.Router();

import diaryController from "../controllers/diaryController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";
import userService from "../services/user.service";

router.post(
  "/user/:id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { id } = req.params;
      logger.info(`Création du journal de bord de l'utilisateur ${id}`);
      const result = await diaryController.createDiary(parseInt(id));
      logger.info(`Journal de bord de l'utilisateur ${id} créé`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.delete(
  "/user/:id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { id } = req.params;
      logger.info(`Suppression du journal de bord de l'utilisateur ${id}`);
      const result = await diaryController.deleteDiary(parseInt(id));
      logger.info(`Journal de bord de l'utilisateur ${id} supprimé`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get("/user/:id", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.context.user) {
      return reply(res, ControllerError.UNAUTHORIZED());
    }
    const roles = userService.getRoles(req.context.user);

    if (
      req.context.user?.id !== parseInt(id) &&
      !roles.includes(EnumUserRole.ADMIN) &&
      !roles.includes(EnumUserRole.EDUCATIONAL_TUTOR) &&
      !roles.includes(EnumUserRole.APPRENTICE)
    ) {
      return reply(res, ControllerError.UNAUTHORIZED());
    }

    logger.info(`Récupération du journal de bord de l'utilisateur ${id}`);
    const result = await diaryController.getDiary(parseInt(id));
    logger.info(`Journal de bord de l'utilisateur ${id} récupéré`);

    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

export default router;
