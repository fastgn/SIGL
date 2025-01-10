import express, { Request, Response } from "express";
import eventController from "../controllers/eventController";
import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import authMiddleware from "../middleware/authMiddleware";
import { EnumUserRole } from "@sigl/types";
import logger from "../utils/logger";
import { fileMiddleware } from "../middleware/fileMiddleware";

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

router.get("/diary/:id", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Récupération des événements du journal ${id}`);
    const result = await eventController.getEventsByDiary(parseInt(id));
    logger.info(`Evénements du journal ${id} récupérés`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.get("/user/:id", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Récupération des événements de l'utilisateur ${id}`);
    const result = await eventController.getEventsByUser(parseInt(id));
    logger.info(`Evénements de l'utilisateur ${id} récupérés`);
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

router.get("/:id/file", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Récupération des fichiers de l'événement ${id}`);
    const result = await eventController.getFilesFromEvent(parseInt(id));
    logger.info(`Fichiers de l'événement ${id} récupérés`);
    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.post(
  "/:id/file",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  fileMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Ajout d'un fichier à l'événement ${id}`);
      const { name, comment, blobName } = req.body;
      const result = await eventController.addFileToEvent(parseInt(id), name, comment, blobName);
      logger.info(`Fichier ajouté à l'événement ${id}`);
      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

router.delete(
  "/:id/file/:fileId",
  authMiddleware([EnumUserRole.ADMIN, EnumUserRole.APPRENTICE_COORDINATOR]),
  async (req, res) => {
    try {
      const { id, fileId } = req.params;
      logger.info(`Suppression du fichier ${fileId} de l'événement ${id}`);
      const result = await eventController.deleteFileFromEvent(parseInt(id), parseInt(fileId));
      logger.info(`Fichier ${fileId} supprimé de l'événement ${id}`);
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
