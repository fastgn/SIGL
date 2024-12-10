import express from "express";
import eventController from "../controllers/eventController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import authMiddleware from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";
import logger from "../utils/logger";

const router = express.Router();

router.get("/", authMiddleware(), async (_req, res) => {
  try {
    logger.info("Récupération des événements");
    const result = await eventController.getEvents();
    logger.info("Evénements récupérés");
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
      const { description, endDate, type, groups } = req.body;
      logger.info(`Création de l'événement "${description}"`);
      const result = await eventController.createEvent(description, new Date(endDate), type);
      if (groups) {
        await eventController.associateEventWithGroups(
          result.data.id,
          groups.map((group: any) => group.id),
        );
      }
      logger.info(`Evénement "${description}" créé`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : "${error}"`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.put(
  "/:id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { id } = req.params;
      logger.info(`Modification de l'événement ${id}`);
      const { description, endDate, type, groups } = req.body;
      const result = await eventController.modifyEvent(
        parseInt(id),
        description,
        new Date(endDate),
        type,
      );
      if (groups) {
        await eventController.associateEventWithGroups(
          result.data.id,
          groups.map((group: any) => group.id),
        );
      }
      logger.info(`Evénement ${id} modifié`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.delete(
  "/:id",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { id } = req.params;
      logger.info(`Suppression de l'événement ${id}`);
      const result = await eventController.deleteEvent(parseInt(id));
      logger.info(`Evénement ${id} supprimé`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

// router.post("/:id/diary/:diaryId", authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]), async (req, res) => {
//   try {
//     const { id, diaryId } = req.params;
//     const result = await eventController.AssociateEventWithDiary(parseInt(id), parseInt(diaryId));
//     reply(res, result);
//   } catch (error: any) {
//     logger.error(`Erreur serveur : ${error.message}`);
//     reply(res, ControllerError.INTERNAL());
//   }
// });

export default router;
