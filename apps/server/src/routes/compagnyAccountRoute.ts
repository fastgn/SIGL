import express from "express";
const router = express.Router();

import compagnyAccountController from "../controllers/compagnyAccountController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";

router.post(
  "/",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { compagny_id, user_id } = req.body;
      logger.info(`Création du compte compagnie`);
      const result = await compagnyAccountController.createCompagnyAccount(compagny_id, user_id);
      logger.info(`Compte compagnie créé`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.delete(
  "/",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { compagny_id, user_id } = req.body;
      logger.info(`Suppression du compte compagnie`);
      const result = await compagnyAccountController.deleteCompagnyAccount(compagny_id, user_id);
      logger.info(`Compte compagnie supprimé`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);
export default router;

