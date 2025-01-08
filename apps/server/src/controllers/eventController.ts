import { ControllerError, ControllerSuccess } from "../utils/controller";
import { db } from "../providers/db";
import logger from "../utils/logger";
import { deleteFileFromBlob } from "../middleware/fileMiddleware";

const eventController = {
  getEvents: async () => {
    const events = await db.event.findMany({
      include: {
        files: true,
        groups: true,
      },
    });

    if (!events) {
      logger.error("Erreur lors de la récupération des évènements");
      return ControllerError.INTERNAL({ message: "Erreur lors de la récupération des évènements" });
    }

    // const eventsWithPromotions = events.map((event) => {
    //   const promotionCount: Record<string, number> = {};
    //
    //   event.trainingDiaries.forEach((diary) => {
    //     const promotion = diary.apprentice.promotion;
    //     if (promotion) {
    //       promotionCount[promotion] = (promotionCount[promotion] || 0) + 1;
    //     }
    //   });
    //
    //   const mostFrequentPromotion = Object.keys(promotionCount).length
    //     ? Object.keys(promotionCount).reduce((a, b) =>
    //         promotionCount[a] > promotionCount[b] ? a : b,
    //       )
    //     : null;
    //
    //   return {
    //     ...event,
    //     promotion: mostFrequentPromotion,
    //     trainingDiaries: undefined,
    //   };
    // });

    return ControllerSuccess.SUCCESS({
      message: "Evènements récupérés avec succès",
      data: events,
    });
  },

  getEventsByDiary: async (diaryId: number) => {
    try {
      const trainingDiaryData = await db.trainingDiary.findFirst({
        where: { id: diaryId },
        include: {
          apprentice: {
            include: {
              user: {
                include: {
                  groups: true,
                },
              },
            },
          },
        },
      });

      if (!trainingDiaryData) {
        logger.error(`Journal de formation introuvable pour ID: ${diaryId}`);
        return ControllerError.INVALID_PARAMS({ message: "Le journal de formation n'existe pas" });
      }

      const apprentice = trainingDiaryData.apprentice;
      if (!apprentice) {
        logger.error(`Aucun apprenti associé au journal de formation ID: ${diaryId}`);
        return ControllerError.INVALID_PARAMS({ message: "L'apprenti n'existe pas" });
      }

      const user = apprentice.user;
      if (!user || !user.groups || user.groups.length === 0) {
        logger.error(`Utilisateur ou groupes introuvables pour l'apprenti ID: ${apprentice.id}`);
        return ControllerError.INVALID_PARAMS({
          message: "Aucun groupe ou utilisateur trouvé pour cet apprenti",
        });
      }

      const groupIds = user.groups.map((group) => group.id);

      const events = await db.event.findMany({
        where: {
          groups: {
            some: { id: { in: groupIds } },
          },
        },
        include: {
          files: true,
        },
      });

      return ControllerSuccess.SUCCESS({
        message: "Évènements récupérés avec succès",
        data: events,
      });
    } catch (error: any) {
      logger.error(`Erreur dans getEventsByDiary: ${error.message}`);
      return ControllerError.INTERNAL({
        message: "Erreur serveur lors de la récupération des évènements",
      });
    }
  },

  createEvent: async (description: string, endDate: Date, type: string) => {
    const event = await db.event.create({
      data: {
        description: description,
        endDate: endDate,
        type: type,
      },
    });

    if (!event) {
      logger.error("Erreur lors de la création de l'évènement");
      return ControllerError.INTERNAL({ message: "Erreur lors de la création de l'évènement" });
    }

    return ControllerSuccess.SUCCESS({ message: "Evènement créé avec succès", data: event });
  },

  modifyEvent: async (id: number, description: string, endDate: Date, type: string) => {
    const chefEventExist = await db.event.findFirst({
      where: {
        id: id,
      },
    });

    if (!chefEventExist) {
      logger.error("L'évènement n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'évènement n'existe pas" });
    }

    const event = await db.event.update({
      where: {
        id: id,
      },
      data: {
        description: description,
        endDate: endDate,
        type: type,
      },
    });

    if (!event) {
      logger.error("Erreur lors de la modification de l'évènement");
      return ControllerError.INTERNAL({ message: "Erreur lors de la modification de l'évènement" });
    }

    return ControllerSuccess.SUCCESS({ message: "Evènement modifié avec succès", data: event });
  },

  deleteEvent: async (id: number) => {
    const eventExist = await db.event.findFirst({
      where: {
        id: id,
      },
    });

    if (!eventExist) {
      logger.error("L'évènement n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'évènement n'existe pas" });
    }

    const eventFiles = await db.eventFile.findMany({
      where: {
        eventId: id,
      },
    });

    if (eventFiles) {
      eventFiles.forEach((eventFile) => {
        deleteFileFromBlob(eventFile.blobName);
      });
    }

    await db.eventFile.deleteMany({
      where: {
        eventId: id,
      },
    });

    const deleteEvent = await db.event.delete({
      where: {
        id: id,
      },
    });

    if (!deleteEvent) {
      logger.error("Erreur lors de la suppression de l'évènement");
      return ControllerError.INTERNAL({ message: "Erreur lors de la suppression de l'évènement" });
    }

    return ControllerSuccess.SUCCESS({ message: "Evènement supprimé avec succès" });
  },

  associateEventWithGroups: async (event_id: number, groups_id: Array<number>) => {
    if (!event_id) {
      return ControllerError.INVALID_PARAMS({ message: "event_id est requis" });
    }

    if (!groups_id) {
      return ControllerError.INVALID_PARAMS({ message: "group_id est requis" });
    }

    const promises = groups_id.map((group_id) =>
      db.event.update({
        where: {
          id: event_id,
        },
        data: {
          groups: {
            connect: {
              id: group_id,
            },
          },
        },
      }),
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      return ControllerError.INTERNAL({
        message: "Erreur lors de l'association de l'évènement avec le groupe : " + error,
      });
    }
  },

  addFileToEvent: async (eventId: number, name: string, comment: string, blobName: string) => {
    const event = await db.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      logger.error("L'évènement n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'évènement n'existe pas" });
    }

    const eventFile = await db.eventFile.create({
      data: {
        name: name,
        comment: comment,
        blobName: blobName,
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    });

    if (!eventFile) {
      logger.error("Erreur lors de l'ajout du fichier à l'évènement");
      return ControllerError.INTERNAL({
        message: "Erreur lors de l'ajout du fichier à l'évènement",
      });
    }

    return ControllerSuccess.SUCCESS({
      message: "Fichier ajouté à l'évènement avec succès",
      data: eventFile,
    });
  },

  getFilesFromEvent: async (eventId: number) => {
    const event = await db.event.findFirst({
      where: {
        id: eventId,
      },
      include: {
        files: true,
      },
    });

    if (!event) {
      logger.error("L'évènement n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "L'évènement n'existe pas" });
    }

    return ControllerSuccess.SUCCESS({
      message: "Fichiers récupérés avec succès",
      data: event.files,
    });
  },

  deleteFileFromEvent: async (eventId: number, fileId: number) => {
    const eventFile = await db.eventFile.findFirst({
      where: {
        id: fileId,
        eventId: eventId,
      },
    });

    if (!eventFile) {
      logger.error("Le fichier n'existe pas");
      return ControllerError.INVALID_PARAMS({ message: "Le fichier n'existe pas" });
    }

    const deleteFile = await db.eventFile.delete({
      where: {
        id: fileId,
      },
    });

    if (!deleteFile) {
      logger.error("Erreur lors de la suppression du fichier");
      return ControllerError.INTERNAL({ message: "Erreur lors de la suppression du fichier" });
    }

    deleteFileFromBlob(deleteFile.blobName);

    return ControllerSuccess.SUCCESS({ message: "Fichier supprimé avec succès" });
  },
};

export default eventController;
