import { db } from "../providers/db";
import { ControllerError, ControllerSuccess } from "../utils/controller";
import logger from "../utils/logger";

export const MeetingController = {
  getAllMeetings: async () => {
    const meetings = await db.meeting.findMany({
      include: {
        presenter: true,
        jury: true,
        events: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    if (!meetings) {
      logger.error("Aucune réunion trouvée");
      return ControllerError.NOT_FOUND({ message: "Aucune réunion trouvée" });
    }

    return ControllerSuccess.SUCCESS({
      message: "Réunions récupérées avec succès",
      data: meetings,
    });
  },

  getMeetingById: async (id: number) => {
    const meeting = await db.meeting.findFirst({
      where: {
        id: id,
      },
      include: {
        presenter: true,
        jury: true,
      },
    });

    if (!meeting) {
      logger.error("Le rendez-vous n'existe pas.");
      ControllerError.NOT_FOUND({ message: "Le rendez-vous n'existe pas." });
    }

    return ControllerSuccess.SUCCESS({ message: "Rendz-vous trouvé avec succès.", data: meeting });
  },

  getMeetingsByUser: async (userId: number) => {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        presenterMeetings: {
          include: {
            presenter: true,
            jury: true,
            events: true,
          },
          orderBy: {
            date: "asc",
          },
        },
        juryMeetings: {
          include: {
            presenter: true,
            jury: true,
            events: true,
          },
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    if (!user) {
      logger.error("L'utilisateur n'existe pas");
      return ControllerError.USER_NOT_FOUND({ message: "L'utilisateur n'existe pas" });
    }

    const meetings = user.presenterMeetings.concat(user.juryMeetings);
    if (!meetings) {
      logger.error("Aucune réunion trouvée pour cet utilisateur");
      return ControllerError.NOT_FOUND({ message: "Aucune réunion trouvée pour cet utilisateur" });
    }

    return ControllerSuccess.SUCCESS({
      message: "Réunions récupérées avec succès",
      data: meetings,
    });
  },

  createMeeting: async (
    title: string,
    description: string,
    date: Date,
    presenter: number[],
    jury: number[],
    events: number[],
  ) => {
    const meeting = await db.meeting.create({
      data: {
        title: title,
        description: description && description.length > 0 ? description : undefined,
        date: date,
        presenter: {
          connect: presenter.map((presenter) => ({ id: presenter })),
        },
        jury: {
          connect: jury.map((juryMember) => ({ id: juryMember })),
        },
        events:
          events && events.length > 0
            ? {
                connect: events.map((event) => ({ id: event })),
              }
            : undefined,
      },
    });

    if (!meeting) {
      logger.error("Erreur lors de la création de la réunion");
      return ControllerError.INTERNAL({ message: "Erreur lors de la création de la réunion" });
    }

    const meetingCreated = await db.meeting.findFirst({
      where: {
        id: meeting.id,
      },
      include: {
        presenter: true,
        jury: true,
        events: true,
      },
    });

    return ControllerSuccess.SUCCESS({
      message: "Réunion créée avec succès",
      data: meetingCreated,
    });
  },

  deleteMeeting: async (meetingId: number) => {
    const meeting = await db.meeting.findFirst({
      where: {
        id: meetingId,
      },
    });

    if (!meeting) {
      logger.error("La réunion n'existe pas");
      return ControllerError.NOT_FOUND({ message: "La réunion n'existe pas" });
    }

    const meetingDel = await db.meeting.delete({
      where: {
        id: meetingId,
      },
    });

    if (!meetingDel) {
      logger.error("Erreur lors de la suppression de la réunion");
      return ControllerError.INTERNAL({ message: "Erreur lors de la suppression de la réunion" });
    }

    return ControllerSuccess.SUCCESS({ message: "Réunion supprimée avec succès", data: meeting });
  },
};
