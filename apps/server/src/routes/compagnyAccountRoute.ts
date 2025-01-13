import express from "express";
import compagnyAccountController from "../controllers/compagnyAccountController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";

const router = express.Router();

router.post(
  "/compagny/:Compagny_id/user/:user_id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { compagny_id, user_id } = req.params;
      logger.info(`Création du compte compagnie`);
      const result = await compagnyAccountController.createCompagnyAccount(
        parseInt(compagny_id),
        parseInt(user_id),
      );
      logger.info(`Compte compagnie créé`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.delete(
  "/user/:user_id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { user_id } = req.params;
      logger.info(`Suppression du compte compagnie`);
      const result = await compagnyAccountController.deleteCompagnyAccount(parseInt(user_id));
      logger.info(`Compte compagnie supprimé`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get(
  "/",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      logger.info(`Récupération des comptes compagnie`);
      const result = await compagnyAccountController.getAllCompagnyAccount();
      logger.info(`Comptes compagnie récupérés`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get(
  "/compagny/:compagny_id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { compagny_id } = req.params;
      logger.info(`Récupération du compte compagnie`);
      const result = await compagnyAccountController.getCompagnyAccount(parseInt(compagny_id));
      logger.info(`Compte compagnie récupéré`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

export default router;
