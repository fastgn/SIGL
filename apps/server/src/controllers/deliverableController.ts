import { Request, Response } from "express";

import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";
import { db } from "../providers/db";
import { ControllerResponse } from "../types/controller";

const deliverableController = {
  createDeliverable: async (req: Request, res: Response): Promise<ControllerResponse> => {
    const { comment, eventId, trainingDiaryId, blobName } = req.body;

    if (!eventId) {
      logger.error("eventId est requis");
      return ControllerError.INVALID_PARAMS({ message: "eventId est requis" });
    }
    if (!trainingDiaryId) {
      logger.error("trainingDiaryId est requis");
      return ControllerError.INVALID_PARAMS({ message: "trainingDiaryId est requis" });
    }
    if (!blobName) {
      logger.error("blobName est requis");
      return ControllerError.INVALID_PARAMS({ message: "blobName est requis" });
    }

    const trainingDiary = await db.trainingDiary.findFirst({
      include: {
        apprentice: {
          include: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: {
        id: parseInt(trainingDiaryId),
      },
    });

    if (!trainingDiary) {
      logger.error("Le journal de formation n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "Le journal de formation n'existe pas" });
    }

    const user = trainingDiary.apprentice.user;
    if (!user) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'utilisateur n'existe pas" });
    }

    const event = await db.event.findFirst({
      include: {
        groups: {
          include: {
            users: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: {
        id: parseInt(eventId),
      },
    });

    if (!event) {
      logger.error("L'évènement n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'évènement n'existe pas" });
    }

    const eventUserIds = event.groups.flatMap((group) => group.users.map((user) => user.id));
    if (!eventUserIds.includes(user.id)) {
      logger.error("L'utilisateur n'est pas autorisé à ajouter un livrable pour cet évènement");
      return ControllerError.UNAUTHORIZED({
        message: "L'utilisateur n'est pas autorisé à ajouter un livrable pour cet évènement",
      });
    }

    const deliverable = await db.deliverable.create({
      data: {
        comment: comment,
        event: {
          connect: {
            id: parseInt(eventId),
          },
        },
        trainingDiary: {
          connect: {
            id: parseInt(trainingDiaryId),
          },
        },
        blobName: blobName,
      },
    });

    if (!deliverable) {
      logger.error("Erreur lors de la création du livrable");
      return ControllerError.INTERNAL({ message: "Erreur lors de la création du livrable" });
    }

    return ControllerSuccess.SUCCESS({ message: "Livrable créé avec succès", data: deliverable });
  },

  getDeliverables: async (
    trainingDiaryId: number,
    eventId: number,
  ): Promise<ControllerResponse> => {
    const deliverables = await db.deliverable.findMany({
      where: {
        trainingDiaryId: trainingDiaryId,
        eventId: eventId,
      },
    });

    return ControllerSuccess.SUCCESS({ data: deliverables });
  },
};

export default deliverableController;
