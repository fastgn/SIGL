import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import logger from "../utils/logger";
import eventController from "../controllers/eventController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import { groupController } from "../controllers/groupController";
import { EnumUserRole } from "@sigl/types";

const router = express.Router();

router.get("/", authMiddleware(), async (_req, res) => {
  try {
    logger.info("Récupération des groupe");
    const result = await groupController.getGroups();
    logger.info("Groupes récupérés");
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.post(
  "/",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { name, description, color } = req.body;
      logger.info(`Création du groupe "${description}"`);
      const result = await groupController.createGroup(name, description, color);
      logger.info(`Groupe "${description}" créé`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : "${error}"`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.delete(
  "/:id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      logger.info(`Suppression du groupe ${id}`);
      const result = await groupController.deleteGroup(id);
      logger.info(`Groupe ${id} supprimé`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

export default router;
