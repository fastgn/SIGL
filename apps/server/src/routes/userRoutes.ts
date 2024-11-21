import express from "express";
import { Request, Response } from "express";
const router = express.Router();

import userController from "../controllers/userController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware, { CustomRequestUser } from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";

router.post(
  "/",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      logger.info("Création d'un utilisateur");
      const body = req.body;
      const result = await userController.add(body);
      logger.info(`Utilisateur créé`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.get("/", authMiddleware(), async (_req: Request, res: Response) => {
  try {
    logger.info("Récupération des utilisateurs");
    const result = await userController.getAll();
    logger.info("Utilisateurs récupérés");
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.get("/:id", authMiddleware(), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    logger.info(`Récupération de l'utilisateur ${id}`);
    const result = await userController.get(id);
    logger.info(`Utilisateur ${id} récupéré`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.delete(
  "/:id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      logger.info(`Suppression de l'utilisateur ${id}`);
      const result = await userController.delete(id);
      logger.info(`Utilisateur ${id} supprimé`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.patch("/:id/password", authMiddleware(), async (req: CustomRequestUser, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    logger.info(`Modification du mot de passe de l'utilisateur ${id}`);

    if (req.user?.id !== id && !req.user?.role?.includes(EnumUserRole.ADMIN)) {
      logger.error("Utilisateur non autorisé");
      return reply(res, ControllerError.UNAUTHORIZED());
    }

    const body = req.body;
    const result = await userController.updatePasswordAdmin(
      id,
      body.password,
      body.confirmPassword,
    );
    logger.info(`Mot de passe de l'utilisateur ${id} modifié`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

export default router;
