import { ControllerError, ControllerSuccess } from "../utils/controller";
import { db } from "../providers/db";
import logger from "../utils/logger";

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

  // AssociateEventWithDiary: async (event_id: number, diary_id: number) => {
  //   if (!event_id) {
  //     return ControllerError.INVALID_PARAMS({ message: "event_id est requis" });
  //   }
  //
  //   if (!diary_id) {
  //     return ControllerError.INVALID_PARAMS({ message: "diary_id est requis" });
  //   }
  //   const updateRelation = db.trainingDiary.update({
  //     where: {
  //       id: diary_id,
  //     },
  //     data: {
  //       events: {
  //         connect: {
  //           id: event_id,
  //         },
  //       },
  //     },
  //     include: {
  //       events: true, // Inclut les events pour vérifier la mise à jour
  //     },
  //   });
  //
  //   if (!updateRelation) {
  //     return ControllerError.INTERNAL({
  //       message: "Erreur lors de l'association de l'évènement avec le journal",
  //     });
  //   }
  //
  //   return ControllerSuccess.SUCCESS({
  //     message: "Evènement associé avec succès",
  //     data: updateRelation,
  //   });
  // },
};
export default eventController;
