import { Request, Response } from "express";

import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";
import { db } from "../providers/db";
import { ControllerResponse } from "../types/controller";
import { deleteFileFromBlob } from "../middleware/fileMiddleware";

const deliverableController = {
  createDeliverable: async (
    comment: string,
    eventId: string,
    trainingDiaryId: string,
    blobName: string,
  ): Promise<ControllerResponse> => {
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

  deleteDeliverable: async (id: number): Promise<ControllerResponse> => {
    if (!id) {
      logger.error("id est requis");
      return ControllerError.INVALID_PARAMS({ message: "id est requis" });
    }

    const deliverable = await db.deliverable.findFirst({
      where: {
        id: id,
      },
    });

    if (!deliverable) {
      logger.error("Le livrable n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "Le livrable n'existe pas" });
    }

    const deletedDeliverable = await db.deliverable.delete({
      where: {
        id: id,
      },
    });

    if (!deletedDeliverable) {
      logger.error("Erreur lors de la suppression du livrable");
      return ControllerError.INTERNAL({ message: "Erreur lors de la suppression du livrable" });
    }

    deleteFileFromBlob(deliverable.blobName);

    return ControllerSuccess.SUCCESS({ message: "Livrable supprimé avec succès" });
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
