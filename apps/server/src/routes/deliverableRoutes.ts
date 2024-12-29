import express, { Request, Response } from "express";
const router = express.Router();

import deliverableController from "../controllers/deliverableController";

import { reply } from "../utils/http";
import { ControllerError } from "../utils/controller";
import logger from "../utils/logger";
import authMiddleware from "../middleware/authMiddleware";
import { fileMiddleware } from "../middleware/fileMiddleware";
import userController from "../controllers/userController";
import userService from "../services/user.service";
import { User } from "@prisma/client";
import { EnumUserRole } from "@sigl/types";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import { fileMiddleware } from "../middleware/fileMiddleware";
import userService from "../services/user.service";
import { ControllerError } from "../utils/controller";
import { reply } from "../utils/http";
import logger from "../utils/logger";

router.post("/", authMiddleware(), fileMiddleware, async (req: Request, res: Response) => {
  try {
    const { comment, eventId, trainingDiaryId, blobName } = req.body;
    logger.info(`Création du livrable`);
    const result = await deliverableController.createDeliverable(
      comment,
      eventId,
      trainingDiaryId,
      blobName,
    );
    logger.info(`Livrable créé`);

    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.delete("/:id", authMiddleware(), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`Suppression du livrable ${id}`);
    const result = await deliverableController.deleteDeliverable(parseInt(id));
    logger.info(`Livrable supprimé`);

    reply(res, result);
  } catch (error: any) {
    logger.error(`Erreur serveur : ${error.message}`);
    reply(res, ControllerError.INTERNAL());
  }
});

router.get(
  "/trainingDiary/:trainingDiaryId/event/:eventId",
  authMiddleware(),
  async (req: Request, res: Response) => {
    try {
      logger.info(`Récupération des livrables`);
      const { trainingDiaryId, eventId } = req.params;

      // ---- Security check ----
      const user = (await userController.getFromTrainingDiary(parseInt(trainingDiaryId)))
        .data as User;
      if (!user) {
        logger.error("L'utilisateur n'existe pas");
        reply(res, ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" }));
      }

      const currentUser = req.context.user;
      if (!currentUser) {
        logger.error("Utilisateur non authentifié");
        return reply(res, ControllerError.UNAUTHORIZED());
      }
      const roles = userService.getRoles(currentUser);

      if (currentUser.id !== user.id && !roles.includes(EnumUserRole.ADMIN)) {
        logger.error("Utilisateur non autorisé");
        return reply(res, ControllerError.UNAUTHORIZED());
      }
      // ---- End security check ----

      const result = await deliverableController.getDeliverables(
        parseInt(trainingDiaryId),
        parseInt(eventId),
      );
      logger.info(`Livrables récupérés`);

      reply(res, result);
    } catch (error: any) {
      logger.error(`Erreur serveur : ${error.message}`);
      reply(res, ControllerError.INTERNAL());
    }
  },
);

export default router;
